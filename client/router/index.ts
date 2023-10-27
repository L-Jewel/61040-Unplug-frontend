import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import CreatePostView from "../views/CreatePostView.vue";
import ExploreView from "../views/ExploreView.vue";
import HomeView from "../views/HomeView.vue";
import LimitView from "../views/LimitView.vue";
import LoginView from "../views/LoginView.vue";
import NexusView from "../views/NexusView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import RelatedPostsView from "../views/RelatedPostsView.vue";
import ScreenTimeReport from "../views/ScreenTimeReportView.vue";
import SearchView from "../views/SearchView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/nexus",
      name: "Nexus",
      component: NexusView,
      meta: { requiresAuth: true },
    },
    {
      path: "/search",
      name: "Search",
      component: SearchView,
      meta: { requiresAuth: true },
    },
    {
      path: "/post",
      name: "Create Post",
      component: CreatePostView,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requriesAuth: true },
    },
    {
      path: "/screen-time-report",
      name: "Screen Time Report",
      component: ScreenTimeReport,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/explore/:username(.*)",
      name: "Explore",
      component: ExploreView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/related-posts/:post(.*)",
      name: "Related Posts",
      component: RelatedPostsView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/limited",
      name: "Limit",
      component: LimitView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn, isUserLimited } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  } else if (to.name !== "Limit" && isLoggedIn.value && isUserLimited.value) {
    return { name: "Limit" };
  } else if (to.name === "Login" && isLoggedIn.value) {
    return { name: "Nexus" };
  } else if (to.name === "Explore" && !to.params.username) {
    return { name: "Search" };
  }
});

export default router;
