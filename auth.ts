import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "./lib/api";
import { ActionResponse } from "./types/global";
import { IAdminAccountDoc } from "./database/adminaccount.model";
import { SignInSchema } from "./lib/validations";
import { IAdmin, IAdminDoc } from "./database/admin.model";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } =
            (await api.adminAccounts.getByProvider(
              email
            )) as ActionResponse<IAdminAccountDoc>;

          if (!existingAccount) return null;

          const { data: existingUser } = (await api.admins.getById(
            existingAccount.userId.toString()
          )) as ActionResponse<IAdminDoc>;

          if (!existingUser) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAdminAccount, success } =
          (await api.adminAccounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId
          )) as ActionResponse<IAdminAccountDoc>;

        if (!success || !existingAdminAccount) {
          return token;
        }
        const adminId = existingAdminAccount.userId;
        if (adminId) {
          token.sub = adminId.toString();
        }
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;
      const userInfo = {
        name: user.name,
        email: user.email!,
        image: user.image,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.adminOAuthSignIn({
        user: {
          email: userInfo.email,
          name: userInfo.name ?? "",
          image: userInfo.image ?? "",
          username: userInfo.username,
        },
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId as string,
      })) as ActionResponse;

      if (!success) return false;
      return true;
    },
  },
});
