import * as core from '@actions/core'

const getRequiredInput = (name: string): string =>
  core.getInput(name, { required: true })

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function createThread(): Promise<void> {
  try {
    const webhookUrl = getRequiredInput('webhookUrl')
    const webhookAuth = getRequiredInput('webhookAuth')

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: webhookAuth
      },
      body: JSON.stringify({
        channelName: getRequiredInput('channelName'),
        title: getRequiredInput('threadName'),
        message: core.getInput('message'),
        tagUser: '0'
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    core.info('Thread created')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
