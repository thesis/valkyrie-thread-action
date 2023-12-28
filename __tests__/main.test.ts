/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the GitHub Actions core library
let infoMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance
let fetchMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    infoMock = jest.spyOn(core, 'info').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()

    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    fetchMock = jest.spyOn(global, 'fetch').mockImplementation()

    getInputMock = jest
      .spyOn(core, 'getInput')
      .mockImplementation((name: string): string => {
        switch (name) {
          case 'threadName':
            return 'v1'
          case 'channelName':
            return 'test'
          case 'webhookUrl':
            return 'webhookUrl'
          case 'webhookAuth':
            return 'webhookAuth'
          case 'message':
            return 'message'
          default:
            return ''
        }
      })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call webhook to create thread', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
      text: jest.fn().mockResolvedValueOnce(''),
      status: 200
    })

    await main.createThread()

    // Verify that all of the core library functions were called correctly
    expect(infoMock).toHaveBeenNthCalledWith(1, 'Thread created')
    expect(errorMock).not.toHaveBeenCalled()

    expect(fetchMock).toHaveBeenNthCalledWith(1, 'webhookUrl', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'webhookAuth'
      },
      body: JSON.stringify({
        channelName: 'test',
        title: 'v1',
        message: 'message',
        tagUser: '0'
      })
    })
  })

  it('should failed action if return is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({}),
      text: jest.fn().mockResolvedValueOnce(''),
      status: 401
    })

    await main.createThread()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'HTTP error! status: 401')
    expect(errorMock).not.toHaveBeenCalled()
  })

  it('should error if missig inputs', async () => {
    getInputMock.mockImplementationOnce(() => {
      throw new Error('Input required and not supplied: webhookUrl')
    })

    await main.createThread()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Input required and not supplied: webhookUrl'
    )
  })
})
