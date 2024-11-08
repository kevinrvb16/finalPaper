<template>
  <v-responsive
    class="align-center mx-auto"
    max-width="1200"
  >
    <div>
      <v-row justify="center" align="center" class=" bg-table-horizontal mb-1" no-gutters>
        <v-tooltip :text="metricsGroup[0]?.description" max-width="360px">
          <template v-slot:activator="{ props }">
            <v-card
              :color="metricsGroup[0]?.backgroundColor"
              variant="tonal"
              class="mx-auto"
              hover
              v-bind="props"
              max-width="136"
            >
              <v-card-item>
                <div class="text-overline">
                  {{ metricsGroup[0]?.title }}
                </div>
                <div>
                  <template v-for="avatar in avatars">
                      <v-avatar size="28" v-if="avatar.value == metricsGroup[0]?.value">
                          <v-tooltip :text="avatar.nickname">
                              <template v-slot:activator="{ props }">
                                  <v-img v-bind="props" :src="`https://robohash.org/${avatar.nickname}`"></v-img>
                              </template>
                          </v-tooltip>
                      </v-avatar>
                  </template>
                </div>
              </v-card-item>
            </v-card>
          </template>
        </v-tooltip>
        <v-col v-for="(metric, index) in metricsOfFirstGroup" :key="index">
          <flip-card :chips="droppedChips" :cardIcon="'mdi-cards-spade'"  @dragover.prevent @drop="dropChip" @click="selectedMetrics.push(metric)" :customClassFlipCard="'custom-flip-card'" :customClassTitle="'white-space-normal'" :title="metric.name" :description="metric.description" :color="metricsGroup[0].backgroundColor"></flip-card>
        </v-col>
      </v-row>
      <v-row class="bg-table-horizontal mt-1"  justify="center" align="center" no-gutters>
        <v-tooltip :text="metricsGroup[1]?.description" max-width="360px">
          <template v-slot:activator="{ props }">
            <v-card
              :color="metricsGroup[1]?.backgroundColor"
              variant="tonal"
              class="mx-auto"
              hover
              v-bind="props"
              max-width="136"
            >
              <v-card-item>
                <div class="text-overline">
                  {{ metricsGroup[1]?.title }}
                </div>
                <div class="d-flex">
                  <template v-for="avatar in avatars">
                      <v-avatar size="28" v-if="avatar.value == metricsGroup[1]?.value">
                          <v-tooltip :text="avatar.nickname">
                              <template v-slot:activator="{ props }">
                                  <v-img v-bind="props" :src="`https://robohash.org/${avatar.nickname}`"></v-img>
                              </template>
                          </v-tooltip>
                      </v-avatar>
                  </template>
                </div>
              </v-card-item>
            </v-card>
          </template>
        </v-tooltip>
        <v-col class="px-1" v-for="(metric, index) in metricsOfSecondGroup" :key="index">
          <flip-card :cardIcon="'mdi-cards-club'"  @dragover.prevent @drop="dropCard" @click="selectedMetrics.push(metric)" :customClassFlipCard="'custom-flip-card'" :customClassTitle="'white-space-normal'" :title="metric.name" :description="metric.description" :color="metricsGroup[1].backgroundColor"></flip-card>
        </v-col>
      </v-row>
    </div>
    <div class="text-center mb-3 mt-2 text-caption d-flex justify-center">
      <div class="d-flex flex-column mx-4" v-for="(chip, index) in chips" :key="index">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-chip :value="chip.value" v-bind="props" variant="elevated" :size="isHovering ? 50 : 38" :class="`mx-4 ${chip.customClass}`" draggable rounded="circle" @dragstart="dragStart" @dragover.prevent @drop="dropChip">
              <v-tooltip :text="chip.description">
                <template v-slot:activator="{ props }">
                  <v-avatar :size="isHovering ? 54 : 42" v-bind="props" :image="chip.img"></v-avatar>
                </template>
              </v-tooltip>
            </v-chip>
          </template>
        </v-hover>
        <p style="max-width: 87px;">
          {{ chip.text }}
        </p>
      </div>
    </div>
    <div class="text-center text-caption">Arraste e solte as fichas em cima de cada carta.</div>
  </v-responsive>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators'
