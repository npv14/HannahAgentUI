const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

export async function sendMessage(payload) {
  const response = await fetch(`${apiBaseUrl}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('Failed to fetch chat response')
  }

  return response.json()
}

export async function streamMessage(payload, onChunk) {
  const response = await fetch(`${apiBaseUrl}/api/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok || !response.body) {
    throw new Error('Failed to stream chat response')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let done = false

  while (!done) {
    const { value, done: doneReading } = await reader.read()
    done = doneReading
    if (value) {
      const chunk = decoder.decode(value, { stream: !done })
      onChunk(chunk)
    }
  }
}
