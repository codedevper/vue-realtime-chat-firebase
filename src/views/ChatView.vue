<template>
  <div v-if="user">
    <p>Welcome, {{ user.displayName }}</p>
    <button @click="logoutUser">Logout</button>

    <MessageList :messages="messages" />

    <div v-if="typingUsers.length">
      <p>Someone is typing...</p>
    </div>

    <MessageInput
      @sendMessage="handleSendMessage"
      @startTyping="handleStartTyping"
      @stopTyping="handleStopTyping"
    />

    <div>
      <h3>Online Users:</h3>
      <ul>
        <li v-for="(online, userId) in onlineUsers" :key="userId">
          {{ userId }}
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <button @click="loginUser">Login with Google</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { login, logout } from '@/services/AuthService'
import { sendMessage, subscribeToMessages } from '@/services/RealtimeChatService'
import { startTyping, stopTyping, subscribeToTyping } from '@/services/RealtimeTypingService'
import { setOnline, setOffline, subscribeToPresence } from '@/services/PresenceService'

import MessageList from '@/components/MessageList.vue'
import MessageInput from '@/components/MessageInput.vue'

const user = ref(null)
const messages = ref([])
const typingUsers = ref([])
const onlineUsers = ref({})

const roomId = 'room1' // Example chat room ID

const loginUser = async () => {
  user.value = await login()
  if (user.value) {
    setOnline(user.value.uid) // Set user as online
  }
}

const logoutUser = async () => {
  if (user.value) {
    setOffline(user.value.uid) // Set user as offline
    await logout()
  }
  user.value = null
}

const handleSendMessage = async (messageText) => {
  if (user.value) {
    await sendMessage(user.value.uid, messageText)
  }
}

const handleStartTyping = () => {
  if (user.value) {
    startTyping(roomId, user.value.uid)
  }
}

const handleStopTyping = () => {
  if (user.value) {
    stopTyping(roomId, user.value.uid)
  }
}

onMounted(() => {
  subscribeToMessages((newMessages) => {
    messages.value = newMessages
  })

  subscribeToTyping(roomId, (typingData) => {
    typingUsers.value = Object.keys(typingData)
  })

  subscribeToPresence((presenceData) => {
    onlineUsers.value = presenceData
  })
})

onUnmounted(() => {
  if (user.value) {
    setOffline(user.value.uid) // Ensure user is set offline when component unmounts
  }
})
</script>

<style scoped>
/* Basic styles for the chat room */
</style>
