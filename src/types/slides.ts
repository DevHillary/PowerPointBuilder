import { BarChartOptions, LineChartOptions, PieChartOptions } from 'chartist'

export const enum ShapePathFormulasKeys {
  ROUND_RECT = 'roundRect',
  ROUND_RECT_DIAGONAL = 'roundRectDiagonal',
  ROUND_RECT_SINGLE = 'roundRectSingle',
  ROUND_RECT_SAMESIDE = 'roundRectSameSide',
  CUT_RECT_DIAGONAL = 'cutRectDiagonal',
  CUT_RECT_SINGLE = 'cutRectSingle',
  CUT_RECT_SAMESIDE = 'cutRectSameSide',
  CUT_ROUND_RECT = 'cutRoundRect',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'roundMessage',
  L = 'L',
  RING_RECT = 'ringRect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogramLeft',
  PARALLELOGRAM_RIGHT = 'parallelogramRight',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
}

export const enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  CHART = 'chart',
  TABLE = 'table',
  LATEX = 'latex',
  VIDEO = 'video',
  AUDIO = 'audio',
}

/**
 * Elements of the shadow
*
* h: horizontal offset
*
* v: vertical offset
*
* the blur: fuzzy degree
*
* color: shadow color
 */
export interface PPTElementShadow {
  h: number
  v: number
  blur: number
  color: string
}

/**
* element border
*
* style?: the border style (solid or dotted lines)
*
* width?: border width
*
* color?: the border color
 */
export interface PPTElementOutline {
  style?: 'dashed' | 'solid'
  width?: number
  color?: string
}

/**
 * Elements of hyperlinks
 * 
 * type: Link type, slide the page (web page)
 * 
 * target: The target address (web page links, slide ID)
 */
export interface PPTElementLink {
  type: 'web' | 'slide'
  target: string
}


/**
 * Element general attributes
*
* id: the id element
*
* left: element horizontal position (left) from canvas
*
* top: element in vertical position (from the top)
*
* the lock?Lock element:
*
* the groupId?Combination: ID (with the same combination ID element is the same combination element members)
*
* width: the width of the elements
*
* height: the element level
*
* the rotate: rotation Angle
*
* link?: a hyperlink
*
* name?: the element name
 */
interface PPTBaseElement {
  id: string
  left: number
  top: number
  lock?: boolean
  groupId?: string
  width: number
  height: number
  rotate: number
  link?: PPTElementLink
  name?: string
}


/**
 * Text elements
*
* type: element type (text)
*
* content: text content (HTML string)
*
* defaultFontName: the default font (will be covered by text content in the HTML inline style)
*
* defaultColor: the default color (will be covered by text content in the HTML inline style)
*
* the outline?: border
*
* the fill?: fill color
*
* lineHeight?Line: high (times), the default is 1.5
*
* wordSpace?: the word spacing, zero by default
*
* opacity?: opacity, 1 by default
 * 
 * Shadow?Shadow:
*
* textIndent?The first line: paragraph indentation
*
* paragraphSpace?: the default 5 px, paragraph spacing
*
* vertical?Vertical text:
 */
export interface PPTTextElement extends PPTBaseElement {
  type: 'text'
  content: string
  defaultFontName: string
  defaultColor: string
  outline?: PPTElementOutline
  fill?: string
  lineHeight?: number
  wordSpace?: number
  opacity?: number
  shadow?: PPTElementShadow
  textIndent?: number
  paragraphSpace?: number
  vertical?: boolean
}


/**
 * Picture flip, flip shape
*
* flipH?: flip horizontal
*
* flipV?: flip vertical
 */
export interface ImageOrShapeFlip {
  flipH?: boolean
  flipV?: boolean
}

/**
 * Image filter
 * 
 * https://developer.mozilla.org/zh-CN/docs/Web/CSS/filter
 * 
 * 'The blur '?: fuzzy. Default is 0 (px)
*
* 'brightness'?: brightness, the default 100 (%)
*
* 'contrast'?: contrast, the default 100 (%)
*
* 'grayscale'?: gray level, the default is 0 (%)
*
Saturate the '*'?: saturation, the default 100 (%)
*
* 'hue - rotate'?Hue: rotation, the default is 0 (deg)
*
* 'opacity?: the opacity, the default 100 (%)
 */
export interface ImageElementFilters {
  'blur'?: string
  'brightness'?: string
  'contrast'?: string
  'grayscale'?: string
  'saturate'?: string
  'hue-rotate'?: string
  'opacity'?: string
}

export type ImageClipDataRange = [[number, number], [number, number]]

/**
 * Image cropping
*
* range: cutting range, such as [[10, 10], [90, 90]] said cropping the original image from the top left corner 10%, 10% to 90%, the range of 90%
*
* shape: shape of cut, see configs/imageClip ts CLIPPATHS
 */
export interface ImageElementClip {
  range: ImageClipDataRange
  shape: string
}

