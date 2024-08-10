<template>
  <v-container>
    <div class="flip-card" @click="isFlipped = !isFlipped">
      <div :class="['flip-card-inner', { 'flipped': isFlipped }]">
        <v-card elevation="24" color="dark" class="flip-card-front pa-5" outlined>
          <v-card-text>{{ title }}</v-card-text>
        </v-card>
        <v-card elevation="24" color="dark" class="flip-card-back pa-5" outlined>
          <v-card-text>{{ description }}</v-card-text>
        </v-card>
      </div>
    </div>
  </v-container>
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
    }
  }
};
</script>

<style scoped>
.flip-card {
  perspective: 360px;
  width: 196px;
  height: 260px;
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
}

.flip-card-front {
  z-index: 2;
  text-align: center;
}

.flip-card-back {
  transform: rotateY(180deg);
}
</style>
