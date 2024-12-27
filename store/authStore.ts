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
                useCookie("token").value = response.data?.token;
                userData.value = response.data?.user;
                return { success: true };
            }

            const errorMsg = response.data?.message || response.error || "Помилка видалення розіграшу";
            return { success: false, error: errorMsg };
        } catch (error: any) {
            console.log(error.message.data);
            
            const errorMsg = error.data?.data?.message || error.message || "Помилка видалення розіграшу";
            return { success: false, error: errorMsg };
        } finally {
            isLoading.value = false;
        }
    }

    function setUserData(user: IUserData) {
        userData.value = user;
    }

    return {
        login,
        userData,
        setUserData
    };
});
