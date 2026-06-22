<!--? РАЗМЕТКА -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="markets-toolbar">
        <div class="markets-header">
          <div>
            <p class="markets-subtitle">Overview</p>
            <h1 class="markets-title">Markets</h1>
          </div>
          <button
            class="refresh-circle"
            :disabled="coinsStore.syncing"
            @click="coinsStore.syncPrices()"
          >
            <ion-icon :icon="refreshOutline" />
          </button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="markets-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <!-- Market summary card -->
      <div class="market-summary">
        <div class="summary-col">
          <p class="summary-label">TOTAL MARKET CAP</p>
          <p class="summary-value">$2.41T</p>
          <p class="summary-change positive">▲ 2.4% today</p>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-col">
          <p class="summary-label">24H VOLUME</p>
          <p class="summary-value">$98.6B</p>
          <p class="summary-change negative">▼ 0.9%</p>
        </div>
      </div>

      <!-- Search -->
      <ion-searchbar
        :value="searchQuery"
        :debounce="300"
        placeholder="Search coins"
        @ionInput="
          (e: CustomEvent) => (searchQuery = String(e.detail.value || ''))
        "
        class="markets-search"
      />

      <!-- Category filters -->
      <ion-segment
        :value="selectedCategory"
        @ionChange="(e: CustomEvent) => (selectedCategory = e.detail.value)"
        class="markets-segment"
      >
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

      <!-- Top Movers -->
      <div class="section-header">
        <h3 class="section-title">Top Movers</h3>
        <span class="section-link">See all</span>
      </div>

      <div class="movers-row">
        <div
          v-for="coin in topMovers"
          :key="coin.documentId"
          class="mover-card"
          @click="openCoin(coin)"
        >
          <div
            class="mover-logo"
            :style="{ background: logoGradient(coin.category) }"
          >
            <img
              v-if="getLogoUrl(coin)"
              :src="getLogoUrl(coin)"
              :alt="coin.name"
            />
            <span v-else>{{ coin.symbol.slice(0, 2).toUpperCase() }}</span>
          </div>
          <div class="mover-symbol">{{ coin.symbol.toUpperCase() }}</div>
          <div class="mover-price">{{ formatPrice(coin.currentPrice) }}</div>
          <div
            class="mover-chip"
            :class="
              coin.priceChange24h >= 0 ? 'chip-positive' : 'chip-negative'
            "
          >
            {{ coin.priceChange24h >= 0 ? "+" : ""
            }}{{ coin.priceChange24h.toFixed(2) }}%
          </div>
        </div>
      </div>

      <!-- All Coins -->
      <div class="section-header" style="margin-top: 8px">
        <h3 class="section-title">All Coins</h3>
        <ion-select
          interface="popover"
          :value="sortBy"
          @ionChange="(e: CustomEvent) => (sortBy = e.detail.value)"
          class="sort-inline"
        >
          <ion-select-option value="price-desc">Price · High</ion-select-option>
          <ion-select-option value="price-asc">Price · Low</ion-select-option>
          <ion-select-option value="change-desc">Top Gainers</ion-select-option>
          <ion-select-option value="change-asc">Top Losers</ion-select-option>
        </ion-select>
      </div>

      <coin-card
        v-for="coin in filteredCoins"
        :key="coin.documentId"
        :coin="coin"
        @open="openCoin"
      />

      <div
        v-if="!filteredCoins.length && !coinsStore.loading"
        class="empty-state"
      >
        No coins found
      </div>
    </ion-content>
  </ion-page>
</template>

<!--? ЛОГИКА -->
<script setup lang="ts">
import "./StatsPage.css";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonToolbar,
} from "@ionic/vue";
import { refreshOutline } from "ionicons/icons";
import { useEnsureCoinsLoaded } from "@/composables/useEnsureCoinsLoaded";
import { useCoinsStore } from "@/stores/coins";
import CoinCard from "@/components/CoinCardTrafaret/CoinCardTrafaret.vue";
import { STRAPI_URL } from "@/services/api";
import type { Coin, CoinCategory } from "@/types/coin";

const router = useRouter();
const coinsStore = useCoinsStore();
useEnsureCoinsLoaded();

const searchQuery = ref("");
const selectedCategory = ref<CoinCategory | "All">("All");
const sortBy = ref("price-desc");

function openCoin(coin: Coin) {
  router.push(`/coins/${coin.documentId}`);
}

function getLogoUrl(coin: Coin): string {
  return coin.logo?.url ? `${STRAPI_URL}${coin.logo.url}` : "";
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: price < 1 ? 4 : price < 100 ? 2 : 0,
  }).format(price);
}

const logoGradients: Record<CoinCategory, string> = {
  Layer1: "linear-gradient(135deg,#8aa0f5,#627EEA)",
  DeFi: "linear-gradient(135deg,#b97aff,#9B51E0)",
  Meme: "linear-gradient(135deg,#ffc97a,#F2994A)",
  Stablecoin: "linear-gradient(135deg,#5fd0a0,#27AE60)",
};

function logoGradient(category: CoinCategory): string {
  return logoGradients[category] ?? "linear-gradient(135deg,#a0aec0,#718096)";
}

async function handleRefresh(event: CustomEvent) {
  await coinsStore.syncPrices();
  (event.target as HTMLIonRefresherElement).complete();
}

// Топ 3 по абсолютній зміні
const topMovers = computed(() => {
  const base =
    selectedCategory.value === "All"
      ? coinsStore.coins
      : coinsStore.coins.filter((c) => c.category === selectedCategory.value);
  return [...base]
    .sort((a, b) => Math.abs(b.priceChange24h) - Math.abs(a.priceChange24h))
    .slice(0, 5);
});

// Відфільтровані та відсортовані монети
const filteredCoins = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  let list = coinsStore.coins.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(query) ||
      c.symbol.toLowerCase().includes(query);
    const matchCat =
      selectedCategory.value === "All" || c.category === selectedCategory.value;
    return matchSearch && matchCat;
  });

  if (sortBy.value === "price-asc")
    list.sort((a, b) => a.currentPrice - b.currentPrice);
  else if (sortBy.value === "change-desc")
    list.sort((a, b) => b.priceChange24h - a.priceChange24h);
  else if (sortBy.value === "change-asc")
    list.sort((a, b) => a.priceChange24h - b.priceChange24h);
  else list.sort((a, b) => b.currentPrice - a.currentPrice);

  return list;
});
</script>
