import { createRouter, createWebHistory } from "@ionic/vue-router";
import type { RouteRecordRaw } from "vue-router";
import AppTabBar from "../views/AppTabBar/AppTabBar.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/coins",
  },
  {
    path: "/tabs",
    component: AppTabBar,
    children: [
      {
        path: "",
        redirect: "/coins",
      },
      {
        path: "coins",
        alias: "/coins",
        component: () => import("../views/CoinsMainPage/CoinsMainPage.vue"),
      },
      {
        path: "coins/:documentId",
        alias: "/coins/:documentId",
        component: () => import("../views/CoinDetailsView/CoinDetailsView.vue"),
      },
      {
        path: "favorites",
        alias: "/favorites",
        component: () => import("../views/FavoritesPage/FavoritesPage.vue"),
      },
      {
        path: "stats",
        alias: "/stats",
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
