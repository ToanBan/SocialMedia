// app/_action/refreshAuth.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function refreshAuth() {
    revalidatePath('/');
}
