<script setup lang="ts">
import { defineVaDataTableColumns, VaButton } from 'vuestic-ui'
import { PropType, ref, computed, watch } from 'vue'
import debounce from 'lodash/debounce.js'
const input = ref("")
const filter = ref("")
const isDebounceInput = ref(false);
const isCustomFilteringFn = ref(false);
const statusColor = ref()
interface Pagination {
  page: number
  perPage: number
  total: number
}
const props = defineProps<{
  columns: ReturnType<typeof defineVaDataTableColumns>
  items: Record<string, any>[],
  loading: boolean,
  pagination: { type: PropType<Pagination>; required: true },
  onEdit: { type: Function },
  onDelete: { type: Function },
  onTask: { type: Function },
  onRefresh?: { type: Function },
  itemsPerPage: { type: Number, default: 10 },
  currentPage: { type: Number, default: 1 },
}>()
const emit = defineEmits(['update:currentPage'])

const localPage = ref(props.currentPage)

const updatePage = (page: number) => {
  emit('update:currentPage', page)
}

// Compute pagination data
const totalPages = computed(() =>
  Math.ceil((props.items?.length || 0) / props.itemsPerPage)
)

const paginatedItems = computed(() => {
  const start: any = (localPage.value - 1) * props.itemsPerPage
  const end: any = start + props.itemsPerPage
  return props.items?.slice(start, end)
})

const prevPage = () => {
  if (localPage.value > 1) {
    localPage.value--
    updatePage(localPage.value)
  }
}

// Go to next page
const nextPage = () => {
  if (localPage.value < totalPages.value) {
    localPage.value++
    updatePage(localPage.value)
  }
}

const customFilteringFn = computed(() => (isCustomFilteringFn.value ? filterExact : undefined));
function filterExact(source: any) {
  if (filter.value === '') return true
  return source?.toString?.() === filter.value;
}
function updateFilter(val: any) {
  filter.value = val;
}
const debouncedUpdateFilter = debounce((val) => {
  updateFilter(val);
}, 600);
watch(input, (newVal) => {
  if (isDebounceInput.value) {
    debouncedUpdateFilter(newVal);
  } else {
    updateFilter(newVal);
  }
});
const getStatusColor = (status: any) => {
  if (status === 1) return 'success'   // green
  if (status === 2) return 'danger' // red
}
const getStatusText = (status: any) => {
  if (status === 1) return 'Active'   // green
  if (status === 2) return 'Passive' // red
}
</script>
<template>
  <VaCard>
    <VaInput v-model="input" placeholder="Filter..." class="w-full" />
    <VaDataTable :columns="columns" :items="paginatedItems" :filter="filter" :per-page="15"
      :filter-method="customFilteringFn" :loading="loading" striped>
      <template #cell(Status)="{ row }">
        <VaBadge :text="getStatusText(row.itemKey.status)" :color="getStatusColor(row.itemKey.status)"/>
      </template>
      <template #cell(Tasks)="{ row }">
        <VaButton preset="plain" color="success" icon="add" @click="onTask(row)" />
      </template>
      <template #cell(actions)="{ row }">
        <VaButton preset="plain" color="success" icon="edit" @click="onEdit(row)" />
        <VaButton preset="plain" color="danger" icon="delete" class="ml-3" @click="onDelete(row)" />
      </template>
    </VaDataTable>
    <div class="flex justify-end mt-4">
      <VaButton color="secondary" size="small" :disabled="localPage <= 1" @click="prevPage">
        <VaIcon name="chevron_left" /> Previous
      </VaButton>
      <VaPagination v-model="localPage" :pages="totalPages" :visible-pages="5" @update:modelValue="updatePage" />

      <VaButton color="secondary" size="small" :disabled="localPage >= totalPages" @click="nextPage">
        Next
        <VaIcon name="chevron_right" />
      </VaButton>
    </div>
    <br></br>
    <VaButton preset="plain" color="primary" size="large" @click="onRefresh">
      <VaIcon class="mr-1" name="loop" size="large" />
    </VaButton>
  </VaCard>
</template>
<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
