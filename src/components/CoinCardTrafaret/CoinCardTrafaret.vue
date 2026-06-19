<template>
  <ion-item
    button
    detail
    lines="none"
    class="coin-card"
    @click="$emit('open', coin)"
  >
    <ion-avatar slot="start" class="coin-logo">
      <img v-if="logoUrl" :src="logoUrl" :alt="coin.name" />
      <span v-else>{{ coin.symbol.slice(0, 2) }}</span>
    </ion-avatar>

    <ion-label class="coin-info">
      <strong class="coin-name">{{ coin.name }}</strong>
      <p class="coin-symbol">{{ coin.symbol }}</p>
      <ion-badge class="coin-category" color="medium">
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
import type { Coin } from "@/types/coin";

// интерфейс для типизации входных парам
interface Props {
  coin: Coin;
}
const props = defineProps<Props>();

// определение события, которое компонент отправляет родителю
defineEmits<{
  open: [coin: Coin];
}>();

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
