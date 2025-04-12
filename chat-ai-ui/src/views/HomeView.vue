<script setup lang="ts">
import robotImage from '@/assets/robot.png';
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const loading = ref(false);
const error = ref('');
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="p-12 bg-gray-800 rounded-lg shadow-lg w-full max-w-lg">
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
        class="w-1/2 p-3 bg-blue-500 rounded-lg mx-auto block"
        :disabled="loading"
      >
        <span v-if="loading">Loading...</span>
        <span v-else>Login</span>
      </button>
    </div>
  </div>
</template>
