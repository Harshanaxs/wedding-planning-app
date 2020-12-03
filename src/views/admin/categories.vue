<template>
  <div>
    <adminlayout>
      <v-row slot="main" no-gutters>
        <v-col cols="12">
          <div>
            <v-data-table
              :headers="headers"
              :items="categories"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>categories</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        v-bind="attrs"
                        v-on="on"
                        >New Category</v-btn
                      >
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="6">
                              <FormulateInput
                                type="text"
                                name="category"
                                label="Category"
                                v-model="editedItem.label"
                              />
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close"
                          >Cancel</v-btn
                        >
                        <v-btn color="blue darken-1" text @click="save"
                          >Save</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item.id)">
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              </template>
            </v-data-table>
          </div>
        </v-col>
      </v-row>
    </adminlayout>
  </div>
</template>

<script>
import { db } from "@/firebase.js";
import adminlayout from "@/components/admin_layout.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    adminlayout
  },
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "Category",
          align: "start",
          sortable: false,
          value: "label"
        },
        { text: "Actions", value: "actions", sortable: false }
      ],
      categories: [],
      editedIndex: -1,
      editedItem: {
        label: ""
      },
      defaultItem: {
        label: ""
      }
    };
  },

  computed: {
    ...mapGetters(["user"]),
    xsuer: function() {
      return this.user;
    },

    formTitle() {
      return this.editedIndex === -1 ? "New Category" : "Edit Category";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {},

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    fbDelete: function(item) {
      db.collection("categories")
        .doc(item)
        .delete();
    },

    deleteItem(item) {
      // const index = this.clients.indexOf(item)
      console.log(item);
      confirm("Are you sure you want to delete this item?") &&
        this.fbDelete(item);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        var dataObj = Object.assign(
          { value: this.editedItem.label },
          this.editedItem
        );
        console.log(dataObj);
        db.collection("categories")
          .doc(this.categories[this.editedIndex].id)
          .set(dataObj);
      } else {
        db.collection("categories").add(
          Object.assign({ value: this.editedItem.label }, this.editedItem)
        );
      }
      this.close();
    }
  },
  firestore: {
    categories: db.collection("categories")
  }
};
</script>
