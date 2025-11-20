<script setup lang="ts">
import { ref, watch } from 'vue'

const form_list = [
  { id: 1, Name: "Text" },
  { id: 2, Name: "Number" },
  { id: 3, Name: "Select" },
  { id: 4, Name: "Textarea" },
  { id: 5, Name: "CheckBox" },
  { id: 6, Name: "Radiobutton" },
  { id: 7, Name: "Date" },
]

// Props from parent
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
})

// Emit to update parent
const emit = defineEmits(['update:modelValue'])

// Local refs (bound to input fields)
const name = ref(props.modelValue.name || '')
const opt = ref(props.modelValue.opt || '')
const value = ref(props.modelValue.value || '')

// Watchers to sync parent <-> child
watch([name, opt, value], ([newName, newOpt, newValue]) => {
  emit('update:modelValue', {
    name: newName,
    opt: newOpt,
    value: newValue,
  })
})
</script>

<template>
  <VaCard color="background-element" class="p-3 mt-3">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="item">
        <VaInput
          v-model="name"
          :rules="[(v) => !!v || 'Required']"
          class="border-2 border-solid border-gray-900 px-2"
          type="text"
          label="Question"
        />
      </div>

      <div class="item">
        <VaSelect
          v-model="opt"
          class="border-2 border-solid border-gray-900 px-2"
          label="Field Type"
          :options="form_list"
          value-by="Name"
          text-by="Name"
          clearable
        />
      </div>

      <div class="item">
        <VaInput
          v-model="value"
          class="border-2 border-solid border-gray-900 px-2"
          type="text"
          label="Default Value"
        />
      </div>
    </div>
  </VaCard>
</template>
