<template>
  <v-dialog max-width="580">
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
        <v-text-field :error="v$.name.$error" v-model="name" label="Digite o nome do jogo" variant="solo-filled" ></v-text-field>
        <div class="d-flex">
          <v-text-field :error="v$.problemA.name.$error" class="mr-3" v-model="problemA.name" label="Digite o nome da dor 1" variant="solo-filled"></v-text-field>
          <v-textarea :error="v$.problemA.description.$error" v-model="problemA.description" label="Digite a descrição da dor 1" variant="solo-filled"></v-textarea>
        </div>
        <div class="d-flex">
          <v-text-field :error="v$.problemB.name.$error" class="mr-3" v-model="problemB.name" label="Digite o nome da dor 2" variant="solo-filled"></v-text-field>
          <v-textarea :error="v$.problemB.description.$error" v-model="problemB.description" label="Digite a descrição da dor 2" variant="solo-filled"></v-textarea>
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-card-actions>
        <v-btn
          variant="outlined"
          text="Criar"
          class="mx-auto mb-6"
          color="primary"
          @click="save(isActive)"
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
      problemA: {},
      problemB: {},
      name: ''
    }
  },
  validations() {
    return {
      name: { required },
      problemA: { 
        name: {
          required
        },
        description: {
          required
        }
       },
      problemB: {
        name: {
          required
        },
        description: {
          required
        }
      }
    }
  },
  methods: {
    save(isActive) {
        this.$emit('create', {
          name: this.name,
          problemA: this.problemA,
          problemB: this.problemB
        })
      isActive.value = false
    }
  },
}
</script>
