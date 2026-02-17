import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user, account }: { user: any; account: any }) {
            // We use 'any' here because strictly typing 'user' as User | AdapterUser 
            // can sometimes conflict with the fields returned by different providers 
            // before the checking logic runs. 'any' is safe here as checks are runtime.
            if (account?.provider === "google" || account?.provider === "github") {
                await dbConnect();
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    // Auto-register OAuth user
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: "user",
                        provider: account.provider,
                    });
                }
            }
            return true;
        },
        async jwt({ token, user }: any) {
            // Initial sign in
            if (user) {
                token.id = user._id;
            }

            // Fetch latest user data from DB to ensure role is up to date
            // This runs on every session check if we don't conditionalize it, 
            // but for safety in this specific case (admin promotion), we want it.
            // Optimization: Only if we have an email.
            if (token.email) {
                await dbConnect();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.role = dbUser.role;
                    token.id = dbUser._id.toString();
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/auth/error", // Keep as is for now or remove if causing issues, but main fix is signIn
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
