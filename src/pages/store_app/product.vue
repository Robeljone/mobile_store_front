<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import api from '../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../components/tables/DataTable.vue';
import { useForm, useToast } from 'vuestic-ui';
import { useDateTime } from '../../services/useDateTime';

const formData = useForm('myForm')
const itemsPerPage = 10;
const currentPage = ref(1)
const tableLoad = ref<boolean>(true)
const { formatDateTime } = useDateTime()
interface Products {
    id: number,
    Name: string,
    Brand: string,
    Model: string,
    PurchasePrice: string,
    SellingPrice: string,
    Stock: number,
    Warranty: number,
    Description: string,
    Status: number,
    created_at: string
}
const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const columns = defineVaDataTableColumns([
    { label: 'Name', key: 'Name', sortable: true },
    { label: 'Brand', key: 'Brand', sortable: true },
    { label: 'Model', key: 'Model', sortable: true },
    { label: 'Purchase', key: 'Purchase', sortable: true },
    { label: 'Selling', key: 'Selling', sortable: true },
    { label: 'Stock', key: 'Stock', sortable: true },
    { label: 'Warranty', key: 'Warranty', sortable: true },
    { label: 'Description', key: 'Description', sortable: true },
    { label: 'Status', key: 'Status', sortable: true },
    { label: 'Created_at', key: 'created_at', sortable: true },
    { label: 'Action', key: 'actions' },
])

const { init } = useToast()
const product_da = ref<Products[]>([])
const brand_list = ref([])
const model_list = ref([])
const selectedBrand = ref('')

const form = ref({
    name: '',
    brand: '',
    model: '',
    purchase: '',
    selling: '',
    stock: '',
    warranty: '',
    description: ''
})
const uform = ref({
    name: '',
    brand: '',
    model: '',
    purchase: '',
    selling: '',
    stock: '',
    warranty: '',
    description: '',
    status: null
})
const delform = ref({
    cid: '',
})
const fetchData = async () => {
    try {
        tableLoad.value = true
        const res = await api.get('/store/getProduct')
        product_da.value = res?.data?.data?.map((da: any) => ({
            id: da.id,
            Name: da.name,
            Brand: da.brand_name.name,
            Model: da.model_name.name,
            Purchase: da.purchase_price,
            Selling: da.selling_price,
            Stock: da.stock_amount,
            Warranty: da.warranty_month,
            Description: da.description,
            Status: '',
            created_at: formatDateTime(da.created_at),
            actions: '',
            status: da.status,
            brand: da.brand,
            model: da.model
        }))
        brand_list.value = res?.data?.brand?.map((da: any) => (
            {id:da.id,name:da.name}
        ))
        model_list.value = res?.data?.model?.map((da: any) => (
            {id:da.id, brand: da.brand_id ,name:da.name}
        ))
    } catch (error) { console.log(error) } finally {
        tableLoad.value = false
    }
}

onMounted(fetchData)

const filteredModelList = ref([])

const onBrandChange = (brand: any) => {
form.value.model = ''
filteredModelList.value = []
  if (!brand) {
    filteredModelList.value = []
    return
  }

  filteredModelList.value = model_list.value.filter(
    (m) => m.brand === brand
  )
}

const selectedModel = (brand: any)=>{
  filteredModelList.value = model_list.value.filter(
    (m) => m.brand === brand
  )
}

function add_modal() {
    doShowAddModal.value = true
}

const save_product = async () => {
    const respo = await api.post('/store/addProduct', form.value).then((res) => {
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

function editItem(row: any) {
    doShowEditModal.value = true
    selectedModel(row.itemKey.brand)
    uform.value = {
    name: row.itemKey.Name,
    brand: row.itemKey.brand,
    model: row.itemKey.model,
    purchase: row.itemKey.Purchase,
    selling: row.itemKey.Selling,
    stock: row.itemKey.Stock,
    warranty: row.itemKey.Warranty,
    description: row.itemKey.Description,
    status: row.itemKey.status
    }
}
function deleteItem(row: any) {
    doShowDeleteModal.value = true
}

</script>
<template>
    <h1 class="page-title">Products</h1>
    <VaCard>
        <VaCardContent>
            <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
                <VaButton @click="add_modal">Add</VaButton>
            </div>
            <DataTable :columns="columns" :items="product_da" :loading="tableLoad" :on-edit="editItem"
                :on-delete="deleteItem" :on-refresh="fetchData" :items-per-page="itemsPerPage"
                v-model:currentPage="currentPage" />
        </VaCardContent>
    </VaCard>
    <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
        <h3>Add Product</h3>
        <hr>
        </hr>
        <br></br>
        <VaForm ref="myForm" submit.prevent="save_product">
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
                        <VaSelect v-model="form.brand" class="mt-4 border-2 border-sold border-grey-900 px-2"
                            type="text" label="Brand"
                            :options="brand_list" value-by="id"
                            text-by="name" 
                            @update:model-value="onBrandChange"
                            clearable />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaSelect v-model="form.model" class="mt-4 border-2 border-sold border-grey-900 px-2"
                            type="text" label="Model"
                            :options="filteredModelList" 
                            value-by="id"
                            text-by="name" 
                            :disabled="!form.brand"
                            clearable />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="form.purchase" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number"
                            label="Amount Purchase" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="form.selling" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number"
                            label="Amount Selling" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="form.stock" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number" label="Stock Amount" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="form.warranty" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number"
                            label="Warranty Month" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaTextarea v-model="form.description" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md" label="Description" />
                    </div>
                </div>
            </div>
            <br></br>
            <VaButton size="small" class="mr-6 mb-2" @click="save_product">
                Save
            </VaButton>
        </VaForm>
    </VaModal>
    <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
        <h3>Update Products</h3>
        <hr>
        </hr>
        <br></br>
        <VaForm ref="myForm" submit.prevent="save_customer">
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
                        <VaSelect v-model="uform.brand" class="mt-4 border-2 border-sold border-grey-900 px-2"
                            type="text" label="Brand"
                            :options="brand_list" value-by="id"
                            @update:model-value="onBrandChange"
                            text-by="name" clearable />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaSelect v-model="uform.model" class="mt-4 border-2 border-sold border-grey-900 px-2"
                            type="text" label="Model"
                            :options="filteredModelList" value-by="id"
                            :disable="!selectedBrand"
                            text-by="name" clearable />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="uform.purchase" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number"
                            label="Amount Purchase" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="uform.selling" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number"
                            label="Amount Selling" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="uform.stock" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number" :disabled="true" label="Stock Amount" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaInput v-model="uform.warranty" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-sold border-grey-900 px-2" type="number"
                            label="Warranty Month" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaTextarea v-model="uform.description" :rules="[(v) => !!v || 'Required']"
                            class="mt-3 border-2 border-solid border-gray-300 px-2 rounded-md" label="Description" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="flex flex-col md3">
                    <div class="item">
                        <VaSelect v-model="uform.status" class="mt-4 border-2 border-sold border-grey-900 px-2"
                            type="text" label="Status"
                            :options="[{ value: 1, name: 'Active' }, { value: 2, name: 'Passive' }]" value-by="value"
                            text-by="name" clearable />
                    </div>
                </div>
            </div>
            <br></br>
            <VaButton size="small" class="mr-6 mb-2" @click="save_city">
                Save
            </VaButton>
        </VaForm>
    </VaModal>
</template>
