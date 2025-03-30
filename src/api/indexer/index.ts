import { TRequests } from './types'
import {
  request,
  defineHeaders }
from '../../helpers'

const requests: TRequests = {
  uploadDropMetadata: (
    apiHost,
    apiKey,
    title,
    description
  ) => {
    return request(`${apiHost}/upload-drop-metadata`, {
      headers: defineHeaders(apiKey),
      method: 'POST',
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}

export default requests
