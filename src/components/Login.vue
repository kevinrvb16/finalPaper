<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="900"
    >
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

        <h1 class="text-h2 font-weight-bold">Metrics Poker</h1>
      </div>

      <div class="py-4" />

      <v-row justify="center" align="center">
        <v-col cols="8">
          <v-text-field v-model="email" label="E-mail" class="pt-3"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="8" class="text-center">
          <v-btn :disabled="v$.$invalid" @click="redirect()">start game</v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
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
      email: ''
    }
  },
  validations() {
    return {
      email: { required }
    }
  },
  methods: {
    redirect() {
      //redirect to board page
      this.$router.push('/board')
    }
  },
}
</script>
