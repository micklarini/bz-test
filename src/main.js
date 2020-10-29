import "roboto-fontface/css/roboto/roboto-fontface.css"
import Vue from "vue"
import "./mixins/recompute"
import vuetify from "./plugins/vuetify"
import router from "./plugins/router"
import App from "./App"

Vue.config.productionTip = false

export default new Vue({
	vuetify,
	router,
	render: (h) => h(App),
}).$mount("#app")
