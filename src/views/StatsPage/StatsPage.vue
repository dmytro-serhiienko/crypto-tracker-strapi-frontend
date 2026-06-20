<!--? РАЗМЕТКА -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Stats</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <section class="stats">
        <div>
          <span>Total coins</span>
          <strong>{{ coinsStore.coins.length }}</strong>
        </div>
        <div>
          <span>Favorites</span>
          <strong>{{ favoritesStore.count }}</strong>
        </div>
        <div>
          <span>Top gainer</span>
          <strong>{{ topGainer?.symbol || "-" }}</strong>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<!--? ЛОГИКА -->
<script setup lang="ts">
import "./StatsPage.css";
import { computed } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { useEnsureCoinsLoaded } from "@/composables/useEnsureCoinsLoaded";
import { useCoinsStore } from "@/stores/coins";
import { useFavoritesStore } from "@/stores/favorites";

const coinsStore = useCoinsStore();
const favoritesStore = useFavoritesStore();
useEnsureCoinsLoaded();

const topGainer = computed(() =>
  [...coinsStore.coins]
    .sort((a, b) => b.priceChange24h - a.priceChange24h)
    .at(0),
);
</script>
