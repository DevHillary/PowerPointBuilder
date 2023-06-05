<template>
  <div class="writing-board" ref="writingBoardRef">
    <div class="blackboard" v-if="blackboard"></div>

    <canvas class="canvas" ref="canvasRef"
      :style="{
        width: canvasWidth + 'px',
        height: canvasHeight + 'px',
      }"
      @mousedown="$event => handleMousedown($event)"
      @mousemove="$event => handleMousemove($event)"
      @mouseup="handleMouseup()"
      @touchstart="$event => handleMousedown($event)"
      @touchmove="$event => handleMousemove($event)"
      @touchend="handleMouseup(); mouseInCanvas = false"
      @mouseleave="handleMouseup(); mouseInCanvas = false"
      @mouseenter="mouseInCanvas = true"
    ></canvas>

    <template v-if="mouseInCanvas">
      <div 
        class="eraser"
        :style="{
          left: mouse.x - rubberSize / 2 + 'px',
          top: mouse.y - rubberSize / 2 + 'px',
          width: rubberSize + 'px',
          height: rubberSize + 'px',
        }"
        v-if="model === 'eraser'"
      ></div>
      <div 
        class="pen"
        :style="{
          left: mouse.x - penSize / 2 + 'px',
          top: mouse.y - penSize * 6 + penSize / 2 + 'px',
          color: color,
        }"
        v-if="model === 'pen'"
      >
        <IconWrite class="icon" :size="penSize * 6" v-if="model === 'pen'" />
      </div>
      <div 
        class="pen"
        :style="{
          left: mouse.x - markSize / 2 + 'px',
          top: mouse.y + 'px',
          color: color,
        }"
        v-if="model === 'mark'"
      >
        <IconHighLight class="icon" :size="markSize * 1.5" v-if="model === 'mark'" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, PropType, ref, watch } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: '#ffcc00',
  },
  model: {
    type: String as PropType<'pen' | 'eraser' | 'mark'>,
    default: 'pen',
  },
  blackboard: {
    type: Boolean,
    default: false,
  },
  penSize: {
    type: Number,
    default: 6,
  },
  markSize: {
    type: Number,
    default: 24,
  },
  rubberSize: {
    type: Number,
    default: 80,
  },
})

const emit = defineEmits<{
  (event: 'end'): void
}>()

let ctx: CanvasRenderingContext2D | null = null
const writingBoardRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

let lastPos = {
  x: 0,
  y: 0,
}
let isMouseDown = false
let lastTime = 0
let lastLineWidth = -1

// Mouse position coordinates: for brush or eraser position to follow
const mouse = ref({
  x: 0,
  y: 0,
})

// The mouse is within the scope of the canvas: in range will only display the brush or rubber
const mouseInCanvas = ref(false)

// Listen to update the canvas size
const canvasWidth = ref(0)
const canvasHeight = ref(0)

const widthScale = computed(() => canvasRef.value ? canvasWidth.value / canvasRef.value.width : 1)
const heightScale = computed(() => canvasRef.value ? canvasHeight.value / canvasRef.value.height : 1)

const updateCanvasSize = () => {
  if (!writingBoardRef.value) return
  canvasWidth.value = writingBoardRef.value.clientWidth
  canvasHeight.value = writingBoardRef.value.clientHeight
}
const resizeObserver = new ResizeObserver(updateCanvasSize)
onMounted(() => {
  if (writingBoardRef.value) resizeObserver.observe(writingBoardRef.value)
})
onUnmounted(() => {
  if (writingBoardRef.value) resizeObserver.unobserve(writingBoardRef.value)
})

// Initialize the canvas
const initCanvas = () => {
  if (!canvasRef.value || !writingBoardRef.value) return

  ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  canvasRef.value.width = writingBoardRef.value.clientWidth
  canvasRef.value.height = writingBoardRef.value.clientHeight

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}
onMounted(initCanvas)

// Switch brush mode, update the canvas CTX configuration
const updateCtx = () => {
  if (!ctx) return
  if (props.model === 'mark') {
    ctx.globalCompositeOperation = 'xor'
    ctx.globalAlpha = 0.5
  }
  else if (props.model === 'pen') {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }
}
watch(() => props.model, updateCtx)

// Paint brush, ink method
const draw = (posX: number, posY: number, lineWidth: number) => {
  if (!ctx) return

  const lastPosX = lastPos.x
  const lastPosY = lastPos.y

  ctx.lineWidth = lineWidth
  ctx.strokeStyle = props.color
  ctx.beginPath()
  ctx.moveTo(lastPosX, lastPosY)
  ctx.lineTo(posX, posY)
  ctx.stroke()
  ctx.closePath()
}

