import { ApiRoutes } from '~/constants/api.routes'
import type {
  CreateRequestPayload,
  RequestsListResponse,
  ServiceRequestItem,
} from '~/types/requests'

export function useRequestsApi() {
  const { $api } = useNuxtApp()

  return {
    listPublic(query: Record<string, unknown>) {
      return $api<RequestsListResponse>(ApiRoutes.REQUESTS.LIST, { query })
    },
    listMine() {
      return $api<ServiceRequestItem[]>(ApiRoutes.REQUESTS.MINE)
    },
    getPublic(id: string) {
      return $api<ServiceRequestItem>(ApiRoutes.REQUESTS.DETAIL(id))
    },
    getMine(id: string) {
      return $api<ServiceRequestItem>(ApiRoutes.REQUESTS.MINE_DETAIL(id))
    },
    create(payload: CreateRequestPayload) {
      return $api<ServiceRequestItem>(ApiRoutes.REQUESTS.LIST, {
        method: 'POST',
        body: payload,
      })
    },
    update(id: string, payload: Partial<CreateRequestPayload>) {
      return $api<ServiceRequestItem>(ApiRoutes.REQUESTS.DETAIL(id), {
        method: 'PATCH',
        body: payload,
      })
    },
    cancel(id: string) {
      return $api<ServiceRequestItem>(ApiRoutes.REQUESTS.DETAIL(id), {
        method: 'DELETE',
      })
    },
  }
}
