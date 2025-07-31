'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus()
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
    if (!value && index > 0) inputRefs.current[index - 1]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.join('').length !== 6) return toast.error('Enter full OTP')
    if (!password) return toast.error('Enter new password')

    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        email,
        otp: otp.join(''),
        newPassword:password,
      })
      toast.success('Password reset successful')
      router.push('/home')
    } catch (err) {
      console.log('Reset password error:', err)
      
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
      
      let errorMessage = 'Reset failed'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data) {
        errorMessage = typeof error.response.data === 'string' ? error.response.data : 'Reset failed'
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.response?.status) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid OTP or password'
            break
          case 404:
            errorMessage = 'User not found'
            break
          case 410:
            errorMessage = 'OTP expired'
            break
          default:
            errorMessage = 'Reset failed'
        }
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
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Your Nimbus Password</h1>
            <p className="text-gray-400 text-sm">Enter the OTP and your new password</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enter OTP</label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    ref={(el) => {
                      inputRefs.current[idx] = el
                    }}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl rounded-lg bg-gray-800/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-lg bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
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
                  Resetting...
                </span>
              </div>
            ) : (
              'Reset Password'
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

function LoadingFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 p-6 sm:p-8 rounded-xl shadow-2xl">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
