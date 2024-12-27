import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('token'); 
  const { validateToken } = useAuth();
  const authStore = useAuthStore(); 
  
  if (to.path.startsWith('/admin')) {
    if (!token.value) {
      return navigateTo('/');
    }

    if (!authStore.userData) {
      const isValid = await validateToken(token.value);
      
      if (!isValid) {
        token.value = null; 
        return navigateTo('/');
      }
    }
  }
});
