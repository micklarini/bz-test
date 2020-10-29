"use strict"

import _ from "lodash"

export function load() {
	const emps = JSON.parse(localStorage.getItem("employees"))
	if (!emps) return {} //^

	try {
		return _.forEach(emps, (v, k) => {
			emps[k] = prepare(v, k)
		})
	} catch(err) {
		localStorage.removeItem("employees")
		return emps
	}
}

const STORAGE_KEYS = ["fio", "pass_ser", "pass_no", "pass_dt"]

export function save(emps) {
	const prepared = _.reduce(emps, (acc, v, k) => {
		acc[k] = {
			..._.pick(v, STORAGE_KEYS),
			pass_dt: v.pass_dt + "T00:00:00Z",
		}
		return acc
	}, {})
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
