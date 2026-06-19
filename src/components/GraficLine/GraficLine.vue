<!--? РАЗМЕТКА -->
<template>
  <svg class="sparkline" viewBox="0 0 120 42" preserveAspectRatio="none">
    <polyline :points="points" fill="none" :stroke="color" stroke-width="3" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

// интерфейс входящих данных => массив чисел-цен и статус изменения цены
interface Props {
  values: number[];
  positive: boolean;
}
const props = defineProps<Props>();

// вычисляем цвет линии: зеленый позитив, красный при негатив
const color = computed(() => (props.positive ? "#16a34a" : "#dc2626"));

// вычисление координат точек для линии GRAFICLINE
const points = computed(() => {
  // если данных нет, ничего не рисуем
  if (!props.values.length) return "";

  // находим минимум и максимум для нормализации значений графика
  const min = Math.min(...props.values);
  const max = Math.max(...props.values);
  // не давим на ноль
  const range = max - min || 1; 

  // преобразуем каждое значение цены в коорд X и Y
  return props.values
    .map((value, index) => {
      // X — равномерное распределение по ширине графика - 120 ед
      const x = (index / Math.max(props.values.length - 1, 1)) * 120;
      // Y — инвертированная координата, вписывающая цену в высоту - 38 ед.
      const y = 38 - ((value - min) / range) * 34;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    // объединяем точки в строку формата xyxyхуху ...
    .join(" "); 
});
</script>

<style scoped src="./GraficLine.css"></style>
