<template>
    <div>
      <form class="form-Patient" @submit.prevent="insertPatient">
        <h3>Add new Patient Information!</h3>
        <hr />
        <br />
        <div class="alert alert-danger" v-if="error">{{ error }}</div>
        <div class="form-group">
          <label for="PatientName">Patient Name</label>
          <input
            v-model="name"
            class="form-control"
            id="PatientName"
            required
            />
        </div>
        <div class="form-group">
          <label for="PatientContact">Patient Contact</label>
          <input
            v-model="contact"
            type="PatientContact"
            class="form-control"
            id="PatientContact"
            required
          />
        </div>
        <div class="form-group">
          <label for="PatientAddress">Patient Address</label>
          <input
            v-model="address"
            type="PatientAddress"
            class="form-control"
            id="PatientAddress"
            required
          />
        </div>
        <div class="form-group">
          <label for="PatientNID">Patient NID</label>
          <input
            v-model="nid"
            type="PatientNID"
            class="form-control"
            id="PatientNID"
            required
          />
        </div><br>
        <button type="submit" class="btn btn-primary mb-3">Submit</button>
        <div><br>
          <b-button variant="outline-dark" @click="addRecord">Add Record</b-button>
          <b-button variant="outline-dark" @click="findPatient">Find Patient</b-button>
          <b-button variant="outline-dark" @click="signOut">Sign out</b-button>
        </div>
      </form>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'addPatient',
  data () {
    return {
      name: '',
      contact: '',
      address: '',
      nid: '',
      error: ''
    }
  },
  created () {
    if (!localStorage.signedIn) {
      this.$router.replace('/')
    } else {
      this.$http.secured.get('http://localhost:3000/patients')
        .then(response => { this.patient = response.data })
        .catch(error => this.setError(error, 'Something went wrong!'))
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    insertPatient () {
      if (localStorage.signedIn) {
        const Patient = {
          name: this.name,
          contact: this.contact,
          address: this.address,
          nid: this.nid
        }
        axios
          .post(
            'http://localhost:3000/patients/new',
            {
              patient: Patient
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
          .then(response => {
            console.log(response)
            if (response.data.nid === Patient.nid) {
              alert('Patient Added!')
            } else {
              alert('NID already exists!')
            }
          })
          .catch(error => console.log(error))
      }
    },
    addRecord () {
      this.$router.push('/records')
    },
    findPatient () {
      this.$router.push('/patients/find')
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
