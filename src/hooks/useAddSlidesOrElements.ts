import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useSlidesStore, useMainStore } from '@/store'
import { PPTElement, Slide } from '@/types/slides'
import { createSlideIdMap, createElementIdMap } from '@/utils/element'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const mainStore = useMainStore()
  const slidesStore = useSlidesStore()
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * Adds the specified element data (group a)
   * @ param elements list data element
   */
  const addElementsFromData = (elements: PPTElement[]) => {
    const { groupIdMap, elIdMap } = createElementIdMap(elements)
    const currentSlideElementIdList = currentSlide.value.elements.map(el => el.id)
    
    for (const element of elements) {
      const inCurrentSlide = currentSlideElementIdList.includes(element.id)
      
      element.id = elIdMap[element.id]

      if (inCurrentSlide) {
        element.left = element.left + 10
        element.top = element.top + 10
      }

      if (element.groupId) element.groupId = groupIdMap[element.groupId]
    }
    slidesStore.addElement(elements)
    mainStore.setActiveElementIdList(Object.values(elIdMap))
    addHistorySnapshot()
  }

  /**
   * Add the specified page data
   * @param slide The page data
   */
  const addSlidesFromData = (slides: Slide[]) => {
    const slideIdMap = createSlideIdMap(slides)
    const newSlides = slides.map(slide => {
      const { groupIdMap, elIdMap } = createElementIdMap(slide.elements)

      for (const element of slide.elements) {
        element.id = elIdMap[element.id]
        if (element.groupId) element.groupId = groupIdMap[element.groupId]
		
        // If the element binding the page jump links
        if (element.link && element.link.type === 'slide') {

          // To add a page contains the page, is related to replace the binding
          if (slideIdMap[element.link.target]) {
            element.link.target = slideIdMap[element.link.target]
          }
          // To add the page does not contain the page, page jump to remove the binding elements
          else delete element.link
        }
      }
      // Animation id to replace
      if (slide.animations) {
        for (const animation of slide.animations) {
          animation.id = nanoid(10)
          animation.elId = elIdMap[animation.elId]
        }
      }
      return {
        ...slide,
        id: slideIdMap[slide.id],
      }
    })
    slidesStore.addSlide(newSlides)
    addHistorySnapshot()
  }

  return {
    addElementsFromData,
    addSlidesFromData,
  }
}