// Erase the ink method
const erase = (posX: number, posY: number) => {
  if (!ctx || !canvasRef.value) return
  const lastPosX = lastPos.x
  const lastPosY = lastPos.y

  const radius = props.rubberSize / 2

  const sinRadius = radius * Math.sin(Math.atan((posY - lastPosY) / (posX - lastPosX)))
  const cosRadius = radius * Math.cos(Math.atan((posY - lastPosY) / (posX - lastPosX)))
  const rectPoint1: [number, number] = [lastPosX + sinRadius, lastPosY - cosRadius]
  const rectPoint2: [number, number] = [lastPosX - sinRadius, lastPosY + cosRadius]
  const rectPoint3: [number, number] = [posX + sinRadius, posY - cosRadius]
  const rectPoint4: [number, number] = [posX - sinRadius, posY + cosRadius]

  ctx.save()
  ctx.beginPath()
  ctx.arc(posX, posY, radius, 0, Math.PI * 2)
  ctx.clip()
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(...rectPoint1)
  ctx.lineTo(...rectPoint3)
  ctx.lineTo(...rectPoint4)
  ctx.lineTo(...rectPoint2)
  ctx.closePath()
  ctx.clip()
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.restore()
}

// The distance between two mobile computing mouse
const getDistance = (posX: number, posY: number) => {
  const lastPosX = lastPos.x
  const lastPosY = lastPos.y
  return Math.sqrt((posX - lastPosX) * (posX - lastPosX) + (posY - lastPosY) * (posY - lastPosY))
}

// The distance between the two under mouse s and time t calculate rendering speed, the faster the speed, the ink is fine
const getLineWidth = (s: number, t: number) => {
  const maxV = 10
  const minV = 0.1
  const maxWidth = props.penSize
  const minWidth = 3
  const v = s / t
  let lineWidth

  if (v <= minV) lineWidth = maxWidth
  else if (v >= maxV) lineWidth = minWidth
  else lineWidth = maxWidth - v / maxV * maxWidth

  if (lastLineWidth === -1) return lineWidth
  return lineWidth * 1 / 3 + lastLineWidth * 2 / 3
}

// Path to the operation
const handleMove = (x: number, y: number) => {
  const time = new Date().getTime()

  if (props.model === 'pen') {
    const s = getDistance(x, y)
    const t = time - lastTime
    const lineWidth = getLineWidth(s, t)

    draw(x, y, lineWidth)
    lastLineWidth = lineWidth
  }
  else if (props.model === 'mark') draw(x, y, props.markSize)
  else erase(x, y)

  lastPos = { x, y }
  lastTime = new Date().getTime()
}

// To obtain the relative position of the mouse on the canvas
const getMouseOffsetPosition = (e: MouseEvent | TouchEvent) => {
  if (!canvasRef.value) return [0, 0]
  const event = e instanceof MouseEvent ? e : e.changedTouches[0]
  const canvasRect = canvasRef.value.getBoundingClientRect()
  const x = event.pageX - canvasRect.x
  const y = event.pageY - canvasRect.y
  return [x, y]
}

// Handle mouse events (touch)
// Ready to start drawing/erase ink (pen)
const handleMousedown = (e: MouseEvent | TouchEvent) => {
  const [mouseX, mouseY] = getMouseOffsetPosition(e)
  const x = mouseX / widthScale.value
  const y = mouseY / heightScale.value

  isMouseDown = true
  lastPos = { x, y }
  lastTime = new Date().getTime()

  if (!(e instanceof MouseEvent)) {
    mouse.value = { x: mouseX, y: mouseY }
    mouseInCanvas.value = true
  }
}

// Start drawing/erase ink (mobile)
const handleMousemove = (e: MouseEvent | TouchEvent) => {
  const [mouseX, mouseY] = getMouseOffsetPosition(e)
  const x = mouseX / widthScale.value
  const y = mouseY / heightScale.value

  mouse.value = { x: mouseX, y: mouseY }

  if (isMouseDown) handleMove(x, y)
}

// End draw/erase ink (pen)
const handleMouseup = () => {
  if (!isMouseDown) return
  isMouseDown = false
  emit('end')
}

// Empty canvas
const clearCanvas = () => {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  emit('end')
}

// Get DataURL
const getImageDataURL = () => {
  return canvasRef.value?.toDataURL()
}

// Set the DataURL (draw pictures to the canvas)
const setImageDataURL = (imageDataURL: string) => {
  if (!ctx || !canvasRef.value) return
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  if (imageDataURL) {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1

    const img = new Image()
    img.src = imageDataURL
    img.onload = () => {
      ctx!.drawImage(img, 0, 0)
      updateCtx()
    }
  }
}

defineExpose({
  clearCanvas,
  getImageDataURL,
  setImageDataURL,
})
</script>

<style lang="scss" scoped>
.writing-board {
  z-index: 8;
  cursor: none;
  @include absolute-0();
}
.blackboard {
  width: 100%;
  height: 100%;
  background-color: #0f392b;
}
.canvas {
  position: absolute;
  top: 0;
  left: 0;
}
.eraser, .pen {
  pointer-events: none;
  position: absolute;
  z-index: 9;

  .icon {
    filter: drop-shadow(2px 2px 2px #555);
  }
}
.eraser {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 4px solid rgba($color: #555, $alpha: .15);
  color: rgba($color: #555, $alpha: .75);
}
</style>