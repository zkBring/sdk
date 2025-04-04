import { TRequests } from './types'
import {
  createQueryString,
  request,
  defineHeaders,
  keysToCamel
} from '../../helpers'

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
  },
  getDrop: (
    apiHost,
    apiKey,
    dropAddress,
    fetchAs
  ) => {
    const queryVariables = createQueryString({
      fetch_as: fetchAs
    })
    return request(`${apiHost}/drops/${dropAddress}?${queryVariables}`, {
      headers: defineHeaders(apiKey)
    }).then((response: any) => keysToCamel(response));
  },
  getDrops: (
    apiHost,
    apiKey,
    creatorAddress,
    offset,
    limit,
    status,
    staked
  ) => {
    const queryVariables = createQueryString({
      offset,
      limit,
      creator_address: creatorAddress,
      status,
      staked
    })
    return request(`${apiHost}/drops?${queryVariables}`, {
      headers: defineHeaders(apiKey)
    }).then((response: any) => keysToCamel(response));
  },
  getDropClaimer: (
    apiHost,
    apiKey,
    dropAddress,
    claimerAddress
  ) => {
    return request(`${apiHost}/drops/${dropAddress}/claimer/${claimerAddress}`, {
      headers: defineHeaders(apiKey)
    }).then((response: any) => keysToCamel(response));
  }
}

export default requests
