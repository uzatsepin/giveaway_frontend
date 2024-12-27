import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async () => {
  const token = useCookie('token').value;
  const authStore = useAuthStore();
  const { validateToken } = useAuth();

  if (!authStore.userData && token) {
    const isValid = await validateToken(token);
    if (!isValid) {
      useCookie('token').value = null;
      return navigateTo('/');
    }
  }
});

