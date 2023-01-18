<template>
    <section :class="{ 'disabled-events': checkFalse() }">
    <router-link :to="{ name: 'Home' }">
        <NavBar></NavBar>
    </router-link>
    <div class="pokemon-section">
        <Transition name="fade" mode="out-in">
            <div class="pokemon" :class="{ 'disabled': stats }" v-if="!stats && dataReady">
                <div class="info-container">
                    <h1 :class="Pokemon.types[0].type.name">
                        {{ capitalize(Pokemon.name) }}
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
                        <img class="pokemon-sprite" :src="loadSprite()" :alt="Pokemon.name" />
                    </figure>
                    <figure class="pokemon-figure">
                        <img class="pokemon-sprite" :src="loadBackSprite()" :alt="Pokemon.name" />
                    </figure>
                    <figure class="pokemon-figure">
                        <img class="pokemon-sprite" :src="loadShinySprite()" :alt="Pokemon.name" />
                    </figure>
                    <figure class="pokemon-figure">
                        <img class="pokemon-sprite" :src="loadShinyBackSprite()" :alt="Pokemon.name" />
                    </figure>
                </div>
                <div class="text-wrapper">
                    <p class="sprite-text">Shiny</p>
                </div>
                <div class="card-change-wrapper tooltip-container">
                    <button class="card-change" @click="stats = !stats" :disabled="stats"><i
                            class="fa-solid fa-chart-simple"></i></button>
                    <p class="tooltiptext">{{ 'Click to show ' + capitalize(Pokemon.name) + ' stats!' }} </p>
                </div>
            </div>
            <div class="pokemon" :class="{ 'disabled': !stats }" v-else-if="stats">
                <div class="typings-container">
                    <h1>
                        Typings
                    </h1>
                    <ul class="typings">
                        <li class="pokemon-type" v-for="(type, index) in Pokemon.types" :key="index"
                            :class="type.type.name + '-b'"><i :class="iconReturn(type.type.name)"></i>{{
                                    capitalize(type.type.name)
                            }}</li>
                    </ul>
                </div>
                <div class="stats-container">
                    <h1 class="stats-title">Stats</h1>
                    <ul class="stats">
                        <li v-for="(stat, index) in Pokemon.stats" :key="index">
                            <div class="stat-name-wrapper">
                                <p class="stat-name">{{ returnStatNames(stat.stat.name) }}</p>
                            </div>
                            <div class="stat-base-wrapper" :class="colorTextBackground()"
                                :style="{ 'width': pokemonLevel * 0.70 + '%' }">
                                <p class="stat-base">{{ baseStatMultiplier(stat.base_stat, index) }}</p>
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
    </div>
    <div class="input-container">
        <ShareLink :route="name"></ShareLink>
    </div>

    <Transition name="fade-modal">
        <CustomIVsModal v-if="pokemonStore.showIVs"></CustomIVsModal>
    </Transition>
    <Transition name="fade-modal">
        <CustomEVsModal v-if="pokemonStore.showEVs"></CustomEVsModal>
    </Transition>
    <Transition name="fade-modal">
        <CustomNatureModal v-if="pokemonStore.showNature"></CustomNatureModal>
    </Transition>
</section>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import CustomEVsModal from '../components/customEVsModal.vue';
import CustomIVsModal from '../components/customIVsModal.vue';
import CustomNatureModal from '../components/customNatureModal.vue';
import ShareLink from '../components/ShareLink.vue';
import { usePokemonStore } from '../stores/pokemonStore.js';
import { icons } from '../exports/icons';
import { statNames } from '../exports/statNames';
import { pokeapi } from '../exports/pokeapi'

