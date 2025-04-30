<script setup lang="ts">
const date = shallowRef<string>('1999-10-01');
</script>

<template>
  <div>
    <DateInput v-model="date" />

    <div>
      v-bind value: {{ date }}
    </div>
  </div>
</template>
