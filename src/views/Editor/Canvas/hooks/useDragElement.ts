import { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore, useKeyboardStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { AlignmentLineProps } from '@/types/edit'
import { VIEWPORT_SIZE } from '@/configs/canvas'
import { getRectRotatedRange, AlignLine, uniqAlignLines } from '@/utils/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default (
  elementList: Ref<PPTElement[]>,
  alignmentLines: Ref<AlignmentLineProps[]>,
  canvasScale: Ref<number>,
) => {
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeGroupElementId } = storeToRefs(useMainStore())
  const { shiftKeyState } = storeToRefs(useKeyboardStore())
  const { viewportRatio } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  const dragElement = (e: MouseEvent | TouchEvent, element: PPTElement) => {
    const isTouchEvent = !(e instanceof MouseEvent)
    if (isTouchEvent && (!e.changedTouches || !e.changedTouches[0])) return

    if (!activeElementIdList.value.includes(element.id)) return
    let isMouseDown = true

    const edgeWidth = VIEWPORT_SIZE
    const edgeHeight = VIEWPORT_SIZE * viewportRatio.value
    
    const sorptionRange = 5

    const originElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList.value))
    const originActiveElementList = originElementList.filter(el => activeElementIdList.value.includes(el.id))
  
    const elOriginLeft = element.left
    const elOriginTop = element.top
    const elOriginWidth = element.width
    const elOriginHeight = ('height' in element && element.height) ? element.height : 0
    const elOriginRotate = ('rotate' in element && element.rotate) ? element.rotate : 0
  
    const startPageX = isTouchEvent ? e.changedTouches[0].pageX : e.pageX
    const startPageY = isTouchEvent ? e.changedTouches[0].pageY : e.pageY

    let isMisoperation: boolean | null = null

    const isActiveGroupElement = element.id === activeGroupElementId.value

    // Collect alignment aligned absorption line
    // Including page in addition to the target element in each of the other elements on the canvas adsorption aligned position: the up and down or so four edges, horizontal, vertical center
    // Which the lines and been rotating element need to recalculate the scope of their center location in the canvas
    let horizontalLines: AlignLine[] = []
    let verticalLines: AlignLine[] = []

    for (const el of elementList.value) {
      if (el.type === 'line') continue
      if (isActiveGroupElement && el.id === element.id) continue
      if (!isActiveGroupElement && activeElementIdList.value.includes(el.id)) continue

      let left, top, width, height
      if ('rotate' in el && el.rotate) {
        const { xRange, yRange } = getRectRotatedRange({
          left: el.left,
          top: el.top,
          width: el.width,
          height: el.height,
          rotate: el.rotate,
        })
        left = xRange[0]
        top = yRange[0]
        width = xRange[1] - xRange[0]
        height = yRange[1] - yRange[0]
      }
      else {
        left = el.left
        top = el.top
        width = el.width
        height = el.height
      }
      
      const right = left + width
      const bottom = top + height
      const centerX = top + height / 2
      const centerY = left + width / 2

      const topLine: AlignLine = { value: top, range: [left, right] }
      const bottomLine: AlignLine = { value: bottom, range: [left, right] }
      const horizontalCenterLine: AlignLine = { value: centerX, range: [left, right] }
      const leftLine: AlignLine = { value: left, range: [top, bottom] }
      const rightLine: AlignLine = { value: right, range: [top, bottom] }
      const verticalCenterLine: AlignLine = { value: centerY, range: [top, bottom] }

      horizontalLines.push(topLine, bottomLine, horizontalCenterLine)
      verticalLines.push(leftLine, rightLine, verticalCenterLine)
    }

    // The canvas of the viewing area four boundary, horizontal, vertical center
    const edgeTopLine: AlignLine = { value: 0, range: [0, edgeWidth] }
    const edgeBottomLine: AlignLine = { value: edgeHeight, range: [0, edgeWidth] }
    const edgeHorizontalCenterLine: AlignLine = { value: edgeHeight / 2, range: [0, edgeWidth] }
    const edgeLeftLine: AlignLine = { value: 0, range: [0, edgeHeight] }
    const edgeRightLine: AlignLine = { value: edgeWidth, range: [0, edgeHeight] }
    const edgeVerticalCenterLine: AlignLine = { value: edgeWidth / 2, range: [0, edgeHeight] }

    horizontalLines.push(edgeTopLine, edgeBottomLine, edgeHorizontalCenterLine)
    verticalLines.push(edgeLeftLine, edgeRightLine, edgeVerticalCenterLine)
    
    // Alignment adsorption wire to heavy
    horizontalLines = uniqAlignLines(horizontalLines)
    verticalLines = uniqAlignLines(verticalLines)

    const handleMousemove = (e: MouseEvent | TouchEvent) => {
      const currentPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const currentPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      // If the mouse sliding distance is too small, will be judged as wrong operation operation:
      // If the wrong operation tag is null, says is the first time trigger mobile, whether need to compute the current is wrong operation
      // Check if wrong operation is true that the current is still in wrong operation range, but still need to continue to calculate check whether further operation is still in the wrong operation
      // Check if the wrong operation to false that is out of the wrong operation scope, does not need to be calculated again
      if (isMisoperation !== false) {
        isMisoperation = Math.abs(startPageX - currentPageX) < sorptionRange && 
                         Math.abs(startPageY - currentPageY) < sorptionRange
      }
      if (!isMouseDown || isMisoperation) return
      
      let moveX = (currentPageX - startPageX) / canvasScale.value
      let moveY = (currentPageY - startPageY) / canvasScale.value

      if (shiftKeyState.value) {
        if (Math.abs(moveX) > Math.abs(moveY)) moveY = 0
        if (Math.abs(moveX) < Math.abs(moveY)) moveX = 0
      }

      // Based on the target location
      let targetLeft = elOriginLeft + moveX
      let targetTop = elOriginTop + moveY

      // Calculate the target element position in the canvas, used for adsorption of alignment
      // Need to distinguish between radio and much choose two situations, including multiple conditions need to compute a whole range of multiple elements;Radio conditions need to distinguish between the lines, the common element, rotating after three common elements
      let targetMinX: number, targetMaxX: number, targetMinY: number, targetMaxY: number

      if (activeElementIdList.value.length === 1 || isActiveGroupElement) {
        if (elOriginRotate) {
          const { xRange, yRange } = getRectRotatedRange({
            left: targetLeft,
            top: targetTop,
            width: elOriginWidth,
            height: elOriginHeight,
            rotate: elOriginRotate,
          })
          targetMinX = xRange[0]
          targetMaxX = xRange[1]
          targetMinY = yRange[0]
          targetMaxY = yRange[1]
        }
        else if (element.type === 'line') {
          targetMinX = targetLeft
          targetMaxX = targetLeft + Math.max(element.start[0], element.end[0])
          targetMinY = targetTop
          targetMaxY = targetTop + Math.max(element.start[1], element.end[1])
        }
        else {
          targetMinX = targetLeft
          targetMaxX = targetLeft + elOriginWidth
          targetMinY = targetTop
          targetMaxY = targetTop + elOriginHeight
        }
      }
      else {
        const leftValues = []
        const topValues = []
        const rightValues = []
        const bottomValues = []
        
        for (let i = 0; i < originActiveElementList.length; i++) {
          const element = originActiveElementList[i]
          const left = element.left + moveX
          const top = element.top + moveY
          const width = element.width
          const height = ('height' in element && element.height) ? element.height : 0
          const rotate = ('rotate' in element && element.rotate) ? element.rotate : 0

          if ('rotate' in element && element.rotate) {
            const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
            leftValues.push(xRange[0])
            topValues.push(yRange[0])
            rightValues.push(xRange[1])
            bottomValues.push(yRange[1])
          }
          else if (element.type === 'line') {
            leftValues.push(left)
            topValues.push(top)
            rightValues.push(left + Math.max(element.start[0], element.end[0]))
            bottomValues.push(top + Math.max(element.start[1], element.end[1]))
          }
          else {
            leftValues.push(left)
            topValues.push(top)
            rightValues.push(left + width)
            bottomValues.push(top + height)
          }
        }

        targetMinX = Math.min(...leftValues)
        targetMaxX = Math.max(...rightValues)
        targetMinY = Math.min(...topValues)
        targetMaxY = Math.max(...bottomValues)
      }
      
      const targetCenterX = targetMinX + (targetMaxX - targetMinX) / 2
      const targetCenterY = targetMinY + (targetMaxY - targetMinY) / 2

      // Align the collected adsorption wire and calculation of the target element position comparing the scope, the difference is less than the setting value of both perform automatic alignment correction
      // The horizontal and vertical directions need to be calculated separately
      const _alignmentLines: AlignmentLineProps[] = []
      let isVerticalAdsorbed = false
      let isHorizontalAdsorbed = false
      for (let i = 0; i < horizontalLines.length; i++) {
        const { value, range } = horizontalLines[i]
        const min = Math.min(...range, targetMinX, targetMaxX)
        const max = Math.max(...range, targetMinX, targetMaxX)
        
        if (Math.abs(targetMinY - value) < sorptionRange && !isHorizontalAdsorbed) {
          targetTop = targetTop - (targetMinY - value)
          isHorizontalAdsorbed = true
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 50, y: value}, length: max - min + 100})
        }
        if (Math.abs(targetMaxY - value) < sorptionRange && !isHorizontalAdsorbed) {
          targetTop = targetTop - (targetMaxY - value)
          isHorizontalAdsorbed = true
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 50, y: value}, length: max - min + 100})
        }
        if (Math.abs(targetCenterY - value) < sorptionRange && !isHorizontalAdsorbed) {
          targetTop = targetTop - (targetCenterY - value)
          isHorizontalAdsorbed = true
          _alignmentLines.push({type: 'horizontal', axis: {x: min - 50, y: value}, length: max - min + 100})
        }
      }
      for (let i = 0; i < verticalLines.length; i++) {
        const { value, range } = verticalLines[i]
        const min = Math.min(...range, targetMinY, targetMaxY)
        const max = Math.max(...range, targetMinY, targetMaxY)

        if (Math.abs(targetMinX - value) < sorptionRange && !isVerticalAdsorbed) {
          targetLeft = targetLeft - (targetMinX - value)
          isVerticalAdsorbed = true
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 50}, length: max - min + 100})
        }
        if (Math.abs(targetMaxX - value) < sorptionRange && !isVerticalAdsorbed) {
          targetLeft = targetLeft - (targetMaxX - value)
          isVerticalAdsorbed = true
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 50}, length: max - min + 100})
        }
        if (Math.abs(targetCenterX - value) < sorptionRange && !isVerticalAdsorbed) {
          targetLeft = targetLeft - (targetCenterX - value)
          isVerticalAdsorbed = true
          _alignmentLines.push({type: 'vertical', axis: {x: value, y: min - 50}, length: max - min + 100})
        }
      }
      alignmentLines.value = _alignmentLines
      
      // Radio, or the currently selected multiple elements are existing in the operation of elements, only change the position of the element is operating
      if (activeElementIdList.value.length === 1 || isActiveGroupElement) {
        elementList.value = elementList.value.map(el => {
          return el.id === element.id ? { ...el, left: targetLeft, top: targetTop } : el
        })
      }

      // Multi-select condition, in addition to modify the position of the element is operating, other elements also need to modify the selected location information
      // Other selected elements of location information by mobile offset is operating elements to calculate
      else {
        const handleElement = elementList.value.find(el => el.id === element.id)
        if (!handleElement) return

        elementList.value = elementList.value.map(el => {
          if (activeElementIdList.value.includes(el.id)) {
            if (el.id === element.id) {
              return {
                ...el,
                left: targetLeft,
                top: targetTop,
              }
            }
            return {
              ...el,
              left: el.left + (targetLeft - handleElement.left),
              top: el.top + (targetTop - handleElement.top),
            }
          }
          return el
        })
      }
    }

    const handleMouseup = (e: MouseEvent | TouchEvent) => {
      isMouseDown = false
      
      document.ontouchmove = null
      document.ontouchend = null
      document.onmousemove = null
      document.onmouseup = null

      alignmentLines.value = []

      const currentPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const currentPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      if (startPageX === currentPageX && startPageY === currentPageY) return

      slidesStore.updateSlide({ elements: elementList.value })
      addHistorySnapshot()
    }

    if (isTouchEvent) {
      document.ontouchmove = handleMousemove
      document.ontouchend = handleMouseup
    }
    else {
      document.onmousemove = handleMousemove
      document.onmouseup = handleMouseup
    }
  }

  return {
    dragElement,
  }
}