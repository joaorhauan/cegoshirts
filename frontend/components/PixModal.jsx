
'use client'
import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

function generatePixPayload({ key, name, city, value }) {
  const clean = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 25)
  const fmt = (id, value) => `${id}${value.length.toString().padStart(2, '0')}${value}`
  const gui = fmt('00', 'BR.GOV.BCB.PIX') + fmt('01', key)
  const merchantAccount = fmt('26', gui)
  const amount = fmt('54', value.toFixed(2))
  const additionalData = fmt('62', fmt('05', '***'))
  const payload =
    fmt('00', '01') + merchantAccount + fmt('52', '0000') +
    fmt('53', '986') + amount + fmt('58', 'BR') +
    fmt('59', clean(name)) + fmt('60', clean(city)) +
    additionalData + '6304'
  const crc = (str) => {
    let crc = 0xffff
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8
      for (let j = 0; j < 8; j++) crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
    return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
  }
  return payload + crc(payload)
}

export default function PixModal({ shirt, onClose }) {
  const [step, setStep] = useState('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)

  const pixPayload = generatePixPayload({
    key: process.env.NEXT_PUBLIC_PIX_KEY,
    name: process.env.NEXT_PUBLIC_PIX_NAME,
    city: process.env.NEXT_PUBLIC_PIX_CITY,
    value: shirt.price,
  })

  const whatsappMsg = encodeURIComponent(
    `Olá! Efetuei o pagamento via Pix da camisa *${shirt.name}* (ref: #${shirt.id}) por R$ ${shirt.price.toFixed(2)}.\n\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone}`
  )

  const handleGenerate = () => {
    if (!name || !email || !phone) return
    setStep('qr')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendReceipt = async () => {
  window.open(
    `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMERO}?text=${whatsappMsg}`,
    '_blank'
  )

  try {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shirtId: shirt.id,
        name,
        email,
        phone,
      }),
    })

    console.log('resposta:', res.status)
  } catch (err) {
    console.error('erro ao notificar:', err)
  }
}

  const inputStyle = {
    width: '100%', height: 44, border: '0.5px solid #e0e0e0',
    borderRadius: 6, paddingInline: 14, fontSize: 14,
    color: '#0a0a0a', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    fontSize: 11, fontWeight: 500, letterSpacing: '.08em',
    textTransform: 'uppercase', color: '#555',
    display: 'block', marginBottom: 6,
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff', borderRadius: 12, padding: 32,
          width: '100%', maxWidth: 400,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'form' ? (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Pagar via Pix</h2>
            <p style={{ fontSize: 13, color: '#a0a0a0', marginBottom: 24 }}>
              {shirt.name} — R$ {shirt.price.toFixed(2)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Nome</label>
                <input style={inputStyle} placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input style={inputStyle} type="tel" placeholder="(84) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <button
              style={{ width: '100%', height: 44, background: '#0a0a0a', color: '#fff', borderRadius: 6, fontSize: 14, fontWeight: 500, border: 'none', cursor: 'pointer', marginTop: 20 }}
              onClick={handleGenerate}
            >
              Gerar QR Code
            </button>
            <button
              style={{ width: '100%', height: 44, background: 'transparent', color: '#a0a0a0', border: 'none', cursor: 'pointer', fontSize: 13, marginTop: 8 }}
              onClick={onClose}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Escaneie o QR Code</h2>
            <p style={{ fontSize: 13, color: '#a0a0a0', marginBottom: 20 }}>
              {shirt.name} — <strong style={{ color: '#0a0a0a' }}>R$ {shirt.price.toFixed(2)}</strong>
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <QRCodeCanvas value={pixPayload} size={200} />
            </div>

            <button
              style={{
                width: '100%', height: 44,
                background: copied ? '#f0faf4' : '#f5f5f5',
                color: copied ? '#1a7a3a' : '#0a0a0a',
                border: `0.5px solid ${copied ? '#b6e8c8' : '#e0e0e0'}`,
                borderRadius: 6, fontSize: 13, cursor: 'pointer',
                marginBottom: 10, transition: 'all .2s',
              }}
              onClick={handleCopy}
            >
              {copied ? '✓ Copiado!' : 'Copiar código Pix'}
            </button>

            <button
              style={{
                width: '100%', height: 44, background: '#0a0a0a',
                color: '#fff', borderRadius: 6, fontSize: 13,
                fontWeight: 500, border: 'none', cursor: 'pointer',
                opacity: sending ? 0.6 : 1,
              }}
              onClick={handleSendReceipt}
              disabled={sending}
            >
              {sending ? 'Abrindo...' : 'Enviar comprovante no WhatsApp'}
            </button>

            <p style={{ fontSize: 11, color: '#a0a0a0', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
              Após o pagamento, envie o comprovante pelo WhatsApp para confirmar seu pedido.
            </p>
          </>
        )}
      </div>
    </div>
  )
}