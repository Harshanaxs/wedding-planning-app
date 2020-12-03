import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import VendorLogin from "../views/vendor/Login.vue";
import VendorChat from "../views/vendor/Chat.vue";

import VendorSignUp from "../views/vendor/SignUp.vue";
import VendorProfile from "../views/vendor/Profile.vue";
import VendorServices from "../views/vendor/Services.vue";
import adminVendors from "../views/admin/vendors.vue";
import adminCategories from "../views/admin/categories.vue";
import adminReports from "../views/admin/reports.vue";
import adminServices from "../views/admin/services.vue";
import adminLogin from "../views/admin/login.vue";

import firebase from "firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: VendorLogin
  },
  {
    path: "/admin",
    name: "adminLogin",
    component: adminLogin
  },
  {
    path: "/vendor/signup",
    name: "vendor_signup",
    component: VendorSignUp
  },
  {
    path: "/vendor/profile",
    name: "vendor_profile",
    component: VendorProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/vendor/services",
    name: "vendor_services",
    component: VendorServices,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin/approvals",
    name: "admin_approvals",
    component: adminVendors
  },
  {
    path: "/vendor/chat",
    name: "vendor_chat",
    component: VendorChat,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/admin/categories",
    name: "admin_categories",
    component: adminCategories
  },
  {
    path: "/admin/vendors",
    name: "admin_reports",
    component: adminReports
  },
  {
    path: "/admin/services",
    name: "admin_services",
    component: adminServices
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !(await firebase.getCurrentUser())) {
    next("login");
  } else {
    next();
  }
});

export default router;
