import { ref, push, onValue } from 'firebase/database'
import { database } from '@/lib/firebase'

const messagesRef = ref(database, 'chatMessages') // Reference to the 'chatMessages' node in the Realtime Database

// Send a message
const sendMessage = async (userId, messageText) => {
  try {
    await push(messagesRef, {
      userId,
      messageText,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

// Subscribe to messages (real-time updates)
const subscribeToMessages = (callback) => {
  onValue(messagesRef, (snapshot) => {
    const messages = []
    snapshot.forEach((childSnapshot) => {
      messages.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      })
    })
    callback(messages)
  })
}

export { sendMessage, subscribeToMessages }
