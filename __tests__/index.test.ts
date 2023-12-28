/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

import * as main from '../src/main'

// Mock the action's entrypoint
const createThreadMock = jest.spyOn(main, 'createThread').mockImplementation()

describe('index', () => {
  it('calls createThread when imported', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')

    expect(createThreadMock).toHaveBeenCalled()
  })
})
