import "roboto-fontface/css/roboto/roboto-fontface.css"
import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false

export default new Vue({
	vuetify,
	render: h => h(App)
}).$mount("#app")
