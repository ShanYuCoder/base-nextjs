import {
  LOCAL_AUTH_ACCESS_TOKEN,
  LOCAL_AUTH_EMAIL,
  LOCAL_AUTH_NAME,
  getLocalAuthUser,
} from '@/config/local-auth';

export { LOCAL_AUTH_ACCESS_TOKEN };

export function isLocalAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === 'true' || process.env.USE_LOCAL_AUTH === 'true';
}

export function getLocalAuthPassword(): string {
  return process.env.LOCAL_AUTH_PASSWORD ?? 'vutv';
}

export function getLocalAuthEmail(): string {
  return process.env.LOCAL_AUTH_EMAIL ?? LOCAL_AUTH_EMAIL;
}

export function getLocalAuthDisplayName(): string {
  return process.env.LOCAL_AUTH_NAME ?? LOCAL_AUTH_NAME;
}

export function buildLocalAuthUser() {
  const user = getLocalAuthUser();
  return {
    ...user,
    name: getLocalAuthDisplayName(),
    full_name: getLocalAuthDisplayName(),
    email: getLocalAuthEmail(),
  };
}

export function validateLocalCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === getLocalAuthEmail().toLowerCase() && password === getLocalAuthPassword();
}
