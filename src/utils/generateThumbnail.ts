import { Canvas, Path2D, loadImage, GlobalFonts } from '@napi-rs/canvas'
import { getTruncatedTitleLines } from './getTruncatedTitleLines'
import { join } from 'path'
import { randomNumber, daysOrHours } from './randomNumber'
import * as Sentry from '@sentry/node'

export async function generateThumbnail(
  title: string,
  name: string,
  thumbnailUrl: string,
  avatarUrl: string
) {
  const transaction = Sentry.getCurrentHub()
    .getScope()
    .getTransaction() as Sentry.Transaction

  const prepFonts = transaction.startChild({
    op: 'prepping fonts',
  }) // This function returns a Span
  GlobalFonts.registerFromPath(
    join(__dirname, '../../fonts/Roboto/Roboto-Bold.ttf'),
    'Title'
  )
  GlobalFonts.registerFromPath(
    join(__dirname, '../../fonts/Roboto/Roboto-Medium.ttf'),
    'Caption'
  )
  prepFonts.finish() // Remember that only finished spans will be sent with the transaction

  const initCanvasSpan = transaction.startChild({ op: 'initialize canvas' }) // This function returns a Span
  // Initialize canvas and set background color
  const canvas = new Canvas(388, 344)
  const context = canvas.getContext('2d')

  const backgroundPath = new Path2D()
  backgroundPath.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#0E0E0E'
  context.fill(backgroundPath)

  context.save()
  initCanvasSpan.finish()

  const drawImages = transaction.startChild({ op: 'draw images' }) // This function returns a Span
  // Draw clipping mask for thumbnail image
  const thumbnailMask = new Path2D()
  thumbnailMask.roundRect(13, 13, 360, 203, 8)
  context.clip(thumbnailMask)

  // // draw thumbnail image to canvas
  const thumbnailImage = await loadImage(thumbnailUrl)
  context.drawImage(thumbnailImage, 13, 13, 360, 203)
  context.restore()

  context.save()
  // Draw clipping mask for profile image
  const profileMask = new Path2D()
  profileMask.arc(13 + 18, 227 + 18, 18, 0, 2 * Math.PI, true)
  context.clip(profileMask)

  // Draw profile image to canvas
  const avatarImage = await loadImage(avatarUrl)
  context.drawImage(avatarImage, 13, 227, 36, 36)
  context.restore()

  drawImages.finish()

  const writeText = transaction.startChild({ op: 'writing text' }) // This function returns a Span

  // Write title text
  const [firstLine, secondLine] = getTruncatedTitleLines(title, canvas)
  context.font = titleStyle
  context.fillStyle = '#ffffff'
  context.fillText(firstLine, 60, 227 + 16)
  context.fillText(secondLine, 60, 227 + 16 + 22)

  context.font = captionStyle
  context.fillStyle = '#A9A9A9'
  let sectionPadding = 248
  if (secondLine !== '') sectionPadding += 26
  context.fillText(name, 60, sectionPadding + 13 + 5)
  context.fillText(
    `${randomNumber(10, 400)}K views • ${randomNumber(
      2,
      10
    )} ${daysOrHours()} ago`,
    60,
    sectionPadding + 20 + 13 + 5
  )
  writeText.finish()

  const encode = transaction.startChild({ op: 'encode return' }) // This function returns a Span
  const ret = await canvas.encode('png')
  encode.finish()

  return ret
}
export const titleStyle = '600 15px Title'
const captionStyle = '13px Caption'
