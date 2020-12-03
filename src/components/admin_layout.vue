<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
          <v-list dense>
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
export default {
  props: {
    source: String
  },

  data: () => ({
    drawer: null,
    links: [
      //{icon:'mdi-home',text:'Home',route:'/'},
      {
        icon: "mdi-check-underline-circle-outline",
        text: "Approvals",
        route: "/admin/approvals"
      },
      //{icon:'mdi-account',text:'Users',route:'/admin/user'},
      { icon: "mdi-account-tie", text: "Vendors", route: "/admin/vendors" },
      {
        icon: "mdi-toolbox-outline",
        text: "Services",
        route: "/admin/services"
      },

      { icon: "mdi-creation", text: "Categories", route: "/admin/categories" }
    ]
  }),
  methods: {
    signOut: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.dispatch("signOut");

          this.$router.replace({
            name: "adminLogin"
          });
        });
    }
  }
};
</script>
