import { NextRequest, NextResponse } from 'next/server'
import { registerC2BUrls } from '@/lib/mpesa'

export async function POST(_request: NextRequest) {
  try {
    const resp = await registerC2BUrls()
    return NextResponse.json(resp)
  } catch (e: any) {
    console.error('C2B register error', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to register C2B URLs' }, { status: 500 })
  }
}



