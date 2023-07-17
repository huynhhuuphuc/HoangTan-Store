import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import DetailBike from "../views/DetailBike.vue";
import SearchBike from "../views/SearchBike.vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import GuestLayout from "../components/GuestLayout.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      {
        path: "/",
        name: "home",
        component: Home,
      },
      {
        path: "/by-detail/:detail?",
        name: "byDetail",
        component: DetailBike,
      },
      {
        path: "/by-name/:name?",
        name: "byName",
        component: SearchBike,
      },
      {
        path: "/letter/:letter?",
        name: "byLetter",
        component: DetailBike,
      },
    ],
  },
  {
    path: "/guest",
    component: GuestLayout,
    children: [],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
