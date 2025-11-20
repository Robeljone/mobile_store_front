<script setup lang="ts">
import { PropType } from 'vue'
import { Pagination } from '../../../data/pages/users'
const props = defineProps({
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  tbColumns: { type: Object, required: true },
  tbItems: { type: Array, required: true },
})
</script>
<template>
  <DataTable :columns="tbColumns" :items="tbItems" :loading="$props.loading" />
</template>
