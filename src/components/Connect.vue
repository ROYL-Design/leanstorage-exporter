<style lang="sass">
.container
  padding: 20px 0
</style>

<template lang="pug">
.container
  .box
    .field
      label.label App ID
      input.input(placeholder="App ID", v-model="appId")
    .field
      label.label Master Key
      input.input(placeholder="Master Key", v-model="appKey")
    .button.is-info(@click="connect", :class="{'is-loading': loading}") Connect
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loading: false,
      appId: window.localStorage.getItem('lse_app_id') || '',
      appKey: window.localStorage.getItem('lse_app_key') || '',
      domain: window.localStorage.getItem('lse_domain') || ''
    }
  },
  methods: {
    connect () {
      if (this.loading) return
      this.loading = true
      axios.get('https://app-router.leancloud.cn/2/route', {
        params: { appId: this.appId }
      }).then(result => {
        this.domain = result.data.api_server
        return axios.get(`https://${this.domain}/1.1/stats/appinfo`, {
          headers: {
            'X-LC-Id': this.appId,
            'X-LC-Key': this.appKey + ',master'
          }
        })
      }).then(result => {
        window.localStorage.setItem('lse_app_id', this.appId)
        window.localStorage.setItem('lse_app_key', this.appKey)
        window.localStorage.setItem('lse_domain', this.domain)
        this.$router.push('/')
      }).catch(err => {
        window.alert(err)
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>
