
import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Image, Alert
} from 'react-native'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import api from '../lib/api'

export default function NewShirt() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (!result.canceled) setImage(result.assets[0])
  }

  const handleSave = async () => {
    if (!name || !price || !image) {
      Alert.alert('Atenção', 'Nome, preço e imagem são obrigatórios')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('image', {
        uri: image.uri,
        name: 'shirt.jpg',
        type: 'image/jpeg',
      })
      await api.post('/shirts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      router.back()
    } catch {
      Alert.alert('Erro', 'Não foi possível cadastrar a camisa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={s.title}>Nova camisa</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={s.form}>
        <TouchableOpacity style={s.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={s.imagePreview} />
          ) : (
            <Text style={s.imageText}>Toque para adicionar imagem</Text>
          )}
        </TouchableOpacity>

        <Text style={s.label}>Nome</Text>
        <TextInput
          style={s.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex: Essencial Preto"
          placeholderTextColor="#a0a0a0"
        />

        <Text style={s.label}>Descrição</Text>
        <TextInput
          style={[s.input, s.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Opcional"
          placeholderTextColor="#a0a0a0"
          multiline
        />

        <Text style={s.label}>Preço</Text>
        <TextInput
          style={s.input}
          value={price}
          onChangeText={setPrice}
          placeholder="89.90"
          placeholderTextColor="#a0a0a0"
          keyboardType="decimal-pad"
        />

        <TouchableOpacity
          style={[s.btn, loading && s.btnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={s.btnText}>
            {loading ? 'Cadastrando...' : 'Cadastrar camisa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    borderBottomWidth: 0.5, borderBottomColor: '#e8e8e8',
  },
  back: { fontSize: 14, color: '#555', width: 60 },
  title: { fontSize: 16, fontWeight: '500' },
  form: { padding: 24, gap: 6 },
  imagePicker: {
    width: '100%', aspectRatio: 1,
    backgroundColor: '#f5f5f5', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, overflow: 'hidden',
  },
  imagePreview: { width: '100%', height: '100%' },
  imageText: { fontSize: 13, color: '#a0a0a0' },
  label: {
    fontSize: 11, fontWeight: '500',
    letterSpacing: 1, textTransform: 'uppercase',
    color: '#555', marginBottom: 6, marginTop: 14,
  },
  input: {
    height: 48, borderWidth: 0.5, borderColor: '#e0e0e0',
    borderRadius: 6, paddingHorizontal: 14,
    fontSize: 14, color: '#0a0a0a',
  },
  textarea: { height: 90, paddingTop: 12, textAlignVertical: 'top' },
  btn: {
    height: 50, backgroundColor: '#0a0a0a',
    borderRadius: 6, alignItems: 'center',
    justifyContent: 'center', marginTop: 28,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
})