import './vitrine.css'
import api from '@/lib/api'
import Vitrine from '@/components/Vitrine'

export default async function Page() {
  const { data: shirts } = await api.get('/shirts')
  return <Vitrine shirts={shirts} />
}