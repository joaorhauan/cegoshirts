// backend/tests/pix.test.js
import { describe, it, expect, vi } from 'vitest'
// função copiada do frontend para testar isolada
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

describe('generatePixPayload', () => {
  it('deve gerar um payload válido', () => {
    const payload = generatePixPayload({
      key: '70886151422',
      name: 'Rhauan',
      city: 'Natal',
      value: 89.90,
    })

    expect(payload).toContain('BR.GOV.BCB.PIX')
    expect(payload).toContain('89.90')
    expect(payload.length).toBeGreaterThan(50)
  })

  it('deve ter CRC de 4 caracteres no final', () => {
    const payload = generatePixPayload({
      key: '70886151422',
      name: 'Rhauan',
      city: 'Natal',
      value: 50.00,
    })

    const crc = payload.slice(-4)
    expect(crc).toMatch(/^[0-9A-F]{4}$/)
  })

  it('deve aceitar valores decimais', () => {
    const payload = generatePixPayload({
      key: '70886151422',
      name: 'Rhauan',
      city: 'Natal',
      value: 129.99,
    })

    expect(payload).toContain('129.99')
  })
})