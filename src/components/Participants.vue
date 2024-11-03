<template>
    <v-card>
        <v-list>
            <v-list-subheader>Participantes</v-list-subheader>
            <v-list-item
                v-for="participant in participants"
                :title="participant.nickname"
                :subtitle="participant?.metric1"
            >
                <template v-slot:prepend>
                    <v-img :width="42" :src="`https://robohash.org/${participant.nickname}`"></v-img>
                </template>
            </v-list-item>
        </v-list>
    </v-card>
</template>
<script>
import { supabase } from '@/main';

export default {
    data() {
        return {
            participants: []
        }
    },
    props: {
        gameId: {
            type: String,
            required: true
        }
    },
    async mounted() {
        console.log(this.participants)
        if (this.participants.length == 0) {
            this.getParticipants()
        }
        supabase
            .channel(`participants${this.gameId}participantsComponent`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', filter: `id=${this.gameId}`,table: 'participants' }, this.handleInserts)
            .subscribe()
    },
    methods: {
        async getParticipants() {
            const participantsInDataBase = await supabase
                .from('participants')
                .select("*")
                .eq('game_session', this.gameId)
            console.log("getParticipants", participantsInDataBase)
            if (!participantsInDataBase.error) {
                this.participants = participantsInDataBase?.data

            }
        },
        handleInserts(payload) {
            if (!payload.errors) {
                console.log('Mudanca recebida', payload)
                this.participants.push(payload?.new)
            }
        },
    }
}
</script>
<style></style>