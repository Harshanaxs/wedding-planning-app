import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: {
        displayName: "",
        email: null,
        uid: null,
        vendorName: null
      }
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  },
  mutations: {
    SET_LOGGED_IN(state) {
      state.user.loggedIn = true;
    },
    SET_USER(state, data) {
      state.user.data.displayName = data.displayName;
      state.user.data.email = data.email;
      state.user.data.uid = data.uid;
      state.user.data.vendorName = data.displayName;
    },
    SIGN_OUT(state) {
      state.user.loggedIn = false;
      state.user.data.displayName = null;
      state.user.data.email = null;
      state.user.data.uid = null;
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      console.log("fetchUser");
      commit("SET_LOGGED_IN");

      commit("SET_USER", user);
      console.log(user);
      // console.log(this.state.user);
    },
    signOut({ commit }) {
      commit("SIGN_OUT");
    }
  },
  modules: {}
});
