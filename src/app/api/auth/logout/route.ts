import { NextResponse } from 'next/server';
import { isLocalAuthEnabled } from '@/lib/local-auth-server';

export async function POST() {
  if (!isLocalAuthEnabled()) {
    return NextResponse.json({ success: false, message: 'Local auth disabled' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'OK', data: null, meta: null });
}
