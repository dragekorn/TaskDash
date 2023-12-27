<template>
  <div id="app">
    <div class="centered-image">
      <img id="logo" alt="Vue logo" src="./assets/logo.png">
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import "flowbite/dist/flowbite.min.js";
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 15px;
}
#logo {
  max-width: 40px;
}
body {
  background: #f9fafb;
}
.centered-image{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<head>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.1/flowbite.min.css" rel="stylesheet" />
</head>
