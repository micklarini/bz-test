<template>
<v-container>
	<v-row>
		<v-col cols="12" class="text-center">
			<h1 class="font-weight-bold mb-3 display-1">Сотрудники — данные</h1>
		</v-col>
	</v-row>
	<v-row>
		<v-col cols="3" class="text-left">
			<v-btn elevation="2" to="/" @click="formNew()" medium><v-icon>add</v-icon>Добавить</v-btn>
			<v-list v-if="emplMap.length" max-width="300" dense light>
				<v-list-item v-for="id in emplMap" :key="id" @click="formEdit(id)">
					<v-list-item-content><router-link :to="'/'+id">{{ employees[id].fioShort }}</router-link></v-list-item-content>
				</v-list-item>
			</v-list>
		</v-col>
		<v-col cols="9">
			<EmpStoreForm ref="editorForm" :entry="current" />
		</v-col>
	</v-row>
	<v-snackbar
		v-model="snackbarOn"
		:timeout="snackbar.timeout"
	>
		{{ snackbar.text }}
		<template v-slot:action="{ attrs }">
			<v-btn
				color="red"
				text
				v-bind="attrs"
				@click="snackbarOn = false"
			>
				Закрыть
			</v-btn>
		</template>
	</v-snackbar>
</v-container>
</template>

<script src="./EmpStore.vue.js"></script>
