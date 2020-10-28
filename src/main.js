import "roboto-fontface/css/roboto/roboto-fontface.css"
import Vue from "vue"
import vuetify from "./plugins/vuetify";
import App from "./App.vue"

Vue.config.productionTip = false

export default new Vue({
	vuetify,
	render: h => h(App)
}).$mount("#app")
