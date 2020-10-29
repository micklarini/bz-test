<template>
	<v-form ref="theForm"
		v-model="valid"
		@submit.prevent="submit"
		lazy-validation>
		<p class="mb-0">Сотрудник</p>

		<v-text-field
			v-model="values.fio"
			:rules="rulesFio"
			@focus="saveOff = false"
			label="Фамилия Имя Отчество"
			required
			ref="employeeName"
			class="mb-3"
		/>

		<p class="mb-0">Паспорт</p>

		<div class="flex-row mb-3">
			<v-text-field
				class="d-inline-flex mr-2"
				type="number"
				maxlength="4"
				:counter="4"
				v-model="values.pass_ser"
				:rules="rulesPassSer"
				@focus="saveOff = false"
				label="серия"
				required
			/>
			<v-text-field
				class="d-inline-flex mr-2"
				type="number"
				maxlength="6"
				:counter="6"
				v-model="values.pass_no"
				:rules="rulesPassNo"
				@focus="saveOff = false"
				label="номер"
				required
			/>
			<v-menu
				ref="dtMenu"
				v-model="dtMenu"
				:close-on-content-click="false"
				transition="scale-transition"
				offset-y
				min-width="290px">
				<template v-slot:activator="{ on, attrs }">
					<v-text-field
						class="d-inline-flex"
						v-model="displayDate"
						:rules="rulesPassDt"
						label="дата выдачи"
						@focus="saveOff = false"
						required
						readonly
						v-bind="attrs"
						v-on="on"
					/>
				</template>
				<v-date-picker
					ref="passDt"
					v-model="values.pass_dt"
					:max="new Date().toISOString().substr(0, 10)"
					min="1930-01-01"
					@input="dtMenu = false"
					locale="ru-ru"
				/>
			</v-menu>
		</div>

		<v-btn
			type="submit"
			:disabled="saveOff"
			color="primary"
			class="mr-3">
			<v-icon>save</v-icon>
			Сохранить
		</v-btn>

		<v-dialog
			v-model="dialogDelete"
			persistent
			max-width="450">
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					v-bind="attrs"
					v-on="on"
					:disabled="!values.id"
					color="secondary">
					<v-icon>delete</v-icon>
					Удалить
				</v-btn>
			</template>

			<v-card>
				<v-card-title class="headline">
					Удалить {{ values.fioShort }}?
				</v-card-title>

				<v-card-actions>
					<v-spacer/>
					<v-btn
						color="green"
						@click="deleteCurrent">
						Да
					</v-btn>
					<v-btn
						color="secondary"
						@click="dialogDelete = false">
						Нет
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script>
"use strict"

import moment from "moment"
import _ from "lodash/core"

const RULES = {
	rulesFio: [
		v => !!v || "Необходимо заполнить Фамилию Имя и Отчество",
		v => /^[^\s]{2,}\s+[^\s]{2,}\s+[^\s]{2,}\s*$/u.test(v) || "Неверный формат",
	],
	rulesPassSer: [
		v => !!v || "Необходимо заполнить серию",
		v => (v && v.length == 4) || "Неверная длина",
	],
	rulesPassNo: [
		v => !!v || "Необходимо заполнить номер",
		v => (v && v.length == 6) || "Неверная длина",
	],
	rulesPassDt: [
		v => !!v || "Необходимо заполнить дату выдачи",
	],
}

export default {
	name: "FormEmp",

	props: {
		values: { type: Object, required: true },
	},

	data: () => ({
		valid: true,
		dtMenu: false,
		dialogDelete: false,
		saveOff: true,
		...RULES,
	}),

	computed: {
		displayDate: {
			get() {
				let dt = this.values.pass_dt
				return _.isUndefined(dt)
					? null
					: moment(dt).format("L")
			},
			set(v) {
				console.log("displayDate set:", v) //D
			},
		},
	},

	watch: {

		["values.id"](v) {
			if (!v) this.$refs.theForm.reset()
		},

		async dtMenu(v) {
			if (!v) return //^
			await this.$nextTick()
			this.$refs.passDt.activePicker = "YEAR"
		},
	},

	methods: {

		submit() {
			const form = this.$refs.theForm
			if (!form || !form.validate()) return //^

			this.$emit("save", this.values)
			this.saveOff = true
		},

		deleteCurrent() {
			this.$emit("delete", this.values)
			this.saveOff = true
			this.dialogDelete = false
		},
	},
}
</script>
