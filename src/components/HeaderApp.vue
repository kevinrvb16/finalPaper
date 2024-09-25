<template>
    <v-app-bar class="px-4" color="success" :elevation="2">
        <template slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Metrics Poker</v-app-bar-title>

        <template v-slot:append>
            <div v-if="userMetadata?.avatar_url" class="d-flex align-center">
                {{ userMetadata?.full_name }}
                <v-avatar class="ml-3" :image="userMetadata?.avatar_url" size="48"></v-avatar>
            </div>
            <v-btn v-else icon="mdi-account"></v-btn>
        </template>
    </v-app-bar>
</template>
<script>
import { supabase } from '../main'

export default {
    name: 'HeaderApp',
    data() {
        return  {
            userMetadata: null
        }
    },
    async created() {
        const { data: { user } } = await supabase.auth.getUser()

       /*  if (error) {
            console.error('Não está logado ou deu erro,', error)
        } */
        if (user) {
            console.log(user)
            this.userMetadata = user.user_metadata
        }
        console.log('this.usermetaData', this.userMetadata)
    }
}

</script>