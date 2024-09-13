import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

const provider = new GoogleAuthProvider()

const login = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (error) {
    console.error('Login error:', error)
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export { login, logout }
