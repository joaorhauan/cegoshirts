import Cookies from 'js-cookie'


export const saveToken = (token) => Cookies.set('token', token, { expires: 7 })
export const getToken = () => Cookies.get('token')
export const removeToken = () => Cookies.remove('token')
export const isLoggedIn = () => !!Cookies.get('token')