/**
 * Pictures of the mask
*
* color: color mask
*
* opacity: the transparency of the mask
 */
export interface ImageColorElementMask {
  color: string
  opacity: number
}

/**
 * Image element
*
* type: element type (image)
*
* fixedRatio: fixed image wide high percentage
*
Address * SRC: images
*
* the outline?: border
*
* filters?: picture filter
*
* clip?: cutting out information
*
* flipH?: flip horizontal
*
* flipV?: flip vertical
*
* shadow?Shadow:
 */
export interface PPTImageElement extends PPTBaseElement {
  type: 'image'
  fixedRatio: boolean
  src: string
  outline?: PPTElementOutline
  filters?: ImageElementFilters
  clip?: ImageElementClip
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  colorMask?: ImageColorElementMask
}


/**
 * Shape of the gradient
*
* type, gradient type (radial and linear)
*
* color: gradient color
*
* the rotate: the gradient Angle (linear gradient)
 */
export interface ShapeGradient {
  type: 'linear' | 'radial'
  color: [string, string]
  rotate: number
}

/**
 * Shape the text within
*
* content: text content (HTML string)
*
* defaultFontName: the default font (will be covered by text content in the HTML inline style)
*
* defaultColor: the default color (will be covered by text content in the HTML inline style)
*
* the align: text alignment direction (vertical direction）
 */
export interface ShapeText {
  content: string
  defaultFontName: string
  defaultColor: string
  align: 'top' | 'middle' | 'bottom'
}

/**
 * The shape elements
*
* type: element type (shape)
*
* viewBox: SVG viewBox attributes, such as [1000, 1000] said '0 0, 1000, 1000'
*
* path: shape path, SVG path d attribute
*
* fixedRatio: fixed shape wide high percentage
*
* the fill, fill, there is no gradient
*
* gradient?: the gradient, the preference of the attribute exists as a filler
*
* the outline?: border
*
* opacity?: no transparency
*
* flipH?: flip horizontal
*
* flipV?: flip vertical
*
* shadow?Shadow:
 * 
 * special?: Special shape (the shape of the tag some difficult to parse, such as path using the L Q C outside of A type, the shape after the export will become the picture form)
*
* text?Shape: within the text
*
* pathFormula?Shape: the path calculation formula
* in general, the size of the shape changes only by the wide high based on the scaling of viewBox to adjust the shape, and viewBox itself and the path will not change,
* but there are some shapes hope to more precise control of some key position, where you need to provide path calculation formula, through the update viewBox when zooming in or out and recalculate the path to draw shapes
*
* keypoint?Key points: location percentage
 */
export interface PPTShapeElement extends PPTBaseElement {
  type: 'shape'
  viewBox: [number, number]
  path: string
  fixedRatio: boolean
  fill: string
  gradient?: ShapeGradient
  outline?: PPTElementOutline
  opacity?: number
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  special?: boolean
  text?: ShapeText
  pathFormula?: ShapePathFormulasKeys
  keypoint?: number
}


export type LinePoint = '' | 'arrow' | 'dot' 

/**
 * Line element
*
* type: element type (line)
*
* start: the starting location ((x, y))
*
* end: the finish position (x, y))
*
* style: line styles (visible)
*
* color: color line
*
* points: endpoint style (/ starting point, end point style, optional: no, arrows, dots)
*
* shadow?Shadow:
*
* broken?: line control point position ((x, y))
*
* the curve?Position: quadratic curve control points ((x, y))
*
* cubic?: three curve control points position ([[x1, y1], [x2, y2]])
 */
export interface PPTLineElement extends Omit<PPTBaseElement, 'height' | 'rotate'> {
  type: 'line'
  start: [number, number]
  end: [number, number]
  style: 'solid' | 'dashed'
  color: string
  points: [LinePoint, LinePoint]
  shadow?: PPTElementShadow
  broken?: [number, number]
  curve?: [number, number]
  cubic?: [[number, number], [number, number]]
}


export type PresetChartType = 'bar' | 'horizontalBar' | 'line' | 'area' | 'scatter' | 'pie' | 'ring'
export type ChartType = 'bar' | 'line' | 'pie'
export type ChartOptions = LineChartOptions & BarChartOptions & PieChartOptions
export interface ChartData {
  labels: string[]
  legends: string[]
  series: number[][]
}

/**
 * The chart elements
*
* type: element type (chart)
*
* the fill?: fill color
*
* chartType: chart base type (bar/line/pie), all chart types are derived from these three basic types
*
* data: data chart
*
* the options?: chart configuration items
*
* the outline?: border
*
* themeColor: theme color
*
* gridColor?: & coordinate grid color
*
* legend?: legend/location
 */
export interface PPTChartElement extends PPTBaseElement {
  type: 'chart'
  fill?: string
  chartType: ChartType
  data: ChartData
  options?: ChartOptions
  outline?: PPTElementOutline
  themeColor: string[]
  gridColor?: string
  legend?: '' | 'top' | 'bottom'
}


