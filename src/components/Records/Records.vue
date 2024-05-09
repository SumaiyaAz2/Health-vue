<template>
    <div>
      <form class="form-Patient" @submit.prevent="insertRecord">
        <h3>Add new Medical Record!</h3>
        <hr />
        <br />
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <div class="form-group">
          <label for="PatientNID">Patient NID</label>
          <input
            v-model="nid"
            type="PatientNID"
            class="form-control"
            id="PatientNID"
            required
          />
        </div>
        <div class="form-group">
          <label for="disease">Disease</label>
          <input
            v-model="disease"
            class="form-control"
            id="disease"
            required
            />
        </div>
        <div class="form-group">
          <label for="medicine">Medicines</label>
          <input
            v-model="medicine"
            type="medicine"
            class="form-control"
            id="medicine"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary mb-3">Submit</button>
        <div><br>
          <b-button variant="outline-dark" @click="addPatient">Add Patient Instead</b-button>
          <b-button variant="outline-dark" @click="signOut">Sign out</b-button>
        </div>
      </form>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'addRecord',
  data () {
    return {
      disease: '',
      medicine: '',
      nid: '',
      error: ''
    }
  },
  created () {
    if (!localStorage.signedIn) {
      this.$router.replace('/')
    } else {
      this.$http.secured.get('http://localhost:3000/patients')
        .then(response => { this.record = response.data })
        .catch(error => this.setError(error, 'Something went wrong!'))
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    insertRecord () {
      if (localStorage.signedIn) {
        const Record = {
          medicine: this.medicine,
          disease: this.disease,
          nid: this.nid
        }
        axios
          .post(
            'http://localhost:3000/records/new',
            {
              record: Record
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
          .then(response => {
            console.log(response)
            if (response.data.nid === Record.nid) {
              alert('Record Created!')
            } else {
              alert('Failed To Create Record!')
            }
          })
          .catch(error => console.log(error))
      }
    },
    addPatient () {
      this.$router.push('/patients')
    },
    signOut () {
      if (localStorage.signedIn) {
        axios
          .delete(
            'http://localhost:3000/logout',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
          .then(response => {
            delete localStorage.token
            delete localStorage.signedIn
            this.$router.replace('/')
          })
          .catch(error => this.setError(error, 'Cannot sign out'))
      }
    }
  }
}
</script>
<style lang="css">
  .form-Patient {
    width: 70%;
    max-width: 500px;
    padding: 10% 15px;
    margin: 0 auto;
    margin-top: 20px !important;
    padding-top: 20px !important;
  }
</style>
