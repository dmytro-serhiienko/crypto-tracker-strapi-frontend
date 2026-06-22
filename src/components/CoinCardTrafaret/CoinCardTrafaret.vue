<!--? РАЗМЕТКА -->
<template>
  <ion-item
    button
    detail
    lines="none"
    class="coin-card"
    @click="$emit('open', coin)"
  >
    <!-- лого монеты -->
    <ion-avatar slot="start" class="coin-logo">
      <img v-if="logoUrl" :src="logoUrl" :alt="coin.name" />
      <span v-else>{{ coin.symbol.slice(0, 2) }}</span>
    </ion-avatar>

    <ion-label class="coin-info">
      <strong class="coin-name">{{ coin.name }}</strong>
      <p class="coin-symbol">{{ coin.symbol }}</p>
      <ion-badge class="coin-category" :style="badgeStyle">
        {{ coin.category }}
      </ion-badge>
    </ion-label>

    <sparkline-chart
      slot="end"
      :values="coin.sparkline"
      :positive="coin.priceChange24h >= 0"
    />

    <div slot="end" class="coin-price">
      <strong>{{ formattedPrice }}</strong>
      <span
        :class="{
          positive: coin.priceChange24h >= 0,
          negative: coin.priceChange24h < 0,
        }"
      >
        {{ formattedChange }}
      </span>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonAvatar, IonBadge, IonItem, IonLabel } from "@ionic/vue";
import SparklineChart from "@/components/GraficLine/GraficLine.vue";
import { STRAPI_URL } from "@/services/api";
import type { Coin, CoinCategory } from "@/types/coin";

// интерфейс для типизации входных парам
interface Props {
  coin: Coin;
}
const props = defineProps<Props>();

// определение события, которое компонент отправляет родителю
defineEmits<{
  open: [coin: Coin];
}>();

// цвета категорий
const categoryColors: Record<CoinCategory, { bg: string; color: string }> = {
  Layer1: { bg: "rgba(47,128,237,.14)", color: "#2F80ED" },
  DeFi: { bg: "rgba(155,81,224,.14)", color: "#9B51E0" },
  Meme: { bg: "rgba(242,153,74,.16)", color: "#c97a1e" },
  Stablecoin: { bg: "rgba(39,174,96,.14)", color: "#27AE60" },
};

const badgeStyle = computed(() => {
  const c = categoryColors[props.coin.category] ?? {
    bg: "rgba(136,150,179,.12)",
    color: "#6b7a99",
  };
  return { "--background": c.bg, "--color": c.color };
});

// вычисляем путь к изображению логотипа
const logoUrl = computed(() =>
  props.coin.logo?.url ? `${STRAPI_URL}${props.coin.logo.url}` : "",
);

// форматируем цену в Usd
const formattedPrice = computed(() =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: props.coin.currentPrice < 1 ? 6 : 2,
  }).format(props.coin.currentPrice),
);

// форматируем процент изменения цены = добавляем + для роста
const formattedChange = computed(() => {
  const prefix = props.coin.priceChange24h >= 0 ? "+" : "";
  return `${prefix}${props.coin.priceChange24h.toFixed(2)}%`;
});
</script>

<style scoped src="./CoinCardTrafaret.css"></style>
