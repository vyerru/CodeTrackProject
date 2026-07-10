import { describe, it, expect } from 'vitest'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    role: z.enum(['Student', 'Instructor']),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    agreed: z.literal(true, { message: 'You must agree to the Terms of Service' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

describe('Login Schema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: 'secret' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: 'secret' })
    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.issues[0].path).toContain('email')
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'test@test.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('Register Schema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@test.com',
      role: 'Student',
      password: 'password123',
      confirmPassword: 'password123',
      agreed: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = registerSchema.safeParse({
      name: 'J',
      email: 'john@test.com',
      role: 'Student',
      password: 'password123',
      confirmPassword: 'password123',
      agreed: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@test.com',
      role: 'Student',
      password: 'password123',
      confirmPassword: 'different',
      agreed: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects unagreed terms', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@test.com',
      role: 'Student',
      password: 'password123',
      confirmPassword: 'password123',
      agreed: false,
    })
    expect(result.success).toBe(false)
  })
})