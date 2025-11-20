<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import api from '../../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import { useForm, useToast } from 'vuestic-ui';
import { useDateTime } from '../../../services/useDateTime';
import Questions from '../Questions.vue';

const formData = useForm('myForm')
const itemsPerPage = 10;
const currentPage = ref(1)
const questions = ref(0)

const tableLoad = ref<boolean>(true)
const { formatDateTime } = useDateTime()
interface TaskForms {
  id: number,
  name: string,
  task_id: string,
  status: number,
  created_at: string
}
interface Tasks {
  id: number,
  Name: string
}
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const columns = defineVaDataTableColumns([
  { label: 'Task', key: 'task_id', sortable: true },
  { label: 'Form Name', key: 'name', sortable: true },
  { label: 'Status', key: 'Status', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions' },
])

watch(questions, (newVal) => {
  form.value.question = Array.from({ length: newVal }, () => ({
    name: '',
    opt: '',
    value: ''
  }))
})

const { init } = useToast()
const product_da = ref([])
const task_da = ref([])
const formats = [
  { id: 1, value: "Excel" },
  { id: 2, value: "CSV" }
]

const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getForms')
    task_da.value = [
      { id: 100, Name: 'All' },
      ...res.data.tasks.map((da: Array) => ({
        id: da.id,
        Name: da.Name,
      })),
    ]
  } catch (error) {
    console.log(error)
  }
  finally {
    tableLoad.value = false
  }
}

onMounted(fetchData)
const form = ref({
  taskid: '',
  datefrom: '',
  dateto: '',
  rp_format: ''
})

const export_rp = async () => {
  try {
    const respo = await api.post('exportReport', form.value, { responseType: 'blob' }).then((res) => {
      const blob = new Blob([res?.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tasks.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
  catch (error) {
    console.log(error);
  }
}

</script>
<template>
  <VaCard>
    <VaCardContent>
      <VaForm ref="myForm" submit.prevent="save_customer">
        <div class="row">
          <div class="flex flex-col md3">
            <div class="item">
              <VaSelect v-model="form.taskid" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
                label="Task" :options="task_da" value-by="id" text-by="Name" clearable />
              <VaInput v-model="form.datefrom" :rules="[(v) => !!v || 'Required']"
                class="mt-3 border-2 border-sold border-grey-900 px-2" type="date" label="Date From" />
              <VaInput v-model="form.dateto" :rules="[(v) => !!v || 'Required']"
                class="mt-3 border-2 border-sold border-grey-900 px-2" type="date" label="Date To" />
              <VaSelect v-model="form.rp_format" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
                label="Format" :options="formats" value-by="id" text-by="value" clearable />
            </div>
          </div>
        </div>
        <br></br>
        <VaButton size="small" class="mr-6 mb-2" @click="export_rp"> Export </VaButton>
      </VaForm>
    </VaCardContent>
  </VaCard>
</template>
