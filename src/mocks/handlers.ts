import { rest } from 'msw'
import * as path from 'path'
import * as fs from 'fs'

export const handlers = [
  // Handles a GET /user request
  rest.get('http://mockserver.com/thumbnail.png', (req, res, ctx) => {
    const imageBuffer = fs.readFileSync(
      path.resolve(__dirname, '../test/thumbnail.png')
    )
    return res(
      ctx.set('Content-Length', imageBuffer.byteLength.toString()),
      ctx.set('Content-Type', 'image/jpeg'),
      // Respond with the "ArrayBuffer".
      ctx.body(imageBuffer)
    )
  }),

  rest.get('http://mockserver.com/profile.jpeg', (req, res, ctx) => {
    const imageBuffer = fs.readFileSync(
      path.resolve(__dirname, '../test/profile.jpeg')
    )
    return res(
      ctx.set('Content-Length', imageBuffer.byteLength.toString()),
      ctx.set('Content-Type', 'image/jpeg'),
      // Respond with the "ArrayBuffer".
      ctx.body(imageBuffer)
    )
  }),
]
