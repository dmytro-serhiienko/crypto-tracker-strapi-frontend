<!--? РАЗМЕТКА -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Crypto Tracker</ion-title>
        <ion-buttons slot="end">
          <ion-button :disabled="coinsStore.syncing" @click="handleSync">
            <ion-icon slot="icon-only" :icon="refreshOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="coins-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <section class="controls">
        <ion-searchbar
          :value="coinsStore.search"
          :debounce="300"
          placeholder="Search coins"
          @ionInput="handleSearch"
        />

        <ion-segment :value="coinsStore.category" @ionChange="handleCategory">
          <ion-segment-button value="All"
            ><ion-label>All</ion-label></ion-segment-button
          >
          <ion-segment-button value="Layer1"
            ><ion-label>Layer1</ion-label></ion-segment-button
          >
          <ion-segment-button value="DeFi"
            ><ion-label>DeFi</ion-label></ion-segment-button
          >
          <ion-segment-button value="Meme"
            ><ion-label>Meme</ion-label></ion-segment-button
          >
          <ion-segment-button value="Stablecoin"
            ><ion-label>Stable</ion-label></ion-segment-button
          >
        </ion-segment>

        <ion-select
          label="Sort"
          interface="popover"
          :value="coinsStore.sort"
          @ionChange="handleSort"
        >
          <ion-select-option value="price-desc">Price high</ion-select-option>
          <ion-select-option value="price-asc">Price low</ion-select-option>
          <ion-select-option value="change-desc">Change high</ion-select-option>
          <ion-select-option value="change-asc">Change low</ion-select-option>
        </ion-select>
      </section>

      <ion-loading :is-open="coinsStore.loading" message="Loading coins..." />

      <ion-text v-if="coinsStore.error" color="danger">
        <p class="state-text">{{ coinsStore.error }}</p>
      </ion-text>

      <ion-text
        v-else-if="!coinsStore.loading && !coinsStore.visibleCoins.length"
      >
        <p class="state-text">No coins found</p>
      </ion-text>

      <coin-card
        v-for="coin in coinsStore.visibleCoins"
        :key="coin.documentId"
        :coin="coin"
        @open="openCoin"
      />

      <ion-infinite-scroll
        threshold="120px"
        :disabled="!coinsStore.hasMore"
        @ionInfinite="handleInfinite"
      >
        <ion-infinite-scroll-content loading-text="Loading more coins..." />
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<!--? ЛОГИКА -->
<script setup lang="ts">
import "./CoinsMainPage.css";
import { nextTick, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { refreshOutline } from "ionicons/icons";
import CoinCard from "@/components/CoinCardTrafaret/CoinCardTrafaret.vue";
import { useCoinsStore } from "@/stores/coins";
import type { Coin, CoinCategory, SortOption } from "@/types/coin";

// роутер и стора
const router = useRouter();

const coinsStore = useCoinsStore();

// при загрузке страницы проверяем наличие монет, если пусто — запрашиваем
onMounted(() => {
  if (!coinsStore.coins.length) coinsStore.fetchCoins();
});

// навигация к странице детализации монеты
function openCoin(coin: Coin) {
  router.push(`/coins/${coin.documentId}`);
}

// обработка ввода в поиск с сбросом пагинации
function handleSearch(event: CustomEvent) {
  coinsStore.search = String(event.detail.value || "");
  coinsStore.resetPagination();
}

// смена категории с сбросом пагинации
function handleCategory(event: CustomEvent) {
  coinsStore.category = event.detail.value as CoinCategory | "All";
  coinsStore.resetPagination();
}

// смена метода сортировки с сбросом пагинации
function handleSort(event: CustomEvent) {
  coinsStore.sort = event.detail.value as SortOption;
  coinsStore.resetPagination();
}

// синхронизация цен через API
async function handleSync() {
  await coinsStore.syncPrices();
}

// обновление цен при жесте "потянуть вниз"
async function handleRefresh(event: CustomEvent) {
  await coinsStore.syncPrices();
  (event.target as HTMLIonRefresherElement).complete();
}

// дозагрузка элементов при достижении низа страницы
async function handleInfinite(event: CustomEvent) {
  coinsStore.loadMore();
  // Ждем рендера перед завершением скролла
  await nextTick();
  (event.target as HTMLIonInfiniteScrollElement).complete();
}
</script>
