import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { KEYS } from '@/configs/hotkey'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const slidesStore = useSlidesStore()
  const { activeElementIdList, activeGroupElementId } = storeToRefs(useMainStore())
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * The element to a specified direction specified distance
* combination element members, there can be independent operation of the selected element, first move the element.Otherwise the default move all the selected elements
   * @param command Direction of movement
   * @param step Mobile distance
   */
  const moveElement = (command: string, step = 1) => {
    let newElementList: PPTElement[] = []

    const move = (el: PPTElement) => {
      let { left, top } = el
      switch (command) {
        case KEYS.LEFT: 
          left = left - step
          break
        case KEYS.RIGHT: 
          left = left + step
          break
        case KEYS.UP: 
          top = top - step
          break
        case KEYS.DOWN: 
          top = top + step
          break
        default: break
      }
      return { ...el, left, top }
    }

    if (activeGroupElementId.value) {
      newElementList = currentSlide.value.elements.map(el => {
        return activeGroupElementId.value === el.id ? move(el) : el
      })
    }
    else {
      newElementList = currentSlide.value.elements.map(el => {
        return activeElementIdList.value.includes(el.id) ? move(el) : el
      })
    }

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  return {
    moveElement,
  }
}