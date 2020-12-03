<template>
  <v-container>
    <h2 class="mb-8">Admin</h2>
    <h3>Users</h3>

    <v-data-table
      :headers="headers"
      :items="users"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:item.processed="{ item }">
        <v-chip class="green white--text" v-if="item.processed"
          >Processed</v-chip
        >
        <v-chip class="yellow " v-if="!item.processed">New</v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { db } from "@/firebase.js";
export default {
  name: "Admin",
  components: {},
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" }
      ],
      users: []
    };
  },
  methods: {
    initData: function() {
      db.collection("users")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.users.push(doc.data());
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    this.initData();
  }
};
</script>
