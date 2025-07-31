'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/auth/login', form) 
      
      if (response.data.token || response.data.accessToken) {
        const token = response.data.token || response.data.accessToken
        localStorage.setItem('auth_token', token)
        

        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }
        
        toast.success('Login successful!')
        router.push('/home')
      } else {
        toast.success('Login successful!')
        router.push('/home')
      }
    } catch (error: any) {
      console.log('Login error:', error)
      

      let errorMessage = 'Login failed'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : 'Login failed'
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.response?.status) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Invalid email or password'
            break
          case 404:
            errorMessage = 'User not found'
            break
          case 500:
            errorMessage = 'Server error. Please try again later.'
            break
          default:
            errorMessage = 'Login failed'
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white"
    >
      <div className="w-full max-w-md space-y-6">
        <motion.form
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome Back to Nimbus</h1>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 sm:p-4 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 sm:p-4 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                required
              />
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold p-3 sm:p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="text-center space-y-2"
          >
            <a 
              href="/forgot-password" 
              className="block text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
              Forgot your password?
            </a>
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{' '}
              <a 
                href="/register" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign up
              </a>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </motion.main>
  )
}
