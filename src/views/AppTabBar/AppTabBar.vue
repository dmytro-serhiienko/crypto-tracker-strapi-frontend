<!--? РАЗМЕТКА -->
<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="coins" href="/coins">
          <ion-icon aria-hidden="true" :icon="pulseOutline" />
          <ion-label>Coins</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="favorites" href="/favorites">
          <ion-icon aria-hidden="true" :icon="bookmarksOutline" />
          <ion-label>Favorites</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="stats" href="/stats">
          <ion-icon aria-hidden="true" :icon="statsChartOutline" />
          <ion-label>Stats</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<!--? ЛОГИКА -->
<script setup lang="ts">
import "./AppTabBar.css";
// компоненты интерфейса Ionic
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/vue";

// иконки
import {
  pulseOutline,
  bookmarksOutline,
  statsChartOutline,
} from "ionicons/icons";
</script>
