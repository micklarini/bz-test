import Vue from "vue"
import VueRouter from "vue-router"
import PageEmp from "../components/PageEmp"

Vue.use(VueRouter)

const routes = [
	{ path: "", component: PageEmp },
	{ path: "/:id", component: PageEmp },
]

export default new VueRouter({
	mode: "history",
	routes,
})
