<script setup lang="ts">
import { onMounted, ref } from 'vue';
import api from '../../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../../components/tables/DataTable.vue';
import { useForm, useToast } from 'vuestic-ui';
import { useDateTime } from '../../../services/useDateTime';
import MonthlyEarnings from '../../admin/dashboard/cards/MonthlyEarnings.vue';
import DataSection from '../../admin/dashboard/DataSection.vue';
import { useRouter } from 'vue-router';
const formData = useForm('myForm')
const tableLoad = ref<boolean>(true)
const itemsPerPage = 10;
const currentPage = ref(1)
const router = useRouter();
const { formatDateTime } = useDateTime()

interface Leads {
  id: number,
  Name: string,
  Email: string,
  Phone: string,
  City: string,
  Specific_area: string,
  Status: number,
  Stage: string,
  Remarks: Text,
  created_at: string
}

const doShowEditModal = ref(false)
const doShowAddModal = ref(false)
const showDeleteModal = ref(false)

const columns = defineVaDataTableColumns([
  { label: 'Name', key: 'Name', sortable: true },
  { label: 'Email', key: 'Email', sortable: true },
  { label: 'Phone', key: 'Phone', sortable: true },
  { label: 'City', key: 'City', sortable: true },
  { label: 'Specific Area', key: 'Specific_area', sortable: true },
  { label: 'Stage', key: 'Stage', sortable: true },
  { label: 'Status', key: 'Status', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions' },
])

const { init } = useToast()
const roles = ref<Leads[]>([])
const city_list = ref([])

const fecthCustomer = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getLeads')
    roles.value = res.data.data.map((da: any) => ({
      id: da.id,
      Name: da.Name,
      Email: da.Email,
      Phone: da.Phone,
      City: da.city_name.Name,
      Specific_area: da.Specific_area,
      Stage:  da.Stage,
      Status: '',
      created_at: formatDateTime(da.created_at),
      actions: '',
      city_id: da.city_name.id,
      status: da.Status,
      remarks: da.remarks
    }))
    city_list.value = res.data.city.map((da: any) => ({
      id: da.id,
      name: da.Name
    }))
    console.log(city_list);
  } catch (error) {
    console.error('Error fetching customers:', error)
  } finally {
    tableLoad.value = false
  }
}
const options = [{ value: 1, Name: "Active" }, { value: 2, Name: "Passive" }]
const save_customer = async () => {
  const respo = await api.post('saveLeads', form.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      formData.reset()
      doShowAddModal.value = false;
      fecthCustomer()
    }
    else {
      init({ message: 'Record Saved Failed', color: 'error' })
    }
  });
}
const update_customer = async () => {
  const respo = await api.post('updateCustomer', modalData.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Updated Success', color: 'success', duration: 12 })
      formData.reset()
      doShowEditModal.value = false
      fecthCustomer();
    }
    else {
      init({ message: 'Record Update Failed', color: 'error' })

    }
  });
}
const delete_customer = async () => {
  const respo = await api.post('deleteCustomer', deleData.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Deleted Success', color: 'success' })
      formData.reset()
      showDeleteModal.value = false
      fecthCustomer();
    }
    else {
      init({ message: 'Record Delete Failed', color: 'error' })

    }
  });
}

const form = ref({
  fname: '',
  city: '',
  email: '',
  spec_area: '',
  phone: '',
  stage: '',
  remarks: ''
})

const modalData = ref({
  id: '',
  Name: '',
  Email: '',
  Phone: '',
  City: '',
  Specific_area: '',
  Stage: '',
  remarks: '',
  status: ''
})

const deleData = ref({
  cusId: ''
})

function editItem(row: any) {
  modalData.value = {
    id: row.itemKey.id,
    Name: row.itemKey.Name,
    Email: row.itemKey.Email,
    Phone: row.itemKey.Phone,
    City: row.itemKey.city_id,
    Specific_area: row.itemKey.Specific_area,
    Stage: row.itemKey.Stage,
    remarks: row.itemKey.remarks,
    status: row.itemKey.status
  }
  doShowEditModal.value = true
}
function deleteItem(row: any) {
  deleData.value = {
    cusId: row.itemKey.id
  }
  showDeleteModal.value = true
}
function add_modal() {
  doShowAddModal.value = true
}

function task_lists(row: any) {
 router.push({ name: 'task_detail', params: { id: row.itemKey.id } });
}

const stages = [
    {id:1, name: 'New'},
    {id:2, name: 'Contacted'},
    {id:3, name: 'Qualified'},
    {id:4, name: 'Lost'},
    {id:5, name: 'Converted'}
]

onMounted(fecthCustomer)
</script>
<template>
  <h1 class="page-title">Leads</h1>
  <br></br>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="roles" :loading="tableLoad" :on-task="task_lists" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fecthCustomer" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" blur mobile-fullscreen close-button hide-default-actions>
    <h3>Add Leads</h3>
    <hr></hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_customer">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.fname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Customer Name" />
            <VaSelect v-model="form.city" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" label="Select City" placeholder="Select an option"
              :options="city_list" value-by="id" text-by="name" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.email" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Customer Email" />
            <VaInput v-model="form.spec_area" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Specific Area" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.phone" :rules="[(v) => !!v || 'Required']"
              class="mt-4 border-2 border-sold border-grey-900 px-2" type="text" label="Customer Phone" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="form.stage" class="mt-4 border-2 border-sold border-grey-900 px-2" 
              label="Stage" :options="stages" value-by="name"
              text-by="name" clearable />
          </div>
        </div>
      </div>
       <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
       <VaTextarea v-model="form.remarks"
          :rules="[(v) => !!v || 'Required']" class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md"
          label="Note" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_customer">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="doShowEditModal" size="large" blur mobile-fullscreen close-button hide-default-actions>
    <h3>Edit Leads</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myUpForm" submit.prevent="update_customer">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="modalData.Name" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Customer Name" />
            <VaSelect v-model="modalData.City" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" label="Select City" placeholder="Select an option"
              :options="city_list" value-by="id" text-by="name" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="modalData.Email" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Customer Email" />
            <VaInput v-model="modalData.Specific_area" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Specific Area" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="modalData.Phone" :rules="[(v) => !!v || 'Required']"
              class="mt-4 border-2 border-sold border-grey-900 px-2" type="text" label="Customer Phone" />
          </div>
        </div>
      </div>
        <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="modalData.Stage" class="mt-4 border-2 border-sold border-grey-900 px-2" 
              label="Stage" :options="stages" value-by="id"
              text-by="name" clearable />
          </div>
        </div>
      </div>
           <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
       <VaTextarea v-model="modalData.remarks"
          :rules="[(v) => !!v || 'Required']" class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md"
          label="Note" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="modalData.status" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
              label="Status" :options="[{ value: 1, name: 'Active' }, { value: 2, name: 'Passive' }]" value-by="value"
              text-by="name" clearable />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="update_customer">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="showDeleteModal" size="small" blur mobile-fullscreen close-button hide-default-actions>
    <h3>Delete Customer</h3>
    <hr>
    </hr>
    <br></br>
    <p>Are you sure you want to delete this record ?</p>
    <br></br>
    <VaButton size="small" class="mr-6 mb-2" @click="delete_customer">
      Delete
    </VaButton>
  </VaModal>

</template>
<style scoped>
.col-hidden {
  display: none !important;
}
</style>
