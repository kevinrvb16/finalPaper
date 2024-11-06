<template>
    <v-col class="pb-0 px-1" :cols="small? '' : '3'" cols-xs="6" v-for="(metricGroup, index) in metricsGroup" :key="index" justify="center">
        <v-card
            :color="metricGroup.backgroundColor"
            variant="tonal"
            class="mx-auto"
            @click="selectGroup(metricGroup)"
            hover
            :link="!isDealer"
            density="compact"
            :min-height="getMinHeight"
            max-width="288"
            :disabled="alreadyChoose || selectedGroups.length > 1 && !selectedGroups.includes(metricGroup)"
            :elevation="!selectedGroups.includes(metricGroup) ? 0 : 10"
            >
            <v-card-item class="pb-0">
                <div>
                <div :class="`${small ? 'text-custom' : 'text-overline'} mb-1`">
                    {{ metricGroup.title }}
                </div>
                <div v-if="!small" class="text-caption align-justify">{{ metricGroup.description }}</div>
                </div>
            </v-card-item>
            <v-card-actions v-if="avatars.length > 0 && ( isDealer || small)" class="pt-0">
                <template v-for="avatar in avatars">
                    <v-avatar v-if="avatar.value == metricGroup.value">
                        <v-tooltip :text="avatar.nickname">
                            <template v-slot:activator="{ props }">
                                <v-img :width="small? 16 : 32" :src="`https://robohash.org/${avatar.nickname}`"></v-img>
                            </template>
                        </v-tooltip>
                    </v-avatar>
                </template>
            </v-card-actions>
        </v-card>
    </v-col>
</template>
<script>
import { metricsGroupList } from '@/db/metricsGroup';


export default {
    data() {
        return {
            problems: [],
            selectedGroups: [],
            metricsGroup: this.getMetricsGroup()
        }
    },
    props: {
        isDealer: {
            required: false,
            type: Boolean,
            default: false
        },
        alreadyChoose: {
            required: false,
            type: Boolean,
            default: false,

        },
        avatars: {
            required: false,
            type: Array,
            default: []
        },
        small: {
            required: false,
            type: Boolean,
            default: false
        }
    },
    methods: {
        selectGroup(metricGroup) {
            if (!this.isDealer) {
                const index = this.selectedGroups.indexOf(metricGroup)
                index != -1 ? this.selectedGroups.splice(index, 1) : this.selectedGroups.push(metricGroup)
                if ( this.selectedGroups.length == 2) {
                    this.$emit('input', this.selectedGroups)
                }
            }
        },
        getMinHeight() {
            if (this.isDealer) return '38vh'
            if (this.small) return '100'
            return '35vh'
        },
        getMetricsGroup() {
            return metricsGroupList
        }
    }
}
</script>
<style>
    .text-custom {
        font-size: .62em !important;
        font-weight: 500;
        line-height: 1;
        letter-spacing: .1em !important;
        font-family: Roboto, sans-serif;
        text-transform: uppercase !important;
    }
</style>