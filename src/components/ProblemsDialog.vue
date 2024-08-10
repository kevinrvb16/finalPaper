<template>
  <v-dialog max-width="480">
  <template v-slot:activator="{ props: activatorProps }">
    <v-btn
      v-bind="activatorProps"
      text="Dores"
    ></v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card title="Digite breve título da dor ou problema:">
      <div class="mx-5">
        <v-text-field label="Dor / Problema" variant="solo-filled" ></v-text-field>
      </div>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn
          variant="outlined"
          text="Selecionar Grupos de Métricas"
          class="mx-auto mb-6"
          @click="close(isActive)"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      problems: []
    }
  },
  validations() {
    return {
      problems: { required }
    }
  },
  methods: {
    redirect() {
      //redirect to board page
      this.$router.push('/rules')
    },
    close(isActive) {
      isActive.value = false
      this.$router.push('/metrics')
    }
  },
}
</script>
