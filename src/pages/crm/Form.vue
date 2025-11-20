<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../router/axios';
import { useRouter, useRoute } from 'vue-router'

interface Questions {
    id: number,
    Name: String,
}

const router = useRouter()
const route = useRoute()
const forms = ref<Questions[]>([])
const ts_id = route.params.tsk_id
const fetch_data = async () => {
    try {
        const respo = await api.get(`getFormsList/${ts_id}`)
        forms.value = respo.data.result.map((res) => (
            {
                id: res.id,
                Name: res.name
            }
        )
        )
    } catch (error) { console.log(error) }
}
const goTo = (id) => {
  router.push({ name: 'question_form', params: {frmid: id} })
}
onMounted(fetch_data)
</script>
<template>
    <br></br>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="item" v-for="value in forms">
            <VaCard color="warning" class="cursor-pointer hover:shadow-lg transition" @click="goTo(value.id)">
                <VaCardTitle>{{ value.Name }}</VaCardTitle>
                <VaCardContent>

                </VaCardContent>
            </VaCard>
        </div>
    </div>
</template>