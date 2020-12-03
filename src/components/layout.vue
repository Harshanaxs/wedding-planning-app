<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
          <v-list dense>
            <v-list-item link router :to="'/vendor/profile'">
              <v-list-item-action>
                <v-icon>mdi-face-profile</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <div v-if="isApproved == 1">
              <v-list-item
                v-for="link in links"
                :key="link.text"
                link
                router
                :to="link.route"
              >
                <v-list-item-action>
                  <v-icon>{{ link.icon }}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ link.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </div>

            <v-list-item link @click="signOut">
              <v-list-item-action>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Sign Out</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-main>
          <v-container class="fill-height mt-0 pt-0" fluid>
            <slot name="main"></slot>
          </v-container>
        </v-main>
        <v-footer color="indigo" app>
          <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
        </v-footer>
      </v-app>
    </v-app>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from "@/firebase.js";
import { mapGetters } from "vuex";
export default {
  props: {
    source: String
  },

  data: () => ({
    status: 0,
    drawer: null,
    links: [
      {
        icon: "mdi-toolbox-outline",
        text: "Services",
        route: "/vendor/services"
      },
      { icon: "mdi-forum", text: "Chat", route: "/vendor/chat" }
    ]
  }),
  computed: {
    ...mapGetters(["user"]),

    xuser: function() {
      return this.user;
    },
    isApproved: function() {
      return this.status;
    }
  },
  created() {
    this.checkUser();
  },
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("signOut");

          this.$router.replace({
            name: "Login"
          });
        });
    },

    async checkUser() {
      await db
        .collection("vendors")
        .doc(this.xuser.data.uid)
        .get()
        .then(doc => {
          console.log(doc.data());
          this.status = doc.data().status;
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
  }
};
</script>
