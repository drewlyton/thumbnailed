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
  const dimensionsAndPositions = scaleDimensionsAndPositions(2)
  // Initialize canvas and set background color
  const canvas = new Canvas(
    dimensionsAndPositions.canvasWidth,
    dimensionsAndPositions.canvasHeight
  )
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
  const thumbnailMaskProperties = dimensionsAndPositions.thumbnailMask
  thumbnailMask.roundRect(
    thumbnailMaskProperties.x,
    thumbnailMaskProperties.y,
    thumbnailMaskProperties.w,
    thumbnailMaskProperties.h,
    thumbnailMaskProperties.radii
  )
  context.clip(thumbnailMask)

  // // draw thumbnail image to canvas
  const thumbnailImage = await loadImage(thumbnailUrl)
  context.drawImage(
    thumbnailImage,
    thumbnailMaskProperties.x,
    thumbnailMaskProperties.y,
    thumbnailMaskProperties.w,
    thumbnailMaskProperties.h
  )
  context.restore()

  context.save()
  // Draw clipping mask for profile image
  const profileMask = new Path2D()
  const profileMaskProperties = dimensionsAndPositions.profileMask
  profileMask.arc(
    profileMaskProperties.x,
    profileMaskProperties.y,
    profileMaskProperties.radius,
    0,
    2 * Math.PI,
    true
  )
  context.clip(profileMask)

  // Draw profile image to canvas
  const avatarImage = await loadImage(avatarUrl)
  const profileImageProperties = dimensionsAndPositions.profileImage
  context.drawImage(
    avatarImage,
    profileImageProperties.x,
    profileImageProperties.y,
    profileImageProperties.w,
    profileImageProperties.h
  )
  context.restore()

  drawImages.finish()

  const writeText = transaction.startChild({ op: 'writing text' }) // This function returns a Span

  // Write title text
  const titleProperties = dimensionsAndPositions.title
  const [firstLine, secondLine] = getTruncatedTitleLines(
    title,
    canvas,
    titleStyle(titleProperties.fontSize),
    titleProperties.x + profileImageProperties.x
  )
  context.font = titleStyle(titleProperties.fontSize)
  context.fillStyle = '#ffffff'
  context.fillText(firstLine, titleProperties.x, titleProperties.y)
  context.fillText(
    secondLine,
    titleProperties.x,
    titleProperties.y + titleProperties.lineHeight
  )

  context.font = captionStyle(dimensionsAndPositions.name.fontSize)
  context.fillStyle = '#A9A9A9'
  const topPadding =
    secondLine !== '' ? dimensionsAndPositions.title.bottomPadding : 0
  context.fillText(
    name,
    dimensionsAndPositions.name.x,
    dimensionsAndPositions.name.y + topPadding
  )
  context.fillText(
    `${randomNumber(10, 400)}K views • ${randomNumber(
      2,
      10
    )} ${daysOrHours()} ago`,
    dimensionsAndPositions.views.x,
    dimensionsAndPositions.views.y + topPadding
  )
  writeText.finish()

  const encode = transaction.startChild({ op: 'encode return' }) // This function returns a Span
  const ret = await canvas.encode('png')
  encode.finish()

  return ret
}
export const titleStyle = (fontSize: number) => `600 ${fontSize}px Title`
const captionStyle = (fontSize: number) => `${fontSize}px Caption`

const scaleDimensionsAndPositions = (scale = 1) => ({
  canvasWidth: scale * 388,
  canvasHeight: scale * 344,
  thumbnailMask: {
    x: scale * 13,
    y: scale * 13,
    w: scale * 360,
    h: scale * 203,
    radii: scale * 8,
  },
  profileMask: {
    x: scale * (13 + 18),
    y: scale * (227 + 18),
    radius: scale * 18,
  },
  profileImage: {
    x: scale * 13,
    y: scale * 227,
    w: scale * 36,
    h: scale * 36,
  },
  title: {
    fontSize: scale * 15,
    lineHeight: scale * 22,
    x: scale * 60,
    y: scale * (227 + 16),
    bottomPadding: scale * 26,
  },
  name: {
    fontSize: scale * 13,
    x: scale * 60,
    y: scale * (248 + 13 + 5),
  },
  views: {
    fontSize: scale * 13,
    x: scale * 60,
    y: scale * (248 + 13 + 5 + 20),
  },
})
