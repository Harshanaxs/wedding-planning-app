<template>
 <layout>
    <div slot="main">
       <div>
   <v-container>
     <v-row>
         <v-col cols="3">
            <v-card
              elevation="16"
              min-width="200px"
              max-width="400"
              class="mx-auto"
              height="100%"
            >
              <v-virtual-scroll
                :items="users"
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
       <v-col  cols="4">

    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :icons="icons"
      :open="openChat"
      :showEmoji="true"
      :showFile="true"
      :showEdition="true"
      :showDeletion="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="false"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage" />
       </v-col>
     </v-row>
   </v-container>
  </div>
    </div>
 </layout>
</template>


<script>
import {mapGetters} from 'vuex';
 import {db} from "@/firebase.js"
import layout from '@/components/layout'
export default {
  name: 'app',
  components:{
    layout
  },
  data() {
    return {
      messages:[],
     
      participants: [
        {
          id: 'user1',
          name: 'Matteo',
        },
        {
          id: 'user2',
          name: 'Support',
        }
      ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
          
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: true, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  computed:{
         ...mapGetters(['user']),

   xuser:function(){
     return this.user;
   },
      users:function(){
     var flags = [], output = [], l = this.messages.length, i;
for( i=0; i<l; i++) {
    if( flags[this.messages[i].userId]) continue;
    flags[this.messages[i].userId] = true;
    output.push(this.messages[i]);
}
  return output;
      }
  },
  methods: {
    setActiveChat(){
      this.messages.forEach(element => {
        let isMe = function(){
          if(element.senderId == this.xuer.data.uid){
            return 'me'
          }else {
            return 'user1'
          }
        }
        let msgt = { type: 'text', author: isMe, data: { text: element.message } };
        this.messageList.push(msgt);

      

    });
     },
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
        this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
      }
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    },
    handleScrollToTop () {
      // called when the user scrolls message list to top
      // leverage pagination for loading another page of messages
    },
    handleOnType () {
      console.log('Emit typing event')
    },
    editMessage(message){
      const m = this.messageList.find(m=>m.id === message.id);
      m.isEdited = true;
      m.data.text = message.data.text;
    }
  },
  firestore:{
    messages:db.collection("messages")
  }
}

</script>