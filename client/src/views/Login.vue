<template>
  <section>
    <h1>Login</h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{errorMessage}}
    </div>
    <form @submit.prevent="login()">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username"
          autocomplete="on"
          required
        >
        <h5 id="usernameHelp" class="form-text text-muted">Enter username to login.</h5>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          id="password"
          aria-describedby="passwordHelp"
          placeholder="Enter a password"
          autocomplete="on"
          required
        >
        <h5 id="passwordHelp" class="form-text text-muted">Enter password to login.</h5>
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </section>
</template>

<script>
import Joi from 'joi'

const LOGIN_URL = 'http://localhost:5000/auth/login';

const schema = Joi.object().keys({
  username: Joi.string()
    .regex(/(^[a-zA-Z0-9_]*$)/)
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .min(10)
    .required(),
});


export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if(this.validUser()) {
        const body = {
          username: this.user.username,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          headers: {
            'content-type':'application/json',
          },
          body: JSON.stringify(body),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          response.json().then(error => {
            throw new Error(error.message);
          });
        })
        .then((result) => {
          console.log(result);
          localStorage.token = result.token;
          this.$router.push('/dashboard');
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
      }
    },
    validUser() {
      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }

      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid';
      } else {
        console.log(result.error.message);
        this.errorMessage = 'Password is invalid';
      }
      return false;
    }
  },
};
</script>

<style>
</style>
