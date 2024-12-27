export default defineNuxtPlugin(async () => {
    const token = useCookie('token').value;
    const { validateToken } = useAuth();
    
    if (token) {
        await validateToken(token);
    }
});