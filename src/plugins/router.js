import Vue from "vue"
import VueRouter from "vue-router"
import PageEmp from "../components/PageEmp"

Vue.use(VueRouter)

const routes = [
	{
		path: "",
		name: "PageHome",
		component: PageEmp,
	},
	{
		path: "/:id",
		name: "PageEmp",
		component: PageEmp,
	},
]

export default new VueRouter({
	mode: "history",
	routes,
})
