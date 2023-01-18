

<script>
import { pokeapi } from '../exports/pokeapi'
import { usePokemonStore } from '../stores/pokemonStore.js';
import { ref } from 'vue'

//const pokeapi = 'https://pokeapi.co/api/v2/pokemon'
export default {
    name: 'PokemonSearch',
    setup() {
        const pokemonStore = usePokemonStore();
        const inputField = ref()
        const focusInput = () => {
            inputField.value.focus()
        }
        return { focusInput, inputField, pokemonStore }
    },
    data() {
        return {
            pokemonNameOrID: '',
        }
    },
    methods: {
        async searchPokemon() {
            try {
                if (this.pokemonNameOrID === '') {
                    alert('Please search for a Pokemon first!')
                } else {
                    if (/^[a-zA-Z]+$/.test(this.pokemonNameOrID)) {
                        const pokemonToFind = await fetch(`${pokeapi}/${this.pokemonNameOrID.toLowerCase()}`)
                        const pokemon = await pokemonToFind.json()
                        let ID = ''
                        ID = pokemon.id
                        //console.log(pokemon.id)
                        this.addPokemon(pokemon, ID)
                        // console.log(ID)
                        return pokemon
                    } else {
                        const pokemonToFind = await fetch(`${pokeapi}/${this.pokemonNameOrID}`)//aggara el pokemon con el id
                        const pokemon = await pokemonToFind.json()
                        //console.log(pokemon)
                        this.$router.replace('/pokemon/' + pokemon.name)
                        this.addPokemon(pokemon, this.pokemonNameOrID)                       
                        return pokemon
                    }
                }
            } catch (error) {
                alert('Pokemon was not found :(')
                console.log(error)
            }
        },
        addPokemon(pokemon, id) {

            const pokemonStore = usePokemonStore()
            pokemonStore.pokemonData = pokemon
            pokemonStore.pokemonID = id
            //console.log(pokemonStore.pokemonData)
            //console.log(pokemonStore.pokemonID)
        },
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
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap");
@import url('http://fonts.cdnfonts.com/css/pokemon-solid');

* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

header .main-container {
    width: 100%;
    height: 35%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-family: 'Lato', sans-serif;
    margin-bottom: 20px;
}

.form {
    position: relative;
    width: 60%;
    height: 50px;
    overflow: hidden;
    margin-bottom: 24px;
}

.form input {
    width: 100%;
    height: 100%;
    color: black;
    padding-top: 20px;
    border: none;
    outline: none;
}

.form label {
    position: absolute;
    font-weight: 600;
    bottom: 0px;
    left: 0%;
    width: 100%;
    height: 100%;
    pointer-events: none;
    /** since the label is on top, it wouldn't allow us to type so this fixes it. */
    border-bottom: 1px solid black;
}

.form label::after {
    content: "";
    position: absolute;
    left: 0px;
    bottom: -1px;
    height: 100%;
    width: 100%;
    border-bottom-width: 3px;
    border-bottom-style: solid;
    border-image: radial-gradient(circle,
            rgba(32, 127, 182, 1) 50%,
            rgba(17, 73, 175, 1) 100%) 1;
    transform: translateX(-100%);
    transition: transform 300ms ease;
}

.content-pokemon {
    position: absolute;
    color: #207fb6;
    bottom: 5px;
    left: 0px;
    opacity: 0;
    transition: all 300ms ease;
}

.form input:focus+.label-name .content-pokemon,
/** the + is to act upon the label name only if it's a son of the previou element aka the input */
.form input:valid+.label-name .content-pokemon {
    /** the :valid acts since we added the "required" condition in the html tag */
    transform: translateY(-150%);
    color: #207fb6;
    font-size: 14px;
    opacity: 1;
}

.form input:focus+.label-name::after,
.form input:valid+.label-name::after {
    transform: translateX(0%);
}

.sub-title {
    font-family: 'Lato', sans-serif;
    margin: 24px;
    text-align: center;
    line-height: 40px;
    font-weight: 800;
}

.blue {
    color: #207fb6;
    transition: all 300ms ease;
    cursor: pointer;
}

.blue:hover {
    color: #24a1e9;
}

.sub-title-wrapper {
    width: 80%; /** update in production */
}

i {
    padding-right: 8px;
}

.btn {
    background: var(--background-color);
    color: white;
    font-size: 16px;
    font-weight: 400;
    padding: 16px 10px;
    border: none;
    outline: none;
    position: relative;
    cursor: pointer;

    --background-color: rgb(163, 163, 163);
}

.btn.btn-search {
    z-index: 1;
}

.btn.btn-search:hover::before,
.btn.btn-search:focus::before {
    transform: scaleX(1);
}


.btn.btn-search::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background: radial-gradient(circle, rgba(38, 97, 205, 1) 0%, rgba(35, 129, 184, 1) 100%);
    transition: transform 300ms ease-in-out;
    transform: scaleX(0);
    transform-origin: left;
}

.disabled-events {
    pointer-events: none;
}

@media only screen and (max-width: 768px) {
    .sub-title{
        font-size: 18px;
    }
    .sub-title-wrapper{
        width: 100%;
    }

    header .main-container{
        margin-bottom: 0;
    }

    .btn.btn-search{
        margin: 12px;
    }

    .form{
        width: 70%;
    }

    .btn{
        padding: 12px 8px;
    }
}
</style>

<template>
    <header>
        <div class="main-container" :class="{ 'disabled-events': checkFalse() }">
            <div class="sub-title-wrapper">
                <h2 class="sub-title">Welcome to the <span class="blue" @click="focusInput">WebDex</span> website! Start
                    your search below by
                    entering a <span class="blue" @click="focusInput">Pokemon's</span> name or <span class="blue"
                        @click="focusInput">Pokedex's</span> ID.</h2>
            </div>
            <div class="form">
                <input ref="inputField" placeholder="E.g: Pikachu" type="text" name="Pokemon" autocomplete="off"
                    required @keyup.enter="searchPokemon()" v-model="pokemonNameOrID">
                <label for="Pokemon" class="label-name">
                    <span class="content-pokemon">Pokemon's Name/ID</span>
                </label>
            </div>
            <router-link :to="'/pokemon/' + pokemonNameOrID"><button class="btn btn-search" @click="searchPokemon()"><i
                    class="fa-sharp fa-solid fa-magnifying-glass"></i>Search Pokemon</button></router-link>
        </div>
    </header>
    <!--<header class="search">
        <label for="search">
            Enter the Pokedex ID of the Pokemon or its name:
            <input type="text" id="search" @keyup.enter="searchPokemon()" v-model="pokemonNameOrID">
            
            <button @click="searchPokemon">Search pokemon</button>
        </label>
    </header>-->
</template>



