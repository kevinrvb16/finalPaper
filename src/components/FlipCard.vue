<template>
  <div :class="`flip-card ${customClassFlipCard}`" @click="isFlipped = !isFlipped">
    <div :class="['flip-card-inner', { 'flipped': isFlipped }]">
      <v-tooltip text="Clique para ver a descrição">
        <template v-slot:activator="{ props }">
          <v-card v-bind="props" variant="outlined" :color="color" class="flip-card-front pa-0" outlined>
            <v-icon :icon="cardIcon" style="position: absolute; top: 5; left: 5; font-size: 24px; " :color="color" ></v-icon>
            <v-card-title :class="`${customClassTitle} text-overline mt-4`">{{ title }}</v-card-title>
            <v-icon :icon="cardIcon" style="position: absolute; top: 44%; left: 41%; font-size: 24px; " :color="color" ></v-icon>
            <v-icon :icon="cardIcon" style="position: absolute; bottom: 5; right: 5; font-size: 24px; " :color="color" ></v-icon>
          </v-card>
        </template>
      </v-tooltip>
      <v-tooltip text="Clique para virar a carta novamente">
        <template v-slot:activator="{ props }">
          <v-card v-bind="props" variant="outlined" :color="color" class="flip-card-back pa-0" outlined>
            <v-card-text class="text-caption">{{ description }}</v-card-text>
          </v-card>
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFlipped: false,
    };
  },
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    },
    color: {
      type: String
    },
    customClassTitle: {
      type: String
    },
    customClassFlipCard: {
      type: String
    },
    textColor: {
      type: String
    },
    cardIcon: {
      type: String
    }
  }
};
</script>

<style scoped lang="scss">
.flip-card {
  perspective: 1080px;
  width: 160px;
  height: 224px;
  aspect-ratio: 400 / 560;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flipped {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  cursor: pointer;
}

.flip-card-front {
  z-index: 2;
  text-align: center;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
