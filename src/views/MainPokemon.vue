<template>
    <section :class="{ 'disabled-events': checkFalse() }">
        <router-link :to="{ name: 'Home' }">
            <NavBar></NavBar>
        </router-link>
        <PokemonSearch></PokemonSearch>
        <router-view v-slot="{ Component }">
            <Transition name="page-fade" mode="out-in">
                <component :is="Component" />
            </Transition>
        </router-view>
        <Transition name="fade">
            <CustomIVsModal v-if="pokemonStore.showIVs"></CustomIVsModal>
        </Transition>
        <Transition name="fade">
            <CustomEVsModal v-if="pokemonStore.showEVs"></CustomEVsModal>
        </Transition>
        <Transition name="fade">
            <CustomNatureModal v-if="pokemonStore.showNature"></CustomNatureModal>
        </Transition>
    </section>
</template>

<script setup>
import { usePokemonStore } from '../stores/pokemonStore';
import PokemonSearch from '../components/PokemonSearch.vue';
//import PokemonSprite from '../components/PokemonSprite.vue';
import NavBar from '../components/NavBar.vue';
import CustomIVsModal from '../components/customIVsModal.vue';
import CustomEVsModal from '../components/customEVsModal.vue';
import CustomNatureModal from '../components/customNatureModal.vue';
const pokemonStore = usePokemonStore();

const checkFalse = () => {
    if (pokemonStore.showNature || pokemonStore.showIVs || pokemonStore.showEVs) {
        return true
    } else {
        return false
    }
};

</script>

<style scoped>
.fade-enter-from {
    opacity: 0;
}

.disabled-events {
    pointer-events: none;
}

.page-fade-enter-active, .page-fade-leave-active {
    transition: opacity 800ms ease;
}

.page-fade-enter-to, .page-fade-leave-from{
    opacity: 1;
}

.page-fade-enter-from, .page-fade-leave-to{
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