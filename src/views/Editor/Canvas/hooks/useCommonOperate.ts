import { computed, Ref } from 'vue'
import { OperateResizeHandlers, OperateBorderLines } from '@/types/edit'

export default (width: Ref<number>, height: Ref<number>) => {
  // Zoom element
  const resizeHandlers = computed(() => {
    return [
      { direction: OperateResizeHandlers.LEFT_TOP, style: {} },
      { direction: OperateResizeHandlers.TOP, style: {left: width.value / 2 + 'px'} },
      { direction: OperateResizeHandlers.RIGHT_TOP, style: {left: width.value + 'px'} },
      { direction: OperateResizeHandlers.LEFT, style: {top: height.value / 2 + 'px'} },
      { direction: OperateResizeHandlers.RIGHT, style: {left: width.value + 'px', top: height.value / 2 + 'px'} },
      { direction: OperateResizeHandlers.LEFT_BOTTOM, style: {top: height.value + 'px'} },
      { direction: OperateResizeHandlers.BOTTOM, style: {left: width.value / 2 + 'px', top: height.value + 'px'} },
      { direction: OperateResizeHandlers.RIGHT_BOTTOM, style: {left: width.value + 'px', top: height.value + 'px'} },
    ]
  })

  // Text element scaling
  const textElementResizeHandlers = computed(() => {
    return [
      { direction: OperateResizeHandlers.LEFT, style: {top: height.value / 2 + 'px'} },
      { direction: OperateResizeHandlers.RIGHT, style: {left: width.value + 'px', top: height.value / 2 + 'px'} },
    ]
  })
  const verticalTextElementResizeHandlers = computed(() => {
    return [
      { direction: OperateResizeHandlers.TOP, style: {left: width.value / 2 + 'px'} },
      { direction: OperateResizeHandlers.BOTTOM, style: {left: width.value / 2 + 'px', top: height.value + 'px'} },
    ]
  })

  // Elements selected border lines
  const borderLines = computed(() => {
    return [
      { type: OperateBorderLines.T, style: {width: width.value + 'px'} },
      { type: OperateBorderLines.B, style: {top: height.value + 'px', width: width.value + 'px'} },
      { type: OperateBorderLines.L, style: {height: height.value + 'px'} },
      { type: OperateBorderLines.R, style: {left: width.value + 'px', height: height.value + 'px'} },
    ]
  })

  return {
    resizeHandlers,
    textElementResizeHandlers,
    verticalTextElementResizeHandlers,
    borderLines,
  }
}