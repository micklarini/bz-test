module.exports = {
	chainWebpack: config => {
		config
			.plugin("html")
			.tap(args => {
				args[0].title = "Vue test of employees management"
				return args
			})
	},
	configureWebpack: {
		resolve: {
			alias: {
				"vue$": "vue/dist/vue.esm.js",
			},
		},
	},
}
