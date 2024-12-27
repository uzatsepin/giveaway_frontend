import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie('token').value;
  const authStore = useAuthStore();
  const { validateToken } = useAuth();
  
  if (authStore.userData) {
      return;
  }

  if (token) {
      try {
          console.log('Attempting to validate token');
          const isValid = await validateToken(token);
          console.log('Token validation result:', isValid);
          
          if (!isValid) {
              useCookie('token').value = null;
              return navigateTo('/');
          }
      } catch (error) {
          console.error('Auth middleware error:', error);
          useCookie('token').value = null;
          return navigateTo('/');
      }
  }
});