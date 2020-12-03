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
                :items="chatUsers"
                height="500"
                item-height="64"
              >
                <template v-slot:default="{ item, i }">
                  <v-list-item @click="setActiveChat(item)" link :key="i">
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
            <ul
              v-chat-scroll
              class="bg-gray-800 m-0 px-8 py-4 overflow-x-auto"
              style="height: 50vh;"
            >
              <li class="m-4 p-4 bg-white">
                Okay, let's see what vue-chat-scroll can do.
              </li>
              <li
                class="m-4 p-4 bg-white"
                v-for="message in messages"
                :key="message"
              >
                {{ message }}
              </li>
            </ul>
          </v-col>
          {{ chatUsers }}
          <v-card>
            <v-card-text>
              {{ messages }}
            </v-card-text>
          </v-card>
          <v-spacer></v-spacer>
        </v-row>
      </v-container>
    </layout>
  </div>
</template>

<script>
import layout from "@/components/layout.vue";
import "vue-quick-chat/dist/vue-quick-chat.css";
import { db } from "@/firebase.js";
import { mapGetters } from "vuex";

export default {
  components: {
    layout
  },
  data() {
    return {
      users: [],
      xchats: [],
      chats: [],
      visible: true,
      participants: [],
      activeUser: "",
      chatTitle: "Requests",
      placeholder: "send your message",
      colors: {
        header: {
          bg: "#d30303",
          text: "#fff"
        },
        message: {
          myself: {
            bg: "#fff",
            text: "#bdb8b8"
          },
          others: {
            bg: "#fb4141",
            text: "#fff"
          },
          messagesDisplay: {
            bg: "#f7f3f3"
          }
        },
        submitIcon: "#b91010",
        submitImageIcon: "#b91010"
      },
      borderStyle: {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px"
      },
      hideCloseButton: false,
      submitIconSize: 25,
      closeButtonIconSize: "20px",
      asyncMode: true,
      toLoad: [],
      scrollBottom: {
        messageSent: false,
        messageReceived: false
      },
      displayHeader: true,
      profilePictureConfig: {
        others: true,
        myself: true,
        styles: {
          width: "30px",
          height: "30px",
          borderRadius: "50%"
        }
      },
      timestampConfig: {
        format: "HH:mm",
        relative: false
      },
      // there are other options, you can check them here
      // https://soapbox.github.io/linkifyjs/docs/options.html
      linkOptions: {
        myself: {
          className: "myLinkClass",
          events: {
            click: function(e) {
              alert("Link clicked!");
              console.log(e);
            },
            mouseover: function(e) {
              alert("Link hovered!");
              console.log(e);
            }
          },
          format: function(value, type) {
            if (type === "url" && value.length > 50) {
              value = value.slice(0, 50) + "…";
            }
            return value;
          }
        },
        others: {
          className: "othersLinkClass",
          events: {
            click: function(e) {
              alert("Link clicked!");
              console.log(e);
            },
            mouseover: function(e) {
              alert("Link hovered!");
              console.log(e);
            }
          },
          format: function(value, type) {
            if (type === "url" && value.length > 50) {
              value = value.slice(0, 50) + "…";
            }
            return value;
          }
        }
      }
    };
  },
  computed: {
    ...mapGetters(["user"]),
    messages: function() {
      var msgarr = this.chats.filter(el => {
        return el.participantId == this.activeUser.userId;
      });
      return msgarr;
    },
    xuser: function() {
      return this.user;
    },
    myself: function() {
      return {
        name: this.xuser.data.displayName,
        id: this.xuser.data.uid,
        profilePicture:
          "https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg"
      };
    },

    chatUsers: function() {
      var array = this.chats;
      var flags = [],
        output = [],
        l = array.length,
        i;

      for (i = 0; i < l; i++) {
        if (flags[array[i].userId]) continue;
        flags[array[i].userId] = true;
        output.push(array[i]);
      }
      return output;
    },
    groups: function() {
      function groupBy(array, key) {
        const result = {};
        array.forEach(item => {
          if (!result[item[key]]) {
            result[item[key]] = [];
          }
          result[item[key]].push(item);
        });
        return result;
      }
      return groupBy(this.xchats, "userName");
    }
  },
  created() {
    this.fetchData();
  },
  firestore: {
    users: db.collection("users")
  },

  methods: {
    fetchData: function() {
      db.collection("messages")
        .where("vendorId", "==", this.xuser.data.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            var self;
            this.xchats.push(doc.data());
            if (doc.data().sender == doc.data().vendorId) {
              self = true;
            } else {
              self = false;
            }
            this.chats.push(
              Object.assign(
                {},
                {
                  content: doc.data().message,
                  myself: self,
                  participantId: doc.data().userId,
                  timestamp: doc.data().createdAt,
                  type: "text"
                }
              )
            );
            //console.log(this.messages);
          });
        });
    },
    setActiveChat: function(user) {
      let tempUser = {};
      this.activeUser = user;
      tempUser = {
        name: user.userName,
        id: user.userId,
        profilePicture:
          "https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/NafSadh_Profile.jpg/768px-NafSadh_Profile.jpg"
      };

      this.participants = [];
      this.participants.push(tempUser);

      // console.log(this.activeChat);
    },
    onType: function(event) {
      //here you can set any behavior
      console.log(event);
    },
    loadMoreMessages(resolve) {
      setTimeout(() => {
        resolve(this.toLoad); //We end the loading state and add the messages
        //Make sure the loaded messages are also added to our local messages copy or they will be lost
        this.messages.unshift(...this.toLoad);
        this.toLoad = [];
      }, 1000);
    },
    onMessageSubmit: function(message) {
      /*
       * example simulating an upload callback.
       * It's important to notice that even when your message wasn't send
       * yet to the server you have to add the message into the array
       */
      this.messages.push(message);

      /*
       * you can update message state after the server response
       */
      // timeout simulating the request
      setTimeout(() => {
        message.uploaded = true;
      }, 2000);
    },
    onClose() {
      this.visible = false;
    },
    onImageSelected(files, message) {
      let src =
        "https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg";
      this.messages.push(message);
      /**
       * This timeout simulates a requisition that uploads the image file to the server.
       * It's up to you implement the request and deal with the response in order to
       * update the message status and the message URL
       */
      setTimeout(
        res => {
          message.uploaded = true;
          message.src = res.src;
        },
        3000,
        { src }
      );
    },
    onImageClicked(message) {
      /**
       * This is the callback function that is going to be executed when some image is clicked.
       * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
       */
      console.log("Image clicked", message.src);
    }
  }
};
</script>
