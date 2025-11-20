<script setup lang="ts">
import { defineProps } from 'vue'
defineProps({
  text: String,
  color: String,
})
</script>
<template>
  <VaBadge text="{{ text }}" color="{{ color }}" class="mr-2" />
</template>