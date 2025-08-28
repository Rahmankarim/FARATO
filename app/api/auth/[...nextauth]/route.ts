import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import connectToDatabase from "@/lib/mongodb"
import { User, Log } from "@/lib/models"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          await connectToDatabase()

          // Find user in database
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase() 
          })

          if (!user) {
            throw new Error("No account found with this email address")
          }

          // Check password
          const isValidPassword = await bcrypt.compare(credentials.password, user.password)
          
          if (!isValidPassword) {
            throw new Error("Incorrect password")
          }

          // Log successful login
          await Log.create({
            userId: user._id,
            action: 'USER_LOGIN',
            details: {
              email: user.email,
              provider: 'credentials',
            },
          })

          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            image: user.avatar,
            role: user.role,
          }
        } catch (error) {
          throw error
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          await connectToDatabase()
          
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            // Create new user for social login
            const newUser = await User.create({
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              email: user.email.toLowerCase(),
              password: await bcrypt.hash(Math.random().toString(36), 12), // Random password for social users
              avatar: user.image,
              isEmailVerified: true,
              provider: account.provider,
              role: 'user',
            })

            // Log social registration
            await Log.create({
              userId: newUser._id,
              action: 'USER_SOCIAL_REGISTERED',
              details: {
                email: newUser.email,
                provider: account.provider,
              },
            })
          } else {
            // Log social login
            await Log.create({
              userId: existingUser._id,
              action: 'USER_SOCIAL_LOGIN',
              details: {
                email: existingUser.email,
                provider: account.provider,
              },
            })
          }
        } catch (error) {
          console.error("Social sign in error:", error)
          return false
        }
      }
      return true
    },
    async redirect({ url, baseUrl }: any) {
      // If it's a relative URL, ensure it starts with the base URL
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // If it's the same origin as the base URL, allow it
      else if (new URL(url).origin === baseUrl) return url
      // Otherwise, redirect to home page
      return baseUrl
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  session: {
    strategy: "jwt" as const,
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
