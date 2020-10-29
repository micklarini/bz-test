"use strict"

import _ from "lodash/core"

class EmployeeStorage {

	static load() {
		let results = {};
		let items = JSON.parse(localStorage.getItem("employees"));
		if (!items) return results;
		try {
			Object.entries(items)
				.map(entry => {
					results[entry[0]] = this.prepareItem(entry[1], entry[0])
				})
			return results
		}
		catch(e) {
			localStorage.removeItem("employees")
			return results
		}
	}

	static save(items) {
		const storageKeys = ["fio", "pass_ser", "pass_no", "pass_dt" ]
		let prepared = {}

		for (var entry in items) {
			prepared[entry] = Object.keys(items[entry])
				.filter(key => storageKeys.includes(key))
				.reduce((obj, key) => {
					obj[key] = items[entry][key]
					return obj
				}, {})
		}
		for (var key in prepared) {
			var item = {
				...prepared[key],
				pass_dt: prepared[key].pass_dt + "T00:00:00Z"
			}
			delete item.id
			prepared[key] = item
		}
		localStorage.setItem("employees", JSON.stringify(prepared))
	}

	static prepareItem(entry, id) {
		const fioparts = entry.fio.split(/\s+/)
		return {
			...entry,
			pass_dt: entry.pass_dt.substr(0, 10),
			fioShort: fioparts.reduce(
				(acc, curr) => acc + curr.charAt(0) + ".",
				fioparts.shift() + " "
			),
			id: !_.isUndefined(id) ? id : _.isUndefined(entry.id) ? this.uuidv4() : entry.id,
		}
	}

	static uuidv4() {
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,
			c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		)
	}
}

export default EmployeeStorage
