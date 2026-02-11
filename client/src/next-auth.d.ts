import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User {
        id: string
        name: string
        email: string
        role: string
        image?: string
        bio?: string
        status?: string
        agreedToTerms?: string
    }

    interface Session {
        user: {
            id: string
            name: string
            email: string
            role: string
            image?: string
            bio?: string
            status?: string
            agreedToTerms?: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        name: string
        email: string
        role: string
        image?: string
        bio?: string
        status?: string
        agreedToTerms?: string
    }
}

export { }