// to automatically under the SRC \ assets \ fonts path of font file list, and replace the related SCSS variables

/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')

const assetsPath = path.join(__dirname, '../src/assets')
const fontVarPath = path.join(assetsPath, 'styles/font.scss')
const fontsPath = path.join(assetsPath, 'fonts')

const scssFontListVar = '$fontList'

const replaceSCSSVariable = (names) => {
  fs.readFile(fontVarPath, 'utf-8', (errs, content) => {
    if (errs) {
      console.error(errs)
      process.exit(1)
    }
    const reg = new RegExp(`(\\${scssFontListVar}:\\s*)(.*)(;.*)`, 'g')
    const newContent = content.replace(reg, `$1${names}$3`)
    fs.writeFile(fontVarPath, newContent, errs => {
      if (errs) {
        console.error(errs)
        process.exit(1)
      }
      console.log('Automatically generate a custom font list')
    })
  })
}

fs.readdir(fontsPath, { withFileTypes: true }, (errs, files) => {
  if (errs) {
    console.error(errs)
    process.exit(1)
  }
  const woff2Fonts = files.filter(({ name }) => name.endsWith('.woff2'))
  const fontList = woff2Fonts.map(({ name }) => name.replace('.woff2', ''))

  const names = fontList.reduce((result, name, i) => {
    if (i === 0) return `'${name}'`
    return `${result}, '${name}'`
  }, '')
  replaceSCSSVariable(names)
})
