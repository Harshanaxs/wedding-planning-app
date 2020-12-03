<template>
  <v-row>
    <v-col cols="12">
      <div class="mx-auto">
        <v-card width="600px">
          <v-card-title>
            <h3>Register</h3>
          </v-card-title>
          <v-card-text>
            <FormulateForm class="mx-auto" @submit="register">
              <FormulateInput
                @change="uploadImageGallery"
                type="image"
                name="avatar"
                label="Your avatar"
                multiple
              />

              <FormulateInput
                type="text"
                name="name"
                label="Name"
                v-model="name"
                validation="required"
              />
              <FormulateInput
                type="email"
                name="email"
                label="Email"
                v-model="email"
                validation="required|email"
              />
              <FormulateInput
                type="password"
                name="password"
                label="Password"
                validation="required"
                v-model="password"
              />
              <FormulateInput
                type="password"
                name="password_confirm"
                label="Confirm Password"
                validation="required|confirm"
                validation-name="Password confirmation"
              />
              <FormulateInput
                type="number"
                name="mobile"
                label="Mobile"
                v-model="mobile"
              />
              <FormulateInput
                type="textarea"
                name="address"
                label="Address"
                v-model="address"
                validation="required"
              />
              <FormulateInput
                type="textarea"
                name="description"
                label="Description"
                v-model="description"
              />

              <FormulateInput type="submit" label="Save profile" />
            </FormulateForm>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import firebase from "firebase";
import { db, fb } from "@/firebase.js";
export default {
  data() {
    return {
      name: null,
      email: null,
      password: null,
      mobile: null,
      address: null,
      img: null,
      description: null
    };
  },
  methods: {
    uploadImageGallery: function(e) {
      this.img = null;
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
            this.img = downloadURL;
          });
        }
      );
    },
    register: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(res => {
          console.log(res.user.uid);
          res.user.updateProfile({
            displayName: this.name,
            photoURL: this.img
          });
          db.collection("vendors")
            .doc(res.user.uid)
            .set({
              name: this.name,
              email: this.email,
              mobile: this.mobile,
              address: this.address,
              img: this.img,
              description: this.description,
              status: 0
            })
            .then(() => {
              this.$router.replace({ name: "vendor_profile" });
            });
        })
        .catch(function(error) {
          // Handle Errors here.

          console.log(error);
          // ...
        });
    }
  }
};
</script>
