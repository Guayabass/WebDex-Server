<script setup>
import PokemonSearch from './components/PokemonSearch.vue';
import Pokemon from './components/Pokemon.vue';
import NavBar from './components/NavBar.vue';
import CustomIVsModal from './components/customIVsModal.vue';
import CustomEVsModal from './components/customEVsModal.vue';
import CustomNatureModal from './components/customNatureModal.vue';

import { usePokemonStore } from '../src/stores/pokemonStore';

const pokemonStore = usePokemonStore()

</script>

<template>
  <main id="PokemonApp">
    <NavBar></NavBar>
    <PokemonSearch></PokemonSearch>
    <Pokemon ></Pokemon>
    <Transition name="fade">
      <CustomIVsModal v-if="pokemonStore.showIVs"></CustomIVsModal>
    </Transition>
    <Transition name="fade">
      <CustomEVsModal v-if="pokemonStore.showEVs"></CustomEVsModal>
    </Transition>
    <Transition name="fade">
      <CustomNatureModal v-if="pokemonStore.showNature"></CustomNatureModal>
    </Transition>
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
</style>
