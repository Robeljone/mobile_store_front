<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import api from '../../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../../components/tables/DataTable.vue';
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
const product_da = ref<TaskForms[]>([])
const task_da = ref<Tasks[]>([])

const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getForms')

    product_da.value = res.data.forms.map((da: any) => ({
      id: da.id,
      name: da.name,
      task_id: da.Name,
      Status: '',
      created_at: formatDateTime(da.created_at),
      actions: '',
      status: da.status
    }))

    task_da.value = res.data.tasks.map((da: any) => ({
      id: da.id,
      Name: da.Name,
    }))
  } catch (error) {
    console.log(error)
  }
  finally {
    tableLoad.value = false
  }
}

onMounted(fetchData)

function editItem(row: any) {
  doShowEditModal.value = true
  uform.value = {
    pname: row.itemKey.Name,
    desc: row.itemKey.Description,
    price: row.itemKey.Price,
    status: row.itemKey.status
  }
}
function deleteItem(row: any) {
  doShowDeleteModal.value = true
}

const form = ref({
  taskid: '',
  frname: '',
  question: [],
})

const uform = ref({
  pname: '',
  desc: '',
  price: '',
  status: null
})
const delform = ref({
  pid: '',
})

const save_city = async () => {
  const respo = await api.post('saveform', form.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      formData.reset()
    }
    else {
      init({ message: 'Record Saved Failed', color: 'error' })
    }
  });
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
              <VaInput v-model="form.frname" :rules="[(v) => !!v || 'Required']"
                class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Form Name" />
              <VaInput v-model="questions" :rules="[(v) => !!v || 'Required']"
                class="mt-3 border-2 border-sold border-grey-900 px-2" type="number" label="Question" />
              <Questions v-for="(item, index) in questions" :key="index" v-model="form.question[index]"/>
            </div>
          </div>
        </div>
        <br></br>
        <VaButton size="small" class="mr-6 mb-2" @click="save_city"> Save </VaButton>
      </VaForm>
    </VaCardContent>
  </VaCard>
  <VaCard>
    <VaCardContent>
      <DataTable :columns="columns" :items="product_da" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
</template>
