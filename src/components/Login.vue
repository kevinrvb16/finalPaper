<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-center fill-height mx-auto"
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
      <v-row class="mb-4" justify="center" align="center">
        <div
          id="g_id_onload"
          data-client_id="266301269895-9iap0cpovgq5fju28e6q6a87qudv2is0.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleCredentialResponse"
          data-itp_support="true"
          data-use_fedcm_for_prompt="true">
        </div>
        
        <div class="g_id_signin"
          data-type="standard"
          data-shape="pill"
          data-theme="outline"
          data-text="signin_with"
          data-size="large"
          data-logo_alignment="left"
          data-width="256">
        </div>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
import { supabase } from '../main'

export default {
  methods: {
    async handleCredentialResponse(response) {
      try {
        // send id token returned in response.credential to supabase
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        })

        if (error) throw error

        this.$router.push('/games')
      } catch (error) {
        console.error('Error logging in with Google One Tap', error)
      }
    }
  },
  mounted() {
    const { data, error } = supabase.auth.getSession()
    if (error) {
      console.error('Não está logado ou deu erro de sessão', error)
    }
    if (data?.session) {
      console.log(data)
      this.$router.push('/games')
      return
    }

    // Add the Google Sign-In script dynamically
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    // Expose the handleCredentialResponse method globally
    window.handleCredentialResponse = this.handleCredentialResponse
  },
}
</script>