import { cookies } from "next/headers";
import { env } from "@/env";

const AUTH_URL = env.NEXT_PUBLIC_AUTH_URL;

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
  user: User;
}

export const userService = {
  /**
   * Fetches the current user session from the backend.
   * Securely passes the Next.js cookies to the external API.
   * @returns {Promise<Session | null>} The session object if authenticated, otherwise null.
   */
  getSession: async function (): Promise<Session | null> {
    try {
      const cookieStore = await cookies();
      const cookieString = cookieStore.toString();

      const res = await fetch(`${AUTH_URL}/get-session`, {
        headers: {
          ...(cookieString ? { Cookie: cookieString } : {}),
        },
        cache: "no-cache",
      });

      if (!res.ok) {
        // If unauthorized or other error, return null to signify no active session
        if (res.status === 401) return null;
        
        throw new Error(`Failed to fetch session: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data as Session;
    } catch (error) {
      console.error("[userService.getSession] Backend is unreachable or session fetch failed:", error);
      return null;
    }
  },
};
