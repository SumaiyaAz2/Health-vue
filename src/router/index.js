import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin.vue'
import Patients from '@/components/Patients/Patients'
import Records from '@/components/Records/Records'
import PatientSearch from '@/components/Patients/PatientSearch'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/patients',
      name: 'Patients',
      component: Patients
    },
    {
      path: '/records',
      name: 'Records',
      component: Records
    },
    {
      path: '/patients/find',
      name: 'PatientSearch',
      component: PatientSearch
    }
  ]
})
