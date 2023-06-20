import * as fs from 'fs'
import * as path from 'path'
import { generateThumbnail } from '../utils/generateThumbnail'
import * as randomizer from '../utils/randomNumber'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

it('should generate thumbnail', async () => {
  vi.spyOn(randomizer, 'daysOrHours').mockImplementation(() => 'days')
  vi.spyOn(randomizer, 'randomNumber').mockImplementation(() => 400)

  const thumbnail = await generateThumbnail(
    'This is a really really long title that should take up TWO lines and be truncated',
    'drewlyton',
    'http://mockserver.com/thumbnail.png',
    'http://mockserver.com/profile.jpeg'
  )

  fs.writeFileSync(path.resolve(__dirname, './test-image.png'), thumbnail)

  expect(
    fs.readFileSync(path.resolve(__dirname, './test-image.png'))
  ).toMatchImageSnapshot({ runInProcess: true })
})
