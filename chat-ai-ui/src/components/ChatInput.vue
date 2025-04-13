<script setup lang="ts">
import { ref, nextTick } from 'vue';

// Define props for state
const props = defineProps<{
  isDisabled?: boolean;
}>();

// Define emits for events
const emit = defineEmits<{
  submit: [message: string];
}>();

const message = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const handleSubmit = () => {
  if (message.value.trim() === '' || props.isDisabled) return;

  emit('submit', message.value);
  message.value = '';
};

// Method to focus the textarea
const focus = () => {
  nextTick(() => {
    textareaRef.value?.focus();
  });
};

// Expose the focus method to parent components
defineExpose({
  focus
});
</script>

<template>
  <div class="px-4 py-6 w-full">
    <div class="mx-auto w-2/3">
      <form @submit.prevent="handleSubmit" class="flex gap-2">
        <textarea
          ref="textareaRef"
          v-model="message"
          placeholder="Type your message..."
          class="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none custom-scrollbar"
          rows="4"
          :disabled="isDisabled"
          @keydown.enter.prevent="handleSubmit"
        ></textarea>
        <button
          type="submit"
          class="px-5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          :disabled="isDisabled || !message.trim()"
          :class="{
            'opacity-50 cursor-not-allowed': isDisabled || !message.trim()
          }"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>
