<template>
  <v-dialog max-width="480">
  <template v-slot:activator="{ props: activatorProps }">
    <v-btn
      v-bind="activatorProps"
      text="Criar novo jogo"
      color="primary"
    ></v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card title="Criar jogo:">
      <div class="mx-5">
        <v-text-field v-model="name" label="Digite o nome do jogo" variant="solo-filled" ></v-text-field>
      </div>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn
          variant="outlined"
          text="Criar"
          class="mx-auto mb-6"
          color="primary"
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
  props: {
    loading: {
        type: Boolean
    }
  },
  data() {
    return {
      problems: [],
      name: ''
    }
  },
  validations() {
    return {
      problems: { required }
    }
  },
  methods: {
    close(isActive) {
        this.$emit('create', this.name)
      isActive.value = false
    }
  },
}
</script>
