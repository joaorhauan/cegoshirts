import AsyncStorage from '@react-native-async-storage/async-storage'


export const saveToken = (token) => AsyncStorage.setItem('token', token)
export const getToken = () => AsyncStorage.getItem('token')
export const removeToken = () => AsyncStorage.removeItem('token')
