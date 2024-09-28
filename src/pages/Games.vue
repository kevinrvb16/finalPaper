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
        <v-card>
          <v-card-text>
            <v-btn @click="createGameSession" color="primary" :loading="loading">
              Criar novo Jogo
            </v-btn>
            <v-text-field
            class="mt-2"
              v-if="sessionLink"
              v-model="sessionLink"
              label="Link gerado"
              readonly
              variant="solo-filled"
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
      </div>
      <div class="py-4" />
      <v-table>
        <thead>
          <tr>
            <th class="text-left">
              Nome do jogo
            </th>
            <th class="text-left">
              Dor
            </th>
            <th class="text-left">
              Métricas Escolhidas
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in desserts"
            :key="item.name"
          >
            <td>{{ item.name }}</td>
            <td>{{ item.problem }}</td>
            <td>{{ item.metricas[0] }}, {{ item.metricas[1] }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-responsive>
  </v-container>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import HeaderApp from '@/components/HeaderApp.vue'
import { supabase } from '@/main';

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    HeaderApp
  },
  data() {
    return {
      successEmail: true,
      desserts: [
        {
          name: 'Jogo',
          problem: 'UX - Usabilidade',
          metricas: ['Qualidade', 'Relevância']
        },
      ],
      user: {}
    }
  },
  methods: {
    async createGameSession() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('game_sessions')
          .insert([{ created_by: this.user?.id }])
          .single()

        if (error) throw error

        // Generate a session link
        this.sessionLink = `${window.location.origin}/game/${data.id}`

        // Set up real-time subscription
        supabase
          .from(`game_sessions:id=eq.${data.id}`)
          .on('UPDATE', payload => {
            console.log('Game session updated:', payload)
            // Handle updates here
          })
          .subscribe()

      } catch (error) {
        console.error('Error creating game session:', error)
        // Handle error (show message to user, etc.)
      } finally {
        this.loading = false
      }
    },
    setUser(u) {
      this.user = u
    }
  },
}
</script>
