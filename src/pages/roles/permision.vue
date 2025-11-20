<script setup lang="ts">
import api from '../../router/axios';
import { ref, onMounted } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import DataTable from '../../components/tables/DataTable.vue';
import { defineVaDataTableColumns } from 'vuestic-ui'
import { useDateTime } from '../../services/useDateTime';

const { init } = useToast()
const formData = useForm('myForm')
const uformData = useForm('upmyForm')
const itemsPerPage = 10;
const currentPage = ref(1)
const tableLoad = ref<boolean>(true)
const { formatDateTime } = useDateTime()

interface Permissions {
  id: number,
  name: string,
  guard_name: string,
  created_at: string
}
const columns = defineVaDataTableColumns([
  { label: 'Role Name', key: 'name', sortable: true },
  { label: 'Guard', key: 'guard_name', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions' },
])
const permission_data = ref<Permissions[]>([])

const form = ref({
  pname: ''
})
const uform = ref({
  id: '',
  urname: ''
})

const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getPermission')
    permission_data.value = res.data.permission.map((da: any) => ({
      id: da.id,
      name: da.name,
      guard_name: da.guard_name,
      created_at: formatDateTime(da.created_at),
      actions: ''
    }))
  } catch (error) { console.log(error) } finally {
    tableLoad.value = false
  }
}

function editItem(row: any) {
  doShowEditModal.value = true
  uform.value = {
    id:row.itemKey.id,
    upname: row.itemKey.name,
  }
}
function add_modal() {
  doShowAddModal.value = true
}

const save_permission = async () => {
  const respo = await api.post('savePermission', form.value).then((res) => {
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
const update_permission = async () => {
  const respo = await api.post('updatePermission', uform.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
      doShowAddModal.value = false
      fetchData()
      uformData.reset()
    }
    else {
      init({ message: 'Record Saved Failed', color: 'error' })
    }
  });
}

onMounted(fetchData)
</script>
<template>
  <h1 class="page-title">Permission</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="permission_data" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Add Permission</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_permission">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.pname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Permission Name" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_permission">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
    <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Edit Permission</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="upmyForm" submit.prevent="update_permission">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="uform.upname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Permission Name" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="update_permission">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
</template>
