import { ref, set, remove, onValue } from 'firebase/database'
import { database } from '@/lib/firebase'

// Create a reference to the typing indicators in the database
const typingRef = (roomId) => ref(database, `typing/${roomId}`)

// Set a user as typing
const startTyping = (roomId, userId) => {
  const userTypingRef = ref(database, `typing/${roomId}/${userId}`)

  // Set the user's typing status to true
  set(userTypingRef, true)
}

// Remove a user's typing status
const stopTyping = (roomId, userId) => {
  const userTypingRef = ref(database, `typing/${roomId}/${userId}`)

  // Remove the user's typing status
  remove(userTypingRef)
}

// Subscribe to typing status updates
const subscribeToTyping = (roomId, callback) => {
  const ref = typingRef(roomId)

  onValue(ref, (snapshot) => {
    const typingData = snapshot.val() || {}
    callback(typingData)
  })
}

export { startTyping, stopTyping, subscribeToTyping }
