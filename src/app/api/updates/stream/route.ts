import { NextRequest } from 'next/server'

type Client = { id: number; controller: ReadableStreamDefaultController<Uint8Array> }
const encoder = new TextEncoder()

// Global registry of SSE clients
const globalAny = global as any
if (!globalAny.__SSE_CLIENTS__) {
  globalAny.__SSE_CLIENTS__ = new Set<Client>()
  globalAny.__SSE_NEXT_ID__ = 1
}

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const id: number = globalAny.__SSE_NEXT_ID__++
      const client: Client = { id, controller }
      globalAny.__SSE_CLIENTS__.add(client)

      // Initial hello
      controller.enqueue(encoder.encode(`event: message\n`))
      controller.enqueue(encoder.encode(`data: {"channel":"connected"}\n\n`))

      // Keep-alive pings
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`))
        } catch {
          // ignore
        }
      }, 30000)

      // Cleanup on cancel/close
      ;(controller as any).closed = false
      const close = () => {
        clearInterval(interval)
        globalAny.__SSE_CLIENTS__.delete(client)
        try { controller.close() } catch {}
      }

      // Patch to support manual close on errors
      ;(controller as any).closeClient = close
    },
    cancel() {
      // Will be removed in notify when enqueue fails
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export function broadcastEvent(payload: any) {
  const encoder = new TextEncoder()
  const clients: Set<Client> = (global as any).__SSE_CLIENTS__
  for (const client of Array.from(clients)) {
    try {
      client.controller.enqueue(encoder.encode(`event: message\n`))
      client.controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
    } catch {
      // drop dead client
      try { (client.controller as any).closeClient?.() } catch {}
      clients.delete(client)
    }
  }
}


