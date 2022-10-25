<template>
  <div class="modal" v-if="returnShowNature()">
    <div class="modal-content">
      <div class="modal-header">
        <span class="close" @click="showNatureModal()"><i class="fa-solid fa-xmark"></i></span>
      </div>
      <div class="modal-body">
        <h3 class="title">Select the desired <span class="blue">nature</span> you desire and click the <span
            class="blue">confirm</span> button to apply the changes to the <span class="blue">global</span> stats.</h3>
        <div class="select-container">
          <div class="select-btn" @click="showNatures = !showNatures">
            <span v-if="!showNatures" class="text-btn">Select a nature</span>
            <span v-else class="text-btn">{{selectedNature.name}}</span>
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <Transition name="fade" mode="out-in">
            <ul class="options-ul" v-if="!showNatures" :disabled="!showNatures">
              <li class="option" v-for="(nature, index) in natures" :key="index" @click="setNature(nature, index)" >
                <i class="fa-solid fa-arrow-right"></i>
                <p class="option-txt">{{nature.name}}</p>
              </li>
            </ul>
            <div class="nature-info-container" v-else-if="showNatures" :disabled="showNatures">
                <h3><span class="blue">{{selectedNature.name}}</span> Nature:</h3>
                <div class="nature-info">
                <h3 v-if="selectedNature.ups === 'none' || selectedNature.downs === 'none'"><span class="blue">Raises</span> no stats at all</h3>
                <h3 v-else>10% <span class="blue">higher</span> {{selectedNature.ups}} stat</h3>
                <div class="nature-icon-wrapper">
                  <i class="fa-solid fa-up-long" :class="{'green' : selectedNature.ups != 'none' || selectedNature.downs != 'none'}"></i>
                  <i class="fa-solid fa-down-long" :class="{'red' : selectedNature.ups != 'none' || selectedNature.downs != 'none'}"></i>
                </div>
                <h3 v-if="selectedNature.ups === 'none' || selectedNature.downs === 'none'"><span class="blue">Lowers</span> no stats at all</h3>
                <h3 v-else>10% <span class="blue">lower</span> {{selectedNature.downs}} stat</h3>
              </div>
              <!--hacer un tipo icons.js con key igual a cada index (de 0 a 24 o lo que sea el maximo) y el value un icono o imagen-->
              <!--hacer funcion que reciba el index para compararlo con el objeto que tiene de key el index y asi con la lista saber cual es y retornar el icono y el texto (pueden ser 2 funciones y una de neutral tambien osea 3)-->
            </div>
          </Transition>
        </div>
        <h3><strong>NOTE:</strong> Changing Pokemon will <span class="red">NOT</span> automatically reset any custom
          IVs/EVs/Nature set.</h3>
      </div>
      <div class="modal-footer">
        <div class="btns-container">
          <button class="btn-confirm" @click="storeNature()">Confirm</button>
          <button class="btn-cancel" @click="showNatureModal()">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePokemonStore } from '../stores/pokemonStore.js';
import { customNatures } from '../exports/natures.js';

export default {
  name: 'customNatureModal',
  setup() {
    const natures = customNatures

    return { natures }
  },
  data() {
    return {
      //natures: ['Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky'],
      showNatures: false,
      selectedNature: '',
      index: 0,
      //hp: 0,
    }
  },
  methods: {
    showNatureModal() {
      const pokemonStore = usePokemonStore();
      pokemonStore.showNature = !pokemonStore.showNature
      return pokemonStore.showNature
    },
    returnShowNature() {
      const pokemonStore = usePokemonStore();
      return pokemonStore.showNature
    },
    setNature(nature, index) {
      //console.log(nature)
      this.selectedNature = nature
      this.index = index
      this.showNatures = !this.showNatures
    },
    storeNature(){
      const pokemonStore = usePokemonStore();
      pokemonStore.nature = this.selectedNature.name
      //console.log(pokemonStore.nature)
      this.showNatureModal()
    }
  }
}

</script>
  
<style>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
}

