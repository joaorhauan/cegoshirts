import { Geist } from 'next/font/google'
import { Bebas_Neue } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })
const bebas = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas'
})

export const metadata = {
  title: 'Cego Shirts',
  description: 'Camisas disponíveis para compra',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={bebas.variable}>
      <body className={geist.className}>{children}</body>
    </html>
  )
}