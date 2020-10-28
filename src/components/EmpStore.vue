<template>
<v-container>
	<v-row>
		<v-col cols="12" class="text-center">
			<h1 class="font-weight-bold mb-3 display-1">Сотрудники - данные</h1>
		</v-col>
	</v-row>
	<v-row>
		<v-col cols="3" class="text-left">
			<v-btn elevation="2" @click="formNew" medium><v-icon>add</v-icon>Добавить</v-btn>
			<v-list v-if="employees.length" max-width="300" dense light>
				<v-list-item v-for="(emp, key) in employees" :key="key" @click="formEdit(key)">
					<v-list-item-content>{{ emp.fioShort }}</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-col>
		<v-col cols="9">
			<EmpStoreForm ref="editorForm" :entry="current" />
		</v-col>
	</v-row>
</v-container>
</template>

<script>
"use strict"

import _ from "lodash/core"
import EmployeeStorage from "../logic/EmployeeStorage.js"

import EmpStoreForm from "./EmpStoreForm"

export default {
	name: "EmpStore",

	components: { EmpStoreForm },

	data: () => ({
		employees: [],
		current: {},
	}),

	mounted: async function() {
		this.employees = EmployeeStorage.load()
		this.$on("entry:save", this.saveEmployee)
		this.$on("entry:delete", this.deleteEmployee)
	},

	methods: {
		saveEmployee(entry) {
			if (!entry.stored) {
				this.employees.push(EmployeeStorage.prepareItem(entry, this.employees.length))
			}
			else if (!_.isUndefined(entry.index)) {
				this.employees[entry.index] = EmployeeStorage.prepareItem(entry, entry.index)
			}
			EmployeeStorage.save(this.employees)
			this.current = {}
		},

		deleteEmployee(entry) {
			if (_.isUndefined(entry.index))
				return
			this.employees.splice(entry.index, 1)
			EmployeeStorage.save(this.employees)
			this.current = {}
		},

		formNew: async function() {
			this.current = {}
			await this.$nextTick()
			this.$refs.editorForm.entryNew()
		},

		formEdit: async function(key) {
			this.current = {...this.employees[key]}
			await this.$nextTick()
			this.$refs.editorForm.entryEdit()
		},

	},

}

</script>
