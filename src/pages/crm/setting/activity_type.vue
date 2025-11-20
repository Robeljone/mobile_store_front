<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../../components/tables/DataTable.vue';
import { useForm, useToast } from 'vuestic-ui';
import { useDateTime } from '../../../services/useDateTime';
const formData = useForm('myForm');
const uFormData = useForm('uform');

const tableLoad = ref<boolean>(true)
const itemsPerPage = 10;
const currentPage = ref(1)

const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const { formatDateTime } = useDateTime()

interface Type {
  id: number,
  Name: string,
  Status: number,
  created_at: string
}

const form = ref({
  aname: '',
})
const upform = ref({
  id: '',
  upname: '',
  status: null
})

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'Name', sortable: true },
  { label: 'Status', key: 'Status', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions' },
])

const { init } = useToast()
const type_da = ref<Type[]>([])

const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getType').then((res) => {
      type_da.value = res.data.type.map((da: any) => ({
        id: da.id,
        Name: da.Name,
        Status: '',
        created_at: formatDateTime(da.created_at),
        actions: '',
        status: da.Status
      }))
    })
  } catch (error) {
    console.log(error)
  } finally {
    tableLoad.value = false
  }
}

onMounted(fetchData);

function add_modal() {
  doShowAddModal.value = true
}

const save_city = async () => {
  const respo = await api.post('saveType', form.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      formData.reset()
    }
    else {
      init({ message: 'Record Saved Failed', color: 'error' })
    }
  });
}

const update_city = async () => {
  const respo = await api.post('updateType', upform.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      uFormData.reset()
      doShowEditModal.value = false
    }
    else {
      init({ message: 'Record Saved Failed', color: 'error' })
    }
  });
}

function editItem(row: any) {
  doShowEditModal.value = true
  upform.value = {
    id: row.itemKey.id,
    upname: row.itemKey.Name,
    status: row.itemKey.status
  }
}

function deleteItem(row: any) {
  doShowDeleteModal.value = true
}

</script>
<template>
  <h1 class="page-title">Tasks</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="type_da" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Add Task</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_customer">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.aname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Type Name" />
          </div>
        </div>
      </div>
      <VaButton size="small" class="mr-6 mb-2" @click="save_city">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Update Task</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="uform" submit.prevent="save_customer">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="upform.upname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Task Name" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="upform.status" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
              label="Status" :options="[{ value: 1, name: 'Active' }, { value: 2, name: 'Passive' }]" value-by="value"
              text-by="name" clearable />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="update_city">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
</template>
