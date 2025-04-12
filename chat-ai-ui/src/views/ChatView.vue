<script setup lang="ts">
import Header from '../components/Header.vue';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const userStore = useUserStore();
const router = useRouter();

// TODO: Optimize chat history retrieval
// 1. Check if user is existing before fetching chat history
// 2. Only make /get-messages API call for existing users
// 3. Skip API call for brand new users with empty history



</script>

<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <Header />
  </div>
</template>
