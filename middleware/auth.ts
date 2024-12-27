import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('Auth middleware running');
  const token = useCookie('token').value;
  const authStore = useAuthStore();
  const { validateToken } = useAuth();
  
  console.log('Token exists:', !!token);
  console.log('User data exists:', !!authStore.userData);

  // Если пользователь уже авторизован, пропускаем
  if (authStore.userData) {
      return;
  }

  // Если есть токен, но нет данных пользователя
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