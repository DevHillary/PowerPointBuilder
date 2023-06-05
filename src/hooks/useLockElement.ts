import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { activeElementIdList } = storeToRefs(mainStore)
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  // Lock the selected elements,And clear the state of the selected elements
  const lockElement = () => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))
  
    for (const element of newElementList) {
      if (activeElementIdList.value.includes(element.id)) element.lock = true
    }
    slidesStore.updateSlide({ elements: newElementList })
    mainStore.setActiveElementIdList([])
    addHistorySnapshot()
  }

  /**
   * Remove elements locked,And set it to the currently selected element
   * @param handleElement Need to unlock the elements
   */
  const unlockElement = (handleElement: PPTElement) => {
    const newElementList: PPTElement[] = JSON.parse(JSON.stringify(currentSlide.value.elements))

    if (handleElement.groupId) {
      const groupElementIdList = []
      for (const element of newElementList) {
        if (element.groupId === handleElement.groupId) {
          element.lock = false
          groupElementIdList.push(element.id)
        }
      }
      slidesStore.updateSlide({ elements: newElementList })
      mainStore.setActiveElementIdList(groupElementIdList)
    }
    else {
      for (const element of newElementList) {
        if (element.id === handleElement.id) {
          element.lock = false
          break
        }
      }
      slidesStore.updateSlide({ elements: newElementList })
      mainStore.setActiveElementIdList([handleElement.id])
    }
    addHistorySnapshot()
  }

  return {
    lockElement,
    unlockElement,
  }
}