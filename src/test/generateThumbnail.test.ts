import * as fs from 'fs'
import * as path from 'path'
import { generateThumbnail } from '../utils/generateThumbnail'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

it('should generate thumbnail', async () => {
  const thumbnail = await generateThumbnail(
    'This is a really really long title that should take up TWO lines and be truncated',
    'drewlyton',
    'http://mockserver.com/thumbnail.png',
    'http://mockserver.com/profile.jpeg'
  )
  fs.writeFileSync(path.resolve(__dirname, '../test/test-image.jpg'), thumbnail)

  expect(
    fs.readFileSync(path.resolve(__dirname, '../test/test-image.jpg'))
  ).toMatchImageSnapshot()
})
