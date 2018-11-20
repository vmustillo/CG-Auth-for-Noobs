<template>
  <div class="home text-center">
    <div class="jumbotron">
      <h1 class="display-3">Authentication for Beginners</h1>
      <p class="lead">Learning auth is interesting and important.</p>
      <hr class="my-4">
      <p>The Coding Garden tutorial is a very useful resource for this.</p>
      <p class="lead">
        <router-link class="btn btn-primary btn-lg" :to="{name: 'signup' }" role="button">
          Sign Up!
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
};
</script>