export default {
    name: "ViewPokemon",
    props: ["name"],
    setup() {
        const pokemonStore = usePokemonStore();

        return { pokemonStore }
    },
    data() {
        return {
            stats: false,
            pokemonLevel: 1,
            sentAlert: false,
            dataReady: false,
            Pokemon: {},
        };
    },
    async mounted() {
        try {
            if (/^[a-zA-Z]+$/.test(this.name)) {
                const pokemonToFind = await fetch(`${pokeapi}/${this.name.toLowerCase()}`)
                const pokemon = await pokemonToFind.json()
                this.Pokemon = pokemon
                this.dataReady = true
                //console.log(this.name)
            } else {
                const pokemonToFind = await fetch(`${pokeapi}/${this.name}`)//aggara el pokemon con el id
                const pokemon = await pokemonToFind.json()
                this.Pokemon = pokemon
                this.dataReady = true
                //console.log(this.name)
            }
        } catch (error) {
            alert('Pokemon was not found :(')
            console.log(error)
        }
    },
    methods: {
        colorTextBackground() {
            let background = this.Pokemon.types[0].type.name + "-b";
            return background;
        },
        loadCry() {
            //console.log(pokemonStore.pokemonData.types.length)
            if (this.Pokemon.id > 721) {
                const audio = new Audio("/src/assets/cries/" + this.Pokemon.id + ".wav");
                audio.play();
            } else {
                const audio = new Audio("/src/assets/cries/" + this.Pokemon.id + ".ogg");
                audio.play();
            }

        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        loadSprite() {
            if (this.Pokemon.id > 649) {
                if (!this.sentAlert) {
                    alert("Unable to find an animated/back sprite for this Pokemon, sorry! :(");
                    this.sentAlert = true
                }
                return "/src/assets/pokemon/" + this.Pokemon.id + ".png";
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/" + this.Pokemon.id + ".gif";
            }
            //return 'https://img.pokemondb.net/sprites/black-white/anim/normal/' + pokemonStore.pokemonData.name + '.gif'
        },
        loadShinySprite() {
            if (this.Pokemon.id > 649) {
                return "/src/assets/pokemon/shiny/" + this.Pokemon.id + ".png";
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/shiny/" + this.Pokemon.id + ".gif";
            }
        },
        loadBackSprite() {
            if (this.Pokemon.id > 649) {
                if (this.Pokemon.id > 697 || this.Pokemon.id < 701) {
                    return "/src/assets/pokemon/" + this.Pokemon.id + ".png";
                }
                else {
                    return "/src/assets/pokemon/versions/generation-v/black-white/back/" + this.Pokemon.id + ".png";
                }
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/back/" + this.Pokemon.id + ".gif";
            }
        },
        loadShinyBackSprite() {
            if (this.Pokemon.id > 649) {
                if (this.Pokemon.id > 697 || this.Pokemon.id < 701) {
                    return "/src/assets/pokemon/shiny/" + this.Pokemon.id + ".png";
                }
                else {
                    return "/src/assets/pokemon/versions/generation-v/black-white/back/shiny/" + this.Pokemon.id + ".png";
                }
            }
            else {
                return "/src/assets/pokemon/versions/generation-v/black-white/animated/back/shiny/" + this.Pokemon.id + ".gif";
            }
        },
        iconReturn(key) {
            return icons.find(element => element.key === key).value
        },
        returnStatNames(key) {
            return statNames.find(element => element.key === key).value
        },
        baseStatMultiplier(stat, index) {
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
    components: { NavBar, CustomEVsModal, CustomIVsModal, CustomNatureModal, ShareLink }
}
</script>

<style>
@import '../assets/css/Pokemon.css';

* {
    text-decoration: none;
}

.input-container {
    display: flex;
    height: 200px;
    width: 80%;
    margin: 0 auto;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}

.pokemon-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.card-change-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 15%;
    width: 100% !important;
    text-align: center;
}

.fade-modal-enter-from {
    opacity: 0;
}

.fade-modal-enter-to {
    opacity: 1;
}

.fade-modal-enter-active {
    transition: opacity 800ms ease;
}

.fade-modal-leave-from {
    opacity: 1;
}

.fade-modal-leave-to {
    opacity: 0;
}

.fade-modal-leave-active {
    transition: opacity 800ms ease;
}
</style>
