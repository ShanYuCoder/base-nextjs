import { NextResponse } from 'next/server';
import {
  buildLocalAuthUser,
  isLocalAuthEnabled,
  LOCAL_AUTH_ACCESS_TOKEN,
  validateLocalCredentials,
} from '@/lib/local-auth-server';

export async function POST(request: Request) {
  if (!isLocalAuthEnabled()) {
    return NextResponse.json({ success: false, message: 'Local auth disabled' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email ?? '';
  const password = body?.password ?? '';

  if (!validateLocalCredentials(email, password)) {
    return NextResponse.json(
      { success: false, message: 'Invalid credentials', user_message: 'メールアドレスまたはパスワードが正しくありません。' },
      { status: 401 },
    );
  }

  const user = buildLocalAuthUser();
  return NextResponse.json({
    success: true,
    message: 'OK',
    data: {
      tokenType: 'Bearer',
      accessToken: LOCAL_AUTH_ACCESS_TOKEN,
      token: LOCAL_AUTH_ACCESS_TOKEN,
      user,
    },
    meta: null,
  });
}
