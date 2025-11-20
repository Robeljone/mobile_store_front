<template>
  <div class="app-navbar-actions">
    <ThemeSwitcher />
    <VaButton color="danger" size="small" round class="power-btn mx-3" @click="callApi">
      <VaIcon name="power_settings_new" size="20px" />
    </VaButton>
  </div>
</template>
<script lang="ts" setup>
import axios from 'axios';
import { useToast } from 'vuestic-ui'
import ThemeSwitcher from '../../../pages/settings/theme-switcher/ThemeSwitcher.vue';
import { useRouter } from 'vue-router'
defineProps({
  isMobile: { type: Boolean, default: false },
})
const { push } = useRouter()
const { init } = useToast()
const token = localStorage.getItem('token');
const callApi = async () => {
  try {
    await axios.post('http://127.0.0.1:8000/api/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    init({ message: "You've successfully logged out", color: 'success' })
    push({ name: 'login' })
    localStorage.removeItem('token')
  }
  catch (e) {
    console.log(e)
  }
}
</script>
<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  .va-dropdown__anchor {
    color: var(--va-primary);
    fill: var(--va-primary);
  }

  &__item {
    padding: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    svg {
      height: 20px;
    }

    &--profile {
      display: flex;
      justify-content: center;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-left: 0;
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }

  .fa-github {
    color: var(--va-on-background-primary);
  }
}
.power-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Optional extra space if you want more */
  margin: 0 8px; /* left-right space */
}
</style>
