import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return null
  }

  const isValidPassword = user.password ? await comparePassword(password, user.password) : false
  if (!isValidPassword) {
    return null
  }

  return user
}

export const authenticateAdmin = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({
    where: { email }
  })

  if (!admin) {
    return null
  }

  const isValidPassword = await comparePassword(password, admin.password)
  if (!isValidPassword) {
    return null
  }

  return admin
}

export const createUser = async (userData: {
  email: string
  phone: string
  password: string
  firstName?: string
  lastName?: string
  title?: string
}) => {
  const hashedPassword = await hashPassword(userData.password)
  
  return prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword
    }
  })
}

export const createAdmin = async (adminData: {
  email: string
  phone: string
  password: string
  firstName?: string
  lastName?: string
  role?: string
}) => {
  const hashedPassword = await hashPassword(adminData.password)
  
  return prisma.admin.create({
    data: {
      ...adminData,
      password: hashedPassword
    }
  })
} 