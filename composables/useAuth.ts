import { useToast } from "~/components/ui/toast";
import { useAuthStore } from "~/store/authStore";
import type { AuthResponse } from "~/types/auth.type";

export const useAuth = () => {
    const config = useRuntimeConfig();
    const authStore = useAuthStore();

    const validateToken = async (tokenValue: string) => {
        if (!tokenValue) return { success: false };

        const { data, error } = await useAsyncData(
            'auth-validate',
            async () => {
                try {
                    const response = await $fetch<AuthResponse>(`${config.public.apiBaseUrl}/user/verify`, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${tokenValue}`
                        },
                    });

                    if (response.success && response.data?.user) {
                        authStore.setUserData(response.data.user);
                        return { success: true };
                    }

                    return { success: false };
                } catch (error: any) {
                    console.error('Error during token validation:', error);
                    return { success: false, error: error.message };
                }
            },
            {
                immediate: false,
                watch: [],
                server: false,
                transform: (response) => response,
                getCachedData: (key) => {
                    const cached = useState<{ success: boolean, error?: any }>(key).value;
                    if (!cached) return undefined;
                    return cached;
                }
            }
        );

        if (error.value) {
            return { success: false, error: error.value };
        }

        return data.value || { success: false };
    };

    return {
        validateToken
    };
};