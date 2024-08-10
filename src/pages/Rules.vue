<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="1200"
    >
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">Regras</h1>
      </div>

      <div class="py-4" />

      <v-row justify="center" align="center">
        <v-col cols="6" class="text-justify">
          <v-card variant="tonal">
            <v-card-title>
              Importante que todos leiam com atenção as regras do jogo.
            </v-card-title>
            <v-card-subtitle>
              A dinâmica inicia com a definição de quem será o Dealer.
            </v-card-subtitle>
            <v-card-text>
              O Dealer questiona os participantes sobre eventuais dores,
               ou seja, problemas que a equipe identifica ao desenvolver 
               (caso a equipe não consiga identificar alguma dificuldade, 
               o Dealer pode trazer dores previamente selecionadas).
            </v-card-text>
            <v-card-text>
              Uma vez selecionadas duas dores, cada um dos jogadores 
              consulta a tabela de grupos de métricas com suas 
              respectivas definições. Os participantes devem fazer 
              uma votação simples para selecionar 2 grupos de métricas 
              (cada um escolhe 2, em seguida os 2 mais votados são escolhidos).
            </v-card-text>
            <v-card-text>
              O Dealer seleciona os 2 grupos de métricas para que cada uma 
              das metricas relacionadas a cada grupo apareçam para todos.
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" class="text-justify">
          <v-card variant="tonal">
            <v-card-text>
              É possivel inserir uma métrica personalizada da equipe. 
              Para tanto deve-se clicar na carta "Joker" e inserir nome e descriçao.
            </v-card-text>
            <v-card-text>
              Cada jogador pode clicar nas cartas das métricas para ler a descrição 
              no verso de cada uma.
            </v-card-text>
            <v-card-text>
              Cada participante recebe 3 fichas  de votação, cada um com um critério.
            </v-card-text>
            <v-card-text>
              Sem mostrar para os outros participantes cada um vota nas cartas que achar pertinente.
            </v-card-text>
            <v-card-text>
              As duas métricas que tiverem a maior quantidade, se houver empate a votação 
              deve ocorrer novamente apenas com as métricas empatadas.
            </v-card-text>
            <v-card-text>
              Em seguida é feito o mesmo procedimento com a seguinte dor.
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="12" class="text-center">
          <problems-dialog>Descrever dores</problems-dialog>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators'
import ProblemsDialog from '@/components/ProblemsDialog.vue'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    ProblemsDialog
  },
  data() {
    return {
      email: ''
    }
  },
  validations() {
    return {
      email: { required }
    }
  }
}
</script>
