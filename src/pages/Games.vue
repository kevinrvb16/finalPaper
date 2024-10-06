<template>
  <v-container class="fill-height">
    <header-app @input="setUser"></header-app>
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="1200"
    >
        <v-snackbar
          text="Sessão de jogo iniciada com sucesso"
          title="Sucesso no login"
          timer
          color="success"
          timeout="5000"
          v-model="successEmail"
          rounded="pill"
        ></v-snackbar>
      <div class="text-center d-flex justify-space-between align-center">
        <h2 class="text-h3 mt-4 font-weight-bold">Jogos recentes</h2>
        <copy-link v-if="sessionLink" :value="sessionLink" @input="updateSessionLink"></copy-link>
        <v-card>
          <v-card-text>
            <create-game-modal :loading="loading" @create="createGameSession"></create-game-modal>
          </v-card-text>
        </v-card>
      </div>
      <div class="py-4" />
      <v-table>
        <thead>
          <tr>
            <th id="name" class="text-left">
              Nome do jogo
            </th>
            <th id="problem" class="text-left">
              Dor
            </th>
            <th id="metrics" class="text-left">
              Métricas Escolhidas
            </th>
            <th id="created_at" class="text-left">
              Data de criação
            </th>
            <th id="links" class="text-left"></tr>
        </thead>
        <tbody>
          <tr
            v-for="item in gamesList"
            :key="item.name"
          >
            <td>{{ item.name }}</td>
            <td>{{ item?.problem }}</td>
            <td>{{ item?.metricas }}</td>
            <td>{{ formattedDate(item.created_at) }}</td>
            <td><v-btn @click="copyURL(item.name)" icon="mdi-link-variant"></v-btn> <v-btn icon="mdi-delete-outline"></v-btn></td>
          </tr>
        </tbody>
      </v-table>
    </v-responsive>
    <v-snackbar v-model="showSnackbar" :timeout="2500" color="success">
      Texto copiado com sucesso!
    </v-snackbar>
  </v-container>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import HeaderApp from '@/components/HeaderApp.vue'
import { supabase } from '@/main'
import CopyLink from '@/components/CopyLink.vue'
import { format, parseISO } from 'date-fns'
import CreateGameModal from '@/components/CreateGameModal.vue'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    HeaderApp,
    CopyLink,
    CreateGameModal
  },
  data() {
    return {
      successEmail: true,
      gamesList: [],
      user: null,
      loading: false,
      sessionLink: '',
      showSnackBar: false
    }
  },
  methods: {
    async createGameSession(name) {
      console.log(name)
      if (!this.user) {
        console.error('User not logged in');
        return;
      }
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('game_sessions')
          .insert([{ created_by: this.user?.id, name }])
          .select()
        console.log('data inside createGameSession: ', data)
        if (error) throw error

        // Generate a session link
        this.sessionLink = `${window.location.origin}/game/${data[0].id}`
        console.log(this.sessionLink)
        // Set up real-time subscription
/*         supabase
          .from(`game_sessions:id=eq.${data.id}`)
          .on('UPDATE', payload => {
            console.log('Game session updated:', payload)
            // Handle updates here
          })
          .subscribe() */

      } catch (error) {
        console.error('Error creating game session:', error)
        // Handle error (show message to user, etc.)
      } finally {
        this.loading = false
      }
    },
    updateSessionLink(newValue) {
      this.sessionLink = newValue;
    },
    setUser(u) {
      this.user = u
      this.setList();
    },
    async setList() {
      console.log("this.user",this.user)
      if (this.user) {
        const { data: game_sessions } = await supabase
          .from('game_sessions')
          .select("*")
          .eq('created_by', this.user.id)
          console.log("game_session", game_sessions)
        this.gamesList = game_sessions;
      }
    },
    formattedDate(created_at) {
      return format(parseISO(created_at), 'dd/MM/yyyy HH:mm:ss')
    },
    copyURL(id) {
      navigator.clipboard.writeText(`${window.location.origin}/game/${id}`).then(() => {
        this.showSnackBar = true
        setTimeout(() => {
          this.showSnackBar = false
        }, 2500)
      })
    }
  },
}
</script>
