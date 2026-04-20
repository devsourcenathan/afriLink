import { describe, expect, it } from 'vitest'
import { ApiRoutes } from '../constants/api.routes'

describe('Services Feature (Frontend)', () => {
  it('should expose the expected services routes', () => {
    expect(ApiRoutes.SERVICES.LIST).toBe('/services')
    expect(ApiRoutes.SERVICES.DETAIL('service-1')).toBe('/services/service-1')
    expect(ApiRoutes.SERVICES.MINE).toBe('/services/me')
    expect(ApiRoutes.SERVICES.MINE_DETAIL('service-1')).toBe('/services/service-1/me')
  })
})
