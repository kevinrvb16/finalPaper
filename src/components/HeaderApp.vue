<template>
    <v-app-bar image="@/assets/header.jpg" class="px-4" :elevation="4" color="teal-darken-4">
        <template slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>
        <template v-slot:image>
            <v-img class="opacity-30" />
        </template>

        <v-app-bar-title class="text-center">Metrics Poker</v-app-bar-title>

        <template v-slot:append>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-list v-bind="props" v-if="userMetadata?.avatar_url">
                        <v-list-item
                            :title="userMetadata?.full_name"
                            :prepend-avatar="userMetadata?.avatar_url"
                            
                        ></v-list-item>
                    </v-list>
                    <v-list v-else-if="nickname">
                        <v-list-item
                            :title="nickname"
                            :prepend-avatar="`https://robohash.org/${nickname}`"
                        ></v-list-item>
                    </v-list>
                    <v-btn v-else icon="mdi-account"></v-btn>
                </template>
                <v-list v-if="userMetadata?.avatar_url">
                    <v-list-item
                        :prepend-avatar="userMetadata?.avatar_url"
                        :subtitle="userMetadata?.email"
                        :title="userMetadata?.full_name"
                    >
                        <template v-slot:append>
                            <v-btn
                                icon="mdi-menu-down"
                                size="small"
                                variant="text"
                            ></v-btn>
                        </template>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list
                    :lines="false"
                    density="compact"
                    nav
                >
                    <v-list-item
                        v-for="(item, i) in items"
                        :key="i"
                        :value="item"
                        color="primary"
                    >
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon"></v-icon>
                        </template>

                        <v-list-item-title @click="redirect(item.link)" >{{ item.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>
</template>
<script>
import { supabase } from '../main'

export default {
    name: 'HeaderApp',
    data() {
        return  {
            userMetadata: null,
            items: [
                { text: 'Perfil', icon: 'mdi-account-details', link: "/profile" },
                { text: 'Jogos', icon: 'mdi-view-list', link: "/games" },
                { text: 'Regras', icon: 'mdi-ruler' , link: "/rules"},
                { text: 'Sair', icon: 'mdi-logout' , link: "/"},
            ]
        }
    },
    props: {
        nickname: {
            default: ''
        }
    },
    async created() {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            this.$emit('input', user)
            localStorage.setItem('logedUserId', user?.id)
            this.userMetadata = user.user_metadata
        }
    },
    methods: {
        async redirect(link) {
            if(link === '/') {
                const { error } = await supabase.auth.signOut()
                if (error) throw error
                localStorage.removeItem('logedUserId');
            }
            this.$router.push(link)
        }
    }
}

</script>