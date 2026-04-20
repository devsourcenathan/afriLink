import { defineStore } from 'pinia'
import type { ServiceRequestItem } from '~/types/requests'

export const useRequestsStore = defineStore('requests', {
  state: () => ({
    myRequests: [] as ServiceRequestItem[],
    publicRequests: [] as ServiceRequestItem[],
  }),
  actions: {
    setMyRequests(requests: ServiceRequestItem[]) {
      this.myRequests = requests
    },
    setPublicRequests(requests: ServiceRequestItem[]) {
      this.publicRequests = requests
    },
  },
})
