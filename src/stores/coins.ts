//! Центральный склад (для данных о монетах, их загрузки и синхронизации с сервером)
import { computed, ref } from "vue";
import { defineStore } from "pinia";
import api from "@/services/api";
import type { Coin, CoinCategory, SortOption } from "@/types/coin";

// какой тип ответа ждем от API Strapi
type CoinsResponse = {
  data: Coin[];
};

// СТОРА
export const useCoinsStore = defineStore("coins", () => {
  // хранилище всех загруженных монет
  const coins = ref<Coin[]>([]);
  // индикатор первичной загрузки
  const loading = ref(false);
  // индикатор процесса синхронизации цен
  const syncing = ref(false);
  // текст ошибки, если что-то пошло не так
  const error = ref("");
  // текущий поисковый запрос
  const search = ref("");
  // выбранная категория фильтрации
  const category = ref<CoinCategory | "All">("All");
  // выбранный метод сортировки
  const sort = ref<SortOption>("price-desc");
  // количество монет, отображаемых в списке (для пагинации)
  const visibleCount = ref(10);

  //? --- вычисляем
  // фильтрация и сортировка монет перед отображением
  const filteredCoins = computed(() => {
    const query = search.value.trim().toLowerCase();

    return coins.value
      .filter((coin) => {
        // проверка на соответствие по имени или символу
        const matchesSearch =
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query);
        // проверка на соответствие категории
        const matchesCategory =
          category.value === "All" || coin.category === category.value;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // логика сортировки (цена или изменение 24ч)
        if (sort.value === "price-asc") return a.currentPrice - b.currentPrice;
        if (sort.value === "change-desc")
          return b.priceChange24h - a.priceChange24h;
        if (sort.value === "change-asc")
          return a.priceChange24h - b.priceChange24h;
        // по умолчанию: цена по убыванию
        return b.currentPrice - a.currentPrice;
      });
  });

  // монеты, которые отображаются прямо сейчас+ лимит visibleCount
  const visibleCoins = computed(() =>
    filteredCoins.value.slice(0, visibleCount.value),
  );

  // флаг есть ли еще данные для подгрузки?
  const hasMore = computed(
    () => visibleCount.value < filteredCoins.value.length,
  );

  //? --- действия (Actions) ---
  // получение полного списка монет с сервера
  async function fetchCoins() {
    loading.value = true;
    error.value = "";

    try {
      const response = await api.get<CoinsResponse>("/coins", {
        params: {
          // загружаем логотип
          populate: "logo",
          "pagination[pageSize]": 30,
        },
      });

      coins.value = response.data.data;
    } catch {
      error.value = "Не удалось загрузить монеты";
    } finally {
      loading.value = false;
    }
  }

  // принудительное обновление цен через серверную синхронизацию
  async function syncPrices() {
    syncing.value = true;
    error.value = "";

    try {
      await api.post("/coins/sync");
      // перезагружаем данные после успешной синхронизации
      await fetchCoins();
    } catch {
      error.value = "Не удалось обновить цены";
    } finally {
      syncing.value = false;
    }
  }

  // увеличение количества монет при скролле
  function loadMore() {
    visibleCount.value += 8;
  }

  // сброс счетчика отображаемых монет при изменении фильтров
  function resetPagination() {
    visibleCount.value = 10;
  }

  // поиск конкретной монеты по её АЙДИ 
  function getCoinByDocumentId(documentId: string) {
    return coins.value.find((coin) => coin.documentId === documentId);
  }

  return {
    coins,
    loading,
    syncing,
    error,
    search,
    category,
    sort,
    filteredCoins,
    visibleCoins,
    hasMore,
    fetchCoins,
    syncPrices,
    loadMore,
    resetPagination,
    getCoinByDocumentId,
  };
});
