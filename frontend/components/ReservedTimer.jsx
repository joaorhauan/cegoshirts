// frontend/components/ReservedTimer.jsx
'use client'
import { useEffect, useState } from 'react'

export default function ReservedTimer({ reservedUntil }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calc = () => {
      const diff = new Date(reservedUntil) - new Date()
      if (diff <= 0) {
        setTimeLeft('00:00')
        return
      }
      const mins = Math.floor(diff / 60000)
      const secs = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`)
    }

    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [reservedUntil])

  return (
    <div style={{
      border: '0.5px solid #ffe082',
      background: '#fff8e1',
      borderRadius: 6,
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: '#633806' }}>
        ⏱️ Peça reservada
      </p>
      <p style={{ fontSize: 13, color: '#8a5200', lineHeight: 1.5 }}>
        Alguém está finalizando a compra desta peça. Ela ficará disponível novamente em:
      </p>
      <p style={{ fontSize: 28, fontWeight: 500, color: '#0a0a0a', letterSpacing: '.04em' }}>
        {timeLeft}
      </p>
      <p style={{ fontSize: 11, color: '#a0a0a0' }}>
        Se o pagamento não for concluído, a peça volta ao estoque automaticamente.
      </p>
    </div>
  )
}