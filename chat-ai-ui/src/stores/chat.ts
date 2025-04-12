import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from './user';

interface ChatMessage {
  message: string;
  reply: string;
}

interface FormattedMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<FormattedMessage[]>([]);
  const isLoading = ref(false);

  const userStore = useUserStore(); // need to retrieve user id from user store

  // Load previous chat messages
  const loadChatHistory = async () => {
    isLoading.value = true;

    if (!userStore.userId) {
      console.error('User ID is not set');
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/get-messages`,
        {
          userId: userStore.userId
        }
      );
      messages.value = data.messages
        .flatMap((msg: ChatMessage): FormattedMessage[] => [
          {
            role: 'user',
            content: msg.message
          },
          {
            role: 'assistant',
            content: msg.reply
          }
        ])
        .filter((msg: FormattedMessage) => msg.content);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    messages,
    isLoading,
    loadChatHistory
  };
});
