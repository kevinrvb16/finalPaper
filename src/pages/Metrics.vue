<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-center mx-auto"
      max-width="1200"
    >
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold">Grupos de Métricas</h1>
      </div>
      <div class="d-flex">
          <template v-for="(metric, index) in metrics" :key="index">
            <flip-card :title="metric.title" :description="metric.description"></flip-card>
          </template>
      </div>
    </v-responsive>
  </v-container>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators'
import FlipCard from '@/components/FlipCard.vue';

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    FlipCard
  },
  data() {
    return {
      email: '',
      metrics: [
        {
          title: "Qualidade do Produto",
          description: "Se concentra na qualidade do produto ou serviço entregue, incluindo sua funcionalidade, confiabilidade, segurança, facilidade de uso, desempenho, manutenção, entre outros aspectos."
        },
        {
          title: "Recursos e Custos",
          description: "Se concentra nos recursos usados no projeto e no custo total do projeto, incluindo o orçamento e o uso de materiais ou ferramentas."
        },
        {
          title: "Desempenho do Processo",
          description: "Se concentra na eficiência e eficácia dos processos usados no projeto, incluindo a eficácia dos métodos de gerenciamento de projetos, a qualidade dos processos de produção, a produtividade da equipe e a eficácia da comunicação interna."
        },
        {
          title: "Cronograma e Progresso",
          description: "Se concentra no cronograma e no progresso do projeto, incluindo o cumprimento de prazos, o acompanhamento do progresso e a identificação e correção de atrasos."
        },
        {
          title: "Eficácia da Tecnologia",
          description: "Se concentra na eficácia das tecnologias usadas no projeto, incluindo a eficácia dos sistemas de informação, a eficácia dos softwares e a segurança e privacidade dos dados."
        },
        {
          title: "Tamanho e Estabilidade",
          description: "Se concentra no tamanho e estabilidade do produto ou sistema desenvolvido, incluindo o número de usuários, a capacidade de armazenamento, a escalabilidade e a estabilidade."
        },
        {
          title: "Satisfação do Cliente",
          description: "Se concentra na satisfação do cliente com o produto ou serviço entregue, incluindo a qualidade, a usabilidade, a confiabilidade e a experiência geral do usuário. Isso pode ser medido por meio de pesquisas de satisfação do cliente e avaliações de clientes."
        }
      ]
    }
  },
  validations() {
    return {
      email: { required }
    }
  }
}
</script>
