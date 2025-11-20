<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue';
import { useForm, useToast } from 'vuestic-ui'
import api from '../../router/axios';
import { defineVaDataTableColumns } from 'vuestic-ui'
import DataTable from '../../components/tables/DataTable.vue';
import { useDateTime } from '../../services/useDateTime';
const { init } = useToast()
const formData = useForm('myForm')
const itemsPerPage = 10;
const currentPage = ref(1)
const tableLoad = ref<boolean>(true)
const { formatDateTime } = useDateTime()
interface Roles
{
  id: number,
  name: string,
  guard_name: string,
  created_at: string
}
const columns = defineVaDataTableColumns([
  { label: 'Role Name', key: 'name', sortable: true },
  { label: 'Guard', key: 'guard_name', sortable: true },
  { label: 'Created_at', key: 'created_at', sortable: true },
  { label: 'Action', key: 'actions'},
])
const form = ref({
  rname: ''
})
const uform = ref({
  id: '',
  urname: ''
})
const doShowAddModal = ref(false)
const doShowEditModal = ref(false)
const doShowDeleteModal = ref(false)

const roles = ref<Roles[]>([])

const fetchData = async () => {
  try {
    tableLoad.value = true
    const res = await api.get('getRole')
    roles.value = res.data.roles.map((da: any) => ({
      id: da.id,
      name: da.name,
      guard_name: da.guard_name,
      created_at: formatDateTime(da.created_at),
      actions: '',
    }))
  } catch (error) { console.log(error) } finally {
    tableLoad.value = false
  }
}
function add_modal() {
  doShowAddModal.value = true
}
const save_role = async () => {
  const respo = await api.post('saveRole', form.value).then((res) => {
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
const update_role = async () => {
  const respo = await api.post('updateRole', uform.value).then((res) => {
    if (res.status === 200) {
      init({ message: 'Record Saved Success', color: 'success' })
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
  uform.value = {
    id:row.itemKey.id,
    urname: row.itemKey.name,
  }
}
onMounted(fetchData)
</script>
<template>
  <h1 class="page-title">Roles</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="add_modal">Add</VaButton>
      </div>
      <DataTable :columns="columns" :items="roles" :loading="tableLoad" :on-edit="editItem" :on-delete="deleteItem"
        :on-refresh="fetchData" :items-per-page="itemsPerPage" v-model:currentPage="currentPage" />
    </VaCardContent>
  </VaCard>
  <VaModal v-model="doShowAddModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Add Role</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="save_role">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="form.rname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Role Name" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="save_role">
        Save
      </VaButton>
    </VaForm>
  </VaModal>
    <VaModal v-model="doShowEditModal" size="large" mobile-fullscreen close-button hide-default-actions>
    <h3>Edit Role</h3>
    <hr>
    </hr>
    <br></br>
    <VaForm ref="myForm" submit.prevent="update_role">
      <div class="row">
        <div class="flex flex-col md3">
          <div class="item">
            <VaInput v-model="uform.urname" :rules="[(v) => !!v || 'Required']"
              class="mt-3 border-2 border-sold border-grey-900 px-2" type="text" label="Role Name" />
          </div>
        </div>
      </div>
      <br></br>
      <VaButton size="small" class="mr-6 mb-2" @click="update_role">
        Update
      </VaButton>
    </VaForm>
  </VaModal>
</template>
