import { NextRequest, NextResponse } from 'next/server'
import { stkPush } from '@/lib/mpesa'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, amount, orderId } = body as {
      phoneNumber: string
      amount: number
      orderId?: string
    }

    if (!phoneNumber || !amount) {
      return NextResponse.json({ error: 'phoneNumber and amount are required' }, { status: 400 })
    }

    const accountReference = orderId ?? 'DAVIETECH'
    const resp = await stkPush({
      phoneNumber,
      amount,
      accountReference,
      transactionDesc: 'DAVIETECH Checkout Payment',
      orderId,
    })

    return NextResponse.json(resp)
  } catch (e: any) {
    console.error('STK error', e)
    return NextResponse.json({ error: e?.message ?? 'STK push failed' }, { status: 500 })
  }
}










