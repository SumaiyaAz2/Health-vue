<template>
    <div>
      <form class="form-signin" @submit.prevent="signin">
        <h3>Welcome back, Doc! Please sign in ...</h3>
        <hr />
        <br />
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <div class="form-group">
          <label for="license">License number</label>
          <input
            v-model="license"
            type="license"
            class="form-control"
            id="license"
            placeholder="1A2B3C-Example"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <br>
        <button type="submit" class="btn btn-primary mb-3">Sign in</button>
      </form>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Signin',
  data () {
    return {
      license: '',
      password: '',
      error: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    signin () {
      axios
        .post('http://localhost:3000/login', {
          license: this.license,
          password: this.password
        })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful (response) {
      if (!response.data) {
        this.signinFailed(response)
        return
      }
      localStorage.token = response.data
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace('patients')
    },
    signinFailed (error) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        ''
      delete localStorage.token
      delete localStorage.signedIn
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/patients')
      }
    }
  }
}
</script>
  <style lang="css">
  .form-signin {
    width: 70%;
    max-width: 500px;
    padding: 10% 15px;
    margin: 0 auto;
    margin-top: 20px !important;
    padding-top: 20px !important;
  }
</style>
