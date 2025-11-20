<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import api from '../../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../../components/tables/DataTable.vue';
import { useForm, useToast, useColors } from 'vuestic-ui';
import { useDateTime } from '../../../services/useDateTime';
import MonthlyEarnings from '../../admin/dashboard/cards/MonthlyEarnings.vue';
import DataSection from '../../admin/dashboard/DataSection.vue';
import DataSectionItem from '../../admin/dashboard/DataSectionItem.vue';
import { useRouter } from 'vue-router';
const formData = useForm('myForm')
const tableLoad = ref<boolean>(true)
const total_customer = ref(0)
const itemsPerPage = 10;
const currentPage = ref(1)
const router = useRouter();
const { formatDateTime } = useDateTime()
interface Customers {
  id: number,
  Name: string,
  Email: string,
  Phone: string,
  City: string,
  Specific_area: string,
  Status: number,
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
  { label: 'Status', key: 'Status', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Tasks', key: 'Tasks' },
  { label: 'Action', key: 'actions' },
])

const { init } = useToast()
const roles = ref<Customers[]>([])
const city_list = ref([])

const fecthCustomer = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getCustomer')
    total_customer.value = res.data.data.length;
    roles.value = res.data.data.map((da: any) => ({
      id: da.id,
      Name: da.Name,
      Email: da.Email,
      Phone: da.Phone,
      City: da.city_name.Name,
      Specific_area: da.Specific_area,
      Status: '',
      created_at: formatDateTime(da.created_at),
      Tasks: '',
      actions: '',
      city_id: da.city_name.id,
      status: da.Status
    }))
    city_list.value = res.data.city.map((da: any) => ({
      id: da.id,
      name: da.Name
    }))
  } catch (error) {
    console.error('Error fetching customers:', error)
  } finally {
    tableLoad.value = false
  }
}
const options = [{ value: 1, Name: "Active" }, { value: 2, Name: "Passive" }]
const save_customer = async () => {
  const respo = await api.post('saveCustomer', form.value).then((res) => {
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
})

const modalData = ref({
  id: '',
  Name: '',
  Email: '',
  Phone: '',
  City: '',
  Specific_area: '',
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

onMounted(fecthCustomer)
interface DashboardMetric {
  id: string
  title: string
  value: string
  icon: string
  changeText: string
  changeDirection: 'up' | 'down'
  iconBackground: string
  iconColor: string
}

const { getColor } = useColors()

const dashboardMetrics = computed<DashboardMetric[]>(() => [
  {
    id: 'openInvoices',
    title: 'Open invoices',
    value: '$35,548',
    icon: 'mso-attach_money',
    changeText: '$1, 450',
    changeDirection: 'down',
    iconBackground: getColor('success'),
    iconColor: getColor('on-success'),
  }
])
</script>
<template>
  <h1 class="page-title">Customer</h1>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
    <DataSectionItem v-for="metric in dashboardMetrics" :key="metric.id" :title="metric.title" :value="metric.value"
      :change-text="metric.changeText" :up="metric.changeDirection === 'up'" :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor">
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
    <DataSectionItem v-for="metric in dashboardMetrics" :key="metric.id" :title="metric.title" :value="metric.value"
      :change-text="metric.changeText" :up="metric.changeDirection === 'up'" :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor">
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
    <DataSectionItem v-for="metric in dashboardMetrics" :key="metric.id" :title="metric.title" :value="metric.value"
      :change-text="metric.changeText" :up="metric.changeDirection === 'up'" :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor">
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
    <DataSectionItem v-for="metric in dashboardMetrics" :key="metric.id" :title="metric.title" :value="metric.value"
      :change-text="metric.changeText" :up="metric.changeDirection === 'up'" :icon-background="metric.iconBackground"
      :icon-color="metric.iconColor">
      <template #icon>
        <VaIcon :name="metric.icon" size="large" />
      </template>
    </DataSectionItem>
  </div>
  <br></br>
  <VaCard>
    <VaCardContent>
      <section class="flex flex-col gap-4">
        <br></br>
        <MonthlyEarnings :total="total_customer" />
      </section>
    </VaCardContent>
  </VaCard>
  <br></br>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="roles" :loading="tableLoad" :on-task="task_lists" :on-edit="editItem"
        :on-delete="deleteItem" :on-refresh="fecthCustomer" :items-per-page="itemsPerPage"
        v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" blur mobile-fullscreen close-button hide-default-actions>
    <h3>Add Customer</h3>
    <hr>
    </hr>
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
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_customer">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="doShowEditModal" size="large" blur mobile-fullscreen close-button hide-default-actions>
    <h3>Edit Customer</h3>
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
