<script setup lang="ts">
import robotImage from '@/assets/robot.png';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<template>
  <div
    class="py-4 px-6 bg-gray-800 shadow-md flex justify-between items-center"
  >
    <div class="flex items-center">
      <img :src="robotImage" alt="Chat AILogo" class="w-8 h-8 mr-2" />
      <h1 class="text-white text-lg font-semibold">Chat AI</h1>
    </div>
    <button @click="logout" class="text-gray-300 hover:text-white">
      Logout
    </button>
  </div>
</template>
