<template>
    <div>
      <form class="form-Patient" @submit.prevent="searchPatient">
        <h3>Find patient!</h3>
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
        </div><br>
        <button type="submit" class="btn btn-primary mb-3">Submit</button>
        <div><br>
          <b-button variant="outline-dark" @click="addRecord">Add Record</b-button>
        <b-button variant="outline-dark" @click="addPatient">Add Patient</b-button>
          <b-button variant="outline-dark" @click="signOut">Sign out</b-button>
        </div>
      </form>
      <div>
        <h3>Patient Info:</h3>
        <hr />
        <div>
          <b-container class="bv-example-row">
            <b-row>
              <b-col>Name</b-col>
              <b-col>Contact</b-col>
              <b-col>Address</b-col>
            </b-row>
            <b-row>
              <b-col>{{patient.name}}</b-col>
              <b-col>{{patient.contact}}</b-col>
              <b-col>{{patient.address}}</b-col>
            </b-row>
        </b-container><br><br>
        </div>
      </div>
      <div>
        <h3>Medical History!</h3>
        <hr />
        <div>
          <b-container class="bv-example-row">
          <b-row>
              <b-col>Disease</b-col>
              <b-col>Medicine Prescribed</b-col>
              <b-col>Prescribed On</b-col>
          </b-row>
            <b-row v-for="medicalRecord in medicalRecords">
              <b-col>{{medicalRecord.disease}}</b-col>
              <b-col>{{medicalRecord.medicine}}</b-col>
              <b-col>{{medicalRecord.created_at}}</b-col>
            </b-row>
        </b-container><br><br>
        </div>
      </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'searchPatient',
  data () {
    return {
      nid: '',
      patient: [],
      medicalRecords: [],
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
    searchPatient () {
      if (localStorage.signedIn) {
        const Patient = {
          nid: this.nid
        }
        axios
          .post(
            'http://localhost:3000/patients/find',
            {
              nid: this.nid
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          )
          .then(response => {
            console.log(response)
            if (response.data.patient.nid === Patient.nid) {
              this.patient = response.data.patient
              this.medicalRecords = response.data.medical_record
            } else {
              alert('NID does not exist!')
            }
          })
          .catch(error => console.log(error))
      }
    },
    addRecord () {
      this.$router.push('/records')
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
