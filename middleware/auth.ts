export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('token')
  const { validateToken } = useAuth()
  
  if (to.path.startsWith('/admin')) {
    if (!token.value) {
      return navigateTo('/')
    }

    const isValid = await validateToken(token.value)
    if (!isValid) {
      token.value = null
      return navigateTo('/')
    }
  }
})