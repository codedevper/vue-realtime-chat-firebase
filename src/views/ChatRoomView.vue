<template>
  <div>
    <ChatRoomSelector @room-selected="setRoom" />
    <ChatRoom v-if="currentRoom" :currentRoom="currentRoom" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChatRoomSelector from '@/components/ChatRoomSelector.vue'
import ChatRoom from '@/components/ChatRoom.vue'

const currentRoom = ref('')

const setRoom = (roomId) => {
  currentRoom.value = roomId
}
</script>
