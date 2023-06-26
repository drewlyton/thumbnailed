import { Canvas } from '@napi-rs/canvas'

export function getTruncatedTitleLines(
  title: string,
  canvas: Canvas,
  titleStyle = '15px sans-serif',
  widthLimitOffset = 60 - 13
) {
  const context = canvas.getContext('2d')
  context.font = titleStyle
  context.fillStyle = '#ffffff'
  const widthLimit = canvas.width - widthLimitOffset

  const firstLine = title.split(' ')
  let secondLine: string[] = []

  while (context.measureText(firstLine.join(' ')).width > widthLimit) {
    const lastWord = firstLine.pop()
    if (!lastWord) break
    secondLine.push(lastWord)
  }

  secondLine.reverse()

  secondLine = secondLine.join(' ').split('')

  let hasEllipses = false
  if (context.measureText(secondLine.join('')).width > widthLimit) {
    hasEllipses = true
    secondLine.push('...')
  }

  while (context.measureText(secondLine.join('')).width > widthLimit) {
    secondLine.splice(hasEllipses ? -2 : -1, 1)
  }

  return [firstLine.join(' '), secondLine.join('')]
}
