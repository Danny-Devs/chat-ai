<script setup lang="ts">
import { ref } from 'vue';

// Define props
const props = defineProps<{
  onSubmit: (message: string) => Promise<void>;
  isDisabled?: boolean;
}>();

const newMessage = ref('');

const handleSubmit = async () => {
  if (newMessage.value.trim() === '' || props.isDisabled) return;
  
  await props.onSubmit(newMessage.value);
  newMessage.value = '';
};
</script>

<template>
  <div class="px-4 py-6">
    <div class="mx-auto w-1/2">
      <form @submit.prevent="handleSubmit" class="flex gap-2">
        <textarea
          v-model="newMessage"
          placeholder="Type your message..."
          class="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
          rows="4"
          :disabled="isDisabled"
        ></textarea>
        <button
          type="submit"
          class="px-5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          :disabled="isDisabled || !newMessage.trim()"
          :class="{ 'opacity-50 cursor-not-allowed': isDisabled || !newMessage.trim() }"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>