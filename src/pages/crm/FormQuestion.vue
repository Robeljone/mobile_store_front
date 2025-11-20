<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui';
import { useCustomerStore } from '../../stores/customerStore';
import api from '../../router/axios'
interface Questions {
  id: number,
  name: String,
  type: String,
  options: String
}
const { init } = useToast()
const customerStore = useCustomerStore()
const question = ref<Questions[]>([])
const form_name = ref('')
const myForm = ref(null)
const route = useRoute()
const router = useRouter()
const ts_id = route.params.frmid
const formData = ref({})
console.log(customerStore.selectedCustomerId)
const fetch_data = async () => {
  try {
    const respo = await api.get(`getQuestionList/${ts_id}`)
    question.value = respo.data.result.map((res) => (
      {
        id: res.id,
        name: res.name,
        type: res.type,
        options: JSON.parse(res.options)
      }
    )
    )
  } catch (error) { console.log(error) }
}

const saveFormResponse = async () => {
  const payload = {
    customer_id: customerStore.selectedCustomerId,
    form_id: ts_id,
    form_data: {...formData.value}
  }
  const respo = await api.post('saveFormsAnswer', payload).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      router.back()
    }
    else {
      init({ message: 'Record Saved Failed', color: 'error' })
    }
  });
}

onMounted(fetch_data)
</script>
<template>
  <br></br>
  <h2>{{ form_name }}</h2>
  <VaForm ref="myForm" @submit.prevent="saveFormResponse">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="(questions, index) in question" :key="index" class="mb-4">
        <VaInput v-if="questions.type === 'Text'" v-model="formData[questions.name]" :rules="[(v) => !!v || 'Required']"
          class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md" type="text" :label="questions.name" />

        <!-- Number Input -->
        <VaInput v-else-if="questions.type === 'Number'" v-model="formData[questions.name]"
          :rules="[(v) => !!v || 'Required']" class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md"
          type="number" :label="questions.name" />

        <VaInput v-else-if="questions.type === 'Date'" v-model="formData[questions.name]"
          :rules="[(v) => !!v || 'Required']" class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md"
          type="Date" :label="questions.name" />

        <!-- Select Dropdown -->
        <VaSelect v-else-if="questions.type === 'Select'" v-model="formData[questions.name]"
          :options="questions.options" :rules="[(v) => !!v || 'Required']" value-by="name" text-by="name"
          class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md" :label="questions.name" />
        <VaTextarea v-else-if="questions.type === 'Textarea'" v-model="formData[questions.name]"
          :options="questions.options" :rules="[(v) => !!v || 'Required']"
          class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md" :label="questions.name" />
        <!-- Checkbox -->
        <VaCheckbox v-else-if="questions.type === 'Checkbox'" v-model="formData[questions.name]"
          :label="questions.name" />
        <!-- Unsupported field -->
        <div v-else class="text-gray-400 italic mt-2">Unsupported field type</div>
      </div>
    </div>
    <VaButton size="small" class="mr-6 mb-2" type="submit"> Done </VaButton>
  </VaForm>
</template>