<template>
    <v-col class="pb-0 pr-1 pl-3" cols="3" cols-xs="6" v-for="(metricGroup, index) in metricsGroup" :key="index" justify="center">
        <v-card
            :color="metricGroup.backgroundColor"
            variant="outlined"
            @click="selectGroup(metricGroup)"
            class="mx-auto"
            hover
            :link="!isDealer"
            :min-height="isDealer ? '307' : '240'"
            :height="isDealer ? '42vh' : '30vh'"
            max-width="288"
            :disabled="selectedTwo || selectedGroups.length > 1 && !selectedGroups.includes(metricGroup)"
            :elevation="!selectedGroups.includes(metricGroup) ? 0 : 16"
        >
            <v-card-item>
                <div>
                <div :class="text-overline">
                    {{ metricGroup.title }} <v-icon icon="mdi-check" v-if="selectedGroups.includes(metricGroup)"></v-icon>
                </div>
                <div class="text-caption align-justify">{{ metricGroup.description }}</div>
                </div>
                <span class="pt-0" v-for="(avatar, index) in avatars" :key="index" size="32">
                    <v-avatar v-if="avatars?.length > 0 && isDealer && avatar?.value == metricGroup?.value" :key="avatar?.nickname" size="32">
                        <v-tooltip :text="avatar?.nickname">
                            <template v-slot:activator="{ props }">
                                <v-img v-bind="props" :src="`https://robohash.org/${avatar?.nickname}`"></v-img>
                            </template>
                        </v-tooltip>
                    </v-avatar>
                </span>
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
            metricsGroup: this.getMetricsGroup(),
            selectedTwo: this.choose
        }
    },
    props: {
        isDealer: {
            required: false,
            type: Boolean,
            default: false
        },
        choose: {
            required: false,
            type: Boolean,
            default: false,

        },
        avatars: {
            required: false,
            type: Array,
            default: []
        },
    },
    methods: {
        selectGroup(metricGroup) {
            console.log(this.selectedGroups)
            console.log(this.selectedTwo)
            if (!this.isDealer && !this.selectedTwo) {
                const index = this.selectedGroups.indexOf(metricGroup)
                index != -1 ? this.selectedGroups.splice(index, 1) : this.selectedGroups.push(metricGroup)
                if ( this.selectedGroups.length == 2) {
                    this.$emit('sendGroupsToFather', this.selectedGroups)
                }
            }
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