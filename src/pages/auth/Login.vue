<template>
  <VaForm ref="form" @submit.prevent="submit">
    <div class="flex justify-center">
      <va-avatar size="large" icon="person_outline" color="danger" />
    </div>
    <br></br>
    <h2 class="flex justify-center">Admin Login</h2>
    <VaInput v-model="formData.email" :rules="[validators.required, validators.email]" class="mb-4" label="Email"
      type="email" color="danger" />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput v-model="formData.password" :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'" class="mb-4" label="Password" color="danger"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value">
        <template #appendInner>
          <VaIcon :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'" class="cursor-pointer"
            color="secondary" />
        </template>
      </VaInput>
    </VaValue>
    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit" color="danger"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import api from '../../router/axios'
import axios from 'axios'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
})


const submit = async () => {
  const isValid = validate()
  if (!isValid) return
  try {
    // Send login request to Laravel API
    const response = await api.post('/auth/login', {
      email: formData.email,
      password: formData.password,
    })
    // Save JWT token in localStorage
    const token = response?.data?.token
    localStorage.setItem('token', token)
    init({ message: "You've successfully logged in", color: 'success' })
    push({ name: 'Management' })
  } catch (error: any) {
    console.log(error)
    init({
      message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      color: 'danger',
    })
  }
}
</script>
