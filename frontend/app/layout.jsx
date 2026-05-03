import { Geist } from 'next/font/google'
import './globals.css'


const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Cego Shirts',
  description: 'Camisas disponíveis para compra',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={geist.className}>{children}</body>
    </html>
  )
}