<template>
    <v-col class="pb-0 pr-1 pl-3" :cols="small? '' : '3'" cols-xs="6" v-for="(metricGroup, index) in metricsGroup" :key="index" justify="center">
        <v-card
            :append-icon="selectedGroups.includes(metricGroup) ? 'mdi-check' : ''"
            :color="metricGroup.backgroundColor"
            variant="tonal"
            class="mx-auto"
            @click="selectGroup(metricGroup)"
            density="comfortable"
            hover
            :link="!isDealer"
            :height="getMinHeight"
            max-width="288"
            :disabled="alreadyChoose || selectedGroups.length > 1 && !selectedGroups.includes(metricGroup)"
            :elevation="!selectedGroups.includes(metricGroup) ? 0 : 16"
            >
            <v-card-item>
                <div>
                <div :class="`${small ? 'text-custom' : 'text-overline'}`">
                    {{ metricGroup.title }}
                </div>
                <div v-if="!small" class="text-caption align-justify">{{ metricGroup.description }}</div>
                </div>
                <template v-if="avatars.length > 0 && ( isDealer || small)" class="pt-0" v-for="avatar in avatars">
                    <v-avatar :size="small ? 26 : 32" v-if="avatar.value == metricGroup.value">
                        <v-tooltip :text="avatar.nickname">
                            <template v-slot:activator="{ props }">
                                <v-img :src="`https://robohash.org/${avatar.nickname}`"></v-img>
                            </template>
                        </v-tooltip>
                    </v-avatar>
                </template>
            </v-card-item>
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
            if (this?.isDealer) return '43vh'
            if (this?.small) return '100'
            return '38vh'
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