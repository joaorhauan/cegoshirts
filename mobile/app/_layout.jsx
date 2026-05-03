import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { getToken } from '../lib/storage'

export default function RootLayout() {
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken()
      if (token) router.replace('/dashboard')
    }
    checkToken()
  }, [])

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )
}