import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters'),
  email: z.string().email('Invalid email try again'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email try again'),
  password: z.string().min(1, 'Password is required'),
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const oauthSchema = z.object({
  provider: z.enum(['google', 'github']),
  providerId: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
});
