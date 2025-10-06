"use server"

import { cookies } from "next/headers";

const SESSION_NAME = "token";

type CreateSessionOptions = {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    path?: string;
    maxAge?: number;
};

function getCookies(): Promise<any> {
    return cookies();
}

export async function createSessionToken(token: string, opts?: CreateSessionOptions): Promise<void> {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOpts: CreateSessionOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60, // 1 hour
        ...opts,
    };

    (await getCookies()).set(SESSION_NAME, token, cookieOpts as any);
}

export async function deleteSessionToken(): Promise<void> {
    (await getCookies()).delete(SESSION_NAME);
}

export async function getSessiontoken(): Promise<string | null> {
    return (await getCookies()).get(SESSION_NAME)?.value ?? null;
}