<template>
  <section>
    <h1>Signup</h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{errorMessage}}
    </div>
    <form @submit.prevent="signup">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="user.username" type="text" class="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter a username" required>
        <h5 id="usernameHelp" class="form-text text-muted">Username must be between 2 and 30 characters in length. Username can only contain alphanumeric characters and underscores.</h5>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <label for="exampleInputPassword1">Password</label>
          <input v-model="user.password" type="password" class="form-control" id="password" aria-describedby="passwordHelp" placeholder="Password" required>
          <h5 id="usernameHelp" class="form-text text-muted">Password must be 10 or more characters long.</h5>
        </div>
        <div class="form-group col-md-6">
          <label for="exampleInputPassword1">Confirm Password</label>
          <input v-model="user.confirmPassword" type="password" class="form-control" id="confirmPassword" aria-describedby="confirmPasswordHelp" placeholder="Password" required>
          <h5 id="usernameHelp" class="form-text text-muted">Please confirm your password.</h5>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </section>
</template>

<script>
import Joi from 'joi';

const SIGNUP_URL = 'http://localhost:5000/auth/signup';

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
  confirmPassword: Joi.string()
    .trim()
    .min(10)
    .required()
});

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true
    }
  },
  methods: {
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        // send data to server...
        const body = {
          username: this.user.username,
          password: this.user.password
        };

        fetch(SIGNUP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json'
          }
        })
          .then(response => {
            if (response.ok) {
              return response.json();
            }

            response.json().then(error => {
              throw new Error(error.message);
            });
          })
          .then(user => {
            this.$router.push('/dashboard');
          })
          .catch(error => {
            this.errorMessage = error.message;
          });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match';
        return false;
      }

      const result = Joi.validate(this.user, schema);
      if (result.error === null) {
        return true;
      }

      if (result.error.message.includes('username')) {
        this.errorMessage = 'Invalid username';
      } else {
        this.errorMessage = 'Password is invalid';
      }
      return false;
    }
  }
};
</script>

<style>
</style>
