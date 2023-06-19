import { Canvas } from '@napi-rs/canvas'
import { titleStyle } from './generateThumbnail'

export function getTruncatedTitleLines(title: string, canvas: Canvas) {
  const context = canvas.getContext('2d')
  context.font = titleStyle
  context.fillStyle = '#ffffff'
  const widthLimit = canvas.width - 60 - 13

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
