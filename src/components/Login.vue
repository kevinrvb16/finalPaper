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
      <v-row class="mb-4" justify="center" align="center">
        <div
          id="g_id_onload"
          data-client_id="266301269895-9iap0cpovgq5fju28e6q6a87qudv2is0.apps.googleusercontent.com"
          data-context="signin"
          data-ux_mode="popup"
          data-callback="handleSignInWithGoogle"
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

async function handleSignInWithGoogle(response) {
  try {
    // send id token returned in response.credential to supabase
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential,
    })

    if (error) throw error
    console.log('Session data: ', data)
    console.log('Successfully logged in with Google One Tap')

    // redirect to protected page
    this.$router.push('/rules')
  } catch (error) {
    console.error('Error logging in with Google One Tap', error)
  }
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: import.meta.env.VITE_CLIENT_ID,
    callback: handleSignInWithGoogle
  });
}

export default {
  mounted() {
    const { data, error } = supabase.auth.getSession()
    if (error) {
      console.error('Não está logado ou deu erro de sessão', error)
    }
    if (data?.session) {
      this.$router.push('/rules')
      return
    }
  },
}
</script>

