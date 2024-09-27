<template>
  <v-container class="fill-height">
    <header-app></header-app>
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
      <div class="text-center">
        <h1 class="text-h2 mt-4 font-weight-bold">Jogos recentes</h1>
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
    }
  },
}
</script>
