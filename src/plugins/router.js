import Vue from "vue"
import VueRouter from "vue-router"
import EmpStore from "../components/EmpStore"

Vue.use(VueRouter)

const routes = [
		{ path: "", component: EmpStore },
		{ path: "/:id", component: EmpStore },
]

export default new VueRouter({
	mode: "history",
	routes,
})
