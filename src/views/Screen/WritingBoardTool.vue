<template>
  <div class="writing-board-tool">
    <div class="writing-board-wrap"
      :style="{
        width: slideWidth + 'px',
        height: slideHeight + 'px',
      }"
    >
      <WritingBoard 
        ref="writingBoardRef" 
        :color="writingBoardColor" 
        :blackboard="blackboard" 
        :model="writingBoardModel"
        :penSize="penSize"
        :markSize="markSize"
        :rubberSize="rubberSize"
        @end="hanldeWritingEnd()"
      />
    </div>

    <MoveablePanel 
      class="tools-panel" 
      :width="520" 
      :height="50"
      :left="left" 
      :top="top"
      :moveable="sizePopoverType === ''"
    >
      <div class="tools" @mousedown.stop>
        <div class="tool-content">
          <Popover trigger="click" :visible="sizePopoverType === 'pen'">
            <template #content>
              <div class="size">
                <div class="label">The ink thickness:</div>
                <Slider class="size-slider" :min="4" :max="10" :step="2" v-model:value="penSize" />
              </div>
            </template>
            <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="The brush">
              <div class="btn" :class="{ 'active': writingBoardModel === 'pen' }" @click="changeModel('pen')"><IconWrite class="icon" /></div>
            </Tooltip>
          </Popover>
          <Popover trigger="click" :visible="sizePopoverType === 'mark'">
            <template #content>
              <div class="size">
                <div class="label">The ink thickness:</div>
                <Slider class="size-slider" :min="16" :max="40" :step="4" v-model:value="markSize" />
              </div>
            </template>
            <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="Fluorescent pen">
              <div class="btn" :class="{ 'active': writingBoardModel === 'mark' }" @click="changeModel('mark')"><IconHighLight class="icon" /></div>
            </Tooltip>
          </Popover>
          <Popover trigger="click" :visible="sizePopoverType === 'eraser'">
            <template #content>
              <div class="size">
                <div class="label">Rubber size:</div>
                <Slider class="size-slider" :min="20" :max="200" :step="20" v-model:value="rubberSize" />
              </div>
            </template>
            <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="The eraser">
              <div class="btn" :class="{ 'active': writingBoardModel === 'eraser' }" @click="changeModel('eraser')"><IconErase class="icon" /></div>
            </Tooltip>
          </Popover>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="Remove the ink">
            <div class="btn" @click="clearCanvas()"><IconClear class="icon" /></div>
          </Tooltip>
          <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="The blackboard">
            <div class="btn" :class="{ 'active': blackboard }" @click="blackboard = !blackboard"><IconFill class="icon" /></div>
          </Tooltip>
          <div class="colors">
            <div 
              class="color" 
              :class="{ 'active': color === writingBoardColor }"
              v-for="color in writingBoardColors"
              :key="color"
              :style="{ backgroundColor: color }"
              @click="changeColor(color)"
            ></div>
          </div>
        </div>
        <Tooltip :mouseLeaveDelay="0" :mouseEnterDelay="0.3" title="Shut down the brush">
          <div class="btn" @click="closeWritingBoard()"><IconClose class="icon" /></div>
        </Tooltip>
      </div>
    </MoveablePanel>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { db } from '@/utils/database'

import WritingBoard from '@/components/WritingBoard.vue'
import MoveablePanel from '@/components/MoveablePanel.vue'
import {
  Tooltip,
  Popover,
  Slider,
} from 'ant-design-vue'

const writingBoardColors = ['#000000', '#ffffff', '#1e497b', '#4e81bb', '#e2534d', '#9aba60', '#8165a0', '#47acc5', '#f9974c', '#ffff3a']

type WritingBoardModel = 'pen' | 'mark' | 'eraser'

defineProps({
  slideWidth: {
    type: Number,
    required: true,
  },
  slideHeight: {
    type: Number,
    required: true,
  },
  left: {
    type: Number,
    default: -5,
  },
  top: {
    type: Number,
    default: -5,
  },
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { currentSlide } = storeToRefs(useSlidesStore())

const writingBoardRef = ref<typeof WritingBoard>()
const writingBoardColor = ref('#e2534d')
const writingBoardModel = ref<WritingBoardModel>('pen')
const blackboard = ref(false)
const sizePopoverType = ref<'' | WritingBoardModel>('')

const penSize = ref(6)
const markSize = ref(24)
const rubberSize = ref(80)

const changeModel = (model: WritingBoardModel) => {
  if (writingBoardModel.value === model) {
    sizePopoverType.value = sizePopoverType.value === model ? '' : model
  }
  else {
    if (sizePopoverType.value) sizePopoverType.value = ''
    writingBoardModel.value = model
  }
}

// Clear the ink on the canvas
const clearCanvas = () => {
  writingBoardRef.value!.clearCanvas()
}

// If the current in a rubber state, modify the brush colour, switch to the first brush
const changeColor = (color: string) => {
  if (writingBoardModel.value === 'eraser') writingBoardModel.value = 'pen'
  writingBoardColor.value = color
}

// Close the tablet
const closeWritingBoard = () => {
  emit('close')
}

// Open the brush tool or switch page, will be stored in the database of the ink paint to the canvas
watch(currentSlide, () => {
  db.writingBoardImgs.where('id').equals(currentSlide.value.id).toArray().then(ret => {
    const currentImg = ret[0]
    writingBoardRef.value!.setImageDataURL(currentImg?.dataURL || '')
  })
}, { immediate: true })

// Will be painted pictures updated after each mapped to the database
const hanldeWritingEnd = () => {
  const dataURL = writingBoardRef.value!.getImageDataURL()
  db.writingBoardImgs.where('id').equals(currentSlide.value.id).toArray().then(ret => {
    const currentImg = ret[0]
    if (currentImg) db.writingBoardImgs.update(currentImg, { dataURL })
    else db.writingBoardImgs.add({ id: currentSlide.value.id, dataURL })
  })
}
</script>

<style lang="scss" scoped>
.writing-board-tool {
  font-size: 12px;
  z-index: 10;
  @include absolute-0();

  .writing-board-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .tools {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .tool-content {
    display: flex;
    align-items: center;
  }
  .btn {
    padding: 5px 10px;
    cursor: pointer;

    &:hover {
      color: $themeColor;
    }
    &.active {
      background-color: rgba($color: $themeColor, $alpha: .5);
      color: #fff;
    }
  }
  .icon {
    font-size: 20px;
  }
  .colors {
    display: flex;
    padding: 0 10px;
  }
  .color {
    width: 16px;
    height: 16px;
    border-radius: $borderRadius;
    cursor: pointer;

    &:hover {
      transform: scale(1.15);
    }
    &.active {
      transform: scale(1.3);
    }

    & + .color {
      margin-left: 8px;
    }
  }
}
.size {
  width: 200px;
  display: flex;
  align-items: center;
  user-select: none;

  .label {
    width: 70px;
  }
  .size-slider {
    flex: 1;
  }
}
</style>