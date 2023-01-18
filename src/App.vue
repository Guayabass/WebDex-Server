<script setup>
// import { usePokemonStore } from '../src/stores/pokemonStore';
// import PokemonSearch from './components/PokemonSearch.vue';
// import Pokemon from './components/Pokemon.vue';
// import NavBar from './components/NavBar.vue';
// import CustomIVsModal from './components/customIVsModal.vue';
// import CustomEVsModal from './components/customEVsModal.vue';
// import CustomNatureModal from './components/customNatureModal.vue';
// const pokemonStore = usePokemonStore();


</script>

<template>
    <main id="PokemonApp">
     <!-- <router-link to="/pokemon/test">pokemon</router-link>  -->
   <router-view/> 
  </main>
</template>


<style scoped> 
/** applies only to this component because of scoped */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#PokemonApp {
  width: 80%;
  height: 100vh;
  background-color: white;
  margin: 0 auto;
}

.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    opacity: 1;
}

.fade-enter-active {
    transition: opacity 800ms ease;
}

.fade-leave-from {
    opacity: 1;
}

.fade-leave-to {
    opacity: 0;
}

.fade-leave-active {
    transition: opacity 800ms ease;
}

@media only screen and (max-width: 768px) {
  #PokemonApp{
    width: 100%;
  }
}
</style>
