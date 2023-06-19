import { Canvas, Path2D, loadImage } from '@napi-rs/canvas'
import { getTruncatedTitleLines } from './getTruncatedTitleLines'

export async function generateThumbnail(
  title: string,
  name: string,
  thumbnailUrl: string,
  avatarUrl: string
) {
  // Initialize canvas and set background color
  const canvas = new Canvas(388, 344)
  const context = canvas.getContext('2d')

  const backgroundPath = new Path2D()
  backgroundPath.rect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#0E0E0E'
  context.fill(backgroundPath)

  context.save()
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
  context.fillText('467K views • 2 days ago', 60, sectionPadding + 20 + 13 + 5)

  return await canvas.encode('png')
}
export const titleStyle = '600 15px sans-serif'
const captionStyle = '13px sans-serif'
