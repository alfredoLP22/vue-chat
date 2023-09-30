<template>
  <div id="app">
    <div v-if="!username">
      <label for="username">Enter your username:</label>
      <input v-model="inputUsername" type="text" id="username" />
      <button @click="joinChat">Join Chat</button>
    </div>
    <div v-else>
      <div id="chat" ref="chat">
        <h3>{{ username }}</h3>
        <div
          v-for="msg in messages"
          :key="msg._id"
          :class="{
            incoming: msg.username !== username,
            outgoing: msg.username === username,
          }"
        >
          <strong>{{ msg.username }} {{ msg.timestamp}}</strong
          >: {{ msg.message }}
        </div>
      </div>
      <div>
        <input
          v-model="inputMessage"
          type="text"
          id="message"
          placeholder="Type your message"
          required
        />
        <p class="error">{{ error }}</p>
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: null,
      inputUsername: "",
      inputMessage: "",
      messages: [],
      error: "",
    };
  },
  props: {
    socket: Object,
  },
  async mounted() {
    const room = "room1";
    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}api/messages/${room}`
    );
    const data = await response.json();
    this.messages = data;

    // Connect to socket.io for real-time updates
    this.socket.on("load messages", (messages) => {
      this.messages = messages;
      this.scrollChat();
    });

    this.socket.on("chat message", (msg) => {
      this.messages.push(msg);
      this.scrollChat();
    });
  },
  methods: {
    joinChat() {
      this.username = this.inputUsername;
      this.socket.emit("join", "room1", this.username);
    },
    sendMessage() {
      const message = this.inputMessage;
      if (message.trim() !== "") {
        this.socket.emit("chat message", { username: this.username, message });
        this.inputMessage = "";
      } else {
        this.error = "Message are required";
        setTimeout(() => {
          this.error = "";
        }, 3000);
        return;
      }
    },
    formattedTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },
    scrollChat() {
      this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
    },
    formatDate(date) {
      const dateObject = new Date(date);
      return dateObject.toLocaleDateString();
    },
  },
};
</script>

<style>
#app {
  max-width: 600px;
  margin: 0 auto;
  font-family: "Arial", sans-serif;
}

.username-container {
  margin-top: 20px;
}

#chat {
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(43, 42, 42, 0.315);
  border-radius: 0.5rem;
  padding: 10px;
  margin-bottom: 10px;
  width: 20vw;
  display: flex;
  flex-direction: column;
}

#chat div {
  margin-bottom: 5px;
  padding: 8px;
  border-radius: 5px;
  width: 10vw;
}

.incoming {
  background-color: #f2f2f2;
  text-align: left;
}

.outgoing {
  background-color: #d9f9b1;
  text-align: right;
  align-self: self-end;
}

.input-container {
  display: flex;
  margin-top: 10px;
}

input {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  display: flex;
  width: 95%;
  justify-content: center;
  align-items: center;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.5rem;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: #45a049;
}
.error {
  color: rgba(255, 0, 0, 0.918);
  font-size: 0.9rem;
}
</style>
