import moment from "moment"
import _ from "lodash/core"

moment.locale("ru")

export default {
	name: "EmpStoreForm",

	props: {
		values: { type: Object, required: true },
	},

	data: () => ({
		valid: true,
		dtMenu: false,
		dialogDelete: false,
		saveOff: true,

		rulesFullName: [
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
		async dtMenu(v) {
			if (!v) return //^
			await this.$nextTick()
			this.$refs.passDt.activePicker = "YEAR"
		},
	},

	methods: {
		entryNew() {
			this.$refs.theForm.reset()
		},

		entryEdit() {
		},

		entrySave() {
			if (!this.$refs.theForm.validate())
				return
			this.$parent.$emit("entry:save", { ...this.entry })
			this.saveOff = true
			this.$refs.theForm.reset()
		},

		entryDelete() {
			this.$parent.$emit("entry:delete", { ...this.entry })
			this.saveOff = true
			this.dialogDelete = false
			this.$refs.theForm.reset()
		},
	},
}
