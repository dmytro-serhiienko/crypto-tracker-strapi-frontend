import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";
import AppTabBar from "../views/AppTabBar/AppTabBar.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: AppTabBar,
    children: [
      {
        path: "",
        redirect: "/coins",
      },
      {
        path: "coins",
        component: () => import("../views/CoinsMainPage/CoinsMainPage.vue"),
      },
      {
        path: "coins/:documentId",
        component: () => import("../views/CoinDetailsView/CoinDetailsView.vue"),
      },
      {
        path: "favorites",
        component: () => import("../views/FavoritesPage/FavoritesPage.vue"),
      },
      {
        path: "stats",
        component: () => import("../views/StatsPage/StatsPage.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
