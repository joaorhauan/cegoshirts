// frontend/tests/ShirtCard.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ShirtCard from '../components/ShirtCard'

const mockShirt = {
  id: 1,
  name: 'Essencial Preto',
  price: 89.90,
  imageUrl: 'https://res.cloudinary.com/test.jpg',
  status: 'available',
  size: 'M',
  babylook: false,
  soldout: false,
}

describe('ShirtCard', () => {
  it('deve renderizar o nome da camisa', () => {
    render(<ShirtCard shirt={mockShirt} />)
    expect(screen.getByText('Essencial Preto')).toBeInTheDocument()
  })

  it('deve renderizar o preço formatado', () => {
    render(<ShirtCard shirt={mockShirt} />)
    expect(screen.getByText(/R\$\s*89[,.]90/i)).toBeInTheDocument()
  })

  it('deve mostrar badge esgotada quando soldout', () => {
    render(<ShirtCard shirt={{ ...mockShirt, status: 'soldout' }} />)
    expect(screen.getByText('Esgotada')).toBeInTheDocument()
  })

  it('deve mostrar badge babylook com tamanho', () => {
    render(<ShirtCard shirt={{ ...mockShirt, babylook: true }} />)
    expect(screen.getByText('BBYL M')).toBeInTheDocument()
  })
})