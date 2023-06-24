import { server } from '../mocks/server'
// Establish API mocking before all tests.
beforeAll(() => server.listen())

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers())

// Clean up after the tests are finished.
afterAll(() => server.close())

vi.mock('@sentry/node', () => {
  const getTransaction = vi.fn(() => {
    const startChild = vi.fn(() => ({
      finish: vi.fn(),
    }))
    return { startChild }
  })
  const getCurrentHub = vi.fn(() => {
    const getScope = vi.fn(() => ({ getTransaction }))
    return { getScope }
  })
  return { getCurrentHub }
})
