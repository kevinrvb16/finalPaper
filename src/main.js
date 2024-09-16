/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
// src/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.YOUR_SUPABASE_URL
const supabaseAnonKey = process.env.YOUR_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia)
registerPlugins(app)

app.mount('#app')
