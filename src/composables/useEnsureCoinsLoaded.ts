import { onMounted } from "vue";
import { useCoinsStore } from "@/stores/coins";

export function useEnsureCoinsLoaded() {
  const coinsStore = useCoinsStore();

  onMounted(() => {
    if (!coinsStore.coins.length && !coinsStore.loading) {
      coinsStore.fetchCoins();
    }
  });
}
