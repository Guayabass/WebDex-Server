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
            <div class="pokemon" v-if="Object.entries(checkPokemon()).length > 0">
                <div class="info-container">
                    <h1 :class="colorText()">
                        {{ capitalize(checkPokemon().name) }}
                    </h1>
                    <button :class="colorTextBackground()" class="cry-button" @click="loadCry()"><i
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
                <div class="main-card-button-container">
                    <div class="card-change-wrapper tooltip-container">
                        <button class="favorite-button"> <i class="fa-solid fa-star"></i></button>
                        <p class="tooltiptext">{{ 'Click to favorite ' + capitalize(checkPokemon().name) + '!' }}</p>
                    </div>
                    <div class="card-change-wrapper tooltip-container">
                        <router-link :to="'/pokemon/' + checkPokemon().name + '/stats'"><button class="card-change"><i
                                    class="fa-solid fa-chart-simple"></i></button></router-link>
                        <p class="tooltiptext">{{ 'Click to show ' + capitalize(checkPokemon().name) + ' stats!' }}</p>
                    </div>
                    <div class="card-change-wrapper tooltip-container">
                        <router-link :to="'/pokemon/' + checkPokemon().name + '/share'"><button class="share-button"><i
                                    class="fa-solid fa-share"></i></button></router-link>
                        <p class="tooltiptext">{{ 'Click to share ' + capitalize(checkPokemon().name) + '!' }}</p>
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
import { pokeapi } from '../exports/pokeapi'
import { icons } from '../exports/icons';
import { statNames } from '../exports/statNames';

//const pokemonStore = usePokemonStore()

export default {
    name: "PokemonSprite",
    props: ["name"],
    // setup() {
    //     const pokemonStore = usePokemonStore()  CHANGE EL BOTON DE POKEMON EV Y IVS MAX WIDTH

    //     return { pokemonStore } 
    // }, //realized a bit too late that you could do this.
    data() {
        return {
            sentAlert: false,
            dataReady: false,
        };
    },
    async mounted() {
        try {
            if (/^[a-zA-Z]+$/.test(this.name)) {
                const pokemonToFind = await fetch(`${pokeapi}/${this.name.toLowerCase()}`)
                const pokemon = await pokemonToFind.json()
                let ID = ''
                ID = pokemon.id
                this.addPokemon(pokemon, ID)
                this.dataReady = true
                //console.log(this.name)
            } else {
                const pokemonToFind = await fetch(`${pokeapi}/${this.name}`)//aggara el pokemon con el id
                const pokemon = await pokemonToFind.json()
                this.addPokemon(pokemon, this.name)
                this.$router.replace('/pokemon/' + pokemon.name)
                this.dataReady = true
            }
        } catch (error) {
            alert('Pokemon was not found :(')
            console.log(error)
        }
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
                const audio = new Audio("/src/assets/cries/" + pokemonStore.pokemonID + ".wav");
                audio.play();
            } else {
                const audio = new Audio("/src/assets/cries/" + pokemonStore.pokemonID + ".ogg");
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
        addPokemon(pokemon, id) {
            const pokemonStore = usePokemonStore()
            pokemonStore.pokemonData = pokemon
            pokemonStore.pokemonID = id
        },
        async nextPokemon() {
            const pokemonStore = usePokemonStore();
            pokemonStore.nextPokemon();
            await pokemonStore.changePokemon;
            this.$router.push('/pokemon/' + pokemonStore.pokemonData.name)
        },
        async previousPokemon() {
            const pokemonStore = usePokemonStore();
            pokemonStore.previousPokemon();
            await pokemonStore.changePokemon;
            this.$router.push('/pokemon/' + pokemonStore.pokemonData.name)
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
@import '../assets/css/Pokemon.css';

.main-card-button-container .tooltip-container .tooltiptext {
    top: 170%;
    left: 50%;
    margin-left: -60px;
}
</style>



