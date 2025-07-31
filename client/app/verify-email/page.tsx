'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<HTMLInputElement[]>([])

  useEffect(() => {
    const storedEmail = localStorage.getItem('auth_email')
    if (!storedEmail) {
      toast.error('Email not found. Please register again.')
      router.push('/login')
    } else {
      setEmail(storedEmail)
    }
  }, [router])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return 
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)


    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    if (fullOtp.length !== 6) return toast.error('Enter all 6 digits')

    try {
      const response = await api.post('/auth/verify-otp', { email, otp: fullOtp })
      

      if (response.data.token || response.data.accessToken) {
      
        const token = response.data.token || response.data.accessToken
        localStorage.setItem('auth_token', token)
        

        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }
        
        toast.success('Email verified! You are now logged in.')
        localStorage.removeItem('auth_email') 
        router.push('/home') 
      } else {
      
        toast.success('Email verified! You can now log in.')
        localStorage.removeItem('auth_email')
        router.push('/home')
      }
    } catch (error: any) {
      console.log('Verification error:', error)
      
    
      let errorMessage = 'Verification failed'
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error?.response?.data) {
       
        errorMessage = typeof error.response.data === 'string' ? error.response.data : 'Verification failed'
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
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
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Verify Your Email</h1>
              <p className="text-blue-400 text-sm font-medium">Nimbus Authentication</p>
            </div>
            <p className="text-gray-400 text-sm">Enter the 6-digit code sent to</p>
            <p className="text-blue-400 text-sm font-medium">{email}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex justify-center gap-2 sm:gap-3"
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleBackspace(index, e)}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el
                }}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl rounded-lg bg-gray-800/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:scale-[1.05]"
              />
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 sm:p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150"
          >
            Verify Email
          </motion.button>

        </motion.form>
      </div>
    </motion.main>
  )
}
