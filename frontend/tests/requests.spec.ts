import { describe, expect, it } from 'vitest'
import { ApiRoutes } from '../constants/api.routes'

describe('Requests Feature (Frontend)', () => {
  it('should expose the expected requests routes', () => {
    expect(ApiRoutes.REQUESTS.LIST).toBe('/requests')
    expect(ApiRoutes.REQUESTS.DETAIL('request-1')).toBe('/requests/request-1')
    expect(ApiRoutes.REQUESTS.MINE).toBe('/requests/me')
    expect(ApiRoutes.REQUESTS.MINE_DETAIL('request-1')).toBe('/requests/request-1/me')
  })
})
