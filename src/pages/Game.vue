<template>
  <v-container class="fill-height">
    <header-app :nickname="noAnonUser ? '' : anonUser"></header-app>
    <div  class="align-center fill-height ma-auto" v-if="noAnonUser">
      <v-text-field class="mt-4" min-width="17vw" v-model="anonUser" label="Digite seu nickname" variant="solo-filled"></v-text-field>
      <v-btn text=" Jogar " class="mx-auto" color="primary" @click="createAnonUser"></v-btn>
    </div>
    <v-responsive class="align-center mx-auto" v-else-if="status == 'started'">
      <div class="pb-4 pt-2 d-flex justify-space-around align-center">
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-left" @click="changeStatus('not_started')">Voltar para Jogo não iniciado</v-btn>
        <div class="text-center">
          <p v-if="isDealer" class="text-h5">Grupos de Métricas</p>
          <p v-else class="my-3 text-h5">Selecione 2 grupos de métricas</p>
          <p class="mt-3">Dor selecionada: <strong>{{  game?.currentProblem?.name }}</strong></p>
        </div>
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-right" @click="redirect()">Avançar</v-btn>
      </div>
      <v-row no-gutters class="mb-3">
        <v-col no-gutters cols="10">
          <v-row class="pa-0" align="center">
            <metrics-group :isDealer="isDealer" @input="setSelectedGroups"></metrics-group>
            <v-col v-if="!isDealer" cols="3" justify="center" align="center">
              <v-btn append-icon="mdi-chevron-double-right" @click="send">enviar</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col no-gutters cols="2" class="d-flex pl-2 align-center justify-end">
          <participants :gameId="id"></participants>
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
            <v-btn :disabled="v$.$invalid" class="mx-auto mt-4" color="primary" @click="changeStatus('started')">
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
import FlipCard from '@/components/FlipCard.vue';
import HeaderApp from '@/components/HeaderApp.vue'
import { required } from '@vuelidate/validators'
import MetricsGroup from '@/components/MetricsGroup.vue';
import Participants from '@/components/Participants.vue';

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    FlipCard,
    HeaderApp,
    MetricsGroup,
    Participants
  },
  data() {
    return {
      selectedGroups: [],
      game: {},
      isDealer: false,
      noAnonUser: true,
      anonUser: '',
      nickname: '',
      status: '',
      participants: [],
      problem: null,
      id: JSON.parse(this?.$route.query.id),
    }
  },
  async mounted() {
    if (this.id) {
      const { data: game_sessions } = await supabase
        .from('game_sessions')
        .select("*, problemA (id, name, description), problemB (id, name, description)")
        .eq('id', this.id)
      this.game = game_sessions[0];
      this.status = this.game?.status
      this.isDealer = this.game.created_by == localStorage.getItem('logedUserId')
      const anonUserExist = localStorage.getItem("anonUser")

      if(this.isDealer ||  anonUserExist?.split(',')[0] == this.id) {
        this.noAnonUser = false;
        this.anonUser = anonUserExist?.split(',')[1]
      }
      // Set up real-time subscription
      if(this.participants.length == 0) {
        this.getParticipants()
      }
      supabase
        .channel(`participants${this.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participants' }, this.handleInserts)
        .subscribe()
      if (!this.isDealer) {
        supabase
          .channel(`game_sessions${this.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'game_sessions' }, this.handleUpdate)
          .subscribe()
      }
    }
  },
  methods: {
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
          console.log("participant: ",participant?.data)
          localStorage.setItem("anonUser", `${this.id},${this.anonUser},${participant?.data[0].id}`)
          this.noAnonUser = false;
        }
      }
    },
    handleUpdate(payload) {
      this.status = payload?.new?.status
    },
    handleInserts(payload) {
      if (!payload.errors) {
        this.participants.push(payload?.new)
      }
    },
    async changeStatus(status) {
      const resp = await supabase
        .from('game_sessions')
        .update({ status, currentProblem: this?.problem?.id })
        .eq('id', this.id)
        .select('*, problemA (id, name, description), problemB (id, name, description), currentProblem (id, name, description)')
      if (!resp.error) {
        this.game = resp.data[0]
        this.status = this?.game?.status
      }
    },
    async getParticipants() {
      const participantsInDataBase = await supabase
        .from('participants')
        .select("*")
        .eq('game_session', this.id)
      if (!participantsInDataBase.error) {
        this.participants = participantsInDataBase?.data
      }
    },
    setSelectedGroups(selectedGroups) {
      this.selectedGroups = selectedGroups
    },
    async send() {
      const selected = this.selectedGroups.reduce((acc, curr) => {
        return acc + ',' + curr.value
      }, this.selectedGroups.shift().value)
      console.log(selected)
      if (this?.game?.currentProblem?.id == this?.game?.problemA?.id) {
        supabase
          .from('participants')
          .update({problemA: selected})
          .eq('id', localStorage.getItem("anonUser").split(',')[2])
          .select('*')
        console.log('participantProblem:', participantProblem)
        return
      }
      if (this?.game?.currentProblem?.id == this?.game?.problemB?.id) {
        const participantProblem = supabase
          .from('participants')
          .update({problemB: selected})
          .eq('id', localStorage.getItem("anonUser").split(',')[2])
          .select('*')
        console.log('participantProblem:', participantProblem)
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
