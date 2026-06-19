import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

// Custom adapter to handle field mapping
const customPrismaAdapter = PrismaAdapter(prisma)

// Override the createUser method to handle our schema
const originalCreateUser = customPrismaAdapter.createUser
customPrismaAdapter.createUser = async (data) => {
  console.log('Custom createUser called with:', data)
  
  // Extract first and last name from the name field
  const nameParts = data.name?.split(' ') || []
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  
  // Create user with our schema fields
  const user = await prisma.user.create({
    data: {
      email: data.email,
      image: data.image,
      firstName,
      lastName,
    }
  })
  
  console.log('User created successfully:', user)
  
  // Return in the format NextAuth expects
  return {
    id: user.id,
    email: user.email,
    emailVerified: null,
    image: user.image,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
  }
}

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET!,
      profile(profile) {
        console.log('Google profile mapping:', profile)
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim() || profile.email,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log('SignIn callback - profile:', profile)
        console.log('SignIn callback - account:', account)
        
        // Handle OAuth account linking
        if (account?.provider === 'google' && profile?.email) {
          // Check if user already exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
            include: { accounts: true }
          })
          
          if (existingUser && existingUser.accounts.length === 0) {
            // User exists but has no OAuth accounts - link the Google account
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                scope: account.scope,
                token_type: account.token_type,
                id_token: account.id_token,
              }
            })
            return true
          }
        }
        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return true // Allow sign-in even if linking fails
      }
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id
        
        // Use the name from the JWT token (which comes from our custom adapter)
        if (token.name) {
          session.user.name = token.name
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        // Store the name in the JWT token
        if (user.name) {
          token.name = user.name
          console.log('JWT callback - storing name:', user.name)
        }
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Redirect to home page after successful sign in
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith("/")) return `${baseUrl}${url}`
      return baseUrl
    },
  },
  // No custom pages needed - using modal instead
  pages: {
    error: '/', // Redirect errors to home page instead of non-existent signin page
  },
  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === 'development',
}
