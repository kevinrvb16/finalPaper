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
            <v-tooltip :text="game?.currentProblem ? game?.currentProblem?.description : problem?.description">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" prepend-icon="mdi-dots-hexagon" variant="tonal" color="indigo-darken-3" size="large" rounded="xl" :ripple="false">{{  game?.currentProblem ? game?.currentProblem?.name : problem?.name }}</v-btn>
              </template>
            </v-tooltip>
            <p class="text-caption">Dor escolhida</p>
            <p v-if="isDealer" >Grupos de Métricas</p>
            <p v-else class="mt-2">Selecione 2 grupos de métricas</p>
        </div>
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-right" @click="changeStatus">Avançar</v-btn>
      </div>
      <v-row no-gutters class="mb-3">
        <v-col no-gutters cols="10">
          <v-row class="pa-0" align="center">
            <metrics-group :isDealer="isDealer" @input="setSelectedGroups" :choose="problemsSaved" :avatars="choosenByParticipants" ></metrics-group>
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
        <div>
          <participants :gameId="id" @input="setParticipants"></participants>
        </div>
      </div>
    </v-responsive>
    <v-responsive class="align-center mx-auto" v-else-if="status == 'select_metrics'">
      <div class="pb-4 pt-0 d-flex justify-space-around align-center">
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-left" @click="changeStatus('prev')">Voltar para Grupos de Métricas</v-btn>
        <div class="text-center d-flex">
          <div>
            <v-tooltip :text="game?.currentProblem ? game?.currentProblem?.description : problem?.description">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" prepend-icon="mdi-dots-hexagon" variant="tonal" color="indigo-darken-3" size="large" rounded="xl" :ripple="false">{{  game?.currentProblem ? game?.currentProblem?.name : problem?.name }}</v-btn>
              </template>
            </v-tooltip>
            <p class="text-caption">Dor escolhida</p>
          </div>
            <p v-if="!isDealer" class=" ml-10 mt-2 text-indigo-darken-2">Cada carta é uma métrica. Para votar, arraste e solte as fichas em cima da carta que você escolher. Clique na carta para ver detalhes.</p>
        </div>
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-right" @click="changeStatus()">Avançar</v-btn>
      </div>
      <v-row no-gutters class="mb-3">
        <v-col no-gutters cols="10" class="pr-0">
          <metrics :groups="game?.currentProblem?.id == game?.problemA?.id ? game?.problemA?.metricsGroups : game?.problemB?. metricsGroups" @input="setMetricsSelected" :game=game :isProblemA="game?.currentProblem?.id == game?.problemA?.id" :metricsGroup="twoMetricsGroupsSelected" :problem="problem" :avatars="choosenByParticipants" :isDealer="isDealer" ></metrics>
        </v-col>
        <v-col no-gutters cols="2" class="d-flex pl-2 align-center justify-end">
          <participants :gameId="id" @input="setParticipants"></participants>
        </v-col>
      </v-row>
    </v-responsive>
    <v-responsive class="align-center fill-height mx-auto" v-else-if="status == 'ended'">
      <div class="pb-4 pt-0 d-flex justify-space-around align-center">
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-left" @click="changeStatus('prev')">Voltar para as Métricas</v-btn>
        <div class="text-center">
          <v-tooltip :text="game?.currentProblem ? game?.currentProblem?.description : problem?.description">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" prepend-icon="mdi-dots-hexagon" variant="tonal" color="indigo-darken-3" size="large" rounded="xl" :ripple="false">{{  game?.currentProblem ? game?.currentProblem?.name : problem?.name }}</v-btn>
            </template>
          </v-tooltip>
          <p class="text-caption">Dor escolhida</p>
          <p class="my-2"> Métricas escolhidas</p>
          <p class="text-caption">Em verde estão as métricas escolhidas, em preto as empatadas, porém não selecionadas. o critério de desempate é qual métrica foi escolhida primeiro</p>
        </div>
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-right" @click="changeStatus">Iniciar Próxima Dor</v-btn>
      </div>
      <v-row no-gutters class="mb-3 justify-space-between">
        <div v-for="metric in metricsSelected" :key="metric.metric" class=" d-flex justify-center text-center mb-3">
          <flip-card :vote="metric.count" :id="metric.metric"  :cardIcon="'mdi-cards-diamond'" :customClassFlipCard="'custom-flip-card'" :customClassTitle="'white-space-normal'" :title="metric.name" :description="metric.description" color="black"></flip-card>
        </div>
        <div class="d-flex align-center justify-end">
          <participants :gameId="id" @input="setParticipants"></participants>
        </div>
      </v-row>
    </v-responsive>
    <div v-else>
      <div class="text-center">
        <p>Aguarde o dealer iniciar, enquanto isso beba água.</p>
      </div>
    </div>
    <v-snackbar v-model="showSnackbar" :timeout="3500" color="success">
      {{ successMessage }}
    </v-snackbar>
    <v-snackbar v-model="showError" :timeout="3500" color="error">
      {{ errorMessage }}
    </v-snackbar>
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
import FlipCard from '@/components/FlipCard.vue';
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    HeaderApp,
    MetricsGroup,
    Participants,
    Metrics,
    FlipCard
  },
  data() {
    return {
      selectedGroups: [],
      metricsSelected: [],
      twoMetricsGroupsSelected: [],
      game: {},
      problemsSaved: false,
      isDealer: false,
      noAnonUser: true,
      anonUser: '',
      nickname: '',
      status: '',
      statusOptions: [ 'not_started', 'started', 'select_metrics', 'ended'],
      participants: [],
      problem: null,
      id: JSON.parse(this?.$route.query.id),
      choosenByParticipants: [],
      metricsGroup: metricsGroupList,
      showSnackBar: false,
      showError: false,
      errorMessage: 'Ocorreu um erro',
      successMessage: 'Salvo com sucesso'
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
        if (!this.isDealer) {
          supabase
            .channel(`game_sessions${this.id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions' }, this.handleUpdate)
            .subscribe();
            if (this.status == 'ended') {
              await this.prepareVariables()
            }
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
    async createAnonUser() {
      const { data: participants, error: err } = await supabase
        .from('participants')
        .select()
        .eq('game_session', this.id)
        .eq('nickname', this.anonUser)
      if (err) {
        this.errorMessage = err.message
        this.showError = true
        return
      }
      if (participants.length > 0) {
        this.errorMessage = 'Já existe um participante com esse nickname'
        this.showError = true
        return
      }
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        this.errorMessage = error.message
        this.showError = true
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
          this.errorMessage = participant?.error.message
          this.showError = true
          return
        }
        if (participant?.data) {
          localStorage.setItem("anonUser", `${this.id},${this.anonUser},${participant?.data[0].id}`)
          this.noAnonUser = false;
          this.successMessage = 'Boa! Clique nos cards para escolher'
          this.showSnackBar = true
        }
      }
    },
    async handleUpdate(payload) {
      if (payload?.new?.status) {
        this.status = payload.new.status
        if (!payload.new.currentProblem?.name && payload.new.status == 'started') {
          await supabase
            .from('problems')
            .select('id, name, description')
            .eq('id', payload.new.currentProblem)
            .then(({ data, error }) => {
              if (error) throw error
              this.game.currentProblem = data[0]
            })
        }
        this.getCurrentProblem()
        await this.prepareVariables()
      }
      if (payload?.new?.nickname) {
        const participant = payload.new
        this.setChoosenParticipants(participant)
      }
    },
    getCurrentProblem() {
      if (this.status == 'select_metrics' || this.status == 'ended') {
        const problem = this?.game?.currentProblem?.id == this?.game?.problemA?.id ? this?.game?.problemA : this?.game?.problemB
        this.problem = problem
      }
    },
    async changeStatus(direction = 'next') {
      try {
      let i = this.statusOptions.indexOf(this.status)
      direction != 'prev' ? i++ : i--
      if (i == this.statusOptions.length) {
        i = 1
        this.problem = this.game?.currentProblem.id == this.game?.problemA?.id ? this.game?.problemB : this.game?.problemA
      }
      const { data, error } = await supabase
        .from('game_sessions')
        .update({ status: this.statusOptions[i], currentProblem: this?.problem?.id })
        .eq('id', this.id)
        .select('*, problemA (id, name, description), problemB (id, name, description), currentProblem (id, name, description)')
      
      if (error) throw error;
      this.successMessage = 'Status de jogo atualizado com sucesso'
      this.showSnackBar = true
      this.game = data[0]
      this.status = this?.game?.status
      } catch (error) {
      console.error("Error changing status:", error);
      this.errorMessage = error.message
      this.showError = true
      }
    },
    async prepareVariables() {
      if(this.status == 'select_metrics') {
        this.getCurrentProblem()
        this.problemsSaved = false
        if (!this.problem?.metricsGroups) {
          if (this.choosenByParticipants.length == 0) {
            this.participants?.forEach((participant)=> {
              this.setChoosenParticipants(participant)
            })
          }
          const metricsGroupsVotes = this.choosenByParticipants.reduce((acc, curr) => {
            if (acc[curr.value]) {
              acc[curr.value]++
            } else if (curr?.value) {
              acc[curr.value] = 1
            }
            return acc
          }, {})
          const onlyTwo = Object.keys(metricsGroupsVotes).sort((a, b) => metricsGroupsVotes[b] - metricsGroupsVotes[a]).slice(0, 2)
          this.twoMetricsGroupsSelected = this.metricsGroup.filter(item => onlyTwo.includes(item.value))
          if (this.twoMetricsGroupsSelected.length > 0) {
            await this.sendToProblemsDatabase()
          }
        } else {
          this.twoMetricsGroupsSelected = this.metricsGroup.filter(item => this.problem.metricsGroups.split(',').includes(item.value))
        }
      }
      if (this.status == 'ended') {
        this.getCurrentProblem()
        if (this.isDealer && this.metricsSelected.length !== 0) {
          console.log('this.metricsSelected 2', this.metricsSelected)
          await this.saveMetricsDatabase()
        } else {
          await this.retrieveSelectedMetricsDatabase()
        }
      }
    },
    async retrieveSelectedMetricsDatabase() {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('game_session', this.id)
        .eq('problem', this.problem?.id)
      if (error) {
        console.error("Erro ao buscar métricas:", error);
        this.errorMessage = error.message
        this.showError = true
        return;
      }
      this.message = 'Métricas votadas com sucesso'
      this.showSnackBar = true
      this.metricsSelected = data
    },
    async saveMetricsDatabase() {
      const twoMetrics = this.metricsSelected.slice(0, 2)

      const { data: metricsAlreadySaved, error: errorMetrics } = await supabase
        .from('metrics')
        .select('*')
        .eq('game_session', this.id)
        .eq('problem', this.problem.id)
      if (errorMetrics) {
        console.error("Erro ao buscar métricas:", errorMetrics);
        this.errorMessage = errorMetrics.message
        this.showError = true
        return;
      }
      console.log('metricsAlreadySaved', metricsAlreadySaved)
      if (metricsAlreadySaved.length > 0) {
        this.message = 'Métricas já salvas'
        this.showSnackBar = true 
        return
      }
      console.log('twoMetrics', twoMetrics)
      const { error } = await supabase
        .from('metrics')
        .insert({ problem: this.problem.id, value: twoMetrics[0].metric, name: twoMetrics[0].name, description: twoMetrics[0].description, count: twoMetrics[0].count, game_session: this.id, participants: twoMetrics[0].participants })
        .select()
      if (error) {
        console.error("Erro ao salvar métricas:", error);
        this.errorMessage = error.message
        this.showError = true
        return;
      }
      const { error: error2 } = await supabase
        .from('metrics')
        .insert({ problem: this.problem.id, value: twoMetrics[1].metric, name: twoMetrics[1].name, description: twoMetrics[1].description, count: twoMetrics[1].count, game_session: this.id, participants: twoMetrics[1].participants })
        .select()
      if (error2) {
        console.error("Erro ao salvar métricas:", error2);
        this.errorMessage = error2.message
        this.showError = true
        return;
      }
      this.message = 'Métricas salvas com sucesso'
      this.showSnackBar = true
    },
    setMetricsSelected(metrics) {
      this.metricsSelected = metrics
      
    },
    async sendToProblemsDatabase() {
      const selected = [...this.twoMetricsGroupsSelected]
      const metricsGroups = selected.reduce((acc, curr) => {
        return acc + ',' + curr.value
      }, selected.shift().value)
      const { error } = await supabase
        .from('problems')
        .update({ metricsGroups })
        .eq('id', this.problem.id)
        .select()
      if (error) throw error
    },
    async setParticipants(participants) {
      this.participants = participants
      if(this.isDealer || this.game.status == 'select_metrics') {
        this.participants?.forEach((participant)=> {
          this.setChoosenParticipants(participant)
        })
        await this.prepareVariables()
      }
    },
    setSelectedGroups(selectedGroups) {
      this.selectedGroups = selectedGroups
    },
    async send() {
      const copy = JSON.parse(JSON.stringify(this.selectedGroups))
      const selected = copy.reduce((acc, curr) => {
        return acc + ',' + curr.value
      }, copy.shift().value)
      const  updateProblem = this?.game?.currentProblem?.id == this?.game?.problemA?.id ?
        { problemA: selected } : { problemB: selected }
      const uId = localStorage.getItem("anonUser").split(',')[2];
      try {
        const { error } = await supabase
          .from('participants')
          .update(updateProblem)
          .eq('id', uId)
          .select('*');
        
        if (error) {
          console.error("Erro ao atualizar o problema do participante:", error);
          this.errorMessage = error.message
          this.showError = true
          return;
        }
        this.problemsSaved = true
        this.successOnSend()
      } catch (error) {
        console.error("Erro na execução da atualização:", error);
        this.errorMessage = error.message
        this.showError = true
      }
    },
    successOnSend(participant = '') {
      this.successMessage = `${participant?.nickname} seus votos foram enviadas com sucesso para o Dealer`
      this.showSnackBar = true
    },
    errorOnSend(error) {
      this.errorMessage = `Ocorreu um erro: ${error.message}`
      this.showError = true
    }
  },
  validations: {
    problem: {
      required
    }
  }
}
</script>
<style lang="css">
  .custom-flip-card {
    border: 1px solid black;
    border-radius: 5%;
    padding: 4px;
    max-width: 250px;
  }
</style>
