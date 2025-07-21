'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const SESSION_COOKIE_NAME = 'session';

export async function login(credentials: z.infer<typeof loginSchema>) {
  const parsedCredentials = loginSchema.safeParse(credentials);

  if (!parsedCredentials.success) {
    return { success: false, error: 'Invalid credentials format.' };
  }

  const { username, password } = parsedCredentials.data;

  // In a real app, you'd validate against a database.
  // For this demo, we'll use hardcoded credentials.
  const validUsername = process.env.ADMIN_USERNAME || 'admin';
  const validPassword = process.env.ADMIN_PASSWORD || 'password';

  if (username === validUsername && password === validPassword) {
    const session = { user: { name: username }, loggedIn: true };
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    cookies().set(SESSION_COOKIE_NAME, JSON.stringify(session), {
      expires,
      httpOnly: true,
      path: '/',
    });

    return { success: true };
  }

  return { success: false, error: 'Invalid username or password.' };
}

export async function logout() {
  cookies().set(SESSION_COOKIE_NAME, '', { expires: new Date(0), path: '/' });
}

export async function getSession() {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    return JSON.parse(sessionCookie);
  } catch {
    return null;
  }
}
