<template>
    <v-app-bar class="px-4" color="success" :elevation="2">
        <template slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>Metrics Poker</v-app-bar-title>

        <template v-slot:append>
            <div v-if="user?.avatar_url" class="d-flex align-center">
                {{ user?.full_name }}
                <v-avatar :image="user?.avatar_url" size="64"></v-avatar>
            </div>
            <v-btn v-else icon="mdi-account"></v-btn>
        </template>
    </v-app-bar>
</template>
<script>

export default {
    name: 'HeaderApp',
    props: {
        user: {
            type: Object
        }
    },
}

</script>