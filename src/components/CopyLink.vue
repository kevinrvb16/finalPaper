<template>
  <v-card class="pa-3" min-width="286px">
    <v-row align="center" no-gutters>
      <v-col>
        <v-text-field
          v-model="text"
          label="Link gerado para copiar"
          readonly
          dense
          hide-details
          variant="solo-filled"
          density="compact"
        ></v-text-field>
      </v-col>
      <v-col cols="auto" class="ml-2">
        <v-btn
          icon
          size="x-small"
          @click="copyText"
          :color="copySuccess ? 'success' : 'primary'"
        >
          <v-icon>{{ copySuccess ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-snackbar v-model="showSnackbar" :timeout="2000" color="success">
        Texto copiado com sucesso!
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
    props: {
        value: {
            type: String
        }
    },
    data() {
        return {
            text: this.value,
            copySuccess: false,
            showSnackbar: false,
        }
    },
    methods: {
        copyText() {
        navigator.clipboard.writeText(this.text).then(() => {
            this.copySuccess = true
            this.showSnackbar = true
            setTimeout(() => {
            this.copySuccess = false
            }, 2000)
        })
        },
    },
}
</script>