import { ApiRoutes } from '~/constants/api.routes'
import type {
  CreateServicePayload,
  SearchServicesPayload,
  ServiceItem,
  ServicesListResponse,
} from '~/types/services'

export function useServicesApi() {
  const { $api } = useNuxtApp()

  return {
    listPublic(query: SearchServicesPayload) {
      return $api<ServicesListResponse>(ApiRoutes.SERVICES.LIST, { query })
    },
    listMine() {
      return $api<ServiceItem[]>(ApiRoutes.SERVICES.MINE)
    },
    getPublic(id: string) {
      return $api<ServiceItem>(ApiRoutes.SERVICES.DETAIL(id))
    },
    getMine(id: string) {
      return $api<ServiceItem>(ApiRoutes.SERVICES.MINE_DETAIL(id))
    },
    create(payload: CreateServicePayload) {
      return $api<ServiceItem>(ApiRoutes.SERVICES.LIST, {
        method: 'POST',
        body: payload,
      })
    },
    update(id: string, payload: Partial<CreateServicePayload>) {
      return $api<ServiceItem>(ApiRoutes.SERVICES.DETAIL(id), {
        method: 'PATCH',
        body: payload,
      })
    },
    archive(id: string) {
      return $api<ServiceItem>(ApiRoutes.SERVICES.DETAIL(id), {
        method: 'DELETE',
      })
    },
  }
}
