<template>
  <v-dialog v-model="isDialogOpen" max-width="650">
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
          <v-text-field density="compact" :error="v$.name.$error" v-model="v$.name.$model" label="Digite o nome do jogo" variant="solo-filled" ></v-text-field>
          <div class="d-flex">
            <v-text-field density="compact" :error="v$.problemA.name.$error" class="mr-3" v-model="v$.problemA.name.$model" label="Digite o nome da dor 1" variant="solo-filled"></v-text-field>
            <v-text-field density="compact" :error="v$.problemB.name.$error" v-model="v$.problemB.name.$model" label="Digite o nome da dor 2" variant="solo-filled"></v-text-field>
          </div>
          <div class="d-flex">
            <v-textarea max-rows="5" rows="3" :error="v$.problemA.description.$error" class="mr-3" v-model="v$.problemA.description.$model" label="Digite a descrição da dor 1" variant="solo-filled"></v-textarea>
            <v-textarea max-rows="5" rows="3" :error="v$.problemB.description.$error" v-model="v$.problemB.description.$model" label="Digite a descrição da dor 2" variant="solo-filled"></v-textarea>
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-btn
            variant="outlined"
            text="Salvar"
            class="mx-auto mb-6"
            color="primary"
            @click="save(isActive)"
            :disabled="v$.$invalid"
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
    },
  },
  data() {
    return {
      problems: [],
      problemA: {},
      problemB: {},
      name: '',
      isEditing: false,
      currentRow: null,
      isDialogOpen: false
    }
  },
  validations() {
    return {
      name: { required, $autoDirty: true },
      problemA: { 
        name: {
          required, $autoDirty: true
        },
        description: {
          required, $autoDirty: true
        }
      },
      problemB: {
        name: {
          required, $autoDirty: true
        },
        description: {
          required, $autoDirty: true
        }
      }
    }
  },
  methods: {
    async save(isActive) {
      const isFormOk = await this.v$.$validate()
      if (!isFormOk) {
        return 
      }
      const payload = {
        name: this.name,
        problemA: this.problemA,
        problemB: this.problemB
      }
      if (this.isEditing) {
        payload.id = this.currentRow.id
        this.$emit('update', payload)
      } else {
        this.$emit('create', payload)
      }
        // clean form
        this.name = ''
        this.problemA = {}
        this.problemB = {}
      isActive.value = false
    },
    edit(row) {
      this.isDialogOpen = true
      console.log('row:', row)
      this.isEditing = true
      this.currentRow = row
      this.name = row.name
      this.problemA = row.problemA
      this.problemB = row.problemB
    }
  },
}
</script>
