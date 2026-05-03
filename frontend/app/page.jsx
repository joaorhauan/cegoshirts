import './vitrine.css'
import Vitrine from '@/components/Vitrine'

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shirts`, {
    cache: 'no-store',
  })
  const shirts = await res.json()
  return <Vitrine shirts={shirts} />
}