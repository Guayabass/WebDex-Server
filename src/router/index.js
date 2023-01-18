import { createRouter, createWebHistory } from "vue-router";
import ViewPokemon from "../views/ViewPokemon.vue";
import SpritePokemon from "../components/PokemonSprite.vue";
import StatsPokemon from "../components/PokemonStats.vue";
import Main from "../views/MainPokemon.vue";
import Home from "../views/LandingPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/pokemon",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/pokemon",
    name: "Main",
    component: Main,
    children: [
        {
            path: ":name",
            name: "PokemonSprite",
            component: SpritePokemon,
            props: true,
        },
        {
            path: ":name/stats",
            name: "PokemonStats",
            component: StatsPokemon,
            props: true,
        }
    ],
  },
  {
    path: "/pokemon/:name/share",
    name: "Share",
    component: ViewPokemon,
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
