'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    try {
      // Send only required fields to backend
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = form
      await api.post('/auth/register', registerData)
      toast.success('Registration successful. Check your email for OTP.')
      localStorage.setItem('auth_email', form.email)
      router.push('/verify-email')
    } catch (err) {
      console.log('Registration error:', err)
      
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
          status?: number;
        };
        message?: string;
      }
      
      const error = err as ErrorResponse
      

      let errorMessage = 'Registration failed'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data) {

        errorMessage = typeof error.response.data === 'string' ? error.response.data : 'Registration failed'
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.response?.status) {

        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid registration data'
            break
          case 409:
            errorMessage = 'User already exists'
            break
          case 500:
            errorMessage = 'Server error. Please try again later.'
            break
          default:
            errorMessage = 'Registration failed'
        }
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Your Noice Account</h1>
            <p className="text-gray-400 text-sm">Join Noice to get started</p>
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              transition={{ duration: 0.3, delay: 0.3 }}
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

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full p-3 sm:p-4 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.01]"
                required
              />
            </motion.div>
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold p-3 sm:p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </motion.button>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.45 }}
            className="text-center"
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </motion.main>
  )
}
