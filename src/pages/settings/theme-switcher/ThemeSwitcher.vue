<template>
  <VaSwitch v-model="isDark" color="#5123a1" off-color="#ffd300" style="--va-switch-checker-background-color: #252723">
    <template #innerLabel>
      <div class="va-text-center">
        <VaIcon :name="isDark ? 'dark_mode' : 'light_mode'" />
      </div>
    </template>
  </VaSwitch>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useColors } from 'vuestic-ui'

const { applyPreset } = useColors()

// Get theme from localStorage or default to light
const savedTheme = localStorage.getItem('app-theme') || 'light'

// Reactive boolean for switch
const isDark = ref(savedTheme === 'dark')

// Apply saved theme on mount
onMounted(() => {
  applyPreset(isDark.value ? 'dark' : 'light')
})

// Watch the switch and change the theme dynamically
watch(isDark, (newVal) => {
  const theme = newVal ? 'dark' : 'light'
  applyPreset(theme)
  localStorage.setItem('app-theme', theme)
})
</script>

<style scoped>
.theme-select {
  background-color: var(--background-element);
  border-color: var(--background-element);
}
</style>
