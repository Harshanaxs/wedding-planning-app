<template>
  <div>
    <adminlayout>
      <v-row slot="main" no-gutters>
        <v-col cols="12">
          <div>
            <v-data-table
              :headers="headers"
              :items="vendors"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Vendors</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="dialog" max-width="500px">
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
                                type="text"
                                name="category"
                                label="Category"
                                v-model="editedItem.address"
                              />
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                              <FormulateInput
                                type="textarea"
                                name="description"
                                label="Description"
                                v-model="editedItem.mobile"
                              />
                            </v-col>

                            <v-col>
                              <h4>{{ editedItem.status }}</h4>
                              <FormulateInput
                                v-model="editedItem.status"
                                :options="[
                                  { value: '1', label: 'Approve' },
                                  { value: '2', label: 'Reject' }
                                ]"
                                type="select"
                                placeholder="Approval Status"
                                label="Approval"
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
import { db, fb } from "@/firebase.js";
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
          text: "Name",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "Mobile", value: "mobile" },
        { text: "Address", value: "address" },

        { text: "Actions", value: "actions", sortable: false }
      ],
      vendors: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        category: "",
        status: 0
      },
      defaultItem: {
        name: "",
        category: "",
        status: 0
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
      this.editedIndex = this.vendors.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    fbDelete: function(item) {
      db.collection("vendors")
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
        console.log(dataObj);
        db.collection("vendors")
          .doc(this.vendors[this.editedIndex].id)
          .set(dataObj);
      } else {
        db.collection("vendors").add(
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
    vendors: db.collection("vendors")
  }
};
</script>
