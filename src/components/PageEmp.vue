<template>
	<v-container>

		<v-row>
			<v-col cols="12" class="text-center">
				<h1 class="font-weight-bold mb-3 display-1">Сотрудники — данные</h1>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="3" class="text-left">
				<v-btn @click="newEmp" color="primary">
					<v-icon>add</v-icon>
					Добавить
				</v-btn>

				<v-list v-if="sortedEmps.length"
					dense color="transparent"
					max-width="300">
					<v-list-item
						v-for="emp in sortedEmps"
						:key="emp.id"
						@click="gotoEmp(emp.id)">
						<v-list-item-content>
							{{ emp.fioShort }}
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
			v-model="snackbar.on"
			:timeout="snackbar.timeout">
			{{ snackbar.text }}
			<template #action="{ attrs }">
				<v-btn
					text
					v-bind="attrs"
					@click="snackbar.on = false">
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

	props: {
		id: String,
	},

	data: () => ({
		employees: {},
		current: {},
		snackbar: { on: false, timeout: 3000, text: "" },
	}),

	created() {
		this.employees = api.load()
		this.resetForm()
	},

	computed: {
		sortedEmps() {
			return _.sortBy(this.employees, v => v.fio)
		},
	},

	watch: {
		id() {
			this.resetForm()
		},
	},

	methods: {

		saveEmployee(emp) {
			const mustGoto = !emp.id
			emp = api.prepare(emp)

			const { id } = emp
			this.$set(this.employees, id, emp)
			api.save(this.employees)

			this.snackbar.text = `${ emp.fio } — сохранен`
			this.snackbar.on = true
			if (mustGoto) this.gotoEmp(id)
		},

		deleteEmployee(emp) {
			if (_.isUndefined(emp.id)) return //^

			this.$delete(this.employees, emp.id)
			api.save(this.employees)

			this.snackbar.text = `${ emp.fio } — удален!`
			this.snackbar.on = true
			this.$router.push({ name: "PageHome" })
		},

		resetForm() {
			const { id } = this
			if (_.isUndefined(id)) {
				this.newEmp()
			} else {
				this.editEmp(id)
			}
		},

		newEmp() {
			this.current = {}
		},

		editEmp(id) {
			this.current = { ...this.employees[id] }
		},

		gotoEmp(id) {
			const mustGoto = id !== this.id
			if (mustGoto) this.$router.push({ name: "PageEmp", params: { id } })
		},
	},
}
</script>
