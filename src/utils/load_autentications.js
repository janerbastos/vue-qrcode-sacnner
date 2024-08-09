import axios from 'axios'

const BASE_URL = import.meta.env.VITE_AUTENTICATE_URL
const PARAMS = {
  client_id: 'ctic-infra',
  client_secret: 'segredo',
  grant_type: 'client_credentials'
}

await axios.post(`${BASE_URL}?client_id=${PARAMS.client_id}&client_secret=${PARAMS.client_secret}&grant_type=${PARAMS.grant_type}`)
.then( response => {
    localStorage.setItem('access_token', response.data.access_token)
})
.catch( err => {
    console.log(err.message)
})