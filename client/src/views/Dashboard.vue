<template>
  <h1>Dashboard</h1>
</template>

<script>
const API_URL = "http://localhost:5000/";

export default {
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
      });
  },
};
</script>

<style>
</style>

