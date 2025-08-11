import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// STK Callback handler (ResultURL)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const callback = data?.Body?.stkCallback

    if (!callback) {
      return NextResponse.json({ received: true })
    }

    const resultCode: number = callback.ResultCode
    const resultDesc: string = callback.ResultDesc
    const checkoutRequestID: string = callback.CheckoutRequestID

    // Extract orderId from MerchantRequestID or CallbackMetadata if you set it as AccountReference
    const meta = callback.CallbackMetadata?.Item as Array<{ Name: string; Value?: string | number }>
    const receipt = meta?.find(i => i.Name === 'MpesaReceiptNumber')?.Value as string | undefined
    const amount = meta?.find(i => i.Name === 'Amount')?.Value as number | undefined
    const phone = meta?.find(i => i.Name === 'PhoneNumber')?.Value as number | undefined

    // Optional: if AccountReference contained an orderId, Daraja does not echo it here.
    // If you want hard linkage, you can persist a pending payment record keyed by CheckoutRequestID when calling STK.

    // On success, you might want to mark the Order as paid if you can correlate it (out of scope without pending record)
    if (resultCode === 0 && receipt) {
      // Attempt best-effort match by amount and phone on recent PENDING orders (if any)
      try {
        if (amount && phone) {
          const recent = await db.order.findFirst({
            where: {
              paymentStatus: 'PENDING',
              paymentMethod: 'MPESA',
              total: amount,
              customerPhone: String(phone),
            },
            orderBy: { createdAt: 'desc' },
          })
          if (recent) {
            await db.order.update({
              where: { id: recent.id },
              data: { paymentStatus: 'PAID', status: 'PROCESSING', notes: `Paid: ${receipt}` },
            })
          }
        }
      } catch (e) {
        console.warn('Order auto-match failed', e)
      }
    }

    return NextResponse.json({ ok: true, checkoutRequestID, resultCode, resultDesc, receipt })
  } catch (e) {
    console.error('STK callback error', e)
    return NextResponse.json({ ok: true })
  }
}



