import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Perform any checks if needed
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (e) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}









