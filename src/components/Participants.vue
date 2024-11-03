<template>
    <v-expansion-panels class="pa-4" variant="popout">
        <v-expansion-panel v-for="(participant, i) in participants" :key="i" hide-actions>
            <v-expansion-panel-title>
                <v-avatar size="42px">
                    <v-img alt="Avatar" :src="`https://robohash.org/${participant.nickname}`" />
                </v-avatar>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
                <v-card-text v-text="participant.nickname"></v-card-text>
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>
<script>
import { supabase } from '@/main';

export default {
    data() {
        return {
            participants: [],
        }
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    async mounted() {
        if (!this.participants) {
            this.getParticipants()
        }
        supabase
            .channel(`participants${this.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participants' }, this.handleInserts)
            .subscribe()
    },
    methods: {
        async getParticipants() {
            const participantsInDataBase = await supabase
                .from('participants')
                .select("*")
                .eq('game_session', this.id)
            console.log("getParticipants", participantsInDataBase)
            if (!participantsInDataBase.error) {
                this.participants = participantsInDataBase?.data
            }
        },
        hasParticipants() {
            return this.participants?.length > 0
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