.modal {
  position: absolute;
  z-index: 1;
  /* Sit on top */
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  width: 100%;
  /* Full width */
  height: 100%;
  /* Full height */
  overflow: auto;
  /* Enable scroll if needed */
  background-color: rgb(0, 0, 0);
  /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4);
  /* Black w/ opacity */
}

.modal-content {
  background-color: #fefefe;
  position: relative;
  pointer-events: all;
  margin: 0 auto;
  width: 60%;
  height: 50%;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.6s;
  animation-name: animatetop;
  animation-duration: 0.6s
}

.modal-header {
  background-color: #207fb6;
  width: 100%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  height: 10%;
}

.modal-body {
  height: 80%;
  width: 90%;
  text-align: center;
  line-height: 32px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-footer {
  background-color: #207fb6;
  width: 100%;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  height: 10%;
}

/* The Close Button */
.close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  text-decoration: none;
  cursor: pointer;
}

.blue {
  color: #207fb6;
  transition: all 300ms ease;
  cursor: text;
}

.green {
  color: green;
}

.blue:hover {
  color: #24a1e9;
}

.red {
  color: red;
  font-weight: 700;
}

.enabled {
  opacity: 1;
  transition: all 500ms ease;
}

.disabled {
  opacity: 0;
  transition: all 500ms ease;
}

.select-container {
  width: 40%;
  height: 75%;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.select-container .select-btn {
  display: flex;
  font-size: 18px;
  height: 55px;
  cursor: pointer;
  padding: 20px;
  border-radius: 8px;
  border: #24a1e9 solid 2px;
  font-weight: 400;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.select-btn i {
  font-size: 25px;
}

.select-container .options-ul {
  padding: 20px;
  margin-top: 10px;
  border-radius: 8px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

.options-ul {
  list-style-type: none;
  overflow: auto;
  width: 100%;
  height: 60%;
}

.nature-info-container {
  width: 100%;
  height: 60%;
  margin-top: 10px;
}

.options-ul .option {
  display: flex;
  height: 55px;
  cursor: pointer;
  padding: 0 16px;
  align-items: center;
}

.options-ul .option:hover {
  background: #f2f2f2;
}

.option i {
  font-size: 25px;
  color: #207fb6;
  margin-right: 12px;
}

.option-txt {
  font-size: 18px;
  color: #333;
}

.fade-enter-from {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.fade-enter-active {
  transition: opacity 300ms ease;
}

.fade-leave-from {
  opacity: 1;
}

.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  transition: opacity 300ms ease;
}

.shake {
  animation: shake 300ms linear 1 normal;
}

.btns-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btns-container button {
  font-size: 18px;
  border: #fefefe solid 3px;
  font-weight: 700;
  background-color: transparent;
  color: white;
  cursor: pointer;
  margin: 0 16px;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
  z-index: 1;
}

.btns-container button::before {
  transition: all 500ms ease;
  position: absolute;
  content: "";
  top: 0;
  right: 50%;
  opacity: 0;
  left: 50%;
  bottom: 0;
}

.btns-container .btn-confirm::before {
  background-color: rgb(140, 184, 74);
}

.btns-container .btn-cancel::before {
  background-color: lightcoral;
}

.btns-container button:hover::before {
  transition: all 500ms ease;
  position: absolute;
  content: "";
  top: 0;
  right: 0;
  opacity: 1;
  left: 0;
  bottom: 0;
  z-index: -1;
}

.nature-info{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.nature-icon-wrapper{
  display: flex;
  width: 100%;
  color: gray;
  font-size: 24px;
  justify-content: space-evenly;
}

/* .nature-icon-wrapper i:nth-child(1){
  color: green;
}

.nature-icon-wrapper i:nth-child(2){
  color: red;
} */

@keyframes shake {
  0% {
    transform: translateX(-5px);
  }

  25% {
    transform: translateX(5px);
  }

  50% {
    transform: translateX(-5px);
  }

  75% {
    transform: translateX(5px);
  }

  100% {
    transform: translateX(-5px);
  }
}

@-webkit-keyframes animatetop {
  from {
    top: -300px;
  }

  to {
    top: 0;
  }
}

@keyframes animatetop {
  from {
    top: -300px;
  }

  to {
    top: 0;
  }
}
</style>