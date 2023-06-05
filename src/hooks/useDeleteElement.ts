import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement } from '@/types/slides'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeGroupElementId } = storeToRefs(mainStore)
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  // Delete all selected elements
  // Composite element members, there can be selected independently operating elements, priority to delete this element.Otherwise the default delete all selected elements
  const deleteElement = () => {
    if (!activeElementIdList.value.length) return

    let newElementList: PPTElement[] = []
    if (activeGroupElementId.value) {
      newElementList = currentSlide.value.elements.filter(el => el.id !== activeGroupElementId.value)
    }
    else {
      newElementList = currentSlide.value.elements.filter(el => !activeElementIdList.value.includes(el.id))
    }

    mainStore.setActiveElementIdList([])
    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  // Remove all elements within the inside (whether or not selected)
  const deleteAllElements = () => {
    if (!currentSlide.value.elements.length) return
    mainStore.setActiveElementIdList([])
    slidesStore.updateSlide({ elements: [] })
    addHistorySnapshot()
  }

  return {
    deleteElement,
    deleteAllElements,
  }
}