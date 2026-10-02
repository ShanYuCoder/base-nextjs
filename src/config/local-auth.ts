import type { UserMe } from '@portal/models/user';

/** Local dev identity — do not use placeholder or agent names in the UI. */
export const LOCAL_AUTH_NAME = 'vutv';
export const LOCAL_AUTH_EMAIL = 'tvvu.150591@gmail.com';
export const LOCAL_AUTH_ACCESS_TOKEN = 'local-auth-token';

export function getLocalAuthUser(): UserMe {
  return {
    id: 1,
    name: LOCAL_AUTH_NAME,
    full_name: LOCAL_AUTH_NAME,
    email: LOCAL_AUTH_EMAIL,
    role: 'USER',
    active: true,
    status: 'active',
  };
}

export function isLocalAuthClientEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === 'true';
}
