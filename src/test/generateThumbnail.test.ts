import * as fs from 'fs'
import * as path from 'path'
import { generateThumbnail } from '../utils/generateThumbnail'
import * as randomizer from '../utils/randomNumber'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

expect.extend({ toMatchImageSnapshot })

it('should generate thumbnail', async () => {
  const thumbnail = await generateThumbnail(
    'This is a really really long title that should take up TWO lines and be truncated',
    'drewlyton',
    'http://mockserver.com/thumbnail.png',
    'http://mockserver.com/profile.jpeg'
  )
  const daysSpy = vi.spyOn(randomizer, 'daysOrHours')
  daysSpy.mockImplementation(() => 'days')

  const viewSpy = vi.spyOn(randomizer, 'randomNumber')
  viewSpy.mockImplementation(() => 400)
  fs.writeFileSync(path.resolve(__dirname, './test-image.png'), thumbnail)

  expect(
    fs.readFileSync(path.resolve(__dirname, './test-image.png'))
  ).toMatchImageSnapshot({ runInProcess: true })
})
