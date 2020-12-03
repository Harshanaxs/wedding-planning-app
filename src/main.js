import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";
import "./assets/formulate.css";
import { firestorePlugin } from "vuefire";
import VueChatScroll from "vue-chat-scroll";
Vue.use(VueChatScroll);

import VueFormulate from "@braid/vue-formulate";
import Chat from "vue-beautiful-chat";

Vue.use(Chat);

Vue.use(VueFormulate);
Vue.use(firestorePlugin);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    store.dispatch("fetchUser", user);
  } else {
    // No user is signed in.
  }
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
