//! Pinia Store для работы с избранными монетами (хранение ID, доб/удал из избранного + синхронизация localStorage)
import { computed, ref } from "vue";
import { defineStore } from "pinia";

// ключ хранения данных в памяти браузера
const STORAGE_KEY = "crypto-tracker:favorites";

export const useFavoritesStore = defineStore("favorites", () => {
  // список ID избранных монет = из localStorage при старте
  const favoriteIds = ref<string[]>(loadFavorites());

  // вычисляемое свойство для получения общего количества избранных монет
  const count = computed(() => favoriteIds.value.length);

  // функция загрузки данных из localStor
  function loadFavorites() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  }

  // функция для сохранения текущего списка ID в localStor
  function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value));
  }

  // проверка - находится ли монета в списке избранных по ID
  function isFavorite(documentId: string) {
    return favoriteIds.value.includes(documentId);
  }

  // переключатель состояния= добавляет монету в избранное, если её там нет, или удаляет
  function toggleFavorite(documentId: string) {
    if (isFavorite(documentId)) {
      favoriteIds.value = favoriteIds.value.filter((id) => id !== documentId);
    } else {
      favoriteIds.value = [...favoriteIds.value, documentId];
    }

    saveFavorites();
  }

  // метод для удаления монеты из избранного
  function removeFavorite(documentId: string) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== documentId);
    saveFavorites();
  }

  return {
    favoriteIds,
    count,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  };
});
