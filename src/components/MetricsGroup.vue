<template>
    <v-col class="pb-0 px-1" cols="3" cols-xs="6" v-for="(metricGroup, index) in metricsGroup" :key="index" justify="center">
        <v-card
            :color="metricGroup.backgroundColor"
            variant="tonal"
            class="mx-auto"
            @click="selectGroup(metricGroup)"
            hover
            link
            density="compact"
            min-height="33vh"
            max-width="288"
            :disabled="isDealer || selectedGroups.length > 1 && !selectedGroups.includes(metricGroup)"
            :elevation="!selectedGroups.includes(metricGroup) ? 0 : 10"
            >
            <v-card-item>
                <div>
                <div class="text-overline mb-1">
                    {{ metricGroup.title }}
                </div>
                <div class="text-caption align-justify">{{ metricGroup.description }}</div>
                </div>
            </v-card-item>
        </v-card>
    </v-col>
</template>
<script>

export default {
    data() {
        return {
            problems: [],
            selectedGroups: [],
            metricsGroup: [
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
                backgroundColor: "#1B5E20" // Verde
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
    props: {
        isDealer: {
            required: false,
            type: Boolean,
            default: false
        }
    },
    methods: {
        selectGroup(metricGroup) {
            const index = this.selectedGroups.indexOf(metricGroup)
            index != -1 ? this.selectedGroups.splice(index, 1) : this.selectedGroups.push(metricGroup)
            console.log("this.selectedGroups: ", this.selectedGroups)
        }
    }
}
</script>
<style>
</style>