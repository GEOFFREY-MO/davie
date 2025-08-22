import type { NextRequest } from 'next/server'

const MPESA_BASE = process.env.MPESA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke'

function ensureEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing required env: ${name}`)
  return v
}

export async function getAccessToken(): Promise<string> {
  const key = ensureEnv('MPESA_CONSUMER_KEY')
  const secret = ensureEnv('MPESA_CONSUMER_SECRET')
  const auth = Buffer.from(`${key}:${secret}`).toString('base64')

  const res = await fetch(`${MPESA_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to get M-Pesa token: ${res.status} ${text}`)
  }

  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

function buildTimestamp(): string {
  const now = new Date()
  const yyyy = now.getFullYear().toString()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const HH = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`
}

function buildPassword(shortCode: string, passkey: string, timestamp: string): string {
  return Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64')
}

export interface StkPushRequest {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc?: string
  orderId?: string
}

export async function stkPush(req: StkPushRequest) {
  const token = await getAccessToken()
  const shortCode = ensureEnv('MPESA_SHORT_CODE')
  const passkey = ensureEnv('MPESA_PASSKEY')
  const callbackUrl = ensureEnv('MPESA_CALLBACK_URL')
  const timestamp = buildTimestamp()
  const password = buildPassword(shortCode, passkey, timestamp)

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(req.amount),
    PartyA: req.phoneNumber,
    PartyB: shortCode,
    PhoneNumber: req.phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: req.accountReference,
    TransactionDesc: req.transactionDesc ?? 'DAVIETECH Order',
  }

  const res = await fetch(`${MPESA_BASE}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(`STK push failed: ${res.status} ${JSON.stringify(json)}`)
  }
  return json
}

export interface TransactionStatusRequest {
  transactionId: string
  remarks?: string
  occasion?: string
}

export async function transactionStatus(req: TransactionStatusRequest) {
  const token = await getAccessToken()
  const shortCode = ensureEnv('MPESA_SHORT_CODE')

  const payload = {
    Initiator: ensureEnv('MPESA_INITIATOR_NAME'),
    SecurityCredential: ensureEnv('MPESA_SECURITY_CREDENTIAL'),
    CommandID: 'TransactionStatusQuery',
    TransactionID: req.transactionId,
    PartyA: shortCode,
    IdentifierType: 4,
    ResultURL: ensureEnv('MPESA_TXN_STATUS_CALLBACK_URL'),
    QueueTimeOutURL: ensureEnv('MPESA_QUEUE_TIMEOUT_URL'),
    Remarks: req.remarks ?? 'Order status check',
    Occasion: req.occasion ?? 'Order',
  }

  const res = await fetch(`${MPESA_BASE}/mpesa/transactionstatus/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  const json = await res.json()
  if (!res.ok) {
    throw new Error(`Txn status failed: ${res.status} ${JSON.stringify(json)}`)
  }
  return json
}

export async function registerC2BUrls() {
  const token = await getAccessToken()
  const shortCode = ensureEnv('MPESA_SHORT_CODE')

  const res = await fetch(`${MPESA_BASE}/mpesa/c2b/v1/registerurl`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ShortCode: shortCode,
      ResponseType: 'Completed',
      ConfirmationURL: ensureEnv('MPESA_C2B_CONFIRMATION_URL'),
      ValidationURL: ensureEnv('MPESA_C2B_VALIDATION_URL'),
    }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`C2B register failed: ${res.status} ${JSON.stringify(json)}`)
  }
  return json
}







