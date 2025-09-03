import { NextRequest, NextResponse } from 'next/server'
import { transactionStatus } from '@/lib/mpesa'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transactionId } = body as { transactionId: string }
    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId is required' }, { status: 400 })
    }
    const resp = await transactionStatus({ transactionId })
    return NextResponse.json(resp)
  } catch (e: any) {
    console.error('Txn status error', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to query status' }, { status: 500 })
  }
}












