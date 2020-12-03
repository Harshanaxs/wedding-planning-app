<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-main>
          <v-container class="fill-height" fluid>
            <v-row align="center" justify="center">
              <v-col>
                <FormulateForm class="mx-auto" @submit="submit">
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-card width="600px" class="ma-auto">
                          <v-card-title>
                            <h2>Welcome To the Admin Login</h2>
                          </v-card-title>
                          <v-card-text>
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
                          </v-card-text>
                          <v-card-actions>
                            <FormulateInput
                              type="submit"
                              label="Log In"
                              @click="submit"
                            />
                          </v-card-actions>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </FormulateForm>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-app>
    </v-app>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  data: () => ({
    valid: false,
    email: "",
    password: ""
  }),
  methods: {
    async submit() {
      await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(data => {
          console.log(data);
          this.$router.replace({ name: "admin_approvals" });
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }
};
</script>
