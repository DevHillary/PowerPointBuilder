import { storeToRefs } from 'pinia'
import { useSlidesStore } from '@/store'
import { PPTElement } from '@/types/slides'
import { ElementOrderCommands } from '@/types/edit'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

export default () => {
  const slidesStore = useSlidesStore()
  const { currentSlide } = storeToRefs(slidesStore)

  const { addHistorySnapshot } = useHistorySnapshot()

  /**
   * Range from composite element level
   * @param elementList List all the elements on this page
   * @param combineElementList Composite element list
   */
  const getCombineElementLevelRange = (elementList: PPTElement[], combineElementList: PPTElement[]) => {
    return {
      minLevel: elementList.findIndex(_element => _element.id === combineElementList[0].id),
      maxLevel: elementList.findIndex(_element => _element.id === combineElementList[combineElementList.length - 1].id),
    }
  }

  /**
   * Move up a layer of
   * @pAram elementList list all the elements on this page
* @ param element of the current element of the operation
   */
  const moveUpElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // If you are members of the operating element is a combination of elements, need to combine all the members will be moved together
    if (element.groupId) {

      // Access to the combination of all members, and all the members of the hierarchy
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel, maxLevel } = getCombineElementLevelRange(elementList, combineElementList)

      // 已经处在顶层，无法继续移动
      if (maxLevel === elementList.length - 1) return

      // By a maximum range of composite members, a layer of getting to the combination of elements, and then the composite element is removed from the list of elements (elements) and the cache is removed
      // If the upper element in another combination, insert the elements of the combination of the above has been removed to the above the upper combination
      // If the upper element does not in any group, insert the elements of the combination of the above has been removed to the above the upper element
      const nextElement = copyOfElementList[maxLevel + 1]
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)

      if (nextElement.groupId) {
        const nextCombineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        copyOfElementList.splice(minLevel + nextCombineElementList.length, 0, ...movedElementList)
      }
      else copyOfElementList.splice(minLevel + 1, 0, ...movedElementList)
    }

    // If the operating element is not combination elements
    else {

      // To get the elements in the list of hierarchy
      const level = elementList.findIndex(item => item.id === element.id)

      // Has been at the top floor, unable to continue to move
      if (level === elementList.length - 1) return

      // Access to this combination on a layer of elements, and then the composite element removed from the list of elements (elements) and the cache is removed
      const nextElement = copyOfElementList[level + 1]
      const movedElement = copyOfElementList.splice(level, 1)[0]

      // By a maximum range of composite members, a layer of getting to the combination of elements, and then the composite element is removed from the list of elements (elements) and the cache is removed
      // If the upper element in another combination, insert the elements of the combination of the above has been removed to the above the upper combination
      // If the upper element does not in any group, insert the elements of the combination of the above has been removed to the above the upper element
      if (nextElement.groupId) {
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === nextElement.groupId)
        copyOfElementList.splice(level + combineElementList.length, 0, movedElement)
      }
      else copyOfElementList.splice(level + 1, 0, movedElement)
    }

    return copyOfElementList
  }

  /**
   * Down a layer, operating mode with up
* @ param elementList list all the elements on this page
* @ param element of the current element of the operation
   */
  const moveDownElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    if (element.groupId) {
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel } = getCombineElementLevelRange(elementList, combineElementList)
      if (minLevel === 0) return

      const prevElement = copyOfElementList[minLevel - 1]
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)

      if (prevElement.groupId) {
        const prevCombineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        copyOfElementList.splice(minLevel - prevCombineElementList.length, 0, ...movedElementList)
      }
      else copyOfElementList.splice(minLevel - 1, 0, ...movedElementList)
    }

    else {
      const level = elementList.findIndex(item => item.id === element.id)
      if (level === 0) return

      const prevElement = copyOfElementList[level - 1]
      const movedElement = copyOfElementList.splice(level, 1)[0]

      if (prevElement.groupId) {
        const combineElementList = copyOfElementList.filter(_element => _element.groupId === prevElement.groupId)
        copyOfElementList.splice(level - combineElementList.length, 0, movedElement)
      }
      else copyOfElementList.splice(level - 1, 0, movedElement)
    }

    return copyOfElementList
  }

  /**
   *Top layer
* @ param elementList list all the elements on this page
* @ param element of the current element of the operation
   */
  const moveTopElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    // If you are members of the operating element is a combination of elements, need to combine all the members will be moved together
    if (element.groupId) {

      // Access to the combination of all members, and all the members of the hierarchy
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel, maxLevel } = getCombineElementLevelRange(elementList, combineElementList)

      // Has been at the top floor, unable to continue to move
      if (maxLevel === elementList.length - 1) return null

      // Will be removed from the list of elements, the combination of elements and then will be removed elements added to the element at the top of the list
      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)
      copyOfElementList.push(...movedElementList)
    }

    // If the operating element is not combination elements
    else {

      // To get the elements in the list of hierarchy
      const level = elementList.findIndex(item => item.id === element.id)

      // Has been at the top floor, unable to continue to move
      if (level === elementList.length - 1) return null

      // Will be removed from the list of elements, the combination of elements and the element will be removed is added to the element at the bottom of the list
      copyOfElementList.splice(level, 1)
      copyOfElementList.push(element)
    }

    return copyOfElementList
  }

  /**
   * Buy the underlying, operation mode and placed at the top
   * @param elementList List all the elements on this page
   * @param element The elements of the current operation
   */
  const moveBottomElement = (elementList: PPTElement[], element: PPTElement) => {
    const copyOfElementList: PPTElement[] = JSON.parse(JSON.stringify(elementList))

    if (element.groupId) {
      const combineElementList = copyOfElementList.filter(_element => _element.groupId === element.groupId)
      const { minLevel } = getCombineElementLevelRange(elementList, combineElementList)
      if (minLevel === 0) return

      const movedElementList = copyOfElementList.splice(minLevel, combineElementList.length)
      copyOfElementList.unshift(...movedElementList)
    }

    else {
      const level = elementList.findIndex(item => item.id === element.id)
      if (level === 0) return

      copyOfElementList.splice(level, 1)
      copyOfElementList.unshift(element)
    }

    return copyOfElementList
  }

  /**
   * Adjust the element hierarchy
   * @param element Need to adjust the level of elements
   * @param command Adjust the command: move up, down, top, bottom
   */
  const orderElement = (element: PPTElement, command: ElementOrderCommands) => {
    let newElementList
    
    if (command === ElementOrderCommands.UP) newElementList = moveUpElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.DOWN) newElementList = moveDownElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.TOP) newElementList = moveTopElement(currentSlide.value.elements, element)
    else if (command === ElementOrderCommands.BOTTOM) newElementList = moveBottomElement(currentSlide.value.elements, element)

    if (!newElementList) return

    slidesStore.updateSlide({ elements: newElementList })
    addHistorySnapshot()
  }

  return {
    orderElement,
  }
}