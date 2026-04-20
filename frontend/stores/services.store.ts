import { defineStore } from 'pinia'
import type { ServiceItem } from '~/types/services'

export const useServicesStore = defineStore('services', {
  state: () => ({
    myServices: [] as ServiceItem[],
    publicServices: [] as ServiceItem[],
  }),
  actions: {
    setMyServices(services: ServiceItem[]) {
      this.myServices = services
    },
    setPublicServices(services: ServiceItem[]) {
      this.publicServices = services
    },
  },
})
