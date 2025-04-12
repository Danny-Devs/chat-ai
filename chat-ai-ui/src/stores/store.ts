import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// Main store using Composition API style (setup stores)
export const useStore = defineStore(
  'main',
  () => {
    // Reactive state for user information
    const userId = ref('');
    const name = ref('');
    const email = ref('');
    const isAuthenticated = ref(false);

    // Array of chat messages with type definition
    const messages = ref<
      Array<{
        id: string;
        content: string;
        sender: 'user' | 'ai';
        timestamp: number;
      }>
    >([]);

    // Computed property to generate user initials from name
    const userInitials = computed(() => {
      if (!name.value) return '';
      return name.value
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    });

    // Sets user data and marks as authenticated
    function setUser(userData: {
      userId: string;
      name: string;
      email: string;
    }) {
      userId.value = userData.userId;
      name.value = userData.name;
      email.value = userData.email;
      isAuthenticated.value = true;
    }

    // Adds a new message to the chat history
    function addMessage(content: string, sender: 'user' | 'ai') {
      messages.value.push({
        id: Date.now().toString(), // Generate unique ID based on timestamp
        content,
        sender,
        timestamp: Date.now()
      });
    }

    // Clears all chat messages
    function clearChat() {
      messages.value = [];
    }

    // Resets all user data and chat history
    function logout() {
      userId.value = '';
      name.value = '';
      email.value = '';
      isAuthenticated.value = false;
      messages.value = [];
    }

    // Expose state, getters and actions
    return {
      // State
      userId,
      name,
      email,
      isAuthenticated,
      messages,

      // Getters
      userInitials,

      // Actions
      setUser,
      addMessage,
      clearChat,
      logout
    };
  },
  {
    persist: true // Enable state persistence across page reloads
  }
);
