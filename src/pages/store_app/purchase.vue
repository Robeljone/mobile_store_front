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
const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const columns = defineVaDataTableColumns([
  { label: 'Suplier', key: 'Suplier', sortable: true },
  { label: 'Product', key: 'Product', sortable: true },
  { label: 'Quantity', key: 'Quantity', sortable: true },
  { label: 'Defined Price', key: 'Defined', sortable: true },
  { label: 'Purchase Price', key: 'Purchase', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions' },
])

const { init } = useToast()
const purchase_da = ref([])
const suplier_list = ref([])
const product_list = ref([])

const form = ref({
  suplier: '',
  quantity: '',
  price: '',
  product: ''
})
const uform = ref({
  id: '',
  suplier: '',
  quantity: '',
  price: '',
  product: '',
  status: null
})
const delform = ref({
  cid: '',
})
const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('/store/getPurchase')
    purchase_da.value = res?.data?.purchase?.map((da: any) => ({
      id: da.id,
      Suplier: da.supp_name.name,
      Product: da.prod_name.name,
      Quantity: da.quantity,
      Defined: da.defined_price,
      Purchase: da.purchase_price,
      created_at: formatDateTime(da.created_at),
      actions: '',
      brands: da.brand_id
    }))
    suplier_list.value = res?.data?.suplier?.map((da: any) => (
      { id: da.id, name: da.name }
    ))
    product_list.value = res?.data?.product?.map((da: any) => (
      { id: da.id, name: da.brand_name.name+'|'+da.model_name.name+'|'+da.name }
    ))
  } catch (error) { console.log(error) } finally {
    tableLoad.value = false
  }
}

onMounted(fetchData)

function add_modal() {
  doShowAddModal.value = true
}

const save_purchase = async () => {
  const respo = await api.post('/store/addPurchase', form.value).then((res) => {
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

const update_model = async () => {
  const respo = await api.post('/store/updateModel', uform.value).then((res) => {
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
    suplier: row.itemKey.Name,
    product: row.itemKey.brands,
    price: row.itemKey.brands,
    quantity: row.itemKey.brands,
    status: row.itemKey.status
  }
}
function deleteItem(row: any) {
  doShowDeleteModal.value = true
}

</script>
<template>
  <h1 class="page-title">Purchase</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="purchase_da" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Add Purchase</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_purchase">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="form.suplier" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
              label="Suplier" :options="suplier_list" value-by="id"
              text-by="name" clearable />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="form.product" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
              label="Product" :options="product_list" value-by="id" text-by="name" clearable />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.quantity" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="number" label="Quantity" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.price" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2"  type="number" label="Purchase Price" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_purchase">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
  <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Update Model</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="update_model">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="uform.name" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Model Name" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaSelect v-model="uform.brand" class="mt-4 border-2 border-sold border-grey-900 px-2" type="text"
              label="Brand" :options="brand_list" value-by="id" text-by="name" clearable />
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
      <VaButton size="small" class="mr-6 mb-2" @click="update_model">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
</template>
