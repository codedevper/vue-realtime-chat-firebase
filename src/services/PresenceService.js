import { ref, set, remove, onDisconnect, onValue } from 'firebase/database'
import { database } from '@/lib/firebase'

// Reference to the presence node in the database
const presenceRef = (userId) => ref(database, `presence/${userId}`)

// Function to set a user's presence status to online
const setOnline = (userId) => {
  const userPresenceRef = presenceRef(userId)

  // Set the user status to online when connected
  set(userPresenceRef, true)

  // Remove the user status when they disconnect
  onDisconnect(userPresenceRef).remove()
}

// Function to set a user's presence status to offline
const setOffline = (userId) => {
  const userPresenceRef = presenceRef(userId)

  // Remove the user's presence status
  remove(userPresenceRef)
}

// Function to subscribe to user presence changes
const subscribeToPresence = (callback) => {
  const presenceNode = ref(database, 'presence')

  onValue(presenceNode, (snapshot) => {
    const presenceData = snapshot.val() || {}
    callback(presenceData)
  })
}

export { setOnline, setOffline, subscribeToPresence }
