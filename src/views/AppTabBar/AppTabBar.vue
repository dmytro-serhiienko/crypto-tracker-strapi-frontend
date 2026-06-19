<!--? РАЗМЕТКА -->
<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="coins" href="/tabs/coins">
          <ion-icon aria-hidden="true" :icon="pulseOutline" />
          <ion-label>Coins</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="favorites" href="/tabs/favorites">
          <ion-icon aria-hidden="true" :icon="bookmarksOutline" />
          <ion-label>Favorites</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="stats" href="/tabs/stats">
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

// іконки
import {
  pulseOutline,
  bookmarksOutline,
  statsChartOutline,
} from "ionicons/icons";
</script>
