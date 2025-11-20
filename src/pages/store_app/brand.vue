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

interface Brand {
  id: number,
  Name: string,
  Status: number,
  created_at: string
}
const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'Name', sortable: true },
  { label: 'Status', key: 'Status', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions' },
])

const { init } = useToast()
const brand_da = ref<Brand[]>([])
const city_list = ref([])

const form = ref({
  cname: '',
})
const uform = ref({
  id: '',
  cname: '',
  status: null
})
const delform = ref({
  cid: '',
})
const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('/store/getBrand')
    brand_da.value = res?.data?.data?.map((da: any) => ({
      id: da.id,
      Name: da.name,
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

const save_brand = async () => {
  const respo = await api.post('/store/addBrand', form.value).then((res) => {
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

const update_brand = async ()=>{
const respo = await api.post('/store/updateBrand',uform.value).then((res)=>{
       if (res.status === 200) {
      init({ message: 'Record Update Success', color: 'success' })
      upformData.reset()
      doShowEditModal.value = false
      fetchData()
    }
    else {
      init({ message: 'Record Update Failed', color: 'error' })
    } 
})
}

function editItem(row: any) {
  doShowEditModal.value = true
  uform.value = {
    id: row.itemKey.id, 
    cname: row.itemKey.Name,
    status: row.itemKey.status
  }
}
function deleteItem(row: any) {
  doShowDeleteModal.value = true
}

</script>
<template>
  <h1 class="page-title">Brand</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="brand_da" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Add Brand</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_brand">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.cname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Brand Name" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_brand">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Update Brand</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="upForm" submit.prevent="update_brand">
        <input v-model="uform.id" type="hidden" />
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="uform.cname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="City Name" />
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
      <VaButton size="small" class="mr-6 mb-2" @click="update_brand">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
</template>
