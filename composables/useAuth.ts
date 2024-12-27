import { useToast } from "~/components/ui/toast";
import { useAuthStore } from "~/store/authStore";
import type { AuthResponse } from "~/types/auth.type";

export const useAuth = () => {
    const config = useRuntimeConfig();
    const { toast } = useToast();
    const authStore = useAuthStore();
    const isLoading = ref(false);

    const validateToken = async (tokenValue: string): Promise<boolean> => {
        if (!tokenValue) return false;
      
        try {
          isLoading.value = true;
      
          // Отправляем запрос на сервер для проверки токена
          const data = await $fetch<AuthResponse>(`${config.public.apiBaseUrl}/user/verify`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokenValue}`,
            },
          });
      
          if (data.success && data.data?.user) {
            authStore.setUserData(data.data.user);
            return true;
          }
      
          return false;
        } catch (error: any) {
          console.error('Error during token validation:', error);
      
          const errorMessage = error.data?.data?.message || 'Помилка авторизації';
          toast({
            title: 'Помилка',
            description: errorMessage,
            variant: 'destructive',
          });
      
          return false;
        } finally {
          // Завершаем состояние загрузки
          isLoading.value = false;
        }
      };
      

    return {
        validateToken,
        isLoading
    };
};
