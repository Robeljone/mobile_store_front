// src/stores/customerStore.js
import { defineStore } from 'pinia'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    selectedCustomerId: null
  }),
  actions: {
    setCustomer(customer: any) {
      this.selectedCustomerId = customer
    },
    clearCustomer() {
      this.selectedCustomerId = null
    }
  }
})
