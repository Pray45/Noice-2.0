'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      toast.success('OTP sent to your email')
      router.push(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (err) {
      console.log('Forgot password error:', err)
      
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
      
      let errorMessage = 'Failed to send OTP'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : 'Failed to send OTP'
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.response?.status === 404) {
        errorMessage = 'Email not found'
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="w-full max-w-md space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-6 sm:p-8 rounded-xl shadow-2xl space-y-6"
        >
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Your Noice Password</h1>
            <p className="text-gray-400 text-sm">Enter your email to receive an OTP</p>
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold p-3 sm:p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-r-white rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }} />
                </div>
                <span className="animate-pulse">
                  Sending OTP...
                </span>
              </div>
            ) : (
              'Send OTP'
            )}
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Remember your password?{' '}
              <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}
