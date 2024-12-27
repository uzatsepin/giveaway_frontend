export default defineNuxtPlugin(async () => {
    const token = useCookie('token').value;
    const { validateToken } = useAuth();
    
    if (token) {
        console.log('Validating token on app start');
        await validateToken(token);
    }
});