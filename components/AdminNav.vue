<template>
  <div class="navbar bg-primary shadow-xl">
    <div class="navbar-start">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost btn-square btn-sm text-primary-content">
          <Bars3Icon class="w=5 h-5" />
        </label>
        <ul tabindex="0" class="menu dropdown-content mt-3 z-50 p-2 shadow bg-base-100 rounded-box w-52">
          <li><nuxt-link to="/admin">Tournaments</nuxt-link></li>
          <li><nuxt-link to="/admin/judges">Judges</nuxt-link></li>
          <li><nuxt-link to="/admin/athletes">Athletes</nuxt-link></li>
        </ul>
      </div>
    </div>
    <div class="navbar-center text-primary-content">
      <h1>{{ props.name }}</h1>
    </div>
    <div class="navbar-end">
      <button class="btn btn-sm btn-error" @click.prevent="logout">
        <ArrowLeftOnRectangleIcon class="w-5 h-5" />
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeftOnRectangleIcon, Bars3Icon } from '@heroicons/vue/24/outline';

const props = defineProps(['name']);
const cookie = useCookie('jkj', { default: () => ({}) });

function logout() {
  cookie.value.adminCode = '';
  navigateTo('/admin/code');
}
</script>
