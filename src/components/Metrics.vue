<template>
  <v-responsive class="align-center mx-auto" max-width="1200">
    <div>
      <v-row justify="center" align="center" class=" bg-table-horizontal mb-1" no-gutters>
        <v-tooltip :text="metricsGroup[0]?.description" max-width="360px">
          <template v-slot:activator="{ props }">
            <v-card :color="metricsGroup[0]?.backgroundColor" variant="tonal" class="mx-auto" hover v-bind="props"
              max-width="136">
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
          <flip-card :id="metric.value" :chips="droppedChips" :cardIcon="'mdi-cards-spade'" @dragover.prevent
            @drop="dropChip" :customClassFlipCard="'custom-flip-card'" :customClassTitle="'white-space-normal'"
            :title="metric.name" :description="metric.description" :color="metricsGroup[0].backgroundColor"></flip-card>
        </v-col>
      </v-row>
      <v-row class="bg-table-horizontal mt-1" justify="center" align="center" no-gutters>
        <v-tooltip :text="metricsGroup[1]?.description" max-width="360px">
          <template v-slot:activator="{ props }">
            <v-card :color="metricsGroup[1]?.backgroundColor" variant="tonal" class="mx-auto" hover v-bind="props"
              max-width="136">
              <v-card-item>
                <div class="text-overline">
                  {{ metricsGroup[1]?.title }}
                </div>
                <div>
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
          <flip-card :id="metric.value" :chips="droppedChips" :cardIcon="'mdi-cards-club'" @dragover.prevent
            @drop="dropChip" :customClassFlipCard="'custom-flip-card'" :customClassTitle="'white-space-normal'"
            :title="metric.name" :description="metric.description" :color="metricsGroup[1].backgroundColor"></flip-card>
        </v-col>
      </v-row>
    </div>
    <div class="text-center mb-3 mt-2 text-caption d-flex justify-center">
      <div class="d-flex flex-column mx-4 align-center" v-for="(chip, index) in chips" :key="index">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-chip size="x-large" variant="text" :value="chip?.value" v-bind="props"
              :class="`mx-4 ${chip?.customClass}`" draggable rounded="circle" @dragstart="dragStart($event, index)"
              @dragover.prevent @drop="dropCard">
              <v-tooltip :text="chip?.description">
                <template v-slot:activator="{ props }">
                  <v-avatar :size="isHovering && !isDealer ? 54 : 42" v-bind="props">
                    <v-img :src="'/img/' + chip?.image + '.png'"></v-img>
                  </v-avatar>
                </template>
              </v-tooltip>
            </v-chip>
          </template>
        </v-hover>
        <p style="max-width: 88px;">
          {{ chip?.text }}
        </p>
      </div>
      <v-btn v-if="!isDealer" :disabled="problemsSaved" append-icon="mdi-chevron-double-right"
        @click="send">enviar</v-btn>
    </div>
  </v-responsive>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators'
