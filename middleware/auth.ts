import { useAuthStore } from "~/store/authStore";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const token = useCookie('token');
    const authStore = useAuthStore();
    const { validateToken } = useAuth();

    if (token.value) {
        try {
            const isValid = await validateToken(token.value);

            if (!isValid) {
                token.value = null;
                authStore.logout();
                return navigateTo('/', { replace: true });
            }

            if (to.path === '/') {
                return navigateTo('/admin/dashboard', { replace: true });
            }
        } catch (error) {
            console.error('Auth middleware error:', error);
            token.value = null;
            authStore.logout();
            return navigateTo('/', { replace: true });
        }
    }

    if (to.path.startsWith('/admin') && !token.value) {
        return navigateTo('/', { replace: true });
    }
});