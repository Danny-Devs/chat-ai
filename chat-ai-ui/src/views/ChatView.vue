<script setup lang="ts">
import Header from '../components/Header.vue';
import ChatInput from '../components/ChatInput.vue';
import { useChatStore } from '../stores/chat';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { onMounted, nextTick, ref, watch } from 'vue';

// TODO: Optimize chat history retrieval
// 1. Check if user is existing before fetching chat history
// 2. Only make /get-messages API call for existing users
// 3. Skip API call for brand new users with empty history

const chatStore = useChatStore();
const userStore = useUserStore();
const router = useRouter();

const chatInputRef = ref<InstanceType<typeof ChatInput> | null>(null);

// ensure user is logged in
if (!userStore.userId) {
  router.push('/');
}

// Format AI messages for better display
const formatMessage = (text: string) => {
  if (!text) return '';

  // First handle code blocks (triple backticks)
  let formatted = text.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre class="bg-gray-950 p-3 rounded my-2 overflow-x-auto"><code class="text-gray-300">$2</code></pre>'
  );

  // Then handle the rest of the formatting
  return formatted
    .replace(/\n/g, '<br>') // Preserve line breaks
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold text
    .replace(/\*(.*?)\*/g, '<i>$1</i>') // Italic text
    .replace(/`(.*?)`/g, '<code class="bg-gray-950 px-1 rounded">$1</code>') // Inline code
    .replace(/(?:^|\n)- (.*?)(?:\n|$)/g, '<li>$1</li>') // Bullet points
    .replace(/(?:^|\n)(\d+)\. (.*?)(?:\n|$)/g, '<li>$1. $2</li>') // Numbered lists
    .replace(/<\/li>\n<li>/g, '</li><li>') // Ensure list continuity
    .replace(/<li>/, '<ul class="list-disc pl-5 my-2"><li>') // Wrap in `<ul>` with proper styling
    .replace(/<\/li>$/, '</li></ul>'); // Close the `<ul>`
};

// Auto-scroll to bottom of chat history
const scrollToBottom = () => {
  nextTick(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};

const handleMessageSubmit = async (message: string) => {
  await chatStore.sendMessage(message);
  scrollToBottom();
};

onMounted(() => {
  chatStore.loadChatHistory().then(() => {
    scrollToBottom();
  });
});

watch(
  () => chatStore.isLoading,
  isLoading => {
    scrollToBottom();

    // When AI has finished responding (loading state ends)
    if (!isLoading) {
      // Focus the textarea for the next message
      chatInputRef.value?.focus();
    }
  }
);
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-900 text-white">
    <Header />
    <!-- Chat messages -->
    <div
      id="chat-container"
      class="flex-1 overflow-y-auto p-6 space-y-4 mx-auto w-2/3 custom-scrollbar"
    >
      <div
        v-for="(msg, index) in chatStore.messages"
        :key="index"
        class="flex items-start"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-3xl px-4 p-2 rounded-lg"
          :class="
            msg.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white'
          "
        >
          <span v-if="msg.role === 'user'">{{ msg.content }}</span>
          <span v-else v-html="formatMessage(msg.content)"></span>
        </div>
      </div>
      <div
        v-if="chatStore.isLoading"
        class="flex justify-center items-center py-4"
      >
        <div class="w-2 h-2 m-1 bg-white rounded-full animate-bounce"></div>
        <div
          class="w-2 h-2 m-1 bg-white rounded-full animate-bounce"
          style="animation-delay: 0.2s"
        ></div>
        <div
          class="w-2 h-2 m-1 bg-white rounded-full animate-bounce"
          style="animation-delay: 0.4s"
        ></div>
      </div>
    </div>

    <!-- Message input area -->
    <ChatInput
      ref="chatInputRef"
      @submit="handleMessageSubmit"
      :isDisabled="chatStore.isLoading"
    />
  </div>
</template>
