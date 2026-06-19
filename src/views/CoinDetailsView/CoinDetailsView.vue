<!--? РАЗМЕТКА -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/coins" />
        </ion-buttons>

        <ion-title>{{ coin?.symbol || "Coin" }}</ion-title>

        <ion-buttons v-if="coin" slot="end">
          <ion-button @click="favoritesStore.toggleFavorite(coin.documentId)">
            <ion-icon
              slot="icon-only"
              :icon="
                favoritesStore.isFavorite(coin.documentId) ? star : starOutline
              "
            />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-loading :is-open="coinsStore.loading" message="Loading coin..." />

      <section v-if="coin" class="detail">
        <div class="hero">
          <img v-if="logoUrl" :src="logoUrl" :alt="coin.name" />

          <div>
            <p>{{ coin.symbol }}</p>
            <h1>{{ coin.name }}</h1>
            <ion-badge>{{ coin.category }}</ion-badge>
          </div>
        </div>

        <section class="price-row">
          <div>
            <span>Price</span>
            <strong>{{ formattedPrice }}</strong>
          </div>

          <div>
            <span>24h</span>
            <strong
              :class="{
                positive: coin.priceChange24h >= 0,
                negative: coin.priceChange24h < 0,
              }"
            >
              {{ formattedChange }}
            </strong>
          </div>
        </section>

        <section>
          <h2>7 day price</h2>
          <div class="chart-wrap">
            <sparkline-chart
              :values="coin.sparkline"
              :positive="coin.priceChange24h >= 0"
            />
          </div>
        </section>

        <section>
          <h2>Description</h2>
          <p>{{ coin.description }}</p>
        </section>
      </section>

      <ion-text v-else-if="!coinsStore.loading">
        <p class="state-text">Coin not found</p>
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<!--? ЛОГИКА -->
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
// компоненти Ionic = создания интерфейса
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/vue";
import { star, starOutline } from "ionicons/icons";
// линия графика
import SparklineChart from "@/components/GraficLine/GraficLine.vue";
import { STRAPI_URL } from "@/services/api";
import { useCoinsStore } from "@/stores/coins";
import { useFavoritesStore } from "@/stores/favorites";

// роутер для получения параметров URL
const route = useRoute();
const coinsStore = useCoinsStore();
const favoritesStore = useFavoritesStore();

// получаем ID монеты из URL
const documentId = computed(() => String(route.params.documentId));

// находим нужную монету в общем списке по ID
const coin = computed(() => coinsStore.getCoinByDocumentId(documentId.value));

// формируем полный URL для отображения логотипа
const logoUrl = computed(() =>
  coin.value?.logo?.url ? `${STRAPI_URL}${coin.value.logo.url}` : "",
);

// форматируем цену в долларовый формат !с учетом количества знаков!
const formattedPrice = computed(() => {
  if (!coin.value) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: coin.value.currentPrice < 1 ? 6 : 2,
  }).format(coin.value.currentPrice);
});

// форматируем изменение цены в процентах с знаком + или -
const formattedChange = computed(() => {
  if (!coin.value) return "";
  const prefix = coin.value.priceChange24h >= 0 ? "+" : "";
  return `${prefix}${coin.value.priceChange24h.toFixed(2)}%`;
});

// хук жиз цикла загружаем данные, если их еще нет в кеше
onMounted(() => {
  if (!coinsStore.coins.length) {
    coinsStore.fetchCoins();
  }
});
</script>

<style scoped src="./CoinDetailsView.css"></style>
