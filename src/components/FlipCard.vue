<template>
  <div :class="`flip-card ${customClassFlipCard}`" @click="isFlipped = !isFlipped">
    <div :class="['flip-card-inner', { 'flipped': isFlipped }]">
      <v-card variant="outlined" :color="color" class="flip-card-front pa-0" outlined>
        <v-card-title :class="`${customClassTitle} text-overline`">{{ title }}</v-card-title>
        <v-icon class="mdi-cards-diamond" style="position: absolute; top: 0; left: 0; font-size: 24px; " :color="color" ></v-icon>
        <v-icon class="mdi-cards-diamond" style="position: absolute; bottom: 0; right: 0; font-size: 24px; " :color="color" ></v-icon>
        <v-icon class="mdi-cards-diamond" style="position: absolute; top: 50%; left: 50%; font-size: 24px; " :color="color" ></v-icon>
      </v-card>
      <v-card variant="outlined" :color="color" class="flip-card-back pa-0" outlined>
        <v-card-text class="text-caption">{{ description }}</v-card-text>
      </v-card>
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
