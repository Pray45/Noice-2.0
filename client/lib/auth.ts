// Authentication utility functions

export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem('auth_token')
  },

  // Get stored token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  },

  // Get stored user data
  getUser: (): any | null => {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  // Store auth data
  setAuth: (token: string, user?: any): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user))
    }
  },

  // Clear auth data (logout)
  clearAuth: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('auth_email') // cleanup
  },

  // Redirect based on auth status
  redirectIfAuthenticated: (router: any, redirectTo: string = '/dashboard'): void => {
    if (authUtils.isAuthenticated()) {
      router.push(redirectTo)
    }
  },

  // Redirect if not authenticated
  redirectIfNotAuthenticated: (router: any, redirectTo: string = '/login'): void => {
    if (!authUtils.isAuthenticated()) {
      router.push(redirectTo)
    }
  }
}
