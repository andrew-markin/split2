<template>
  <div class="block-container center">
    <slot></slot>
  </div>
</template>

<style scoped>
.block-container {
  width: 100%;
  margin: 0;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 950px) {
  .block-container {
    width: 900px;
  }
}
</style>