import FlipCard from '@/components/FlipCard.vue';
import HeaderApp from '@/components/HeaderApp.vue'
import { supabase } from '@/main';

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
    isDealer: {
      type: Boolean,
      default: false,
      required: false
    },
    isProblemA: {
      type: Boolean,
      default: false,
      required: false
    },
    game: {
      type: Object,
      default: {},
      required: false
    },
    groups: {
      type: String,
      default: "",
      required: false
    }
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
      problemsSaved: false,
      participants: [],
      chips: [
        {
          value: 'relevance',
          image: 'coin_pink',
          text: 'Relevância para a dor',
          description: 'Ficha de Relevância para a dor',
          customClass: 'mb-2 mt-6',
          styleInsideCard: 'position: absolute; bottom: 5px; left: 5px; font-size: 24px; ',
        },
        {
          value: 'ease',
          image: 'coin_blue_dark_white',
          text: 'Facilidade de coleta',
          description: 'Ficha de Facilidade de coleta',
          customClass: 'mb-1',
          styleInsideCard: 'position: absolute; bottom: 5px; left: 5px; font-size: 24px; ',
        },
        {
          value: 'preference',
          image: 'coin_blue',
          text: 'Preferência pessoal',
          description: 'Ficha de Preferência pessoal',
          customClass: 'mb-2 mt-6',
          styleInsideCard: 'position: absolute; bottom: 5px; left: 5px; font-size: 24px; ',
        }
      ],
      draggedChip: null,
      droppedChips: [],
      metricOfEachGroup: {
        resources: [
          {
            name: "EFFORT REMAINING",
            description: "É a métrica que mede a quantidade de esforço que ainda precisa ser aplicada para concluir uma tarefa.",
            value: "effort_remaining"
          },
          {
            name: "EFFORT",
            description: "É a métrica que mede a quantidade de trabalho necessário para concluir uma tarefa.",
            value: "effort"
          },
          {
            name: "EFFORT ESTIMATION ACCURACY",
            description: "É a métrica que mede a precisão da estimativa de esforço necessário para completar uma tarefa.",
            value: "effort_estimation_accuracy"
          },
          {
            name: "TOTAL EFFECTIVE AVAILABLE HOURS",
            description: "É a métrica que mede o tempo que a equipe tem disponível para trabalhar.",
            value: "total_effective_available_hours"
          },
          {
            name: "BACKLOG SIZE",
            description: "É a métrica que mede o número de tarefas pendentes na lista de tarefas.",
            value: "backlog_size"
          }
        ],
        performance_and_process: [
          {
            name: "FIXED BUGS",
            description: "É a métrica que mede a quantidade de erros corrigidos em um produto.",
            value: "fixed_bugs"
          },
          {
            name: "HOURS SPENT ON TASK",
            description: "É a métrica que mede o tempo gasto em uma tarefa específica.",
            value: "hours_spent_on_task"
          },
          {
            name: "HOURS SPENT ON BUGS",
            description: "É a métrica que mede o tempo gasto na correção de bugs.",
            value: "hours_spent_on_bugs"
          },
          {
            name: "CYCLE TIME",
            description: "É a métrica que mede o tempo necessário para concluir uma tarefa desde o início até a entrega.",
            value: "cycle_time"
          },
          {
            name: "TASKS ATTRIBUTES QUALITY",
            description: "É a métrica que mede a qualidade das tarefas, incluindo descrição, informações e objetivos.",
            value: "tasks_attributes_quality"
          }
        ],
        schedule_and_progress: [
          {
            name: "NUMBER OF COMPLETED TASKS",
            description: "É a métrica que mede a quantidade de tarefas concluídas em um período de tempo.",
            value: "number_of_completed_tasks"
          },
          {
            name: "SCOPE GROWTH",
            description: "É a métrica que mede o aumento do escopo do projeto.",
            value: "scope_growth"
          },
          {
            name: "PRIORITY SHIFT",
            description: "É a métrica que mede a taxa de mudança de prioridade das tarefas.",
            value: "priority_shift"
          },
          {
            name: "CUMULATIVE FLOW DIAGRAMS",
            description: "É a métrica que mede a quantidade de trabalho em cada estágio do processo de desenvolvimento.",
            value: "cumulative_flow_diagrams"
          },
          {
            name: "MERGE REQUEST REVIEW",
            description: "É a métrica que mede o tempo gasto na revisão de solicitações de mesclagem.",
            value: "merge_request_review"
          }
        ],
        technology_effectiveness: [
          {
            name: "TEST RUN FREQUENCY",
            description: "É a métrica que mede a frequência com que os testes são executados.",
            value: "test_run_frequency"
          },
          {
            name: "TEST FAILURE RATE",
            description: "É a métrica que mede a quantidade de testes que falharam em relação ao número total de testes executados.",
            value: "test_failure_rate"
          },
          {
            name: "AVG. TEST RUN TIME",
            description: "É a métrica que mede o tempo médio gasto na execução de um teste.",
            value: "avg_test_run_time"
          },
          {
            name: "TEST COVERAGE",
            description: "É a métrica que mede a porcentagem do código que é testado.",
            value: "test_coverage"
          },
          {
            name: "SECURITY TEST PASS RATE",
            description: "É a métrica que mede a quantidade de testes de segurança aprovados em relação ao número total de testes de segurança executados.",
            value: "security_test_pass_rate"
          }
        ],
        size_and_stability: [
          {
            name: "CHANGED PRODUCT BACKLOG ITEMS",
            description: "É a métrica que mede o número de itens no backlog do produto que foram modificados.",
            value: "changed_product_backlog_items"
          },
          {
            name: "NUMBER OF CODE LINES",
            description: "É a métrica que mede a quantidade de linhas de código escritas.",
            value: "number_of_code_lines"
          },
          {
            name: "WEAK COMPONENTS",
            description: "É a métrica que mede a presença de componentes fracos ou vulnerabilidades em um software.",
            value: "weak_components"
          }
        ],
        customer_satisfaction: [
          {
            name: "NPS",
            description: "É a métrica que mede a satisfação do cliente com um produto ou serviço em uma escala de 0-10.",
            value: "nps"
          }
        ],
        product_quality: [
          {
            name: "OUTSTANDING BUGS",
            description: "É a métrica que mede a quantidade de erros em um produto que foram identificados, mas ainda não foram corrigidos.",
            value: "outstanding_bugs"
          },
          {
            name: "DELIVERY ON TIME",
            description: "É a métrica que indica se a entrega foi feita dentro do prazo estabelecido.",
            value: "delivery_on_time"
          },
          {
            name: "PRODUCT VELOCITY",
            description: "É a métrica que mede a quantidade de trabalho realizado em um período de tempo.",
            value: "product_velocity"
          },
          {
            name: "LEAD TIME",
            description: "É a métrica que mede o tempo necessário para completar um item de trabalho.",
            value: "lead_time"
          },
          {
            name: "THROUGHPUT",
            description: "É a métrica que mede a quantidade de trabalho que é concluída com sucesso em um determinado período de tempo.",
            value: "throughput"
          }
        ]
      }
    }
  },
  async mounted() {
    this.metricsOfFirstGroup = this.metricOfEachGroup[this.metricsGroup[0]?.value]
    this.metricsOfSecondGroup = this.metricOfEachGroup[this.metricsGroup[1]?.value]
    // create channel to listen to changes in the database participants
    if (this.isDealer) {
      supabase
        .channel(`participants${this.problem?.id}metricsComponent`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants' }, this.handleUpdate)
        .subscribe();
    }
    if (this.participants.length == 0 && this.isDealer) {
      await this.getParticipants()
    }
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
    async getParticipants() {
      const participantsInDataBase = await supabase
        .from('participants')
        .select("*")
        .eq('game_session', this.game.id)
      console.log('participantsInDataBase', participantsInDataBase);
      if (!participantsInDataBase.error) {
        this.participants = participantsInDataBase?.data
        this.loadDroppedChipsWithParticipants();
      }
    },
    handleUpdate(payload) {
      if (!payload?.errors && payload?.new?.game_session == this.game?.id) {
        this.mountDroppedChipsWithParticipant(payload.new);
      }
    },
    loadDroppedChipsWithParticipants() {
      this.participants.forEach(participant => {
        console.log('participant', participant);
        this.mountDroppedChipsWithParticipant(participant);
      });
    },
    mountDroppedChipsWithParticipant(newPayload) {
      console.log('newPayload', newPayload);

      // Remove the participant from the list of participants of the droppedChips
      this.droppedChips.forEach(droppedChip => {
        droppedChip.participants = droppedChip.participants.filter(participant => participant.id !== newPayload.id);
      });

      const newParticipantVoted = this.chips.map(chip => {
        console.log('chip', chip);
        let destinyId = null;
        if (chip.value === 'relevance') {
          destinyId = this.isProblemA ? newPayload?.relevanceA : newPayload?.relevanceB;
        } else if (chip.value === 'ease') {
          destinyId = this.isProblemA ? newPayload?.easeA : newPayload?.easeB;
        } else if (chip.value === 'preference') {
          destinyId = this.isProblemA ? newPayload?.preferenceA : newPayload?.preferenceB;
        }

        const existingChip = this.droppedChips.findIndex(droppedChip => {
          return droppedChip.destinyId === destinyId && droppedChip.value === chip.value;
        });

        if (existingChip !== -1) {
          this.droppedChips[existingChip].count += 1;
          this.droppedChips[existingChip].participants.push(newPayload);
          return null;
        }

        const destinyIdAlreadyHasCoinWithValue = this.droppedChips.find(droppedChip => droppedChip.destinyId === destinyId && droppedChip.value === chip.value);
        if (destinyIdAlreadyHasCoinWithValue) {
          return null;
        }

        const destinyIdAlreadyHasCoin = this.droppedChips.find(droppedChip => droppedChip.destinyId === destinyId && droppedChip.value !== chip.value);
        if (destinyIdAlreadyHasCoin) {
          chip.styleInsideCard = `position: absolute; bottom: 5px; left: ${parseInt(chip.styleInsideCard.split(' ')[5]) + 40}px; font-size: 24px; `;
        }

        return { ...chip, destinyId, count: 1, participants: [newPayload] };
      }).filter(chip => chip !== null && chip.destinyId !== null);
      console.log('newParticipantVoted', newParticipantVoted);
      this.droppedChips.push(...newParticipantVoted);
      this.sendDroppedChipsToParent();
    },
    sendDroppedChipsToParent() {
      if (this.selectedMetrics.length > 0) {
        this.selectedMetrics = [];
      }
      this.droppedChips.forEach(droppedchip => {
        const i = this.selectedMetrics.findIndex(card => card?.metric === droppedchip.destinyId)
        if (i !== -1) {
          this.selectedMetrics[i].count += 1
          this.selectedMetrics = droppedchip.participants.map(participant => participant.nickname);
        } else {
          const lisOfParticipantsNickname = droppedchip.participants.map(participant => participant.nickname);
          this.selectedMetrics.push({ metric: droppedchip?.destinyId, count: 1, participants: lisOfParticipantsNickname });
        }
      })
      this.selectedMetrics.sort((a, b) => b.count - a.count);
      this.selectedMetrics = this.selectedMetrics.filter((card, index) => {
        return index < 2 || card.count === this.selectedMetrics[1].count;
      });
      // antes de enviar para o pai, trás os dados de cada card. metric que estão no droppedChips
      this.selectedMetrics.forEach(card => {
        console.log('this.metricsGroup', this.metricsGroup);
        let metricOfGroup = null;
        if ( !this.metricsGroup ) {
          const selectedMetrics = this.groups.split(',');
          metricOfGroup = this.metricOfEachGroup[selectedMetrics[0]].find(metric => metric.value === card.metric) || this.metricOfEachGroup[selectedMetrics[1]].find(metric => metric.value === card.metric);
        } else if (this.metricsGroup.length > 0) {
          metricOfGroup = this.metricOfEachGroup[this.metricsGroup[0].value].find(metric => metric.value === card.metric) || this.metricOfEachGroup[this.metricsGroup[1].value].find(metric => metric.value === card.metric);
        }
        console.log('metricOfGroup', metricOfGroup);
        card.name = metricOfGroup?.name;
        card.description = metricOfGroup?.description;
      });
      this.$emit('input', this.selectedMetrics);
    },
    dragStart(event, index) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index);
      console.log('event drag start', event);
    },
    dropChip(event) {
      console.log('event dropChip', event);
      const index = event.dataTransfer.getData('text/plain');
      const destinyId = event?.target?.id;
      if (index !== null && destinyId !== null) {
        const chip = {
          ...this.chips[index],
          destinyId
        };
        console.log('chip drop chip', chip);
        this.droppedChips.push(chip);
        console.log('droppedChips drop chip', this.droppedChips);
        this.chips.splice(index, 1);
        console.log('chips drop chip', this.chips);
      }
    },
    dropCard(event) {
      console.log('event dropCard', event);
      const index = event.dataTransfer.getData('text/plain');
      console.log('index drop card', index);
      if (index !== null) {
        const chip = this.droppedChips[index];
        chip.destinyId = null;
        console.log('chip drop card', chip);
        this.chips.push(chip);
        console.log('chips drop card', this.chips);
        this.droppedChips.splice(index, 1);
        console.log('droppedChips drop card', this.droppedChips);
      }
    },
    send() {
      this.problemsSaved = true;
      console.log('droppedChips', this.droppedChips);
      this.droppedChips.forEach(chip => {
        if (chip.value === 'relevance') {
          this.relevance = chip.destinyId
        } else if (chip.value === 'ease') {
          this.ease = chip.destinyId
        } else if (chip.value === 'preference') {
          this.preference = chip.destinyId
        }
      });
      this.sendToSupabase();
      console.log('relevance', this.relevance);
      console.log('ease', this.ease);
      console.log('preference', this.preference);
    },
    async sendToSupabase() {
      // verify if problem is problemA or problemB to save in relevanceB or relevanceA, easeB or easeA, preferenceB or preferenceA
      try {
        const uId = localStorage.getItem("anonUser").split(',')[2];
        const { data: participants } = this.isProblemA ?
          await supabase
            .from('participants')
            .update({
              relevanceA: this.relevance,
              easeA: this.ease,
              preferenceA: this.preference
            })
            .eq('id', uId)
            .select('*')
          :
          await supabase
            .from('participants')
            .update({
              relevanceB: this.relevance,
              easeB: this.ease,
              preferenceB: this.preference
            })
            .eq('id', uId)
            .select('*')
        this.$emit('successOnSend', participants[0]);
      } catch (error) {
        console.error('error', error);
        this.problemsSaved = false;
        this.$emit('errorOnSend', error);
      }
    }
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
  white-space: normal !important;
}

.bg-table-horizontal {
  background-image: linear-gradient(black, white), linear-gradient(white, black);
  background-size: 2px 0%, 87% 2px;
  /* Tamanho das linhas */
  background-position: 100px, 135px;
  /* Posiciona as linhas */
  background-repeat: no-repeat;
}

.custom-flip-card {
  border: 1px solid black;
  border-radius: 5%;
  padding: 4px;
  max-width: 250px;
}
</style>
