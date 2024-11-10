<template>
  <div :class="`flip-card ${customClassFlipCard}`" @click="isFlipped = !isFlipped">
    <div :class="['flip-card-inner', { 'flipped': isFlipped }]">
      <v-tooltip text="Clique para ver a descrição">
        <template v-slot:activator="{ props }">
          <v-card :id="id" v-bind="props" variant="outlined" :color="color" class="flip-card-front pa-0" outlined>
            <v-icon :icon="cardIcon" style="position: absolute; top: 5px; left: 5px; font-size: 24px; " :color="color" ></v-icon>
            <v-card-title :class="`${customClassTitle} text-overline mt-4`">{{ title }}</v-card-title>
            <v-icon :icon="cardIcon" style="position: absolute; top: 44%; left: 41%; font-size: 24px; " :color="color" ></v-icon>
            <template v-for="chip in chips.flat()">
              <v-chip v-if="chip.destinyId === id" size="x-large" :value="chip.value" v-bind="props" variant="text" class="pl-0 overflow-visible" :style="chip.styleInsideCard" draggable rounded="circle" @dragstart="dragStart" @dragover.prevent @drop="dropCard">
                <v-tooltip :text="showChipDescOrParticipantsNickname(chip)">
                  <template v-slot:activator="{ props }">
                    <v-badge v-if="chip?.count" :color="color" overlap="circle" :content="chip?.count" class="ma-0">
                      <v-avatar size="42" v-bind="props">
                        <v-img :src="'/img/' + chip?.image + '.png'" alt="fichas para apostar nas cartas de métricas"></v-img>
                      </v-avatar>
                    </v-badge>
                    <v-avatar size="42" v-else v-bind="props">
                      <v-img :src="'/img/' + chip?.image + '.png'" alt="fichas para apostar nas cartas de métricas"></v-img>
                    </v-avatar>
                  </template>
                </v-tooltip>
              </v-chip>
            </template>
            <v-icon :icon="cardIcon" style="position: absolute; bottom: 5px; right: 5px; font-size: 24px; " :color="color" ></v-icon>
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
    id: {
      type: String
    },
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
    },
    chips: {
      type: Array
    }
  },
  methods: {
    showChipDescOrParticipantsNickname(chip) {
      if (chip?.count) {
        return chip?.participants.reduce((acc, participant) => acc + participant.nickname + ', ', '').slice(0, -2);
      }
      return chip?.description;
    },
    dragStart(event) {
      event.dataTransfer.setData('text/plain', event.target.value);
    },
    dropCard(event) {
      event.preventDefault();
      const data = event.dataTransfer.getData('text/plain');
      event.target.appendChild(document.getElementById(data));
    },
  },
};
</script>

<style scoped lang="scss">
.flip-card {
  perspective: 1080px;
  width: 160px;
  height: 224px;
  aspect-ratio: 400 / 560;
  background-color: white;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  background-color: white;
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
