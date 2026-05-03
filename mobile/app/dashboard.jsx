import { useState, useCallback } from 'react'
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, RefreshControl, Alert
} from 'react-native'
import { router, useFocusEffect } from 'expo-router'
import api from '../lib/api'
import { removeToken } from '../lib/storage'

export default function Dashboard() {
  const [shirts, setShirts] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    try {
      const { data } = await api.get('/clicks')
      setShirts(data)
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar as camisas')
    }
  }

  useFocusEffect(
    useCallback(() => {
      load()
    }, [])
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }, [])

  const handleSignOut = async () => {
    await removeToken()
    router.replace('/')
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.item}
      onPress={() => router.push(`/edit/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={s.thumb} />
      <View style={s.itemInfo}>
        <Text style={s.itemName}>{item.name}</Text>
        <Text style={s.itemClicks}>{item.totalClicks} cliques</Text>
        <View style={[s.badge, item.soldout && s.badgeSoldOut]}>
          <Text style={[s.badgeText, item.soldout && s.badgeTextSoldOut]}>
            {item.soldout ? 'Esgotada' : 'Disponível'}
          </Text>
        </View>
      </View>
      <Text style={s.arrow}>›</Text>
    </TouchableOpacity>
  )

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Cego Shirts</Text>
        <View style={s.headerActions}>
          <TouchableOpacity
            style={s.btnNew}
            onPress={() => router.push('/new--shirt')}
          >
            <Text style={s.btnNewText}>+ Nova</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={s.signOutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={shirts}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ItemSeparatorComponent={() => <View style={s.separator} />}
        ListEmptyComponent={
          <Text style={s.empty}>Nenhuma camisa cadastrada</Text>
        }
      />
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
  headerTitle: { fontSize: 18, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btnNew: {
    backgroundColor: '#0a0a0a', borderRadius: 6,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  btnNewText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  signOutText: { fontSize: 13, color: '#a0a0a0' },
  item: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, gap: 14,
  },
  thumb: {
    width: 56, height: 56, borderRadius: 6,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 14, fontWeight: '500', color: '#0a0a0a' },
  itemClicks: { fontSize: 13, color: '#a0a0a0' },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 999, borderWidth: 0.5,
    borderColor: '#b6e8c8', backgroundColor: '#f0faf4',
  },
  badgeSoldOut: { borderColor: '#e8e8e8', backgroundColor: '#f5f5f5' },
  badgeText: { fontSize: 11, color: '#1a7a3a' },
  badgeTextSoldOut: { color: '#a0a0a0' },
  arrow: { fontSize: 20, color: '#d0d0d0' },
  separator: { height: 0.5, backgroundColor: '#e8e8e8', marginLeft: 90 },
  empty: { textAlign: 'center', color: '#a0a0a0', marginTop: 60, fontSize: 14 },
})