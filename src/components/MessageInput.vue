<template>
  <div class="message-input">
    <input
      v-model="messageText"
      @input="startTyping"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const messageText = ref('')
const emit = defineEmits(['sendMessage', 'startTyping', 'stopTyping'])

const sendMessage = () => {
  if (messageText.value.trim() !== '') {
    emit('sendMessage', messageText.value) // Emit message to parent
    messageText.value = '' // Clear the input
    emit('stopTyping') // Emit stopTyping event
  }
}

const startTyping = () => {
  emit('startTyping') // Emit startTyping event when typing
}

// Optional: stop typing event after a delay
let typingTimeout
const handleTyping = () => {
  clearTimeout(typingTimeout)
  startTyping()
  typingTimeout = setTimeout(() => {
    emit('stopTyping')
  }, 1000)
}

// Watch for changes in messageText to handle typing status
watch(messageText, (newVal) => {
  if (newVal === '') {
    handleTyping()
  }
})
</script>

<style scoped>
.message-input {
  padding: 10px;
  background-color: #fff;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
