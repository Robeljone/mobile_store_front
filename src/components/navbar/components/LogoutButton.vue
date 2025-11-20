<template>
  <VaButton preset="secondary" color="textPrimary" aria-label="" @click="callApi">
    <VaIcon :component="VaIconClose" />
  </VaButton>
</template>

<script lang="ts" setup>
import axios from 'axios';
import VaIconClose from '../../icons/VaIconClose.vue';
import { useRouter } from 'vue-router'
import { useToast } from 'vuestic-ui'
const { push } = useRouter()
const { init } = useToast()
const token = localStorage.getItem('token');
const callApi = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    init({ message: "You've successfully logged out", color: 'success' })
    push({ name: 'login' })
    localStorage.removeItem('token')
  }
  catch (e) {
    console.log(e)
  }
}
</script>
