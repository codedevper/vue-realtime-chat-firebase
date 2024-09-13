<template>
  <div class="chat-container">
    <h2>Room: {{ currentRoom }}</h2>

    <div class="messages">
      <div v-for="message in messages" :key="message.id">
        <strong>{{ message.username }}:</strong> {{ message.text }}
      </div>
    </div>
    <input v-model="newMessage" placeholder="Type a message" @keyup.enter="sendMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { database } from '@/lib/firebase'
import { onValue, ref as dbRef, push } from 'firebase/database'

const props = defineProps(['currentRoom'])
const messages = ref([])
const newMessage = ref('')
const username = 'User' + Math.floor(Math.random() * 1000) // Random username for demo

const messagesRef = dbRef(database, `chat-rooms/${props.currentRoom}/messages`)

watch(
  () => props.currentRoom,
  (newRoom) => {
    if (newRoom) {
      const messagesRef = dbRef(database, `chat-rooms/${newRoom}/messages`)
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          messages.value = Object.keys(data).map((key) => ({
            id: key,
            ...data[key]
          }))
        } else {
          messages.value = []
        }
      })
    }
  }
)

const sendMessage = async () => {
  if (newMessage.value.trim() !== '' && props.currentRoom) {
    const messagesRef = dbRef(database, `chat-rooms/${props.currentRoom}/messages`)
    await push(messagesRef, {
      username,
      text: newMessage.value,
      timestamp: Date.now()
    })
    newMessage.value = ''
  }
}

onMounted(() => {
  // Listen to real-time messages from Firebase
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      messages.value = Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      }))
    }
  })
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: auto;
}

.messages {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  height: 300px;
  overflow-y: auto;
}

input {
  padding: 10px;
  font-size: 16px;
}
</style>
