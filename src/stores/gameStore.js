import { defineStore } from "pinia";
import { io } from "socket.io-client"
import api from '../api';

export const useGameStore = defineStore("game", {
    state: () => ({
        gameId: null,
        gameState: {},
        socket: null
    }),
    actions: {
        initSocket() {
            this.socket = io("localhost:3000")

            this.socket.on("gameState", (newState) => {
                this.gameState = newState;
            })
        },
        sendGameAction(action) {
            this.socket.emit("gameAction", action);
        },
        async setupGame() {
            const response = await api.get('/api/game/setup');
            this.gameId = response.data.gameId;
        },
        async joinGame(gameId) {
            await api.get(`/game/join/${gameId}`);
            // Atualizar o estado conforme necessário
        }
    }
})
