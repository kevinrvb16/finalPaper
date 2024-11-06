<template>
  <div :class="`flip-card ${customClassFlipCard}`" @click="isFlipped = !isFlipped">
    <div :class="['flip-card-inner', { 'flipped': isFlipped }]">
      <v-card variant="tonal" :color="color" class="flip-card-front pa-0" outlined>
        <v-card-title :class="`${customClassTitle} text-overline`">{{ title }}</v-card-title>
      </v-card>
      <v-card variant="tonal" :color="color" class="flip-card-back pa-0 text-caption" outlined>
        <v-card-text>{{ description }}</v-card-text>
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
  height: 33vh;
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
