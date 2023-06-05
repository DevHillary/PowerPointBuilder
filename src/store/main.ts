import { customAlphabet } from 'nanoid'
import { defineStore } from 'pinia'
import { CreatingElement, TextFormatPainter } from '@/types/edit'
import { ToolbarStates } from '@/types/toolbar'
import { DialogForExportTypes } from '@/types/export'
import { SYS_FONTS } from '@/configs/font'
import { TextAttrs, defaultRichTextAttrs } from '@/utils/prosemirror/utils'
import { isSupportFont } from '@/utils/font'

import { useSlidesStore } from './slides'

export interface MainState {
  activeElementIdList: string[]
  handleElementId: string
  activeGroupElementId: string
  hiddenElementIdList: string[]
  canvasPercentage: number
  canvasScale: number
  canvasDragged: boolean
  thumbnailsFocus: boolean
  editorAreaFocus: boolean
  disableHotkeys: boolean
  gridLineSize: number
  showRuler: boolean
  creatingElement: CreatingElement | null
  availableFonts: typeof SYS_FONTS
  toolbarState: ToolbarStates
  clipingImageElementId: string
  isScaling: boolean
  richTextAttrs: TextAttrs
  selectedTableCells: string[]
  selectedSlidesIndex: number[]
  dialogForExport: DialogForExportTypes
  databaseId: string
  textFormatPainter: TextFormatPainter | null
  showSelectPanel: boolean
}

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
export const databaseId = nanoid(10)

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    activeElementIdList: [], // The selected element ID set contains handleElementId
    handleElementId: '', // Are working in the element ID
    activeGroupElementId: '', // Composite element members, ID can be independent operation of the selected elements
    hiddenElementIdList: [], // Hidden elements of the collection ID
    canvasPercentage: 90, // The canvas viewing area percentage
    canvasScale: 1, // The canvas scaling (based on the width 1000 px)
    canvasDragged: false, // The canvas by drag and drop to move
    thumbnailsFocus: false, // The left navigation thumbnails regional focus
    editorAreaFocus: false, //  The editing area is focused on the
    disableHotkeys: false, // To disable the keyboard shortcuts
    gridLineSize: 0, // Grid size (0 means no display grid lines)
    showRuler: false, // A ruler
    creatingElement: null, // Is inserted into the element information, need through drawing inserted elements (text, shapes, lines)
    availableFonts: SYS_FONTS, // The current environment available fonts
    toolbarState: ToolbarStates.SLIDE_DESIGN, // On the right side of the toolbar
    clipingImageElementId: '', // The current is cut out pictures of ID  
    richTextAttrs: defaultRichTextAttrs, // The rich text state
    selectedTableCells: [], // The selected table cell
    isScaling: false, // Ongoing element scaling
    selectedSlidesIndex: [], // The current selected collection of pages indexed
    dialogForExport: '', // The export panel
    databaseId, // Identify the current application with indexedDB database ID
    textFormatPainter: null, // Text format to brush
    showSelectPanel: false, // Open the selection panel
  }),

  getters: {
    activeElementList(state) {
      const slidesStore = useSlidesStore()
      const currentSlide = slidesStore.currentSlide
      if (!currentSlide || !currentSlide.elements) return []
      return currentSlide.elements.filter(element => state.activeElementIdList.includes(element.id))
    },
  
    handleElement(state) {
      const slidesStore = useSlidesStore()
      const currentSlide = slidesStore.currentSlide
      if (!currentSlide || !currentSlide.elements) return null
      return currentSlide.elements.find(element => state.handleElementId === element.id) || null
    },
  },

  actions: {
    setActiveElementIdList(activeElementIdList: string[]) {
      if (activeElementIdList.length === 1) this.handleElementId = activeElementIdList[0]
      else this.handleElementId = ''
      
      this.activeElementIdList = activeElementIdList
    },
    
    setHandleElementId(handleElementId: string) {
      this.handleElementId = handleElementId
    },
    
    setActiveGroupElementId(activeGroupElementId: string) {
      this.activeGroupElementId = activeGroupElementId
    },
    
    setHiddenElementIdList(hiddenElementIdList: string[]) {
      this.hiddenElementIdList = hiddenElementIdList
    },
  
    setCanvasPercentage(percentage: number) {
      this.canvasPercentage = percentage
    },
  
    setCanvasScale(scale: number) {
      this.canvasScale = scale
    },
  
    setCanvasDragged(isDragged: boolean) {
      this.canvasDragged = isDragged
    },
  
    setThumbnailsFocus(isFocus: boolean) {
      this.thumbnailsFocus = isFocus
    },
  
    setEditorareaFocus(isFocus: boolean) {
      this.editorAreaFocus = isFocus
    },
  
    setDisableHotkeysState(disable: boolean) {
      this.disableHotkeys = disable
    },
  
    setGridLineSize(size: number) {
      this.gridLineSize = size
    },
  
    setRulerState(show: boolean) {
      this.showRuler = show
    },
  
    setCreatingElement(element: CreatingElement | null) {
      this.creatingElement = element
    },
  
    setAvailableFonts() {
      this.availableFonts = SYS_FONTS.filter(font => isSupportFont(font.value))
    },
  
    setToolbarState(toolbarState: ToolbarStates) {
      this.toolbarState = toolbarState
    },
  
    setClipingImageElementId(elId: string) {
      this.clipingImageElementId = elId
    },
  
    setRichtextAttrs(attrs: TextAttrs) {
      this.richTextAttrs = attrs
    },
  
    setSelectedTableCells(cells: string[]) {
      this.selectedTableCells = cells
    },
  
    setScalingState(isScaling: boolean) {
      this.isScaling = isScaling
    },
    
    updateSelectedSlidesIndex(selectedSlidesIndex: number[]) {
      this.selectedSlidesIndex = selectedSlidesIndex
    },

    setDialogForExport(type: DialogForExportTypes) {
      this.dialogForExport = type
    },

    setTextFormatPainter(textFormatPainter: TextFormatPainter | null) {
      this.textFormatPainter = textFormatPainter
    },

    setSelectPanelState(show: boolean) {
      this.showSelectPanel = show
    },
  },
})