import FlipCard from '@/components/FlipCard.vue';
import HeaderApp from '@/components/HeaderApp.vue'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    FlipCard,
    HeaderApp
  },
  props: {
    metricsGroup: {
      type: Array,
      default: [],
      required: true
    },
    problem: {
      type: Object,
      default: {},
      required: true
    },
    avatars: {
      type: Array,
      default: [],
      required: false
    },
  },
  data() {
    return {
      email: '',
      selectedMetrics: [],
      metricsOfFirstGroup: [],
      metricsOfSecondGroup: [],
      relevance: null,
      ease: null,
      preference: null,
      chips: [
        {
          value: 'relevance',
          img: '../assets/coin_pink.png',
          text: 'Relevância para a dor',
          description: 'Ficha de Relevância para a dor',
          customClass: 'mb-2 mt-6',
          classInsideCard: 'bg-pink',
          styleInsideCard: 'position: absolute; bottom: 5px; left: 5px; font-size: 24px; ',
        },
        {
          value: 'ease',
          img: '../assets/coin_blue_dark_white.png',
          text: 'Facilidade de coleta',
          description: 'Ficha de Facilidade de coleta',
          customClass: 'mb-1',
          classInsideCard: 'bg-blue-dark',
          styleInsideCard: 'position: absolute; bottom: 5px; left: 5px; font-size: 24px; ',
        },
        {
          value: 'preference',
          img: '../assets/coin_blue.png',
          text: 'Preferência pessoal',
          description: 'Ficha de Preferência pessoal',
          customClass: 'mb-2 mt-6',
          classInsideCard: 'bg-blue',
          styleInsideCard: 'position: absolute; bottom: 5px; left: 5px; font-size: 24px; ',
        }
      ],
      draggedChip: null,
      droppedChips: [],
      metricOfEachGroup: {
        "resources": [
          {
            "name": "EFFORT REMAINING",
            "description": "É a métrica que mede a quantidade de esforço que ainda precisa ser aplicada para concluir uma tarefa."
          },
          {
            "name": "EFFORT",
            "description": "É a métrica que mede a quantidade de trabalho necessário para concluir uma tarefa."
          },
          {
            "name": "EFFORT ESTIMATION ACCURACY",
            "description": "É a métrica que mede a precisão da estimativa de esforço necessário para completar uma tarefa."
          },
          {
            "name": "TOTAL EFFECTIVE AVAILABLE HOURS",
            "description": "É a métrica que mede o tempo que a equipe tem disponível para trabalhar."
          },
          {
            "name": "BACKLOG SIZE",
            "description": "É a métrica que mede o número de tarefas pendentes na lista de tarefas."
          }
        ],
        "performance_and_process": [
          {
            "name": "FIXED BUGS",
            "description": "É a métrica que mede a quantidade de erros corrigidos em um produto."
          },
          {
            "name": "HOURS SPENT ON TASK",
            "description": "É a métrica que mede o tempo gasto em uma tarefa específica."
          },
          {
            "name": "HOURS SPENT ON BUGS",
            "description": "É a métrica que mede o tempo gasto na correção de bugs."
          },
          {
            "name": "CYCLE TIME",
            "description": "É a métrica que mede o tempo necessário para concluir uma tarefa desde o início até a entrega."
          },
          {
            "name": "TASKS ATTRIBUTES QUALITY",
            "description": "É a métrica que mede a qualidade das tarefas, incluindo descrição, informações e objetivos."
          }
        ],
        "schedule_and_progress": [
          {
            "name": "NUMBER OF COMPLETED TASKS",
            "description": "É a métrica que mede a quantidade de tarefas concluídas em um período de tempo."
          },
          {
            "name": "SCOPE GROWTH",
            "description": "É a métrica que mede o aumento do escopo do projeto."
          },
          {
            "name": "PRIORITY SHIFT",
            "description": "É a métrica que mede a taxa de mudança de prioridade das tarefas."
          },
          {
            "name": "CUMULATIVE FLOW DIAGRAMS",
            "description": "É a métrica que mede a quantidade de trabalho em cada estágio do processo de desenvolvimento."
          },
          {
            "name": "MERGE REQUEST REVIEW",
            "description": "É a métrica que mede o tempo gasto na revisão de solicitações de mesclagem."
          }
        ],
        "technology_effectiveness": [
          {
            "name": "TEST RUN FREQUENCY",
            "description": "É a métrica que mede a frequência com que os testes são executados."
          },
          {
            "name": "TEST FAILURE RATE",
            "description": "É a métrica que mede a quantidade de testes que falharam em relação ao número total de testes executados."
          },
          {
            "name": "AVG. TEST RUN TIME",
            "description": "É a métrica que mede o tempo médio gasto na execução de um teste."
          },
          {
            "name": "TEST COVERAGE",
            "description": "É a métrica que mede a porcentagem do código que é testado."
          },
          {
            "name": "SECURITY TEST PASS RATE",
            "description": "É a métrica que mede a quantidade de testes de segurança aprovados em relação ao número total de testes de segurança executados."
          }
        ],
        "size_and_stability": [
          {
            "name": "CHANGED PRODUCT BACKLOG ITEMS",
            "description": "É a métrica que mede o número de itens no backlog do produto que foram modificados."
          },
          {
            "name": "NUMBER OF CODE LINES",
            "description": "É a métrica que mede a quantidade de linhas de código escritas."
          },
          {
            "name": "WEAK COMPONENTS",
            "description": "É a métrica que mede a presença de componentes fracos ou vulnerabilidades em um software."
          }
        ],
        "customer_satisfaction": [
          {
            "name": "NPS",
            "description": "É a métrica que mede a satisfação do cliente com um produto ou serviço em uma escala de 0-10."
          }
        ],
        "product_quality": [
          {
            "name": "OUTSTANDING BUGS",
            "description": "É a métrica que mede a quantidade de erros em um produto que foram identificados, mas ainda não foram corrigidos."
          },
          {
            "name": "DELIVERY ON TIME",
            "description": "É a métrica que indica se a entrega foi feita dentro do prazo estabelecido."
          },
          {
            "name": "PRODUCT VELOCITY",
            "description": "É a métrica que mede a quantidade de trabalho realizado em um período de tempo."
          },
          {
            "name": "LEAD TIME",
            "description": "É a métrica que mede o tempo necessário para completar um item de trabalho."
          },
          {
            "name": "THROUGHPUT",
            "description": "É a métrica que mede a quantidade de trabalho que é concluída com sucesso em um determinado período de tempo."
          }
        ]
      }
    }
  },
  mounted() {
    this.metricsOfFirstGroup = this.metricOfEachGroup[this.metricsGroup[0]?.value]
    this.metricsOfSecondGroup = this.metricOfEachGroup[this.metricsGroup[1]?.value]
  },
  watch: {
    metricsGroup: {
      handler() {
        this.metricsOfFirstGroup = this.metricOfEachGroup[this.metricsGroup[0]?.value]
        this.metricsOfSecondGroup = this.metricOfEachGroup[this.metricsGroup[1]?.value]
      },
      deep: true
    }
  },
  methods: {
    dragStart(event) {
      this.draggedChip = event.target.value;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', this.draggedChip);
      console.log('event drag start',event);
      console.log('this.draggedChip drag start',this.draggedChip);
    },
    dropChip(event) {
      console.log('event dropChip',event);
      const value = event.dataTransfer.getData('text/plain');
      if (value !== null) {
        const chip = this.chips.find(chip => chip.value === value);
        console.log('chip dropChip',chip);
        if (chip) {
          this.droppedChips.push(chip);
          this.chips = this.chips.filter(chip => chip.value !== value);
        }
      }
    },
  },
  validations() {
    return {
      email: { required }
    }
  }
}
</script>
<style lang="scss">

.white-space-normal {
  white-space: normal!important;
}

.bg-table-horizontal {
  background-image: linear-gradient(black, white), linear-gradient(white, black);
  background-size: 2px 0%, 87% 2px; /* Tamanho das linhas */
  background-position: 100px, 135px; /* Posiciona as linhas */
  background-repeat: no-repeat;
  }

  .custom-flip-card {
    border: 1px solid black;
    border-radius: 5%;
    padding: 4px;
    max-width: 250px;
  }
</style>
