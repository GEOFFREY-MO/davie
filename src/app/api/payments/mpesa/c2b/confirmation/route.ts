import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Optionally persist raw confirmations for audit
    // console.log('C2B confirmation', JSON.stringify(data))
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Confirmation received' })
  } catch (e) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Confirmation received' })
  }
}



