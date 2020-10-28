<template>
	<v-app>
		<v-main>
		<EmpStore/>
		</v-main>
	</v-app>
</template>

<script>
import EmpStore from "./components/EmpStore"

export default {
	name: "App",
	components: { EmpStore },
};
</script>
