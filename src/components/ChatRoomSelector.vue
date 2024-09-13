<template>
  <div class="chat-room-selector">
    <div>
      <label for="new-room">Create New Room</label>
      <input
        id="new-room"
        v-model="newRoom"
        placeholder="Enter room name"
        @keyup.enter="createRoom"
      />
      <button @click="createRoom">Create</button>
    </div>

    <div class="rooms">
      <h3>Available Rooms:</h3>
      <ul>
        <li v-for="room in rooms" :key="room.id" @click="selectRoom(room.id)">
          {{ room.id }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { database } from '@/lib/firebase'
import { ref as dbRef, set, onValue } from 'firebase/database'

const rooms = ref([])
const newRoom = ref('')
const chatRoomsRef = dbRef(database, 'chat-rooms')

const createRoom = () => {
  if (newRoom.value.trim() !== '') {
    set(dbRef(database, `chat-rooms/${newRoom.value}`), { createdAt: Date.now() })
    newRoom.value = ''
  }
}

onMounted(() => {
  // Fetch available rooms
  onValue(chatRoomsRef, (snapshot) => {
    const data = snapshot.val()
    rooms.value = data ? Object.keys(data).map((key) => ({ id: key })) : []
  })
})

const emit = defineEmits(['room-selected'])

const selectRoom = (roomId) => {
  emit('room-selected', roomId)
}
</script>

<style scoped>
.rooms {
  margin-top: 20px;
}

ul {
  list-style-type: none;
}

li {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  margin-bottom: 5px;
  background-color: #f9f9f9;
}

li:hover {
  background-color: #e0e0e0;
}
</style>
