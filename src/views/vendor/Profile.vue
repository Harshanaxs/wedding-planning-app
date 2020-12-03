<template>
  <div>
    <layout>
      <v-row slot="main" no-gutters>
        <v-col cols="12">
          <div>
            <v-card class="mx-auto" width="600px">
              <v-card-title>
                <h3>Profile</h3>
                <v-chip color="primary" class="ml-4">{{
                  vendor.status | userStatus
                }}</v-chip>
              </v-card-title>
              <v-card-text>
                <FormulateForm class="mx-auto" @submit="sendData">
                  <p>Avatar</p>
                  <img
                    :src="vendor.img"
                    alt="John"
                    height="200px"
                    width="200px"
                  />
                  <FormulateInput
                    type="text"
                    name="name"
                    label="Name"
                    v-model="vendor.name"
                  />
                  <FormulateInput
                    type="email"
                    name="email"
                    label="Email"
                    v-model="vendor.email"
                  />
                  <FormulateInput
                    type="number"
                    name="name"
                    label="Mobile"
                    v-model="vendor.mobile"
                  />
                  <FormulateInput
                    type="text"
                    name="name"
                    label="Address"
                    v-model="vendor.address"
                  />

                  <FormulateInput type="submit" label="Save profile" />
                </FormulateForm>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import layout from "@/components/layout";
import { fb, db } from "@/firebase.js";
export default {
  components: {
    layout
  },
  data: function() {
    return {
      status: "Pending",
      vendor: null
    };
  },
  computed: {
    ...mapGetters(["user"]),

    xuser: function() {
      return this.user;
    }
  },
  created() {
    db.collection("vendors")
      .doc(this.xuser.data.uid)
      .get()
      .then(doc => {
        console.log(doc.data());
        this.vendor = doc.data();
      });
  },
  filters: {
    userStatus: function(value) {
      if (value == 0) {
        return "Pending";
      } else if (value == 1) {
        return "Approved";
      } else {
        return "Rejected";
      }
    }
  },
  methods: {
    uploadImageGallery: function(e) {
      let file = e.target.files[0];
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
          console.log("no state change");
        },
        () => {
          // Handle unsuccessful uploads
          console.log("no state change X");
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  }
};
</script>
