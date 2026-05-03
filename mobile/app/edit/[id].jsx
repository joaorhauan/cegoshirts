
import { useEffect, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Switch, Alert, Image
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import api from '../../lib/api'

export default function EditShirt() {
  const { id } = useLocalSearchParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [soldout, setSoldout] = useState(false)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get(`/shirts/${id}`).then(({ data }) => {
      setName(data.name)
      setDescription(data.description || '')
      setPrice(String(data.price))
      setSoldout(data.soldout)
      setPreview(data.imageUrl)
    })
  }, [id])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (!result.canceled) {
      setImage(result.assets[0])
      setPreview(result.assets[0].uri)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('soldout', soldout)
      if (image) {
        formData.append('image', {
          uri: image.uri,
          name: 'shirt.jpg',
          type: 'image/jpeg',
        })
      }
      await api.put(`/shirts/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      router.back()
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a camisa')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert('Deletar', 'Tem certeza que deseja deletar essa camisa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar', style: 'destructive',
        onPress: async () => {
          await api.delete(`/shirts/${id}`)
          router.back()
        },
      },
    ])
  }

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={s.title}>Editar camisa</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={s.form}>
        <TouchableOpacity style={s.imagePicker} onPress={pickImage}>
          {preview ? (
            <Image source={{ uri: preview }} style={s.imagePreview} />
          ) : (
            <Text style={s.imageText}>Toque para trocar a imagem</Text>
          )}
        </TouchableOpacity>

        <Text style={s.label}>Nome</Text>
        <TextInput
          style={s.input}
          value={name}
          onChangeText={setName}
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
          keyboardType="decimal-pad"
          placeholderTextColor="#a0a0a0"
        />

        <View style={s.switchRow}>
          <Text style={s.switchLabel}>Marcar como esgotada</Text>
          <Switch
            value={soldout}
            onValueChange={setSoldout}
            trackColor={{ true: '#0a0a0a' }}
          />
        </View>

        <TouchableOpacity
          style={[s.btn, loading && s.btnDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={s.btnText}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnDelete} onPress={handleDelete}>
          <Text style={s.btnDeleteText}>Deletar camisa</Text>
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
  switchRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20, paddingVertical: 14,
    borderTopWidth: 0.5, borderBottomWidth: 0.5,
    borderColor: '#e8e8e8',
  },
  switchLabel: { fontSize: 14, color: '#0a0a0a' },
  btn: {
    height: 50, backgroundColor: '#0a0a0a',
    borderRadius: 6, alignItems: 'center',
    justifyContent: 'center', marginTop: 28,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  btnDelete: {
    height: 50, borderWidth: 0.5, borderColor: '#f0a0a0',
    borderRadius: 6, alignItems: 'center',
    justifyContent: 'center', marginTop: 12,
  },
  btnDeleteText: { color: '#c00', fontSize: 14 },
})