<template>
  <v-container class="fill-height">
    <header-app></header-app>
    <v-responsive
      class="align-center mx-auto"
      max-width="1200"
    >
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">Grupos de Métricas</h1>
      </div>
      <v-row justify="end" >
        <v-col class="pb-0" cols="4" v-for="(metricGroup, index) in metrics" :key="index" justify="center" align="center">
            <flip-card @click="selectedMetrics.push(metricGroup)" :title="metricGroup.title" :description="metricGroup.description" :color="metricGroup.backgroundColor"></flip-card>
        </v-col>
        <v-col cols="4" justify="center" align="center" class="my-auto">
          <v-btn append-icon="mdi-chevron-double-right" @click="redirect()">Avançar</v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
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
  data() {
    return {
      selectedMetrics: [],
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
  methods: {
    redirect() {
      this.$router.push({
        path: '/game',
        query: { metricGroup: JSON.stringify(this.selectedMetrics)}
      })
    }
  },
}
</script>
