<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Вхід в адмін панель</h2>
            </div>
            <form
                class="mt-8 space-y-6"
                @submit.prevent="handleLogin">
                <div class="flex flex-col gap-3 items-center">
                    <div class="grid relative w-[350px] items-center gap-1.5">
                        <Input
                            id="username"
                            type="text"
                            placeholder="username"
                            class="pl-10" 
                            v-model="form.username"
                            />
                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                            <User class="w-5 h-5 text-gray-400"/>
                        </span>
                    </div>
                    <div class="grid relative w-[350px] items-center gap-1.5">
                        <Input
                            id="password"
                            type="password"
                            placeholder="******"
                            class="pl-10" 
                            v-model="form.password"
                            />
                        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                            <RectangleEllipsis class="w-5 h-5 text-gray-400"/>
                        </span>
                    </div>
                </div>
                <div class="flex justify-center gap-2">
                    <Button class="mx-auto max-w-fit" :disabled="!form.username || !form.password">Авторизуватись</Button>
                </div>
            </form>
        </div>
    </div>
    <Toaster />
</template>

<script setup lang="ts">
import { toast, useToast } from "~/components/ui/toast/use-toast";
import { User, RectangleEllipsis } from 'lucide-vue-next';
import { useAuthStore } from "~/store/authStore";

const form = reactive({
    username: '',
    password: ''
})

const authStore = useAuthStore();

const handleLogin = async () => {
    try {
        const result = await authStore.login(form);

        if (result.success) {
            toast({
                title: "Успіх",
                description: "Ви успішно увійшли в адмін панель"
            });
            navigateTo('/admin/dashboard');
        } else {
            throw new Error(result.error);
        }
    } catch (e: any) {
        toast({
            title: "Помилка",
            description: e.message,
            variant: "destructive"
        });
    }
}


// onMounted(async () => {
//     if (token.value) {
//         const isValid = await validateToken(token.value || '');
//         if (isValid) {
//             const tokenCookie = useCookie('token')
//             tokenCookie.value = ''
//         }
//     }

// })


</script>
