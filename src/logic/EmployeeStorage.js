"use strict"

import _ from "lodash/core"

class EmployeeStorage {

	static load() {
		const items = localStorage.getItem("employees")
		if (!items) return []
		try {
			return JSON.parse(items).map((item, index) => this.prepareItem(item, index))
		}
		catch(e) {
			localStorage.removeItem("employees")
			return []
		}
	}

	static save(items) {
		const storageKeys = [ "fio", "pass_ser", "pass_no", "pass_dt" ]

		const prepared = items.map(entry =>
			Object.keys(entry)
				.filter(key => storageKeys.includes(key))
				.reduce((obj, key) => {
					obj[key] = entry[key]
					return obj
				}, {})
			)
		prepared.forEach(entry => entry.pass_dt = entry.pass_dt + "T00:00:00Z")

		localStorage.setItem("employees", JSON.stringify(prepared))
	}

	static prepareItem(entry, index) {
		const fioparts = entry.fio.split(/\s+/)
		return {
			...entry,
			pass_dt: entry.pass_dt.substr(0, 10),
			fioShort: fioparts.reduce(
				(acc, curr) => acc + curr.charAt(0) + ".",
				fioparts.shift() + " "
			),
			stored: !_.isUndefined(index),
			index,
		}
	}

}

export default EmployeeStorage;
