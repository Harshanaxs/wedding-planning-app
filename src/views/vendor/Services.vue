<template>
  <div>
    <layout>
      <v-row slot="main" no-gutters>
        <v-col cols="12">
          <div>
            <v-data-table
              :headers="headers"
              :items="services"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>services</v-toolbar-title>
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
                        >New service</v-btn
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
                                name="name"
                                label="Name"
                                v-model="editedItem.name"
                              />
                            </v-col>

                            <v-col cols="12" sm="6" md="6">
                              <FormulateInput
                                type="select"
                                :options="categories"
                                label="Category"
                                v-model="editedItem.category"
                              />
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <FormulateInput
                                type="textarea"
                                name="description"
                                label="Description"
                                v-model="editedItem.description"
                              />
                            </v-col>

                            <v-col>
                              <FormulateInput
                                @change="uploadImageGallery"
                                type="image"
                                name="avatar"
                                label="Images"
                                multiple
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
    </layout>
  </div>
</template>

<script>
import { db, fb } from "@/firebase.js";
import layout from "@/components/layout.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    layout
  },
  data() {
    return {
      categories: [],
      dialog: false,
      headers: [
        {
          text: "Service",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Category", value: "category" },
        { text: "Description", value: "description" },

        { text: "Actions", value: "actions", sortable: false }
      ],
      servicesFb: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        category: "",
        description: "",
        images: []
      },
      defaultItem: {
        name: "",
        category: "",
        description: "",
        images: []
      }
    };
  },

  computed: {
    ...mapGetters(["user"]),
    xsuer: function() {
      return this.user;
    },

    formTitle() {
      return this.editedIndex === -1 ? "New service" : "Edit service";
    },
    services() {
      return this.servicesFb.filter(s => s.vendorId === this.user.data.uid);
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
    uploadImageGallery: function(e) {
      var i;
      for (i = 0; i < e.target.files.length; i++) {
        let file = e.target.files[i];
        console.log(file);

        var storageRef = fb.storage().ref("profiles/" + file.name);
        let uploadTask = storageRef.put(file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          () => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            console.log("Uploading");
          },
          () => {
            // Handle unsuccessful uploads
            console.log("no state change X");
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log("Uploaded");
              console.log("File available at", downloadURL);
              this.editedItem.images.push(downloadURL);
            });
          }
        );
      }
    },
    initialize() {},

    editItem(item) {
      this.editedIndex = this.services.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    fbDelete: function(item) {
      db.collection("services")
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
          {
            vendorId: this.xsuer.data.uid,
            vendorName: this.xsuer.data.vendorName
          },
          this.editedItem
        );
        db.collection("services")
          .doc(this.services[this.editedIndex].id)
          .set(dataObj);
      } else {
        db.collection("services").add(
          Object.assign(
            {
              vendorId: this.xsuer.data.uid,
              vendorName: this.xsuer.data.vendorName
            },
            this.editedItem
          )
        );
      }
      this.close();
    }
  },
  firestore: {
    servicesFb: db.collection("services"),
    categories: db.collection("categories")
  }
};
</script>
