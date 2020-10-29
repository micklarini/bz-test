<template>
	<v-form ref="employeeForm" v-model="valid" lazy-validation>
		<p class="mb-0">Сотрудник</p>
		<v-text-field
			v-model="entry.fio"
			:rules="rulesFullName"
			@focus="saveDisabled=false"
			label="Фамилия Имя Отчество"
			required
			ref="employeeName"
			class="mb-3"
		></v-text-field>
		<p class="mb-0">Паспорт</p>
		<div class="flex-row mb-3">
			<v-text-field
				class="d-inline-flex mr-2"
				type="number"
				maxlength="4"
				:counter="4"
				v-model="entry.pass_ser"
				:rules= "rulesPSeries"
				@focus="saveDisabled=false"
				label="серия"
				required
			></v-text-field>
			<v-text-field
				class="d-inline-flex mr-2"
				type="number"
				maxlength="6"
				:counter="6"
				v-model="entry.pass_no"
				:rules="rulesPNumber"
				@focus="saveDisabled=false"
				label="номер"
				required
			></v-text-field>
			<v-menu
				ref="dtMenu"
				v-model="dtMenu"
				:close-on-content-click="false"
				transition="scale-transition"
				offset-y
				min-width="290px"
			>
				<template v-slot:activator="{ on, attrs }">
					<v-text-field
						class="d-inline-flex"
						v-model="displayDate"
						:rules="rulesPDate"
						label="дата выдачи"
						@focus="saveDisabled=false"
						required
						readonly
						v-bind="attrs"
						v-on="on"
					></v-text-field>
				</template>
				<v-date-picker
					ref="passportDate"
					v-model="entry.pass_dt"
					:max="new Date().toISOString().substr(0, 10)"
					min="1930-01-01"
					@input="dtMenu = false"
					locale="ru-ru"
				></v-date-picker>
			</v-menu>
		</div>
		<v-btn
			elevation="2"
			:disabled="saveDisabled"
			@click="entrySave()"
			medium
			color="primary"
			class="mr-3"
		>
			<v-icon>save</v-icon>Сохранить
		</v-btn>
		<v-dialog
			v-model="dialogDelete"
			persistent
			max-width="450"
		>
			<template v-slot:activator="{ on, attrs }">
				<v-btn elevation="2"
					:disabled="!entry.id"
					medium
					color="secondary"
					v-bind="attrs"
					v-on="on"
				>
					<v-icon>delete</v-icon>Удалить
				</v-btn>
			</template>
			<v-card>
					<v-card-title class="headline">
						Удалить {{ entry.fioShort }}?
					</v-card-title>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="green"
							@click="entryDelete()"
						>
						Да
						</v-btn>
						<v-btn
							color="secondary"
							@click="dialogDelete = false"
						>
						Нет
						</v-btn>
					</v-card-actions>
			</v-card>
		</v-dialog>
	</v-form>
</template>

<script src="./EmpStoreForm.vue.js"></script>
