<template>
  <v-container class="fill-height">
    <header-app :nickname="noAnonUser ? '' : anonUser"></header-app>
    <div  class="align-center fill-height ma-auto" v-if="noAnonUser">
      <p class="text-h5">Bem vindo ao MetricsPoker</p>
      <v-text-field class="mt-4" min-width="19vw" v-model="anonUser" label="Digite seu nickname" variant="solo-filled"></v-text-field>
      <v-btn text=" Jogar " class="mx-auto" color="primary" @click="createAnonUser"></v-btn>
    </div>
    <v-responsive class="align-center mx-auto" v-else-if="status == 'started'">
      <div class="pb-4 pt-0 d-flex justify-space-around align-center">
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-left" @click="changeStatus('prev')">Voltar para Jogo não iniciado</v-btn>
        <div class="text-center">
          <p v-if="isDealer" class="text-h5">Grupos de Métricas</p>
          <p v-else class="my-3 text-h5">Selecione 2 grupos de métricas</p>
          <p class="mt-3">Dor selecionada: 
            <v-tooltip :text="game?.currentProblem ? game?.currentProblem?.description : problem?.description">
              <template v-slot:activator="{ props }">
                <strong>{{  game?.currentProblem ? game?.currentProblem?.name : problem?.name }}</strong>
              </template>
            </v-tooltip>
          </p>
        </div>
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-right" @click="changeStatus">Avançar</v-btn>
      </div>
      <v-row no-gutters class="mb-3">
        <v-col no-gutters cols="10">
          <v-row class="pa-0" align="center">
            <metrics-group :isDealer="isDealer" @input="setSelectedGroups" :alreadyChoose="problemsSaved" :avatars="choosenByParticipants" ></metrics-group>
            <v-col v-if="!isDealer" cols="3" justify="center" align="center">
              <v-btn :disabled="problemsSaved" append-icon="mdi-chevron-double-right" @click="send">enviar</v-btn>
              <div v-if="problemsSaved">Enviado com sucesso, aguarde o Dealer avançar.</div>
              <p  v-if="problemsSaved" class="text-caption">Caso queira mudar os cards selecionados, basta atualizar a tela e selecionar outro</p>
            </v-col>
          </v-row>
        </v-col>
        <v-col no-gutters cols="2" class="d-flex pl-2 align-center justify-end">
          <participants :gameId="id" @input="setParticipants"></participants>
        </v-col>
      </v-row>
    </v-responsive>
    <v-responsive class="align-center fill-height mx-auto" max-width="1000" v-else-if="status == 'not_started'">
      <div :class="`d-flex ${hasParticipants ? 'justify-space-between' : 'justify-space-center'}`">
        <div class="mr-2">
          <h2>Jogo não iniciado</h2>
          <div  class="align-center fill-height mx-auto" v-if="isDealer">
            <p class="my-3">Selecione por qual problema iniciar</p>
            <v-list>
              <v-radio-group v-model="v$.problem.$model">
                <v-tooltip :text="game.problemA.description">
                  <template v-slot:activator="{ props }">
                    <v-radio v-bind="props" :label="game.problemA.name" :value="game.problemA"></v-radio>
                  </template>
                </v-tooltip>
                <v-tooltip :text="game.problemB.description">
                  <template v-slot:activator="{ props }">
                    <v-radio v-bind="props" :label="game.problemB.name" :value="game.problemB"></v-radio>
                  </template>
                </v-tooltip>
              </v-radio-group>
            </v-list>
            <v-btn :disabled="v$.$invalid" class="mx-auto mt-4" color="primary" @click="changeStatus">
              <v-icon icon="mdi-play" start></v-icon>
              Iniciar jogo
            </v-btn>
          </div>
          <div  class="align-center fill-height mx-auto" v-else>
            <p class="py-4 pr-4">Dores cadastradas pelo Dealer:</p>
            <v-list>
              <v-list-item v-model="game.problemA" color="seccondary">
                <template v-slot:prepend>
                  <v-icon icon="mdi-dots-hexagon"></v-icon>
                </template>
                <v-list-item-title>{{ game.problemA.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ game.problemA.description }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-model="game.problemB" color="seccondary">
                <template v-slot:prepend>
                  <v-icon icon="mdi-dots-hexagon"></v-icon>
                </template>
                <v-list-item-title>{{ game.problemB.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ game.problemB.description }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </div>
        <div v-if="hasParticipants()">
          <h4>Participantes: </h4>
          <v-list>
            <v-list-item v-for="(item, i) in participants" :key="i" :value="item" color="seccondary">
              <template v-slot:prepend>
                <v-img :width="48" :src="`https://robohash.org/${item.nickname}`"></v-img>
              </template>
              <v-list-item-title>{{ item.nickname }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-responsive>
    <v-responsive class="align-center mx-auto" v-else-if="status == 'select_metrics'">
      <div class="pb-4 pt-0 d-flex justify-space-around align-center">
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-left" @click="changeStatus('prev')">Voltar para Grupos de Métricas</v-btn>
        <div class="text-center">
          <p v-if="isDealer" class="text-h5">Métricas</p>
          <p v-else class="my-3 text-h5">Selecione as métricas</p>
          <p class="mt-3">Dor selecionada: 
            <v-tooltip :text="game?.currentProblem?.description">
              <template v-slot:activator="{ props }">
                <strong>{{  game?.currentProblem?.name }}</strong>
              </template>
            </v-tooltip>
          </p>
        </div>
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-right" @click="changeStatus()">Avançar</v-btn>
      </div>
      <v-row no-gutters class="mb-3">
        <v-col no-gutters cols="10">
          <v-row class="pa-0" align="center">
            <metrics-group :isDealer="isDealer" :small="true" @input="setSelectedGroups" :alreadyChoose="problemsSaved" :avatars="choosenByParticipants" ></metrics-group>
          </v-row>
          <metrics :selectedGroups="selectedGroups" :problem="problem"></metrics>
        </v-col>
        <v-col no-gutters cols="2" class="d-flex pl-2 align-center justify-end">
          <participants :gameId="id" @input="setParticipants"></participants>
        </v-col>
      </v-row>
    </v-responsive>
    <div v-else>
      <div class="text-center">
        <p>Aguarde o dealer iniciar, enquanto isso beba água.</p>
      </div>
    </div>
  </v-container>
</template>

<script>
import { supabase } from '@/main'
import { useVuelidate } from '@vuelidate/core';
import HeaderApp from '@/components/HeaderApp.vue'
import { required } from '@vuelidate/validators'
import MetricsGroup from '@/components/MetricsGroup.vue';
import Participants from '@/components/Participants.vue';
import Metrics from '@/components/Metrics.vue';
import { metricsGroupList } from '@/db/metricsGroup';
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    HeaderApp,
    MetricsGroup,
    Participants,
    Metrics
  },
  data() {
    return {
      selectedGroups: [],
      game: {},
      problemsSaved: false,
      isDealer: false,
      noAnonUser: true,
      anonUser: '',
      nickname: '',
      status: '',
      statusOptions: [ 'not_started', 'started', 'select_metrics', 'voting', 'ended'],
      participants: [],
      problem: null,
      id: JSON.parse(this?.$route.query.id),
      choosenByParticipants: [],
      metricsGroup: metricsGroupList
    }
  },
  async mounted() {
    try {
      if (this.id) {
        const { data: game_sessions, error } = await supabase
          .from('game_sessions')
          .select("*, problemA (id, name, description, metricsGroups), problemB (id, name, description, metricsGroups), currentProblem (id, name, description)")
          .eq('id', this.id);

        if (error) throw error;

        this.game = game_sessions[0];
        this.status = this.game?.status;
        this.isDealer = this.game.created_by == localStorage.getItem('logedUserId');
        const anonUserExist = localStorage.getItem("anonUser");

        if (this.isDealer || anonUserExist?.split(',')[0] == this.id) {
          this.noAnonUser = false;
          this.anonUser = anonUserExist?.split(',')[1];
        }

        supabase
          .channel(`participants${this.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participants' }, this.handleInserts)
          .subscribe();

        if (!this.isDealer) {
          supabase
            .channel(`game_sessions${this.id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions' }, this.handleUpdate)
            .subscribe();
        }

        if (this.isDealer) {
          supabase
            .channel(`participantsProblems${this.id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'participants' }, this.handleUpdate)
            .subscribe();
        }
      }
    } catch (error) {
      console.error('Error in mounted:', error);
    }
  },
  methods: {
    setChoosenParticipants(participant) {
      const newProblem = this?.game?.currentProblem?.id == this?.game?.problemA?.id ? participant.problemA : participant.problemB
        const values = newProblem.split(',')
        this.choosenByParticipants = this.choosenByParticipants.filter(item => item.nickname != participant.nickname)
        this.choosenByParticipants = [
          ...this.choosenByParticipants,
          { nickname: participant.nickname, value: values[0] },
          { nickname: participant.nickname, value: values[1] }
        ]
    },
    hasParticipants() {
      return this.participants?.length > 0
    },
    redirect() {
      this.$router.push({
        path: '/game',
        query: { metricGroup: JSON.stringify(this.selectedGroups) }
      })
    },
    async createAnonUser() {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.log('error CreateAnonUser', error)
        return
      }
      if (data) {
        const participant = await supabase
          .from('participants')
          .insert([
            { game_session: this.id, nickname: this.anonUser }
          ])
          .select()
        if (participant?.error) {
          console.log('error participant', error)
          return
        }
        if (participant?.data) {
          localStorage.setItem("anonUser", `${this.id},${this.anonUser},${participant?.data[0].id}`)
          this.noAnonUser = false;
        }
      }
    },
    handleUpdate(payload) {
      if (payload?.new?.status) {
        this.status = payload.new.status
        this.getCurrentProblem()
      }
      if (payload?.new?.nickname) {
        const participant = payload.new
        this.setChoosenParticipants(participant)
      }
    },
    getCurrentProblem() {
      if (this.status == 'select_metrics') {
        const problem = this?.game?.currentProblem?.id == this?.game?.problemA?.id ? this?.game?.problemA : this?.game?.problemB
        this.problem = problem
      }
    },
    handleInserts(payload) {
      if (!payload.errors) {
        this.participants.push(payload?.new)
      }
    },
    async changeStatus(direction = 'next') {
      try {
      let i = this.statusOptions.indexOf(this.status)
      direction != 'prev' ? i++ : i--
      const { data, error } = await supabase
        .from('game_sessions')
        .update({ status: this.statusOptions[i], currentProblem: this?.problem?.id })
        .eq('id', this.id)
        .select('*, problemA (id, name, description), problemB (id, name, description), currentProblem (id, name, description)')
      
      if (error) throw error;
      
      this.game = data[0]
      this.status = this?.game?.status
      this.prepareVariables()
      } catch (error) {
      console.error("Error changing status:", error);
      }
    },
    prepareVariables() {
      if(this.status == 'select_metrics') {
        this.getCurrentProblem()
        if (!this.problem?.metricsGroups) {
          //retorna os 2 grupos de métricas mais selecioNADOS PELOS PARTICIPANTS
          const metricsGroupsVotes = this.choosenByParticipants.reduce((acc, curr) => {
            if (acc[curr.value]) {
              acc[curr.value]++
            } else if (curr?.value) {
              acc[curr.value] = 1
            }
            return acc
          }, {})
          //retorna os 2 grupos de métricas mais votados
          const sortedMetricsGroups = Object.keys(metricsGroupsVotes).sort((a, b) => metricsGroupsVotes[b] - metricsGroupsVotes[a])
          console.log('Grupos de métricas votados:', sortedMetricsGroups)
          this.problem.metricsGroups = sortedMetricsGroups.slice(0, 2)
          console.log('Grupos de métricas selecionados:', this.problem.metricsGroups)
          //a partir dos values mais votados pegar os objetos dos grupos de métricas
          this.problem.metricsGroups = this.problem.metricsGroups.map((value) => {
            return this.metricsGroup.filter((group) => group.value == value)
          })
          // salva no supabase
          console.log('Grupos de métricas selecionados:', this.problem.metricsGroups)
          this.sendToProblemsDatabase()
        }
      }
    },
    sendToProblemsDatabase() {
      const metricsGroups = this.problem.metricsGroups.reduce((acc, curr) => {
        return acc + ',' + curr.value
      }, this.problem.metricsGroups.shift().value)
      console.log('Grupos de métricas que vão rpo db:', metricsGroups)
      const { data, error } = supabase
        .from('problems')
        .update({ metricsGroups })
        .eq('id', this.problem.id)
        .select()
      if (error) throw error
      console.log('Problema atualizado com os grupos de métricas:', data)
    },
    async setParticipants(participants) {
      this.participants = participants
      if(this.isDealer) {
        this.participants?.forEach((participant)=> {
          this.setChoosenParticipants(participant)
        })
        this.prepareVariables()
      }
    },
    setSelectedGroups(selectedGroups) {
      this.selectedGroups = selectedGroups
    },
    async send() {
      const selected = this.selectedGroups.reduce((acc, curr) => {
        return acc + ',' + curr.value
      }, this.selectedGroups.shift().value)
      const  updateProblem = this?.game?.currentProblem?.id == this?.game?.problemA?.id ?
        { problemA: selected } : { problemB: selected }
      const uId = localStorage.getItem("anonUser").split(',')[2];
      try {
        const { data, error } = await supabase
          .from('participants')
          .update(updateProblem)
          .eq('id', uId)
          .select('*');
        
        if (error) {
          console.error("Erro ao atualizar o problema do participante:", error);
          return;
        }
        this.problemsSaved = true
      } catch (error) {
        console.error("Erro na execução da atualização:", error);
      }
    }
  },
  validations: {
    problem: {
      required
    }
  }
}
</script>
