import type { AuthResponse, ILoginForm } from "~/types/auth.type";

interface IUserData {
    id: number;
    username: string;
}

export const useAuthStore = defineStore("auth", () => {
    const config = useRuntimeConfig();
    const isLoading = ref(true);
    const userData = ref<IUserData>()

    async function login(formData: ILoginForm) {
        try {
            const response = await $fetch<AuthResponse>(`${config.public.apiBaseUrl}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
    
            if (response.success) {
                const tokenCookie = useCookie('token', {
                    maxAge: 60 * 60 * 24 * 7,
                    path: '/',
                    secure: true,
                    sameSite: 'lax'
                });
                
                tokenCookie.value = response.data?.token;
                userData.value = response.data?.user;
                return { success: true };
            }
    
            const errorMsg = response.data?.message || response.error || "Помилка авторизації";
            return { success: false, error: errorMsg };
        } catch (error: any) {
            console.log(error.message.data);
            
            const errorMsg = error.data?.data?.message || error.message || "Помилка авторизації";
            return { success: false, error: errorMsg };
        } finally {
            isLoading.value = false;
        }
    }

    function setUserData(user: IUserData) {
        userData.value = user;
    }

    function clearUserData() {
        userData.value = undefined;
        const tokenCookie = useCookie('token');
        tokenCookie.value = null;
      }

    return {
        login,
        userData,
        setUserData,
        clearUserData
    };
});
