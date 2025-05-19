/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthService } from "@/services/auth.service";

export const authOptions: AuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
          remember: { type: "boolean" }
        },
        async authorize(credentials) {
          try {
            if (!credentials?.email || !credentials?.password) {
              throw new Error('Vui lòng nhập email và mật khẩu');
            }
  
            const result = await AuthService.login(
              credentials.email,
              credentials.password
            );
  
            return {
              id: result.user.user_id.toString(),
              email: result.user.email,
              name: result.user.username,
              avatar: result.user.avatar,
              remember: credentials.remember === "true"
            };
          } catch (error: any) {
            throw new Error(error.message);
          }
        }
      })
    ],
    pages: {
      signIn: '/', // Trang đăng nhập custom
    },
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        if (user) {
          // Nếu là đăng nhập Google, lấy thông tin từ database
          if (user.email) {
            const dbUser = await AuthService.getUserByEmail(user.email);
            if (dbUser) {
              token.id = dbUser.user_id.toString();
              token.name = dbUser.username;
              token.avatar = dbUser.avatar || user.image;
              token.hasBadge = dbUser.has_badge || false;
            }
          } else {
            // Nếu không phải Google login, sử dụng thông tin từ user
            token.id = user.id;
            token.avatar = user.avatar;
            token.name = user.name;
            token.hasBadge = user.hasBadge || false;
          }
  
          if (!user.remember) {
            token.maxAge = 0;
          } else {
            token.maxAge = 30 * 24 * 60 * 60;
          }
        }
  
        if (trigger === "update") {
          if (session?.name) token.name = session.name;
          if (session?.avatar) token.avatar = session.avatar;
          if (session?.hasBadge !== undefined) token.hasBadge = session.hasBadge;
        }
  
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string;
          session.user.avatar = token.avatar as string;
          session.user.name = token.name as string;
          session.user.hasBadge = token.hasBadge as boolean;
        }
        return session;
      },
      async signIn({ user, account }) {
        if (account?.provider === "google") {
          try {
            // Đăng ký hoặc lấy thông tin user từ database
            const result = await AuthService.register({
              username: user.name || '',
              email: user.email || '',
              password: '', // Google login không cần password
              isGoogleUser: true,
              avatar: user.image || ''
            });
            
            // Gán lại id từ database
            user.id = result.userId.toString();
            user.hasBadge = result.user.has_badge || false;
            return true;
          } catch (error: any) {
            if (error.message === 'Email đã được sử dụng') {
              // Nếu email đã tồn tại, lấy thông tin user từ database
              const dbUser = await AuthService.getUserByEmail(user.email || '');
              if (dbUser) {
                user.id = dbUser.user_id.toString();
                user.hasBadge = dbUser.has_badge || false;
                return true;
              }
            }
            console.error('Error during Google sign in:', error);
            return false;
          }
        }
        return true;
      },
    }
  };