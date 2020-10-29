"use strict"

import _ from "lodash/core"

export function load() {
	const emps = {}
	const items = JSON.parse(localStorage.getItem("employees"))
	if (!items) return emps //^

	try {
		Object.entries(items)
			.map(v => {
				emps[v[0]] = this.prepare(v[1], v[0])
			})
		return emps
	} catch(err) {
		localStorage.removeItem("employees")
		return emps
	}
}

export function save(emps) {
	const STORAGE_KEYS = ["fio", "pass_ser", "pass_no", "pass_dt"]
	let prepared = {}

	for (var emp in emps) {
		prepared[emp] = Object.keys(emps[emp])
			.filter(k => STORAGE_KEYS.includes(k))
			.reduce((obj, k) => {
				obj[k] = emps[emp][k]
				return obj
			}, {})
	}
	for (var k in prepared) {
		var item = {
			...prepared[k],
			pass_dt: prepared[k].pass_dt + "T00:00:00Z",
		}
		delete item.id
		prepared[k] = item
	}
	localStorage.setItem("employees", JSON.stringify(prepared))
}

export function prepare(emp, id) {
	const fioparts = emp.fio.split(/\s+/)
	return {
		...emp,
		pass_dt: emp.pass_dt.substr(0, 10),
		fioShort: fioparts.reduce(
			(acc, s) => acc + s.charAt(0) + ".",
			fioparts.shift() + " ",
		),
		id: !_.isUndefined(id)
			? id
			: _.isUndefined(emp.id) ? this.uuidv4() : emp.id,
	}
}

export function uuidv4() {
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g,
		c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16),
	)
}
