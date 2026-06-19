<!--? РАЗМЕТКА -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Favorites</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-text v-if="!favoriteCoins.length">
        <p class="state-text">No favorite coins yet</p>
      </ion-text>

      <ion-list v-else>
        <ion-item-sliding v-for="coin in favoriteCoins" :key="coin.documentId">
          <coin-card :coin="coin" @open="openCoin" />

          <ion-item-options side="end">
            <ion-item-option
              color="danger"
              @click="favoritesStore.removeFavorite(coin.documentId)"
            >
              Remove
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<!--? ЛОГИКА -->
<script setup lang="ts">
import "./FavoritesPage.css";
// импорт хуков / вычислений и жиз цикла
import { computed, onMounted } from "vue";
// импорт хука роутера для навигации между страницами
import { useRouter } from "vue-router";
// импорт компонентов интерфейса Ionic
import {
  IonContent,
  IonHeader,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
// импорт карточки и хранилищ данных => Stores
import CoinCard from "@/components/CoinCardTrafaret/CoinCardTrafaret.vue";
import { useCoinsStore } from "@/stores/coins";
import { useFavoritesStore } from "@/stores/favorites";
// импорт типа данных монеты
import type { Coin } from "@/types/coin";

// роутер для переходов между страницами
const router = useRouter();
// хранилище всех монет
const coinsStore = useCoinsStore();
// хранилище избранного
const favoritesStore = useFavoritesStore();

// вычисляем массив избранных монет: фильтруем общий список, оставляя те, что есть в favoritesStore
const favoriteCoins = computed(() =>
  coinsStore.coins.filter((coin) => favoritesStore.isFavorite(coin.documentId)),
);

// хук жиз цикла выполняется сразу после появления компонента на экране
onMounted(() => {
  // проверка = если стора пустая, запускаем загрузку данных с сервера
  if (!coinsStore.coins.length) {
    coinsStore.fetchCoins();
  }
});

// функ для перехода на страницу деталей конкретной монеты
function openCoin(coin: Coin) {
  router.push(`/tabs/coins/${coin.documentId}`);
}
</script>
