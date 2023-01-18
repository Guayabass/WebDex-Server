<template>
    <section class="pokemon-section" :class="{ 'disabled-events': checkFalse() }">
        <Transition name="button">
            <button class="pokemon-change" v-if="Object.entries(checkPokemon()).length > 0"
                :disabled="Object.entries(checkPokemon()).length === 0"
                :class="{ 'disabled': Object.entries(checkPokemon()).length === 0 }" @click="previousPokemon()"><i
                    class="fa-solid fa-chevron-left"></i></button>
        </Transition>
        <Transition name="fade" mode="out-in">
            <div class="pokemon" v-if="Object.entries(checkPokemon()).length > 0">
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
                            <router-link :to="'/pokemon/' + checkPokemon().name"><button class="card-change"><i
                                        class="fa-solid fa-arrow-left-long"></i></button></router-link>
                            <p class="tooltiptext">{{ 'Click to go back the info page!' }}</p>
                        </div>
                        <div class="change-btn-wrapper tooltip-container">
                            <button class="card-change" @click="resetCustomStats()"><i
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
        </Transition>
    </section>
</template>

<script>
import { usePokemonStore } from '../stores/pokemonStore.js';
import { icons } from '../exports/icons';
import { statNames } from '../exports/statNames';
import { pokeapi } from '../exports/pokeapi'

//const pokemonStore = usePokemonStore()

export default {
    name: "PokemonStats",
    props: ["name"],
    async mounted() {
        try {
            if (/^[a-zA-Z]+$/.test(this.name)) {
                const pokemonToFind = await fetch(`${pokeapi}/${this.name.toLowerCase()}`)
                const pokemon = await pokemonToFind.json()
                let ID = ''
                ID = pokemon.id
                this.addPokemon(pokemon, ID)
                //this.dataReady = true
                //console.log(this.name)
            } else {
                const pokemonToFind = await fetch(`${pokeapi}/${this.name}`)//aggara el pokemon con el id
                const pokemon = await pokemonToFind.json()
                this.addPokemon(pokemon, this.name)
                this.$router.replace('/pokemon/' + pokemon.name + '/stats')
                //this.dataReady = true
            }
        } catch (error) {
            alert('Pokemon was not found :(')
            console.log(error)
        }
    },
    data() {
        return {
            //stats: false,
            pokemonLevel: 1,
            //sentAlert: false,
        };
    },
    methods: {
        checkPokemon() {
            const pokemonStore = usePokemonStore();
            return pokemonStore.pokemonData;
        },
        capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        async nextPokemon() {
            const pokemonStore = usePokemonStore();
            pokemonStore.nextPokemon();
            await pokemonStore.changePokemon;
            this.$router.push('/pokemon/' + pokemonStore.pokemonData.name + '/stats')
        },
        async previousPokemon() {
            const pokemonStore = usePokemonStore();
            pokemonStore.previousPokemon();
            await pokemonStore.changePokemon;
            this.$router.push('/pokemon/' + pokemonStore.pokemonData.name + '/stats')
        },
        colorTextBackground() {
            const pokemonStore = usePokemonStore();
            let background = pokemonStore.pokemonData.types[0].type.name + "-b";
            return background;
        },
        addPokemon(pokemon, id) {
            const pokemonStore = usePokemonStore()
            pokemonStore.pokemonData = pokemon
            pokemonStore.pokemonID = id
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
        },
        addPokemon(pokemon, id) {
            const pokemonStore = usePokemonStore()
            pokemonStore.pokemonData = pokemon
            pokemonStore.pokemonID = id
        },
    },
    //components: { PokemonStats }
}
</script>

<style>
@import '../assets/css/Pokemon.css';
</style>