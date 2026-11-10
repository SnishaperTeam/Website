import { connect } from 'cloudflare:sockets'

const SMTP_HOST = 'smtp.qq.com'
const SMTP_PORT = 465
const decoder = new TextDecoder()
const encoder = new TextEncoder()

class SmtpError extends Error {}

async function readResponse(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<string> {
  let text = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    text += decoder.decode(value, { stream: true })
    const lines = text.split(/\r?\n/).filter(Boolean)
    const last = lines.at(-1)
    if (last && /^\d{3} /.test(last)) return text
  }
  throw new SmtpError('SMTP 连接中断')
}

function checkResponse(response: string, expected: number): void {
  const lines = response.split(/\r?\n/).filter(Boolean)
  const finalLine = lines.at(-1) ?? ''
  if (!finalLine.startsWith(`${expected} `)) throw new SmtpError(response.replace(/\r?\n/g, ' '))
}

async function command(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  writer: WritableStreamDefaultWriter<Uint8Array>,
  text: string,
  expected: number,
): Promise<string> {
  await writer.write(encoder.encode(`${text}\r\n`))
  const response = await readResponse(reader)
  checkResponse(response, expected)
  return response
}

function encodeBase64(value: string): string {
  return btoa(String.fromCharCode(...encoder.encode(value)))
}

function mime(value: string): string {
  return `=?UTF-8?B?${btoa(String.fromCharCode(...encoder.encode(value)))}?=`
}

export async function sendMail(from: string, password: string, to: string, subject: string, text: string): Promise<void> {
  const socket = connect(
    { hostname: SMTP_HOST, port: SMTP_PORT },
    { secureTransport: 'on', allowHalfOpen: false },
  )
  const reader = socket.readable.getReader()
  const writer = socket.writable.getWriter()

  try {
    await readResponse(reader)
    await command(reader, writer, 'EHLO jetcpp.ccwu.cc', 250)
    await command(reader, writer, `AUTH PLAIN ${encodeBase64(`\0${from}\0${password}`)}`, 235)
    await command(reader, writer, `MAIL FROM:<${from}>`, 250)
    await command(reader, writer, `RCPT TO:<${to}>`, 250)
    await command(reader, writer, 'DATA', 354)

    const body = [
      `From: SnishaperTeam <${from}>`,
      `To: ${to}`,
      `Subject: ${mime(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      ...text.split('\n').map((line) => (line.startsWith('.') ? `.${line}` : line)),
    ].join('\r\n')
    await writer.write(encoder.encode(`${body}\r\n.\r\n`))
    await readResponse(reader).then((response) => checkResponse(response, 250))
    await command(reader, writer, 'QUIT', 221)
  } finally {
    reader.releaseLock()
    writer.releaseLock()
    socket.close()
  }
}
