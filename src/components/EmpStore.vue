<template>
<v-container>
	<v-row>
		<v-col cols="12" class="text-center">
			<h1 class="font-weight-bold mb-3 display-1">Сотрудники</h1>
		</v-col>
	</v-row>
	<v-row>
		<v-col cols="3" class="text-left">
			<v-btn elevation="2" @click="newForm" medium><v-icon>add</v-icon>Добавить</v-btn>
			<v-list v-if="employees.length" max-width="300" dense light>
				<v-list-item v-for="(emp, key) in employees" :key="key" @click="editForm(key)">
					<v-list-item-content>{{ emp.fioshort }}</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-col>
		<v-col cols="9">
			<v-form ref="employeeForm" model="current.valid" lazy-validation>
				<p class="mb-0">Сотрудник</p>
				<v-text-field v-model="current.fio" label="Фамилия Имя Отчество" required ref="employeeName" class="mb-3"></v-text-field>
				<p class="mb-0">Паспорт</p>
				<div class="flex-row mb-3">
					<v-text-field class="d-inline-flex mr-2" v-model="current.pass_ser" label="серия" required></v-text-field>
					<v-text-field class="d-inline-flex mr-2" v-model="current.pass_no" label="номер" required></v-text-field>
					<v-text-field class="d-inline-flex" v-model="current.pass_dt" label="дата выдачи" required></v-text-field>
				</div>
				<v-btn elevation="2" :disabled="!current.valid" @click="saveEmployee(current)" medium primary class="mr-3"><v-icon>save</v-icon>Сохранить</v-btn>
				<v-btn elevation="2" :disabled="!current.stored" @click="deleteEmployee(current.key)" medium secondary><v-icon>delete</v-icon>Удалить</v-btn>
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
	}),

	mounted: async function() {
/*
		const entries = [
			{ fio: "Иванов Сидор Алексеевич", pass_ser: "3974", pass_no: "304238", pass_dt: "2003-04-16T00:00:00Z" },
			{ fio: "Петров Петр Иванович", pass_ser: "4021", pass_no: "420487", pass_dt: "2008-02-03T00:00:00Z" },
			{ fio: "Сидоров Петр Сидорович", pass_ser: "4148", pass_no: "399223", pass_dt: "2012-12-12T00:00:00Z" },
		]
*/
		if (localStorage.getItem('employees')) {
			try {
				this.employees = JSON.parse(localStorage.getItem('employees')).map((item, index) => ({
					...this.prepareEmployee(item, index),
					valid: true,
					stored: true,
				}))
			}
			catch(e) {
				localStorage.removeItem('employees')
			}
		}
	},

	methods: {
		prepareEmployee: (entry, index) => {
			let fioparts = entry.fio.split(/\s+/)
			let result = {
				index,
				...entry,
				fioshort: fioparts.reduce(
					(acc, curr) => acc + curr.charAt(0) + '.',
					fioparts.shift() + ' '
				)
			}
			return result
		},

		saveEmployee: function(entry) {
			if (!entry.stored) {
				this.employees.push(this.prepareEmployee(entry, this.employees.length))
			}
			else if (entry.index) {
				this.employees[entry.index] = this.prepareEmployee(entry, entry.index)
			}
			this.current = {}
			this.storeEmployees()
		},

		deleteEmployee: function(key) {
			this.current = {}
			this.employees.splice(key, 1)
		},

		newForm: function() {
			this.current = {}
			this.$refs.employeeName.focus()
		},

		editForm: function(key) {
			this.current = this.employees[key]
			this.$refs.employeeName.focus()
		},

		storeEmployees: function() {
			const storageKeys = [ "fio", "pass_ser", "pass_no", "pass_dt" ]

			const serialized = JSON.stringify(
				this.employees.map(entry =>
					Object.keys(entry)
						.filter(key => storageKeys.includes(key))
						.reduce((obj, key) => {
							obj[key] = entry[key]
							return obj
						}, {})
				)
			)
			localStorage.setItem('employees', serialized)
		},

	},
}
</script>
