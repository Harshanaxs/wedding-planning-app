<template>
  <div>
    <layout>
      <v-container slot="main">
        <v-row>
          <v-col cols="3">
            <v-card
              elevation="16"
              max-width="400"
              class="mx-auto"
              height="100%"
            >
              <v-virtual-scroll
                :bench="benched"
                :items="chatUsers"
                height="500"
                item-height="64"
              >
                <template v-slot:default="{ item }">
                  <v-list-item @click="setActiveChat(item.id)" link :key="item">
                    <v-list-item-action> </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.userName }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-card>
          </v-col>
          <v-col cols="7">
            <v-row>
              <v-col cols="12">
                <v-card v-for="(chat, i) in chats" :key="i">
                  <v-card-title>
                    {{ chat.createdAt | chatDate }}
                  </v-card-title>
                  <v-card-text>
                    <v-list>
                      <h3>{{ chat.message }}</h3>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10">
                <div class="typer">
                  <input
                    type="text"
                    placeholder="Type here..."
                    v-model="message"
                  />
                  <v-btn @click="sendMsg">
                    Send
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </layout>
  </div>
</template>

<script>
import layout from "@/components/layout";
import { db } from "@/firebase.js";
import { mapGetters } from "vuex";
export default {
  components: {
    layout
  },
  data: () => ({
    activeUser: "",
    defaultmessage: {
      createdAt: Date.now(),
      message: "",
      sender: "",
      vendorId: "",
      userId: ""
    },
    activeChat: [],
    text: "",
    messages: [],
    users: [],
    chats: [],
    items: [
      { header: "Chats" },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
        title: "Brunch this weekend?",
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`
      },
      { divider: true, inset: true }
    ]
  }),

  methods: {
    setActiveChat: function(userId) {
      this.activeUser = userId;
      this.activeChat = this.messages.filter(el => {
        return el.userId == userId && el.vendorId == this.xuser.data.uid;
      });
      console.log(this.activeChat);
    },
    sendMsg() {
      db.collection("messages")
        .add({
          createdAt: Date.now(),
          message: this.text,
          sender: this.xuser.data.uid,
          vendorId: this.xuser.data.uid,
          userId: this.activeUser
        })
        .then(() => {
          this.message = this.defaultmessage;
        });
    }
  },

  created() {
    db.collection("messages")
      .where("vendorId", "==", this.xuser.data.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          //console.log(doc.data());
          this.chats.push(doc.data());

          //const data = {}
        });
      });
  },
  computed: {
    ...mapGetters(["user"]),
    xuser: function() {
      return this.user;
    },
    chatUsers: function() {
      return this.messages.filter(el => {
        return el.vendorId == this.xuser.data.uid && el.sender != el.vendorId;
      });
    }
  },
  filters: {
    chatDate: function(value) {
      var tempDate = new Date(value);
      return tempDate.toLocaleDateString("en-US");
    }
  },
  firestore: {
    messages: db.collection("messages"),
    users: db.collection("users")
  }
};
</script>

<style></style>
