"use strict"

import _ from "lodash/core"
import EmployeeStorage from "../logic/EmployeeStorage.js"

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
		this.employees = EmployeeStorage.load()
		this.$on("entry:save", this.saveEmployee)
		this.$on("entry:delete", this.deleteEmployee)
		if (_.isUndefined(this.id)) {
			this.formNew()
		}
		else {
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
		saveEmployee(entry) {
			entry = EmployeeStorage.prepareItem(entry)
			this.employees[entry.id] = entry
			EmployeeStorage.save(this.employees)
			this.snackbar.text = `${entry.fio} — сохранен`
			this.snackbarOn = true
			this.current = {}
			this.$recompute("emplMap")
			this.$router.push("/")
		},

		deleteEmployee(entry) {
			if (_.isUndefined(entry.id))
				return
			delete this.employees[entry.id]
			EmployeeStorage.save(this.employees)
			this.snackbar.text = `${entry.fio} — удален!`
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
			this.current = {...this.employees[id]}
			await this.$nextTick()
			this.$refs.editorForm.entryEdit()
		},
	},
}
