<template>
  <v-responsive
    class="align-center mx-auto"
    max-width="1200"
  >
    <div class="bg-table-vertical">
      <v-row justify="center" align="center" class=" bg-table-horizontal" no-gutters>
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
                <div class="d-flex">
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
        <v-col class="px-1" v-for="(metric, index) in metricsOfFirstGroup" :key="index">
          <flip-card @dragover.prevent @drop="dropCard" @click="selectedMetrics.push(metric)" :customClassFlipCard="'custom-flip-card'" :customClassTitle="'white-space-normal'" :title="metric.name" :description="metric.description" :color="metricsGroup[0].backgroundColor"></flip-card>
        </v-col>
      </v-row>
      <v-row class="bg-table-horizontal"  justify="center" align="center" no-gutters>
        <v-tooltip :text="metricsGroup[1]?.description" max-width="360px">
          <template v-slot:activator="{ props }">
            <v-btn variant="tonal" class="cursor-pointer my-3" v-bind="props" :color="metricsGroup[1]?.backgroundColor">{{metricsGroup[1]?.title}}</v-btn>
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
          <flip-card  @dragover.prevent @drop="dropCard" @click="selectedMetrics.push(metric)" :customClassFlipCard="'custom-flip-card'" :customClassTitle="'white-space-normal'" :title="metric.name" :description="metric.description" :color="metricsGroup[1].backgroundColor"></flip-card>
        </v-col>
      </v-row>
    </div>
    <div class="text-center mb-3 mt-5 text-caption">
      <div class="d-flex flex-column">
        <v-chip variant="plain" class="mr-4 mb-3 rounded-chip text-caption" draggable size="" rounded="circle" text="Relevância para a dor" @dragstart="dragStart" @dragover.prevent @drop="dropChip">
          <v-tooltip text="Relevância para a dor">
            <template v-slot:activator="{ props }">
              <v-avatar v-bind="props" image="@/assets/coin_pink.png"></v-avatar>
            </template>
          </v-tooltip>
        </v-chip>
        Relevância para a dor
      </div>
      <div class="d-flex flex-column">
        <v-chip variant="plain" class="mr-4 mb-3 rounded-chip text-caption" draggable size="" rounded="circle"  text="Facilidade de coleta"  @dragstart="dragStart" @dragover.prevent @drop="dropChip">
          <v-tooltip text="Facilidade de coleta">
            <template v-slot:activator="{ props }">
              <v-avatar v-bind="props" image="@/assets/coin_blue_dark_white.png"></v-avatar>
            </template>
          </v-tooltip>
        </v-chip>
        Facilidade de coleta
      </div>
      <div class="d-flex flex-column">
        <v-chip variant="plain" class="mr-4 mb-3 rounded-chip text-caption" draggable size="" rounded="circle"  text="Preferência pessoal"  @dragstart="dragStart" @dragover.prevent @drop="dropChip">
          <v-tooltip text="Preferência pessoal">
            <template v-slot:activator="{ props }">
              <v-avatar v-bind="props" image="@/assets/coin_blue.png"></v-avatar>
            </template>
          </v-tooltip>
        </v-chip>
        Preferência pessoal
      </div>
    </div>
    <div class="text-center text-caption">Arraste e solte as fichas em cima de cada carta.</div>
    <div class="text-center text-caption">Clique sobre a carta para ver a descrição.</div>
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
      event.dataTransfer.setData('text', event.target.innerText);
    },
    dropChip(event) {
      const data = event.dataTransfer.getData('text');
    },
    dropCard(event) {
      const data = event.dataTransfer.getData('text');
      console.log(data)
      // permite que o elemento seja solto na área de destino
      event.preventDefault();

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

.rounded-chip {
  border-radius: 50%;       /* Torna o chip completamente circular */
  display: flex;            /* Alinha o conteúdo no centro */
  align-items: center;      /* Alinha verticalmente no centro */
  justify-content: center;  /* Alinha horizontalmente no centro */
  text-align: center;       /* Centraliza o texto */
  white-space: normal!important;      /* Permite que o texto quebre linha */
  word-wrap: break-word!important;    /* Quebra palavras longas */
  overflow: hidden;         /* Esconde o conteúdo que transborda */
}

.bg-table-horizontal {
  background-image: linear-gradient(white, white), linear-gradient(white, white);
  background-size: 2px 0%, 100% 2px; /* Tamanho das linhas */
  background-position: 100px, 150px; /* Posiciona as linhas */
  background-repeat: no-repeat;
  }

  .bg-table-vertical {
  background-image: linear-gradient(white, white), linear-gradient(white, white);
  background-size: 2px 50%, 0% 2px; /* Tamanho das linhas */
  background-position: 100px, 150px; /* Posiciona as linhas */
  background-repeat: no-repeat;
  }

  .custom-flip-card {
    border: 1px solid white;
    border-radius: 2%;
    padding: 4px;
    max-width: 250px;
  }
</style>
