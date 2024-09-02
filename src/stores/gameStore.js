import { defineStore } from "pinia";
import { io } from "socket.io-client"

export const useGameStore = defineStore("game", {
    state: () => ({
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
        }
    }
})