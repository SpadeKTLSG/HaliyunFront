<template>
  <div>
    <h1 v-if="!showingSth" class="test">这是首页</h1>
    <button v-if="!showingSth" @click="showPage('home')">Home</button>
    <button v-if="!showingSth" @click="showPage('login')">Login</button>
    <button v-if="!showingSth" @click="showPage('404')">404</button>

    <Home v-if="currentPage === 'home'" @close="indexBack()"/>
    <Login v-if="currentPage === 'login'" @close="indexBack()"/>
    <Error404 v-if="currentPage === '404'" @close="indexBack()"/>
  </div>

</template>

<script setup>
import './App.scss'
import {ref} from 'vue'
import Home from './components/common/home/home.vue'
import Login from './components/common/login/login.vue'
import Error404 from './components/common/error-page/404.vue'

let showingSth = false
const currentPage = ref('')

const showPage = (page) => {
  currentPage.value = page
  showingSth = !showingSth
}

const indexBack = () => {
  currentPage.value = ''
  showingSth = !showingSth
}


</script>

