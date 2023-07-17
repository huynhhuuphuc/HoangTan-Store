<template>
  <header class="bg-white shadow h-16 flex justify-between items-stretch">
    <router-link
      :to="{ name: 'home' }"
      class="inline-flex items-center h-full px-5"
      >Home</router-link
    >
    <div class="flex items-center gap-1">
      <router-link
        :to="{ name: 'byName' }"
        class="inline-flex items-center transition-colors px-2 h-full hover:bg-purple-100"
      >
        Tim xe
      </router-link>
      <router-link
        :to="{ name: 'byDetail' }"
        class="inline-flex items-center transition-colors px-2 h-full hover:bg-purple-100"
      >
        Tim chi tiet xe
      </router-link>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppNavbar",
};
</script>

<style></style>
