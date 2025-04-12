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

const userStore = useUserStore(); // need to retrieve user id from user store

export const useChatStore = defineStore(
  'chat',
  () => {
    const messages = ref<FormattedMessage[]>([]);

    return {
      messages
    };
  }
);