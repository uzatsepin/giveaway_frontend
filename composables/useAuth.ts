import { useToast } from "~/components/ui/toast";
import { useAuthStore } from "~/store/authStore";
import type { AuthResponse } from "~/types/auth.type";

export const useAuth = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();
    const isLoading = ref(false);

    const validateToken = async (tokenValue: string): Promise<boolean> => {
        if (!tokenValue) return false;
      
        try {
            isLoading.value = true;
      
            const data = await $fetch<AuthResponse>(`${config.public.apiBaseUrl}/user/verify`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenValue}`
                },
            });
      
            if (data.success && data.data?.user) {
                authStore.setUserData(data.data.user);
                return true;
            }
      
            return false;
        } catch (error: any) {
            console.error('Error during token validation:', error);
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        validateToken,
        isLoading
    };
};