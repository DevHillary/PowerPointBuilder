import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { getElementRange, getElementListRange, getRectRotatedOffset } from '@/utils/element'
import useHistorySnapshot from './useHistorySnapshot'

interface ElementItem {
  min: number
  max: number
  el: PPTElement
}

interface GroupItem {
  groupId: string
  els: PPTElement[]
}

interface GroupElementsItem {
  min: number
  max: number
  els: PPTElement[]
}

type Item = ElementItem | GroupElementsItem

interface ElementWithPos {
  pos: number
  el: PPTElement
}

interface LastPos {
  min: number
  max: number
}

export default () => {
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeElementList } = storeToRefs(useMainStore())
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  const displayItemCount = computed(() => {
    let count = 0
    const groupIdList: string[] = []
    for (const el of activeElementList.value) {
      if (!el.groupId) count += 1
      else if (!groupIdList.includes(el.groupId)) {
        groupIdList.push(el.groupId)
        count += 1
      }
    }
    return count
  })
  // The level of uniform arrangement
  const uniformHorizontalDisplay = () => {
    const { minX, maxX } = getElementListRange(activeElementList.value)
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    // For common elements and combination set respectively, and record the scope of each item
    const singleElemetList: ElementItem[] = []
    let groupList: GroupItem[] = []
    for (const el of copyOfActiveElementList) {
      if (!el.groupId) {
        const { minX, maxX } = getElementRange(el)
        singleElemetList.push({ min: minX, max: maxX, el })
      }
      else {
        const groupEl = groupList.find(item => item.groupId === el.groupId)
        if (!groupEl) groupList.push({ groupId: el.groupId, els: [el] })
        else {
          groupList = groupList.map(item => item.groupId === el.groupId ? { ...item, els: [...item.els, el] } : item)
        }
      }
    }
    const formatedGroupList: GroupElementsItem[] = []
    for (const groupItem of groupList) {
      const { minX, maxX } = getElementListRange(groupItem.els)
      formatedGroupList.push({ min: minX, max: maxX, els: groupItem.els })
    }

    // Ordinary set and combination elements together, then each item according to the position (from left to right)
    const list: Item[] = [...singleElemetList, ...formatedGroupList]
    list.sort((itemA, itemB) => itemA.min - itemB.min)

    // Computing elements required for uniform distribution of interval:
    // (The selected element in the overall range - The width and all of the selected elements) / (The selected too - 1)
    let totalWidth = 0
    for (const item of list) {
      const width = item.max - item.min
      totalWidth += width
    }
    const span = ((maxX - minX) - totalWidth) / (list.length - 1)

    // According to the position sequence calculation each element of the target location
    // In the first element is the starting point, without calculation
    // Starting from the second, the position of each item should be: a position + On a width + interval
    // Note here to calculate the position of the element (pos) is not the final left value, but the minimum target range (elements left after the rotation values ≠ 范围最小值）
    const sortedElementData: ElementWithPos[] = []

    const firstItem = list[0]
    let lastPos: LastPos = { min: firstItem.min, max: firstItem.max }

    if ('el' in firstItem) {
      sortedElementData.push({ pos: firstItem.min, el: firstItem.el })
    }
    else {
      for (const el of firstItem.els) {
        const { minX: pos } = getElementRange(el)
        sortedElementData.push({ pos, el })
      }
    }

    for (let i = 1; i < list.length; i++) {
      const item = list[i]
      const lastWidth = lastPos.max - lastPos.min
      const currentPos = lastPos.min + lastWidth + span
      const currentWidth = item.max - item.min
      lastPos = { min: currentPos, max: currentPos + currentWidth }

      if ('el' in item) {
        sortedElementData.push({ pos: currentPos, el: item.el })
      }
      else {
        for (const el of item.els) {
          const { minX } = getElementRange(el)
          const offset = minX - item.min
          sortedElementData.push({ pos: currentPos + offset, el })
        }
      }
    }

    // According to the target position computation element ultimate goal left value
    // For rotating elements, after the need to compute rotating left before and after the migration to make correction
    for (const element of newElementList) {
      if (!activeElementIdList.value.includes(element.id)) continue

      for (const sortedItem of sortedElementData) {
        if (sortedItem.el.id === element.id) {
          if ('rotate' in element && element.rotate) {
            const { offsetX } = getRectRotatedOffset({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            element.left = sortedItem.pos - offsetX
          }
          else element.left = sortedItem.pos
        }
      }
    }

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  // Vertical uniform arrangement (logic similar levels of uniform arrangement method)
  const uniformVerticalDisplay = () => {
    const { minY, maxY } = getElementListRange(activeElementList.value)
    const copyOfActiveElementList: PPTElement[] = JSON.parse(JSON.stringify(activeElementList.value))
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    const singleElemetList: ElementItem[] = []
    let groupList: GroupItem[] = []
    for (const el of copyOfActiveElementList) {
      if (!el.groupId) {
        const { minY, maxY } = getElementRange(el)
        singleElemetList.push({ min: minY, max: maxY, el })
      }
      else {
        const groupEl = groupList.find(item => item.groupId === el.groupId)
        if (!groupEl) groupList.push({ groupId: el.groupId, els: [el] })
        else {
          groupList = groupList.map(item => item.groupId === el.groupId ? { ...item, els: [...item.els, el] } : item)
        }
      }
    }
    const formatedGroupList: GroupElementsItem[] = []
    for (const groupItem of groupList) {
      const { minY, maxY } = getElementListRange(groupItem.els)
      formatedGroupList.push({ min: minY, max: maxY, els: groupItem.els })
    }

    const list: Item[] = [...singleElemetList, ...formatedGroupList]
    list.sort((itemA, itemB) => itemA.min - itemB.min)

    let totalHeight = 0
    for (const item of list) {
      const height = item.max - item.min
      totalHeight += height
    }
    const span = ((maxY - minY) - totalHeight) / (list.length - 1)

    const sortedElementData: ElementWithPos[] = []

    const firstItem = list[0]
    let lastPos: LastPos = { min: firstItem.min, max: firstItem.max }

    if ('el' in firstItem) {
      sortedElementData.push({ pos: firstItem.min, el: firstItem.el })
    }
    else {
      for (const el of firstItem.els) {
        const { minY: pos } = getElementRange(el)
        sortedElementData.push({ pos, el })
      }
    }

    for (let i = 1; i < list.length; i++) {
      const item = list[i]
      const lastHeight = lastPos.max - lastPos.min
      const currentPos = lastPos.min + lastHeight + span
      const currentHeight = item.max - item.min
      lastPos = { min: currentPos, max: currentPos + currentHeight }

      if ('el' in item) {
        sortedElementData.push({ pos: currentPos, el: item.el })
      }
      else {
        for (const el of item.els) {
          const { minY } = getElementRange(el)
          const offset = minY - item.min
          sortedElementData.push({ pos: currentPos + offset, el })
        }
      }
    }

    for (const element of newElementList) {
      if (!activeElementIdList.value.includes(element.id)) continue

      for (const sortedItem of sortedElementData) {
        if (sortedItem.el.id === element.id) {
          if ('rotate' in element && element.rotate) {
            const { offsetY } = getRectRotatedOffset({
              left: element.left,
              top: element.top,
              width: element.width,
              height: element.height,
              rotate: element.rotate,
            })
            element.top = sortedItem.pos - offsetY
          }
          else element.top = sortedItem.pos
        }
      }
    }

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  return {
    displayItemCount,
    uniformHorizontalDisplay,
    uniformVerticalDisplay,
  }
}