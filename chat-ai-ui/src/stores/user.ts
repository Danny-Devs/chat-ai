import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const userId = ref<string | null>(null);
    const name = ref<string | null>(null);
    const email = ref<string | null>(null);

    function setUser(data: { userId: string; name: string; email: string }) {
      userId.value = data.userId;
      name.value = data.name;
      email.value = data.email;
    }

    function logout() {
      userId.value = null;
      name.value = null;
      email.value = null;
    }

    return {
      userId,
      name,
      email,
      setUser,
      logout
    };
  },
  {
    persist: true // Keep user logged in across page reloads
  }
);
