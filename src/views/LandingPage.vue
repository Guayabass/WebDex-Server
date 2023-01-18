<template>
    <NavBar></NavBar>
    <router-link :to="{name: 'Main'}">Pokemon</router-link>
</template>

<script>
import NavBar from '../components/NavBar.vue'

export default {
    components: { NavBar }
}
</script>