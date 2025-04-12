<script setup lang="ts">
import Header from '../components/Header.vue';
import { useChatStore } from '../stores/chat';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue';

// TODO: Optimize chat history retrieval
// 1. Check if user is existing before fetching chat history
// 2. Only make /get-messages API call for existing users
// 3. Skip API call for brand new users with empty history

const chatStore = useChatStore();
const userStore = useUserStore();
const router = useRouter();

// ensure user is logged in
if (!userStore.userId) {
  router.push('/login');
}

onMounted(() => {
  chatStore.loadChatHistory();
});
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <Header />
  </div>
</template>
