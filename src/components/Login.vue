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
        <div class="text-body-2 font-weight-light mb-n1">Boas vindas à</div>

        <h1 class="text-h2 font-weight-bold">Metrics Poker</h1>
      </div>

      <div class="py-4" />

      <v-row justify="center" align="center">
        <v-col cols="8">
          <v-text-field v-model="email" label="E-mail" @blur="$v.form.email.$touch()" class="pt-3"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" align="center">
        <v-col cols="2">
          <v-btn  class="mx-auto" :disabled="v$.$invalid" @click="redirect()">Iniciar</v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
   <v-alert
    text="Preencha o e-mail corretamente"
    title="E-mail inválido"
    type="error"
    icon="$error"
    closable
    variant="elevated"
    v-if="erroEmail"
  ></v-alert>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators'

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      email: '',
      successEmail: false,
      errorEmail: false
    }
  },
  validations() {
    return {
      email: {
        required,
        email
       }
    }
  },
  methods: {
    redirect() {
      this.v$.email.$touch()
      //redirect to board page
      if (!this.v$.email.$invalid) {
        this.successEmail = true;
        this.$router.push({
          path: '/rules',
          query: { session: this.email}
        })
      } else {
        this.erroEmail = true;
      }
    }
  },
}
</script>
