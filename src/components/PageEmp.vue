<template>
	<v-container>

		<v-row>
			<v-col cols="12" class="text-center">
				<h1 class="font-weight-bold mb-3 display-1">Сотрудники — данные</h1>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="3" class="text-left">
				<v-btn elevation="2" to="/" @click="formNew()" medium><v-icon>add</v-icon>Добавить
				</v-btn>
				<v-list v-if="emplMap.length" max-width="300" dense light>
					<v-list-item v-for="id in emplMap" :key="id" @click="formEdit(id)">
						<v-list-item-content>
							<router-link :to="'/' + id">
								{{ employees[id].fioShort }}
							</router-link>
						</v-list-item-content>
					</v-list-item>
				</v-list>
			</v-col>

			<v-col cols="9">
				<FormEmp
					ref="editorForm"
					:values="current"
					@save="saveEmployee"
					@delete="deleteEmployee"
				/>
			</v-col>
		</v-row>

		<v-snackbar
			v-model="snackbarOn"
			:timeout="snackbar.timeout">
			{{ snackbar.text }}
			<template v-slot:action="{ attrs }">
				<v-btn
					color="red"
					text
					v-bind="attrs"
					@click="snackbarOn = false">
					Закрыть
				</v-btn>
			</template>
		</v-snackbar>

	</v-container>
</template>

<script>
"use strict"

import _ from "lodash"
import * as api from "../logic/apiEmp.js"
import FormEmp from "./FormEmp"

export default {
	name: "PageEmp",
	components: { FormEmp },

	data: () => ({
		employees: {},
		current: {},
		snackbar: { timeout: 1000, text: "" },
		snackbarOn: false,
	}),

	mounted: async function() {
		this.employees = api.load()
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
			emp = api.prepare(emp)
			this.$set(this.employees, emp.id, emp)
			api.save(this.employees)

			this.snackbar.text = `${ emp.fio } — сохранен`
			this.snackbarOn = true
			// this.current = {}
			// this.$recompute("emplMap")
			// this.$router.push({ name: "PageHome" })
		},

		deleteEmployee(emp) {
			if (_.isUndefined(emp.id)) return //^
			this.$delete(this.employees, emp.id)
			api.save(this.employees)

			this.snackbar.text = `${ emp.fio } — удален!`
			this.snackbarOn = true
			this.current = {}
			// this.$recompute("emplMap")
			this.$router.push({ name: "PageHome" })
		},

		formNew: async function() {
			this.current = {}
			await this.$nextTick()
		},

		formEdit: async function(id) {
			this.current = { ...this.employees[id] }
			await this.$nextTick()
		},
	},
}
</script>
