<template>
    <section class="pokemon-section" :class="{ 'disabled-events': checkFalse() }">
        <Transition name="button">
            <button class="pokemon-change" v-if="Object.entries(checkPokemon()).length > 0"
                :disabled="Object.entries(checkPokemon()).length === 0"
                :class="{ 'disabled': Object.entries(checkPokemon()).length === 0 }" @click="previousPokemon()"><i
                    class="fa-solid fa-chevron-left"></i></button>
            <!--the if is just there for transition purposes -->
        </Transition>
        <Transition name="fade" mode="out-in">
            <div class="pokemon" :class="{ 'disabled': stats }"
                v-if="Object.entries(checkPokemon()).length > 0 && !stats">
                <div class="info-container">
                    <h1 :class="colorText()">
                        {{ capitalize(checkPokemon().name) }}
                    </h1>
                    <button :class="colorTextBackground()" class="cry-button" :disabled="stats" @click="loadCry()"><i
                            class="fa-solid fa-play"></i>Cry</button>
                    <!-- <p class="cry-text">Cry</p> -->
                </div>
                <div class="text-wrapper">
                    <p class="sprite-text">Normal</p>
                </div>
                <div class="sprites-container">
                    <figure class="pokemon-figure">
                        <img class="pokemon-sprite" :src="loadSprite()" :alt="checkPokemon().name" />
                    </figure>
                    <figure class="pokemon-figure">
                        <img class="pokemon-sprite" :src="loadBackSprite()" :alt="checkPokemon().name" />
                    </figure>
                    <figure class="pokemon-figure">
                        <img class="pokemon-sprite" :src="loadShinySprite()" :alt="checkPokemon().name" />
                    </figure>
                    <figure class="pokemon-figure">
                        <img class="pokemon-sprite" :src="loadShinyBackSprite()" :alt="checkPokemon().name" />
                    </figure>
                </div>
                <div class="text-wrapper">
                    <p class="sprite-text">Shiny</p>
                </div>
                <div class="card-change-wrapper tooltip-container">
                    <button class="card-change" @click="stats = !stats" :disabled="stats"><i
                            class="fa-solid fa-chart-simple"></i></button>
                    <p class="tooltiptext">{{ 'Click to show ' + capitalize(checkPokemon().name) + ' stats!' }}</p>
                </div>
            </div>
            <div class="pokemon" :class="{ 'disabled': !stats }" v-else-if="stats">
                <div class="typings-container">
                    <h1>
                        Typings
                    </h1>
                    <ul class="typings">
                        <li class="pokemon-type" v-for="(type, index) in checkPokemon().types" :key="index"
                            :class="type.type.name + '-b'"><i :class="iconReturn(type.type.name)"></i>{{
                                    capitalize(type.type.name)
                            }}</li>
                    </ul>
                </div>
                <div class="stats-container">
                    <h1 class="stats-title">Stats</h1>
                    <ul class="stats">
                        <li v-for="(stat, index) in checkPokemon().stats" :key="index">
                            <div class="stat-name-wrapper">
                                <p class="stat-name">{{ returnStatNames(stat.stat.name) }}</p>
                            </div>
                            <div class="stat-base-wrapper" :class="colorTextBackground()"
                                :style="{ 'width': pokemonLevel * 0.70 + '%' }">
                                <p class="stat-base">{{ baseStatMultiplier(stat.stat.name, stat.base_stat, index) }}</p>
                            </div>
                        </li>
                        <div class="stats-button-container">
                            <button class="stats-button" @click="showIVModal()">Custom IVs</button>
                            <button class="stats-button" @click="showEVModal()">Custom EVs</button>
                            <button class="stats-button" @click="showNatureModal()">Custom Nature</button>
                            <!-- hacer un objeto para cada nombre de naturaleza con los tipos de ataque y si devuelve 0.9 o 1.1 -->
                        </div>
                    </ul>
                </div>
                <!-- <div class="checkbox-container">
                    <label class="toggler-wrapper label-checkbox">
                        <input type="checkbox" @change="this.level100 = !this.level100, timeoutToggle(),triggeredChangeStats = true">
                        <div class="toggler-slider">
                            <div class="toggler-knob"></div>
                        </div>
                    </label>
                </div> -->
                <div class="last-stats-wrapper">
                    <div class="slider-container">
                        <input type="range" min="1" max="100" id="myRange" v-model="pokemonLevel" class="slider"
                            :style="'background: linear-gradient(90deg, rgb(23, 114, 212) ' + pokemonLevel + '%, rgb(214, 214, 214) ' + pokemonLevel + '%);'">
                        <div class="slider-text-container">
                            <p class="slider-text">1</p>
                            <p class="slider-text">Level: {{ pokemonLevel }}</p>
                            <p class="slider-text">100</p>
                        </div>
                    </div>
                    <div class="card-change-wrapper-container">
                        <div class="change-btn-wrapper tooltip-container">
                            <button class="card-change" @click="stats = !stats" :disabled="!stats"><i
                                    class="fa-solid fa-arrow-left-long"></i></button>
                            <p class="tooltiptext">{{ 'Click to go back the info page!' }}</p>
                        </div>
                        <div class="change-btn-wrapper tooltip-container">
                            <button class="card-change" @click="resetCustomStats()" :disabled="!stats"><i
                                    class="fa-solid fa-trash"></i></button>
                            <p class="tooltiptext">{{ 'Click to reset the custom stats (IVs/EVs/Nature)!' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
        <Transition name="button">
            <button class="pokemon-change" v-if="Object.entries(checkPokemon()).length > 0"
                :disabled="Object.entries(checkPokemon()).length === 0"
                :class="{ 'disabled': Object.entries(checkPokemon()).length === 0 }" @click="nextPokemon()"><i
                    class="fa-solid fa-chevron-right"></i></button>
            <!--the if is just there for transition purposes -->
        </Transition>
    </section>
</template>

<script>
import { usePokemonStore } from '../stores/pokemonStore.js';
import { icons } from '../exports/icons';
import { statNames } from '../exports/statNames';

//const pokemonStore = usePokemonStore()

export default {
    name: "Pokemon",
    // setup() {
    //     const pokemonStore = usePokemonStore()

    //     return { pokemonStore } 
    // }, //realized a bit too late that you could do this.
    data() {
        return {
            stats: false,
            arrayIVs: [],
            counterIV: 0,
            EV: 0,
            pokemonLevel: 1,
            sentAlert: false,
        };
    },
    methods: {
        checkPokemon() {
            const pokemonStore = usePokemonStore();
            return pokemonStore.pokemonData;
        },
        loadSprite() {
            const pokemonStore = usePokemonStore();
            if (pokemonStore.pokemonData.id > 649) {
                if (!this.sentAlert) {
                    alert("Unable to find an animated/back sprite for this Pokemon, sorry! :(");
                    this.sentAlert = true
                }
                return "/src/assets/pokemon/" + pokemonStore.pokemonData.id + ".png";
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/" + pokemonStore.pokemonData.id + ".gif";
            }
            //return 'https://img.pokemondb.net/sprites/black-white/anim/normal/' + pokemonStore.pokemonData.name + '.gif'
        },
        loadCry() {
            const pokemonStore = usePokemonStore();
            //console.log(pokemonStore.pokemonData.types.length)
            if (pokemonStore.pokemonID > 721) {
                const audio = new Audio("src/assets/cries/" + pokemonStore.pokemonID + ".wav");
                audio.play();
            } else {
                const audio = new Audio("src/assets/cries/" + pokemonStore.pokemonID + ".ogg");
                audio.play();
            }

        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        loadShinySprite() {
            const pokemonStore = usePokemonStore();
            if (pokemonStore.pokemonData.id > 649) {
                return "/src/assets/pokemon/shiny/" + pokemonStore.pokemonData.id + ".png";
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/shiny/" + pokemonStore.pokemonData.id + ".gif";
            }
        },
        loadBackSprite() {
            const pokemonStore = usePokemonStore();
            if (pokemonStore.pokemonData.id > 649) {
                if (pokemonStore.pokemonData.id > 697 || pokemonStore.pokemonData.id < 701) {
                    return "/src/assets/pokemon/" + pokemonStore.pokemonData.id + ".png";
                }
                else {
                    return "/src/assets/pokemon/versions/generation-v/black-white/back/" + pokemonStore.pokemonData.id + ".png";
                }
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/back/" + pokemonStore.pokemonData.id + ".gif";
            }
        },
        loadShinyBackSprite() {
            const pokemonStore = usePokemonStore();
            if (pokemonStore.pokemonData.id > 649) {
                if (pokemonStore.pokemonData.id > 697 || pokemonStore.pokemonData.id < 701) {
                    return "/src/assets/pokemon/shiny/" + pokemonStore.pokemonData.id + ".png";
                }
                else {
                    return "/src/assets/pokemon/versions/generation-v/black-white/back/shiny/" + pokemonStore.pokemonData.id + ".png";
                }
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/back/shiny/" + pokemonStore.pokemonData.id + ".gif";
            }
        },
        nextPokemon() {
            const pokemonStore = usePokemonStore();
            pokemonStore.nextPokemon();
            pokemonStore.changePokemon;
        },
        previousPokemon() {
            const pokemonStore = usePokemonStore();
            pokemonStore.previousPokemon();
            pokemonStore.changePokemon;
        },
        colorText() {
            const pokemonStore = usePokemonStore();
            return pokemonStore.pokemonData.types[0].type.name;
        },
        colorTextBackground() {
            const pokemonStore = usePokemonStore();
            let background = pokemonStore.pokemonData.types[0].type.name + "-b";
            return background;
        },
        iconReturn(key) {
            return icons.find(element => element.key === key).value
        },
        returnStatNames(key) {
            return statNames.find(element => element.key === key).value
        },
        baseStatMultiplier(statName, stat, index) {
            const pokemonStore = usePokemonStore();
            // if (this.counterIV > 5) {
            //     this.counterIV = 0
            // case usando index para saber cual es el stat 0-5 y hacer un if conteniendo cada nature que modifica el stat
            let statValue = 0
            switch (index) {
                case 0: //hp
                    if (stat === 1) {
                        // this.counterIV++
                        return 1
                    } else {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 10
                        statValue = statValue + parseFloat(this.pokemonLevel)
                        // this.counterIV++
                        return Math.floor(statValue)
                    }
                case 1: //attack
                    if (['Lonely', 'Brave', 'Adamant', 'Naughty'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 1.10
                        return Math.floor(statValue)
                    }
                    else if (['Bold', 'Timid', 'Modest', 'Calm'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 0.90
                        return Math.floor(statValue)
                    } else {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        return Math.floor(statValue)
                    }
                case 2: //defense
                    if (['Bold', 'Relaxed', 'Impish', 'Lax'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 1.10
                        return Math.floor(statValue)
                    }
                    else if (['Lonely', 'Hasty', 'Mild', 'Gentle'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 0.90
                        return Math.floor(statValue)
                    } else {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        return Math.floor(statValue)
                    }
                case 3://Special Attack
                    if (['Modest', 'Mild', 'Quiet', 'Rash'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 1.10
                        return Math.floor(statValue)
                    }
                    else if (['Adamant', 'Impish', 'Jolly', 'Careful'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 0.90
                        return Math.floor(statValue)
                    } else {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        return Math.floor(statValue)
                    }
                case 4: //Special Defense
                    if (['Calm', 'Gentle', 'Sassy', 'Careful'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 1.10
                        return Math.floor(statValue)
                    }
                    else if (['Naughty', 'Lax', 'Naive', 'Rash'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 0.90
                        return Math.floor(statValue)
                    } else {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        return Math.floor(statValue)
                    }
                case 5: //speed
                    if (['Timid', 'Jolly', 'Hasty', 'Naive'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 1.10
                        return Math.floor(statValue)
                    }
                    else if (['Brave', 'Relaxed', 'Quiet', 'Sassy'].includes(pokemonStore.nature)) {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        statValue = statValue * 0.90
                        return Math.floor(statValue)
                    } else {
                        statValue = (2 * stat + pokemonStore.arrayIVs[index] + (pokemonStore.arrayEVs[index] / 4)) * this.pokemonLevel
                        statValue = (statValue / 100) + 5
                        return Math.floor(statValue)
                    }
                default:
                    break;
            }
        },
        showIVModal() {
            const pokemonStore = usePokemonStore();
            pokemonStore.showIVs = !pokemonStore.showIVs
            return pokemonStore.showIVs
        },
        showEVModal() {
            const pokemonStore = usePokemonStore();
            pokemonStore.showEVs = !pokemonStore.showEVs
            return pokemonStore.showEVs
        },
        showNatureModal() {
            const pokemonStore = usePokemonStore();
            pokemonStore.showNature = !pokemonStore.showNature
            return pokemonStore.showNature
        },
        resetCustomStats() {
            const pokemonStore = usePokemonStore();
            pokemonStore.arrayIVs = [0, 0, 0, 0, 0, 0]
            pokemonStore.arrayEVs = [0, 0, 0, 0, 0, 0]
            pokemonStore.nature = ''
        },
        checkFalse() {
            const pokemonStore = usePokemonStore();
            if (pokemonStore.showNature || pokemonStore.showIVs || pokemonStore.showEVs) {
                return true
            } else {
                return false
            }
        }
    },
    //components: { PokemonStats }
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap");
@import url('http://fonts.cdnfonts.com/css/pokemon-solid');
@import '../assets/css/color.css';

.pokemon-section {
    display: flex;
    font-family: 'Lato', sans-serif;
    justify-content: space-evenly;
    /**space between for responsive in media*/
    align-items: center;
    width: 100%;
    height: 50%;
    min-height: 500px;
    /** para responsive */
    opacity: 1;
    cursor: default;
    /* transition: opacity 2000ms ease; */
}

.bug .dark .dragon .electric .fairy .fighting .fire .flying .ghost .grass .ground .ice .normal .poison .psychic .rock .steel .water .bug-b .dark-b .dragon-b .electric-b .fairy-b .fighting-b .fire-b .flying-b .ghost-b .grass-b .ground-b .ice-b .normal-b .poison-b .psychic-b .rock-b .steel-b .water-b {
    font-size: 24px;
    font-weight: 800;
}

.pokemon {
    width: 400px;
    height: 500px;
    margin-top: 48px;
    /* border: 1px black solid; */
    border-radius: 25px;
    background: linear-gradient(145deg, #e6e6e6, #ffffff);
    box-shadow: 35px 35px 70px #bababa,
        -35px -35px 70px #ffffff;
    /**transition: opacity 2000ms ease;**/
    cursor: default;
}

h1 {
    text-align: center;
    font-size: 32px;
    font-weight: 800;
}

.sprites-container {
    display: flex;
    width: 100%;
    height: 50%;
    flex-wrap: wrap;
    /* border-bottom: 1px black solid; */
}

.pokemon-figure {
    width: 50%;
    justify-content: center;
    align-items: center;
    display: flex;
    margin: 0;
}

.pokemon-sprite {
    width: fit-content;
    height: fit-content;
}

.info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 20%;
    margin: 8px 0;
}

.typings-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 20%;
    margin-top: 8px;
}

.cry-button {
    border: none;
    outline: none;
    cursor: pointer;
    color: white;
    border-radius: 24px;
    display: flex;
    justify-content: center;
    width: 100px;
    font-size: 20px;
    margin: 4px 0;
    padding: 8px 0;
    transition: all 300ms ease;

}

.cry-button:active {
    /*cuando es clicked*/
    transform: translateY(4px);
}

.cry-text {
    font-size: 18px;
    font-weight: 600;
}

.info-container i {
    padding: 0 8px;
}

.card-change-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 15%;
    width: 100%;
    text-align: center;
}

.card-change {
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    font-size: 28px;
    width: 28px;
    color: #207fb6;
    text-align: center;
}

.tooltip-container {
    /*container del tooltip*/
    position: relative;
    display: flex;
    /*border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

.tooltip-container .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: rgb(155, 155, 155);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    margin-top: 4px;
    position: absolute;
    z-index: 1;
    top: 70%;
    left: 50%;
    margin-left: -60px;
    /* Fade in tooltip - takes 1 second to go from 0% to 100% opac: */
    opacity: 0;
    transition: opacity 1s;
}

.last-stats-wrapper .tooltip-container .tooltiptext {
    top: 150%;
    left: 42%;
    width: 150px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip-container:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}

.tooltip-container .tooltiptext::after {
    /*para que tenga flecha*/
    content: " ";
    position: absolute;
    bottom: 100%;
    /* At the top of the tooltip */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent rgb(83, 81, 81) transparent;
}

.pokemon-sprite-anim:hover {
    background-color: rgb(212, 245, 242);
    transition: all 350ms ease;
}

.pokemon-sprite:hover {
    background-color: rgb(212, 245, 242);
    transition: all 350ms ease;
}

.pokemon-change {
    border: none;
    outline: none;
    cursor: pointer;
    color: #207fb6;
    font-size: 48px;
    background-color: transparent;
    transition: transform 300ms ease;
}

.pokemon-change i{
    padding: 0;
}

.pokemon-change:active {
    /*cuando es clicked*/
    transform: translateY(4px);
}

.disabled-events {
    pointer-events: none;
}

.active {
    opacity: 1;
}

.text-wrapper {
    display: flex;
    justify-content: center;
}

.sprite-text {
    text-align: center;
    font-size: 24px;
    font-weight: 800;
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

.button-enter-from {
    opacity: 0;
}

.button-enter-to {
    opacity: 1;
}

.button-enter-active {
    transition: opacity 2500ms ease;
}

.pokemon-type {
    list-style-type: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35%;
    border-radius: 24px;
    color: white;
    font-size: 18px;
    font-weight: 600;
    height: 40px;
    transition: all 300ms ease-in-out;
}

.pokemon-type:hover {
    filter: brightness(120%);
}

.typings {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin: 8px 0;
    width: 100%;
}

.slider-container {
    width: 100%;
    display: flex;
    height: 10%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.slider {
    -webkit-appearance: none;
    appearance: none;
    width: 80%;
    height: 20px;
    outline: none;
    opacity: 0.7;
    -webkit-transition: 0.2s;
    transition: opacity 0.2;
    border-radius: 12px;
    box-shadow: 0px 1px 10px 1px black;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 30px;
    height: 30px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
}

.slider-text-container {
    width: 80%;
    display: flex;
    justify-content: space-between;
}

.slider-text {
    width: calc(80% / 3);
    font-size: 16px;
    font-weight: 500;
    margin-top: 8px;
}

.slider-text:nth-child(1) {
    text-align: left;
}

.slider-text:nth-child(2) {
    text-align: center;
}

.slider-text:nth-child(3) {
    text-align: right;
}

.stats-container {
    width: 90%;
    height: 45%;
    margin: 0 auto;
}

.stats-title {
    margin-bottom: 8px;
    text-align: center;
}

.stats {
    width: 100%;
    height: 100%;
    list-style-type: none;
}

.stats li {
    display: flex;
}

.stat-name-wrapper {
    background-color: #bababa;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 6px;
    text-align: center;
}

.stat-name,
.stat-base {
    font-size: 14px;
    font-weight: 500;
    color: white;
}

/* .stat-name{
    padding-right: 6px;
} */

.stat-base-wrapper {
    filter: brightness(120%);
    border-bottom-right-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    justify-content: flex-end;
    text-align: center;
    margin-bottom: 6px;
    align-items: center;
}

.stat-base {
    padding-right: 4px;
}

.stats-button-container {
    margin-top: 8px;
    display: flex;
    height: 20%;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
}

.stats-button {
    width: 30%;
    font-size: 12px;
    border: none;
    cursor: pointer;
    padding: 6px 0;
    border-radius: 20px;
    font-weight: 400;
    background: radial-gradient(circle, rgba(38, 97, 205, 1) 0%, rgba(35, 129, 184, 1) 100%);
    color: white;
}

.card-change-wrapper-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 10%;
    width: 100%;
}

.last-stats-wrapper {
    display: flex;
    width: 100%;
    height: 30%;
    flex-direction: column;
    justify-content: space-around;
}

.change-btn-wrapper {
    height: 100%;
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* @media only screen and (max-width: 768px) {
    .pokemon-change{
        z-index: 2;
    }
} */

@media only screen and (max-width: 476px) and (min-width: 452px) {
    .pokemon-change {
        z-index: 2;
        margin: 0 16px;
    }

    .pokemon {
        background: linear-gradient(145deg, #e6e6e6, #ffffff);
        box-shadow: 15px 15px 30px #bababa,
            -15px -15px 30px #ffffff;
    }
}

@media only screen and (max-width: 452px) {
    .pokemon-change {
        z-index: 2;
    }

    .pokemon {
        background: linear-gradient(145deg, #e6e6e6, #ffffff);
        box-shadow: 15px 15px 30px #bababa,
            -15px -15px 30px #ffffff;
    }

    .stat-name,
    .stat-base {
        font-size: 11px;
    }
}

@media only screen and (max-width: 388px) {
    .pokemon-change {
        z-index: 2;
    }

    .pokemon {
        background: linear-gradient(145deg, #e6e6e6, #ffffff);
        box-shadow: 15px 15px 30px #bababa,
            -15px -15px 30px #ffffff;
    }

    .typings li {
        font-size: 14px;
    }

    .stat-name,
    .stat-base {
        font-size: 10px;
    }

    .stats-button-container{
        height: 40%;
    }

    .stats-button{
        font-size: 10px;
    }
}

@media only screen and (max-width: 350px) {
    .pokemon-change {
        z-index: 2;
    }

    .pokemon {
        background: linear-gradient(145deg, #e6e6e6, #ffffff);
        box-shadow: 15px 15px 30px #bababa,
            -15px -15px 30px #ffffff;
    }

    .typings li {
        font-size: 14px;
    }

    .stat-name,
    .stat-base {
        font-size: 9px;
    }

    .stats-button{
        font-size: 9px;
    }
}
</style>



