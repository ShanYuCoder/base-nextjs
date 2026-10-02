import { NextResponse } from 'next/server';
import { buildLocalAuthUser, isLocalAuthEnabled, LOCAL_AUTH_ACCESS_TOKEN } from '@/lib/local-auth-server';

function isAuthorized(request: Request): boolean {
  const header = request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7).trim();
    if (token === LOCAL_AUTH_ACCESS_TOKEN) return true;
  }
  const cookie = request.headers.get('cookie') ?? '';
  return /(?:^|;\s*)auth_token=([^;]+)/.test(cookie) && cookie.includes(LOCAL_AUTH_ACCESS_TOKEN);
}

export async function GET(request: Request) {
  if (!isLocalAuthEnabled()) {
    return NextResponse.json({ success: false, message: 'Local auth disabled' }, { status: 404 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    message: 'OK',
    data: buildLocalAuthUser(),
    meta: null,
  });
}
