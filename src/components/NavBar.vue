<template>
    <nav id="nav">
        <div class="nav-container" :class="{ 'disabled-events': checkFalse() }">
            <figure class="pokedex-image-figure">
                <img src="../assets/images/pokedex.png" class="pokedex-nav-image">
            </figure>
            <p class="nav-title">WebDex</p>
        </div>
    </nav>
</template>

<script>
import { usePokemonStore } from '../stores/pokemonStore.js';

export default {
    name: 'NavBar',
    methods: {
        checkFalse() {
            const pokemonStore = usePokemonStore();
            if (pokemonStore.showNature || pokemonStore.showIVs || pokemonStore.showEVs){
                return true
            } else {
                return false
            }
        }
    }
}

</script>

<style>

@import url('https://fonts.cdnfonts.com/css/pokemon-solid');

#nav {
    width: 100%;
    height: 15%;
    /**background-color: #f5f5f5;**/
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
}

.disabled-events {
    pointer-events: none;
}

.nav-title {
    font-family: 'Pokemon Solid', sans-serif;
    color: #207fb6;
    font-size: 42px;
    margin: 0;
}

.nav-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.pokedex-nav-image:hover {
    transform: scale(1.1);
    transition: all 350ms ease;
}

.pokedex-nav-image:not(:hover) {
    transform: scale(1);
    transition: all 350ms ease;
}

.nav-title:hover {
    transform: scale(1.1);
    transition: all 350ms ease;
}

.nav-title:not(:hover) {
    transform: scale(1);
    transition: all 350ms ease;
}

.pokedex-image-figure {
    margin: 8px 0 8px 0;
}

</style>