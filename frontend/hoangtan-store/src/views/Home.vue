<template>
  <div class="flex justify-center gap-2 mt-2">
    <router-link
      :to="{ name: 'byLetter', params: { letter } }"
      v-for="letter of letters"
      :key="letter"
    >
      {{ letter }}
    </router-link>
  </div>
  <!-- <div v-for="product in productArray" :key="product.name">
    {{ product.name }}
  </div> -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5 p-8">
    <div v-for="product in productArray" :key="product._id">
      <img :src="product.images[0].url" alt="product.name" />
      <div class="">
        <h3 class="py-2 font-semibold">{{ product.name }}</h3>
        <div>{{ product.description }}</div>
        <span>{{ product.price }} Đ </span>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import axios from "axios";
export default {
  name: "AppHome",
  setup() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const productArray = ref([]);
    console.log("productArray: ", productArray);

    onMounted(async () => {
      const { data } = await axios.get("/api/v1/products");
      productArray.value = data.products;
    });

    return {
      letters,
      productArray,
    };
  },
};
</script>

<style></style>
