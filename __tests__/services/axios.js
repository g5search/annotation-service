import axios from '@nuxtjs/axios'

export function getNotes() {
  return axios
    .get()
    .then(res => res.data)
}