import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native'
import { router } from 'expo-router'
import api from '../lib/api'
import { saveToken } from '../lib/storage'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      await saveToken(data.token)
      router.replace('/dashboard')
    } catch (err) {
      Alert.alert('Erro', 'Email ou senha incorretos')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={s.logo}>Cego Shirts</Text>
      <Text style={s.subtitle}>Painel administrativo</Text>

      <View style={s.form}>
        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor="#a0a0a0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={s.input}
          placeholder="Senha"
          placeholderTextColor="#a0a0a0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />
        <TouchableOpacity
          style={[s.btn, loading && s.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={s.btnText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', padding: 32,
  },
  logo: {
    fontSize: 22, fontWeight: '500',
    letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6,
  },
  subtitle: {
    fontSize: 13, color: '#a0a0a0', marginBottom: 40,
  },
  form: { width: '100%', gap: 12 },
  input: {
    width: '100%', height: 48,
    borderWidth: 0.5, borderColor: '#e0e0e0',
    borderRadius: 6, paddingHorizontal: 16,
    fontSize: 14, color: '#0a0a0a',
  },
  btn: {
    height: 48, backgroundColor: '#0a0a0a',
    borderRadius: 6, alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
})