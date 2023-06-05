/**
* a plain text to HTML string with paragraph information * @param text 文本
 */
export const parseText2Paragraphs = (text: string) => {
  const htmlText = text.replace(/[\n\r]+/g, '<br>')
  const paragraphs = htmlText.split('<br>')
  let string = ''
  for (const paragraph of paragraphs) {
    if (paragraph) string += `<div>${paragraph}</div>`
  }
  return string
}