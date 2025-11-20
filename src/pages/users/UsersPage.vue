<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast, useForm, VaButton } from 'vuestic-ui'
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../components/tables/DataTable.vue'
import api from '../../router/axios'
import { useDateTime } from '../../services/useDateTime'
const { init } = useToast()
const formData = useForm('myForm')
const uformData = useForm('upmyForm')
const itemsPerPage = 10;
const currentPage = ref(1)
const tableLoad = ref<boolean>(true)
const { formatDateTime } = useDateTime()

const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)


interface UserModel {
  id: number,
  name: string,
  email: string,
  status: number | string,
  created_at: Date,
  updated_at: any
}
const items = ref<UserModel[]>([])

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'id', sortable: true },
  { label: 'Full Name', key: 'name', sortable: true },
  { label: 'Email Address', key: 'email', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Status', key: 'Status', sortable: true },
  { label: 'Action', key: 'actions' },
])

const form = ref({
  fname: '',
  email: '',
  pass: ''
})
const upform = ref({
  id: '',
  fname: '',
  email: '',
  status: ''
})

const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getUsers')
    items.value = res.data.users.map((da: any) => ({
      id: da.id,
      name: da.name,
      email: da.email,
      Status: '',
      created_at: formatDateTime(da.created_at),
      actions: '',
      status: da.status
    }))

  } catch (error) { console.log(error) } finally {
    tableLoad.value = false
  }
}
onMounted(fetchData)

function showAddUserModal() {
  doShowAddModal.value = true
}
const save_user = async () => {
  const respo = await api.post('register', form.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      formData.reset()
      doShowAddModal.value = false
      fetchData()
    }
    else if(res.status === 500) {
      init({ message: res?.data?.message, color: 'success' })
    }
  });
}

const update_user = async () => {
  const respo = await api.post('update_user', upform.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      uformData.reset()
      doShowAddModal.value = false
      fetchData()
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
    fname: row.itemKey.name,
    email: row.itemKey.email,
    status: row.itemKey.status,
  }
}
function deleteItem(item: any) {
  alert(item)
}
</script>
<template>
  <h1 class="page-title">Users</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="showAddUserModal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="items" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Add User</h3>
    <hr></hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_user">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.fname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Full Name" />
            <VaInput v-model="form.email" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="email" label="Email" />
            <VaInput v-model="form.pass" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="password" label="Password" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_user">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Update User</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="upmyForm" submit.prevent="update_user">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="upform.fname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Full Name" />
            <VaInput v-model="upform.email" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="email" label="Email" />
            <VaSelect v-model="upform.status" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
              label="Status" :options="[{ value: 1, name: 'Active' }, { value: 2, name: 'Passive' }]" value-by="value"
              text-by="name" clearable />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="update_user">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
</template>
