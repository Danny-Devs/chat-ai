<script setup lang="ts">
import robotImage from '@/assets/robot.png';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../stores/store';

const router = useRouter();
const store = useStore();

const name = ref('');
const email = ref('');
const loading = ref(false);
const error = ref('');

const createUser = async () => {
  if (!name.value || !email.value) {
    error.value = 'Please enter your name and email';
    return;
  }

  loading.value = true;
  let response;

  try {
    response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name.value, email: email.value })
    });
  } catch (err) {
    console.error(err);
    error.value = 'Failed to connect to server';
  } finally {
    loading.value = false;
  }

  if (response && response.ok) {
    router.push('/chat');
  } else if (response) {
    error.value = 'Failed to create user';
  }
};
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="p-12 pb-16 bg-gray-800 rounded-lg shadow-lg w-full max-w-lg relative">
      <img :src="robotImage" alt="Robot" class="mx-auto w-24 h-24 mb-2" />
      <h1 class="text-2xl font-semibold mb-10 text-center">
        Welcome to Chat AI
      </h1>

      <input
        type="text"
        class="w-full px-5 py-2 mb-5 bg-gray-700 text-white rounded-lg focus:outline-none placeholder:italic placeholder:text-gray-300 text-center"
        placeholder="Enter your name"
        v-model="name"
      />

      <input
        type="email"
        class="w-full px-5 py-2 mb-7 bg-gray-700 text-white rounded-lg focus:outline-none placeholder:italic placeholder:text-gray-300 text-center"
        placeholder="Enter your email"
        v-model="email"
      />

      <button
        class="w-1/2 p-3 bg-blue-600 rounded-lg mx-auto block hover:bg-blue-500"
        :disabled="loading"
        @click="createUser"
      >
        {{ loading ? 'Logging in...' : 'Start Chat' }}
      </button>

      <p
        v-if="error"
        class="absolute left-0 right-0 text-red-500 text-center mt-4"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>
