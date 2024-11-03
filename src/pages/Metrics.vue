<template>
  <v-container class="fill-height">
    <header-app :nickname="noAnonUser ? '' : anonUser"></header-app>
    <div  class="align-center fill-height ma-auto" v-if="noAnonUser">
      <v-text-field class="mt-4" min-width="17vw" v-model="anonUser" label="Digite seu nickname" variant="solo-filled"></v-text-field>
      <v-btn text=" Jogar " class="mx-auto" color="primary" @click="createAnonUser"></v-btn>
    </div>
    <v-responsive class="align-center mx-auto" max-width="1200" v-else-if="game?.status == 'started'">
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">Grupos de Métricas</h1>
        <h3>Selecione 2 grupos de métricas:</h3>
      </div>
      <v-row justify="end">
        <v-col class="pb-0" cols="4" v-for="(metricGroup, index) in metrics" :key="index" justify="center"
          align="center">
          <flip-card @click="selectedMetrics.push(metricGroup)" :title="metricGroup.title"
            :description="metricGroup.description" :color="metricGroup.backgroundColor"></flip-card>
        </v-col>
        <v-col cols="4" justify="center" align="center" class="my-auto">
          <v-btn v-if="isDealer" append-icon="mdi-chevron-double-right" @click="redirect()">Avançar</v-btn>
        </v-col>
        <v-btn v-if="isDealer" append-icon="mdi-chevron-double-left" @click="changeStatus('not_started')">Voltar para Jogo não iniciado</v-btn>
      </v-row>
    </v-responsive>
    <v-responsive class="align-center fill-height mx-auto" max-width="1000" v-else-if="game?.status == 'not_started'">
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
                <v-img :width="56" :src="`https://robohash.org/${item.nickname}`"></v-img>
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

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    FlipCard,
    HeaderApp
  },
  data() {
    return {
      selectedMetrics: [],
      game: {},
      isDealer: false,
      noAnonUser: true,
      anonUser: '',
      nickname: '',
      participants: [],
      problem: null,
      id: JSON.parse(this?.$route.query.id),
      metrics: [
        {
          title: "Qualidade do Produto",
          value: "product_quality",
          description: "Se concentra na qualidade do produto ou serviço entregue, incluindo sua funcionalidade, confiabilidade, segurança, facilidade de uso, desempenho, manutenção, entre outros aspectos.",
          backgroundColor: "#B90000" // Vermelho
        },
        {
          title: "Recursos e Custos",
          value: "resources",
          description: "Se concentra nos recursos usados no projeto e no custo total do projeto, incluindo o orçamento e o uso de materiais ou ferramentas.",
          backgroundColor: "#000000" // Preto
        },
        {
          title: "Desempenho e Processo",
          value: "performance_and_process",
          description: "Se concentra na eficiência e eficácia dos processos usados no projeto, incluindo a eficácia dos métodos de gerenciamento de projetos, a qualidade dos processos de produção, a produtividade da equipe e a eficácia da comunicação interna.",
          backgroundColor: "#1C4E8A" // Azul
        },
        {
          title: "Cronograma e Progresso",
          value: "schedule_and_progress",
          description: "Se concentra no cronograma e no progresso do projeto, incluindo o cumprimento de prazos, o acompanhamento do progresso e a identificação e correção de atrasos.",
          backgroundColor: "#B971CA" // Roxo
        },
        {
          title: "Eficácia da Tecnologia",
          value: "technology_effectiveness",
          description: "Se concentra na eficácia das tecnologias usadas no projeto, incluindo a eficácia dos sistemas de informação, a eficácia dos softwares e a segurança e privacidade dos dados.",
          backgroundColor: "#4F8A10" // Verde
        },
        {
          title: "Tamanho e Estabilidade",
          value: "size_and_stability",
          description: "Se concentra no tamanho e estabilidade do produto ou sistema desenvolvido, incluindo o número de usuários, a capacidade de armazenamento, a escalabilidade e a estabilidade.",
          backgroundColor: "#F0803C" // Laranja
        },
        {
          title: "Satisfação do Cliente",
          value: "customer_satisfaction",
          description: "Se concentra na satisfação do cliente com o produto ou serviço entregue, incluindo a qualidade, a usabilidade, a confiabilidade e a experiência geral do usuário. Isso pode ser medido por meio de pesquisas de satisfação do cliente e avaliações de clientes.",
          backgroundColor: "#6CAF44" // Verde Claro
        }
      ]
    }
  },
  async mounted() {
    if (this.id) {
      const { data: game_sessions } = await supabase
        .from('game_sessions')
        .select("*")
        .eq('id', this.id)
      this.game = game_sessions[0];
      console.log(" localStorage.getItem('logedUserId'):", localStorage.getItem('logedUserId'))
      this.isDealer = this.game.created_by == localStorage.getItem('logedUserId')
      const anonUserExist = localStorage.getItem("anonUser")
      if(this.isDealer || (anonUserExist && anonUserExist.split(',')[0] == this.id)) {
        this.noAnonUser = false;
        this.anonUser = anonUserExist.split(',')[1]
      }
      // Set up real-time subscription
      this.getParticipants()
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
        query: { metricGroup: JSON.stringify(this.selectedMetrics) }
      })
    },
    async createAnonUser() {
      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.log('error CreateAnonUser', error)
        return
      }
      if (data) {
        console.log('data createAnonUser', data)
        console.log(this.anonUser)
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
          localStorage.setItem("anonUser", `${this.id},${this.anonUser}`)
          console.log(participant.data)
          this.noAnonUser = false;
        }
      }
    },
    handleUpdate(payload) {
      this.status = payload?.new?.status
    },
    handleInserts(payload) {
      if (!payload.errors) {
        console.log('Mudanca recebida', payload)
        this.participants.push(payload?.new)
      }
    },
    async changeStatus(status) {
      console.log(this.id)
      const resp = await supabase
        .from('game_sessions')
        .update({ status })
        .eq('id', this.id)
        .select()
      if (!resp.error) {
        console.log('responseee23 :', resp)
        this.game = resp.data[0]
        console.log(this.game)
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
  },
  validations: {
    problem: {
      required
    }
  }
}
</script>
