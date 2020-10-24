<template>
<v-container>
	<v-row>
		<v-col cols="12" class="text-center">
			<h1 class="font-weight-bold mb-3 display-1">Сотрудники - данные</h1>
		</v-col>
	</v-row>
	<v-row>
		<v-col cols="3" class="text-left">
			<v-btn elevation="2" @click="newForm" medium><v-icon>add</v-icon>Добавить</v-btn>
			<v-list v-if="employees.length" max-width="300" dense light>
				<v-list-item v-for="(emp, key) in employees" :key="key" @click="editForm(key)">
					<v-list-item-content>{{ emp.fioShort }}</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-col>
		<v-col cols="9">
			<v-form ref="employeeForm" v-model="valid" lazy-validation>
				<p class="mb-0">Сотрудник</p>
				<v-text-field
					v-model="current.fio"
					:rules="fioRules"
					label="Фамилия Имя Отчество"
					required
					ref="employeeName"
					class="mb-3"
				></v-text-field>
				<p class="mb-0">Паспорт</p>
				<div class="flex-row mb-3">
					<v-text-field
						class="d-inline-flex mr-2"
						type="number"
						maxlength="4"
						:counter="4"
						v-model="current.pass_ser"
						:rules= "serRules"
						label="серия"
						required
					></v-text-field>
					<v-text-field
						class="d-inline-flex mr-2"
						type="number"
						maxlength="6"
						:counter="6"
						v-model="current.pass_no"
						:rules="noRules"
						label="номер"
						required
					></v-text-field>
					<v-menu
						ref="dtMenu"
						v-model="dtMenu"
						:close-on-content-click="false"
						transition="scale-transition"
						offset-y
						min-width="290px"
					>
						<template v-slot:activator="{ on, attrs }">
							<v-text-field
								class="d-inline-flex"
								v-model="displayDate"
								:rules="dtRules"
								label="дата выдачи"
								required
								readonly
								v-bind="attrs"
								v-on="on"
							></v-text-field>
						</template>
						<v-date-picker
							ref="passportDate"
							v-model="current.pass_dt"
							:max="new Date().toISOString().substr(0, 10)"
							min="1930-01-01"
							@input="dtMenu = false"
							locale="ru-ru"
						></v-date-picker>
					</v-menu>
				</div>
				<v-btn
					elevation="2"
					@click="saveEmployee(current)"
					medium
					color="primary"
					class="mr-3"
				>
					<v-icon>save</v-icon>Сохранить
				</v-btn>
				<v-dialog
					v-model="dialogDelete"
					persistent
					max-width="290"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn elevation="2"
							:disabled="!current.stored"
							medium
							color="secondary"
							v-bind="attrs"
							v-on="on"
						>
							<v-icon>delete</v-icon>Удалить
						</v-btn>
					</template>
					<v-card>
							<v-card-title class="headline">
								Удалить {{ current.fioShort }}?
							</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									color="green"
									@click="deleteEmployee(current.index);"
								>
								Да
								</v-btn>
								<v-btn
									color="secondary"
									@click="dialogDelete = false"
								>
								Нет
								</v-btn>
							</v-card-actions>
					</v-card>
				</v-dialog>
			</v-form>
		</v-col>
	</v-row>
</v-container>
</template>


<script>
export default {
	name: "EmpStore",

	data: () => ({
		employees: [],
		current: {},

		valid: true,
		dtMenu: false,
		dialogDelete: false,

		fioRules: [
			v => !!v || "Необходимо заполнить Фамилию Имя и Отчество",
			v => /^[^\s]{2,}\s+[^\s]{2,}\s+[^\s]{2,}\s*$/u.test(v) || "Неверный формат",
		],
		serRules: [
			v => !!v || "Необходимо заполнить серию",
			v => (v && v.length == 4) || "Неверная длина",
		],
		noRules: [
			v => !!v || "Необходимо заполнить номер",
			v => (v && v.length == 6) || "Неверная длина",
		],
		dtRules: [
			v => !!v || "Необходимо заполнить дату выдачи",
		]
	}),

	computed: {
		displayDate() {
			if (!!!this.current.pass_dt)
				return null
			return (new Date(this.current.pass_dt).toLocaleDateString())
		},
	},

	watch: {
		dtMenu(val) {
			val && setTimeout(() => (this.$refs.passportDate.activePicker = "YEAR"))
		},
	},

	mounted: async function() {
		if (localStorage.getItem("employees")) {
			try {
				this.employees = JSON.parse(localStorage.getItem("employees")).map(
					(item, index) => this.prepareEmployee(item, index)
				)
			}
			catch(e) {
				localStorage.removeItem("employees")
			}
		}
	},

	methods: {
		storeEmployees: function() {
			const storageKeys = [ "fio", "pass_ser", "pass_no", "pass_dt" ]
			
			let prepared = this.employees.map(entry =>
				Object.keys(entry)
					.filter(key => storageKeys.includes(key))
					.reduce((obj, key) => {
						obj[key] = entry[key]
						return obj
					}, {})
			)
			prepared.forEach(entry => entry.pass_dt = entry.pass_dt + "T00:00:00Z")

			const serialized = JSON.stringify(prepared)
			localStorage.setItem("employees", serialized)
		},

		prepareEmployee: (entry, index) => {
			const fioparts = entry.fio.split(/\s+/)
			return {
				...entry,
				pass_dt: entry.pass_dt.substr(0, 10),
				fioShort: fioparts.reduce(
					(acc, curr) => acc + curr.charAt(0) + ".",
					fioparts.shift() + " "
				),
				stored: index !== undefined,
				index,
			}
		},

		saveEmployee: function(entry) {
			if (!this.$refs.employeeForm.validate())
				return

			if (!entry.stored) {
				this.employees.push(this.prepareEmployee(entry, this.employees.length))
			}
			else if (entry.index !== undefined) {
				this.employees[entry.index] = this.prepareEmployee(entry, entry.index)
			}
			this.storeEmployees()
			this.current = {}
			this.$refs.employeeForm.reset()
		},

		deleteEmployee: function(key) {
			this.dialogDelete = false;
			this.employees.splice(key, 1)
			this.current = {}
			this.storeEmployees()
			this.$refs.employeeForm.reset()
		},

		newForm: function() {
			this.current = {}
			this.$refs.employeeForm.reset()
			this.$refs.employeeName.focus()
		},

		editForm: function(key) {
			this.current = {...this.employees[key]}
			this.$refs.employeeName.focus()
		},

	},
}
</script>