/**
 * Table cell style
*
* bold?: bold
*
* em?: italic
*
* underline?: the underline
*
* strikethrough?: delete lines
*
* color?: the font color
*
* backcolor?: fill color
*
* fontsize?: the font size
*
* fontname?: font
*
* the align?: alignment
 */
export interface TableCellStyle {
  bold?: boolean
  em?: boolean
  underline?: boolean
  strikethrough?: boolean
  color?: string
  backcolor?: string
  fontsize?: string
  fontname?: string
  align?: 'left' | 'center' | 'right'
}


/**
 *Table cell
*
* id: cell id
*
* colspan: merge the number of columns
*
* rowspan: merge rows
*
* text: text content
*
* style?: cell style
 */
export interface TableCell {
  id: string
  colspan: number
  rowspan: number
  text: string
  style?: TableCellStyle
}

/**
 * Table topics
*
* color: color theme
*
* rowHeader: header line
*
* rowFooter: summary
*
* colHeader: in the first column
*
* colFooter: the last column
 */
export interface TableTheme {
  color: string
  rowHeader: boolean
  rowFooter: boolean
  colHeader: boolean
  colFooter: boolean
}

/**
 * Table element
*
* type: element type (table)
*
* the outline: border
*
* the theme?Theme:
*
* colWidths: column widths array, such as [30, 50, 20] said three column width were 30%, 50%, 20%
*
* cellMinHeight: cell minimum height
*
* data: table data
 */
export interface PPTTableElement extends PPTBaseElement {
  type: 'table'
  outline: PPTElementOutline
  theme?: TableTheme
  colWidths: number[]
  cellMinHeight: number
  data: TableCell[][]
}


/**
 * LaTeX elements (formula)
*
* type: element type (latex)
*
* latex, latex code
*
* path: SVG path
*
* color: color
*
* strokeWidth: path width
*
* viewBox: SVG viewBox attributes
*
* fixedRatio: fixed shape wide high percentage
 */
export interface PPTLatexElement extends PPTBaseElement {
  type: 'latex'
  latex: string
  path: string
  color: string
  strokeWidth: number
  viewBox: [number, number]
  fixedRatio: boolean
}

/**
 * Video elements
*
* type: element type (video)
*
* SRC: video address
*
* poster: preview cover
 */
export interface PPTVideoElement extends PPTBaseElement {
  type: 'video'
  src: string
  poster?: string
}

/**
 * The audio element
*
* type: element type (audio)
*
* fixedRatio: fixed icon wide high percentage
*
* color: color ICONS
*
* loop: looping
*
* the autoplay: playing automatically
*
* SRC: audio address
 */
export interface PPTAudioElement extends PPTBaseElement {
  type: 'audio'
  fixedRatio: boolean
  color: string,
  loop: boolean,
  autoplay: boolean,
  src: string
}


export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement | PPTLatexElement | PPTVideoElement | PPTAudioElement


/**
 * Elements of the animation
*
* id: animation id
*
* elId: element ID
*
* effect: animation effects
*
* type: animation types (entry, exit, emphasize)
*
* duration: the duration of the animation
*
* trigger: animation is triggered (click click, meantime with an animation at the same time, the auto - after a animation)
 */
export interface PPTAnimation {
  id: string
  elId: string
  effect: string
  type: 'in' | 'out' | 'attention'
  duration: number
  trigger: 'click' | 'meantime' | 'auto'
}

/**
 * The slide background
*
* type: background types (pure color, picture, gradient)
*
* color?: background color (pure color)
*
* image?Address: picture (picture)
*
* imageSize?: picture fill the way
*
* gradientType?: the gradient type (linear, radial)
*
* gradientColor?: gradual change color
*
* gradientRotate?: the gradient Angle (linear)
 */
export interface SlideBackground {
  type: 'solid' | 'image' | 'gradient'
  color?: string
  image?: string
  imageSize?: 'cover' | 'contain' | 'repeat'
  gradientType?: 'linear' | 'radial'
  gradientColor?: [string, string]
  gradientRotate?: number
}


export type TurningMode = 'no' | 'fade' | 'slideX' | 'slideY'

/**
 * Slide the page
*
* id: page id
*
* elements: the element set
*
* remark?: note
*
* background?Background: page
*
* animations?Collection: the element animation
*
* turningMode?: flip way
 */
export interface Slide {
  id: string
  elements: PPTElement[]
  remark?: string
  background?: SlideBackground
  animations?: PPTAnimation[]
  turningMode?: TurningMode
}

/**
 * Slide the theme
*
* backgroundColor: page background color
*
* themeColor: Theme color, 2 for shape and color is created by default
*
* fontColor: the font color
*
* fontName: the font
 */
export interface SlideTheme {
  backgroundColor: string
  themeColor: string
  fontColor: string
  fontName: string
}
