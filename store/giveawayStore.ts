import type { ApiResponse, ApiResponseMessage, ApiResponseSingleGiveaway, IGiveaway, IGiveawayForm, IMessage, IMessageForm } from "~/types/giveaway.type";

export const useGiveawayStore = defineStore("giveaway", () => {
    const config = useRuntimeConfig();
    const isLoading = ref(true);
    const errorMessage = ref<string | null>(null);
    const giveaways = ref<IGiveaway[]>([]);
    const giveawayById = ref<IGiveaway | null>(null);
    const activeGiveaways = ref<IGiveaway[]>([]);
    const messages = ref<IMessage[]>([]);

    async function fetchGiveaways() {
        errorMessage.value = null;

        try {
            const data = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/giveaway`, {
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                }
            });

            if (data.success) {
                giveaways.value = data.data.giveaways;
            }
        } catch (error) {
            errorMessage.value = "Failed to fetch giveaways";
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function createGiveaway(formData: IGiveawayForm) {
        errorMessage.value = null;
    
        try {
            const formattedData = {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString()
            };
    
            const response = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/giveaway/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${useCookie("token").value}`
                },
                body: JSON.stringify(formattedData)
            });
    
            if (response.success) {
                await fetchGiveaways();
                return { success: true };
            }

            const errorMsg = response.data?.message || response.error || "Помилка видалення розіграшу";
            errorMessage.value = errorMsg;
            return { success: false, error: errorMsg };
        } catch (error: any) {
            const errorMsg = error.data?.data?.message || error.message || "Помилка видалення розіграшу";
            errorMessage.value = errorMsg;
            return { success: false, error: errorMsg };
        }
    }

    async function deleteGiveaway(giveawayId: number) {
        errorMessage.value = null;
        isLoading.value = true;
    
        try {
            const response = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/giveaway/${giveawayId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                }
            });
    
            if (response.success) {
                await fetchGiveaways();
                return { success: true };
            }
    
            const errorMsg = response.data?.message || response.error || "Помилка видалення розіграшу";
            errorMessage.value = errorMsg;
            return { success: false, error: errorMsg };
        } catch (error: any) {
            const errorMsg = error.data?.data?.message || error.message || "Помилка видалення розіграшу";
            errorMessage.value = errorMsg;
            return { success: false, error: errorMsg };
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchGiveawayById(giveawayId: number) {
        errorMessage.value = null;

        try {
            const data = await $fetch<ApiResponseSingleGiveaway>(`${config.public.apiBaseUrl}/giveaway/${giveawayId}`, {
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                }
            });

            if (data.success) {
                giveawayById.value = data.data.giveaway;
            }
        } catch (error) {
            errorMessage.value = "Failed to fetch giveaways";
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function startGiveaway(giveawayId: number) {
        errorMessage.value = null;

        try {
            const response = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/giveaway/${giveawayId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                },
                body: JSON.stringify({ status: "ACTIVE" })
            });

            if (response.success) {
                await fetchGiveaways();
                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error: any) {
            errorMessage.value = error.message;
            return { success: false, error: error.message };
        } finally {
            isLoading.value = false;
        }
    }

    async function endGiveaway(giveawayId: number) {
        errorMessage.value = null;

        try {
            const response = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/giveaway/${giveawayId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                },
                body: JSON.stringify({ status: "COMPLETED" })
            });

            if (response.success) {
                await fetchGiveaways();
                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error: any) {
            errorMessage.value = error.message;
            return { success: false, error: error.message };
        } finally {
            isLoading.value = false;
        }
    }

    async function finishGiveaway(giveawayId: number) {
        errorMessage.value = null;

        try {
            const response = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/giveaway/${giveawayId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                },
                body: JSON.stringify({ status: "COMPLETED" })
            });

            if (response.success) {
                await fetchGiveaways();
                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error: any) {
            errorMessage.value = error.message;
            return { success: false, error: error.message };
        } finally {
            isLoading.value = false;
        }
    }

    async function createMessage(formData: IMessageForm) {
        errorMessage.value = null;

        try {
            const response = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${useCookie("token").value}`
                },
                body: JSON.stringify(formData)
            });

            if (response.success) {
                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error: any) {
            errorMessage.value = error.message;
            return { success: false, error: error.message };
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchActiveGiveaways() {
        errorMessage.value = null;

        try {
            const data = await $fetch<ApiResponse>(`${config.public.apiBaseUrl}/giveaway/active`, {
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                }
            });

            if (data.success) {
                activeGiveaways.value = data.data.giveaways;
            }
        } catch (error) {
            errorMessage.value = "Failed to fetch active giveaways";
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchMessages() {
        errorMessage.value = null;

        try {
            const data = await $fetch<ApiResponseMessage>(`${config.public.apiBaseUrl}/messages`, {
                headers: {
                    Authorization: `Bearer ${useCookie("token").value}`
                }
            });

            if (data.success) {
                messages.value = data.data.messages;
            }
        } catch (error) {
            errorMessage.value = "Failed to fetch active giveaways";
            console.error(error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        errorMessage,
        giveaways,
        giveawayById,
        activeGiveaways,
        messages,
        fetchGiveaways,
        fetchGiveawayById,
        createGiveaway,
        startGiveaway,
        finishGiveaway,
        deleteGiveaway,
        createMessage,
        fetchActiveGiveaways,
        fetchMessages,
        endGiveaway
    };
});
