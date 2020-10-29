import moment from "moment"
import _ from "lodash/core"

moment.locale("ru")

export default {
	name: "EmpStoreForm",

	props: {
		entry: { type: Object, required: true }
	},

	data: () => ({
		valid: true,
		dtMenu: false,
		dialogDelete: false,
		saveDisabled: true,

		rulesFullName: [
			v => !!v || "Необходимо заполнить Фамилию Имя и Отчество",
			v => /^[^\s]{2,}\s+[^\s]{2,}\s+[^\s]{2,}\s*$/u.test(v) || "Неверный формат",
		],
		rulesPSeries: [
			v => !!v || "Необходимо заполнить серию",
			v => (v && v.length == 4) || "Неверная длина",
		],
		rulesPNumber: [
			v => !!v || "Необходимо заполнить номер",
			v => (v && v.length == 6) || "Неверная длина",
		],
		rulesPDate: [
			v => !!v || "Необходимо заполнить дату выдачи",
		],
	}),

	computed: {
		displayDate: {
			get() {
				if (_.isUndefined(this.entry.pass_dt))
					return null
				return moment(this.entry.pass_dt).format("L")
			},
			set() {}
		},
	},

	watch: {
		dtMenu: async function(val) {
			if (!val) return
			await this.$nextTick()
			this.$refs.passportDate.activePicker = "YEAR"
		},
	},

	methods: {
		entryNew() {
			this.$refs.employeeForm.reset()
		},

		entryEdit() {
		},

		entrySave() {
			if (!this.$refs.employeeForm.validate())
				return
			this.$parent.$emit("entry:save", { ...this.entry })
			this.saveDisabled = true
			this.$refs.employeeForm.reset()
		},

		entryDelete() {
			this.$parent.$emit("entry:delete", { ...this.entry })
			this.saveDisabled = true
			this.dialogDelete = false
			this.$refs.employeeForm.reset()
		},
	},
}
