<template>
  <div class="message-list">
    <div v-for="message in messages" :key="message.id" class="message-item">
      <p>
        <strong>{{ message.userId }}</strong
        >: {{ message.messageText }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.message-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background-color: #f1f1f1;
}

.message-item {
  margin-bottom: 10px;
  padding: 5px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
