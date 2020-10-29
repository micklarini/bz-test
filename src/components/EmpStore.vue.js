"use strict"

import _ from "lodash/core"
import EmpStore from "../logic/EmpStore.js"

import EmpStoreForm from "./EmpStoreForm"

export default {
	name: "EmpStore",
	components: { EmpStoreForm },

	data: () => ({
		employees: {},
		current: {},
		snackbar: { timeout: 1000, text: "" },
		snackbarOn: false,
	}),

	mounted: async function() {
		this.employees = EmpStore.load()
		this.$on("entry:save", this.saveEmployee)
		this.$on("entry:delete", this.deleteEmployee)
		if (_.isUndefined(this.id)) {
			this.formNew()
		} else {
			this.formEdit(this.id)
		}
	},

	computed: {

		id() {
			return this.$route.params.id
		},
		emplMap() {
			return Object.entries(this.employees)
				.sort((a, b) => a[1].fio.localeCompare(b[1].fio))
				.map(item => item[0])
		},
	},

	methods: {

		saveEmployee(emp) {
			emp = EmpStore.prepare(emp)
			this.employees[emp.id] = emp
			EmpStore.save(this.employees)
			this.snackbar.text = `${ emp.fio } — сохранен`
			this.snackbarOn = true
			this.current = {}
			this.$recompute("emplMap")
			this.$router.push("/")
		},

		deleteEmployee(emp) {
			if (_.isUndefined(emp.id)) return //^
			delete this.employees[emp.id]
			EmpStore.save(this.employees)

			this.snackbar.text = `${ emp.fio } — удален!`
			this.snackbarOn = true
			this.current = {}
			this.$recompute("emplMap")
			this.$router.push("/")
		},

		formNew: async function() {
			this.current = {}
			await this.$nextTick()
			this.$refs.editorForm.entryNew()
		},

		formEdit: async function(id) {
			this.current = { ...this.employees[id] }
			await this.$nextTick()
			this.$refs.editorForm.entryEdit()
		},
	},
}
