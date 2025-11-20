<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../router/axios'
import { useRouter, useRoute } from 'vue-router'
import { useCustomerStore } from '../../stores/customerStore'
interface Forms {
  id: number,
  Name: string
}
const forms = ref<Forms[]>([])
const customerStore = useCustomerStore()
const route = useRoute()
const router = useRouter()
const customer_id = route.params.id
customerStore.setCustomer(customer_id)
const fetch = async () => {
  try {
    const resp = await api.get('getAssignedTask')
    forms.value = resp.data.results.map((da: any) => ({
      id: da.id,
      Name: da.Name
    }))
  } catch (error) {
    console.log(error)
  }
}
const goTo = (id) => {
  router.push({ name: 'task_form', params: {tsk_id: id } })
}
onMounted(fetch)
</script>
<template>
  <br></br>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div class="item" v-for="value in forms">
      <VaCard color="primary" class="cursor-pointer hover:shadow-lg transition" @click="goTo(value.id)">
        <VaCardTitle>{{ value.Name }}</VaCardTitle>
        <VaCardContent>
          
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>