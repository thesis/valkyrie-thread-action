import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function createThread(): Promise<void> {
  try {
    const webhookUrl: string = core.getInput('webhookUrl')
    const webhookAuth: string = core.getInput('webhookAuth')

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: webhookAuth
      },
      body: JSON.stringify({
        channelName: core.getInput('channelName'),
        title: core.getInput('threadName'),
        message: core.getInput('message')
      })
    })

    core.info('Thread created')
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
