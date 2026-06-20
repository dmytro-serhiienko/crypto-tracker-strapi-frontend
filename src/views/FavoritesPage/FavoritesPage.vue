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
import { computed } from "vue";
import { useRouter } from "vue-router";
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
import CoinCard from "@/components/CoinCardTrafaret/CoinCardTrafaret.vue";
import { useEnsureCoinsLoaded } from "@/composables/useEnsureCoinsLoaded";
import { useCoinsStore } from "@/stores/coins";
import { useFavoritesStore } from "@/stores/favorites";
import type { Coin } from "@/types/coin";

const router = useRouter();
const coinsStore = useCoinsStore();
const favoritesStore = useFavoritesStore();
useEnsureCoinsLoaded();

const favoriteCoins = computed(() =>
  coinsStore.coins.filter((coin) => favoritesStore.isFavorite(coin.documentId)),
);

function openCoin(coin: Coin) {
  router.push(`/coins/${coin.documentId}`);
}
</script>
