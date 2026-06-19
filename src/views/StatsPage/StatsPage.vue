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
import { computed, onMounted } from "vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { useCoinsStore } from "@/stores/coins";
import { useFavoritesStore } from "@/stores/favorites";

// ФУНКЦИИ
// доступ к сторе монет => данные о ценах, списки
const coinsStore = useCoinsStore();

// доступ к сторе избранных монет
const favoritesStore = useFavoritesStore();

// нахождение лидера роста
const topGainer = computed(() =>
  // Создаем копию массива монет (не изменяет оригинал), сортируем от наибольшего прироста к наименьшему => берет первую монету
  [...coinsStore.coins]
    .sort((a, b) => b.priceChange24h - a.priceChange24h)
    .at(0),
);

// Хук жиз цикла выполняется сразу после монтирования компонента на экран
onMounted(() => {
  // проверка если стора пустая => запускаем процесс загрузки данных
  if (!coinsStore.coins.length) {
    coinsStore.fetchCoins();
  }
});
</script>
