<!--? РАЗМЕТКА -->
<template>
  <div id="container">
    <strong>{{ name }}</strong>
    <p>
      Explore
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://ionicframework.com/docs/components"
        >UI Components</a
      >
    </p>
  </div>
</template>

<script setup lang="ts">
// описание интерфейса пропсов для типизации
interface Props {
  // name — необязательный
  name?: string;
}

// определение пропсов для компонента
defineProps<Props>();
</script>

<style scoped src="./ExploreContainer.css"></style>
