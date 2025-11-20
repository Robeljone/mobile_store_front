<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../components/tables/DataTable.vue';
import { useForm, useToast } from 'vuestic-ui';
import { useDateTime } from '../../services/useDateTime';

const formData = useForm('myForm')
const upformData = useForm('upForm')
const itemsPerPage = 10;
const currentPage = ref(1)
const tableLoad = ref<boolean>(true)
const { formatDateTime } = useDateTime()
interface Supplier {
  id: number,
  Name: string,
  Email: string,
  Phone: string,
  Status: number,
  created_at: string
}
const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'Name', sortable: true },
  { label: 'Email', key: 'Email', sortable: true },
  { label: 'Phone', key: 'Phone', sortable: true },
  { label: 'Status', key: 'Status', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions' },
])

const { init } = useToast()
const suplier_da = ref<Supplier[]>([])


const form = ref({
  name: '',
  email: '',
  phone: ''
})
const uform = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  status: null
})
const delform = ref({
  cid: '',
})
const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('/store/getCustomer')
    suplier_da.value = res?.data?.data?.map((da: any) => ({
      id: da.id,
      Name: da.name,
      Email: da.email,
      Phone: da.phone,
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

function add_modal() {
  doShowAddModal.value = true
}

const save_suplier = async () => {
  const respo = await api.post('/store/addCustomer', form.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      formData.reset()
      doShowAddModal.value = false
      fetchData()
    }
    else {
      init({ message: 'Record Saved Failed', color: 'error' })
    }
  });
}

const update_suplier = async () => {
  const respo = await api.post('/store/updateCustomer', uform.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Update Success', color: 'success' })
      upformData.reset()
      doShowEditModal.value = false
      fetchData()
    }
    else {
      init({ message: 'Record Update Failed', color: 'error' })
    }
  });
}

function editItem(row: any) {
  doShowEditModal.value = true
  uform.value = {
    id: row.itemKey.id,
    name: row.itemKey.Name,
    email:row.itemKey.Email,
    phone: row.itemKey.Phone,
    status: row.itemKey.status
  }
}
function deleteItem(row: any) {
  doShowDeleteModal.value = true
}

</script>
<template>
  <h1 class="page-title">Customer</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="suplier_da" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Add Customer</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_suplier">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.name" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Name" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.email" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="email" label="Email" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.phone" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Phone" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_suplier">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Update Customer</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="upForm" submit.prevent="update_suplier">
            <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="uform.name" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Name" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="uform.email" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="email" label="Email" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="uform.phone" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Phone" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="uform.status" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
              label="Status" :options="[{ value: 1, name: 'Active' }, { value: 2, name: 'Passive' }]" value-by="value"
              text-by="name" clearable />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="update_suplier">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
</template>
