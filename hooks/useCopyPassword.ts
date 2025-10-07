"use client";

import { toast } from 'react-toastify';

export function useCopyPassword() {
    const copyPassword = async (password: string) => {
        try {
            await navigator.clipboard.writeText(password);
            toast.success('Password copied! Will clear in 15s');
            
            setTimeout(async () => {
                await navigator.clipboard.writeText('');
                toast.info('Clipboard cleared');
            }, 15000);
        } catch {
            toast.error('Failed to copy');
        }
    };

    return { copyPassword };
}
