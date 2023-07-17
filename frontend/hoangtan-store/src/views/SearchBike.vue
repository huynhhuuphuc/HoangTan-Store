<template>
  <div class="p-8">
    <form @submit="detailsBikes" class="flex justify-center">
      <input
        placeholder="Tìm tên xe"
        type="text"
        v-model="keyword"
        class="rounded border-2 border-gray-200 w-72"
      />
      <input
        type="submit"
        value="Tìm Kiếm"
        class="p-4 ml-2 bg-blue-500 rounded cursor-pointer text-white hover:bg-blue-400"
      />
    </form>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-8">
      <div v-for="bike of bikesDetails" :key="bike._id">
        <img :src="bike.images[0].url" alt="bike.name" />
        <div class="">
          <h3 class="py-2 font-semibold">{{ bike.name }}</h3>
          <div>{{ bike.description }}</div>
          <span>{{ bike.price }} Đ </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import store from "../store";
export default {
  setup() {
    const keyword = ref("");
    const bikesDetails = computed(() => store.state.searchedBikes);

    const detailsBikes = (event) => {
      event.preventDefault();
      store.dispatch("searchBikes", keyword.value);
    };

    return {
      keyword,
      bikesDetails,
      detailsBikes,
    };
  },
};
</script>

<style></style>
