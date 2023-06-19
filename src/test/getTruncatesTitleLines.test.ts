import { Canvas } from '@napi-rs/canvas'
import { getTruncatedTitleLines } from '../utils/getTruncatedTitleLines'

it('should create multi-line text from title', () => {
  const canvas = new Canvas(388, 344)
  const testTitle = 'This is a very long title that should span multiple lines'
  const [firstLine, secondLine] = getTruncatedTitleLines(testTitle, canvas)

  expect(firstLine.length).not.toBe(0)
  expect(secondLine.length).not.toBe(0)
})

it('should create multi-line text with truncation from title', () => {
  const canvas = new Canvas(388, 344)
  const testTitle =
    'This is a very long title that should span multiple lines and should be so long that it should have to truncate'
  const [firstLine, secondLine] = getTruncatedTitleLines(testTitle, canvas)

  expect(firstLine.length).not.toBe(0)
  expect(secondLine.length).not.toBe(0)
  expect(secondLine.slice(-1)).toBe('.')
})
