
function DelegatorViewModel() {
	var self = this;

	self.years = ko.observableArray();
	self.months = ko.observableArray();
	self.weeks = ko.observableArray();
	self.days = ko.observableArray();
	self.timepoints = ko.observableArray();
	self.currentTask = ko.observable(undefined);
	self.selectedYear = ko.observable();
	self.selectedMonth = ko.observable();
	self.selectedDay = ko.observable();
	self.selectedWeek = ko.observable();
	self.filteredTasks = ko.observableArray();		
	self.currentTaskBackup = undefined;
	self.filteredTasks = ko.observableArray();
	self.currentTasks = ko.observableArray();
	self.settings = getSettings();	
	self.projects =  ko.observableArray();		
	self.years(getYears());

	self.selectMonthFilter = function (item) {

		if (self.selectedDay() != undefined)
			self.selectedDay().selected(false);

		if (self.selectedMonth() != undefined)
			self.selectedMonth().selected(false);

		if (self.selectedWeek() != undefined)
			self.selectedWeek().selected(false);

		item.selected(true);
		self.selectedMonth(item);

		self.weeks(getWeeks(item));
		makeDroppable();
		self.setFilterTasksDate(item.parent().id, item.id);
		makeDraggable();
	};

	self.selectWeekFilter = function (item) {

		if (self.selectedDay() != undefined)
			self.selectedDay().selected(false);

		if (self.selectedWeek() != undefined)
			self.selectedWeek().selected(false);

		item.selected(true);
		self.selectedWeek(item);

		makeDroppable();

		var year = 0;

		if (item.parent().filtertype == "month") {
			year = item.parent().parent().id;
		} else if (item.parent().filtertype == "year") {
			year = item.parent().id;
		}

		self.setFilterTasksDate(year, undefined, item.id);
		makeDraggable();
	};

	self.saveCurrentTask = function () {

		var item = self.currentTask();

		if (item.new()) {
			item.new(false);
			self.currentTasks.push(item);
			self.filteredTasks.push(item);
			makeDraggable();
		}

		self.currentTask(undefined);
		makeDraggable();
	};

	self.cancelCurrentTask = function () {

		var backup = ko.utils.parseJson(self.currentTaskBackup);
		var task = self.currentTask();
		var newTask = ko.mapping.fromJS(backup);

		self.filteredTasks.replace(task, newTask);
		self.currentTasks.replace(task, newTask);
		self.currentTaskBackup = undefined;

		self.currentTask(undefined);
		makeDraggable();
	};

	self.sortTasks = function () {};

	self.editTask = function (item) {

		self.currentTaskBackup = ko.toJSON(item);
		self.currentTask(item);
	};

	self.removeTask = function (item) {
		//todo fixme should use real filter instead.
		self.filteredTasks.remove(item);
		self.currentTasks.remove(item);
	};

	self.showStatistics = function () {};

	self.cancelSettings = function () {
		//revert settings like revert task
		self.settings.showSettings(false);
	};

	self.saveSettings = function () {
		self.settings.showSettings(false);
		saveSettings(self.settings);
		resizeFilters();
	};

	self.showSettings = function () {
		self.settings.showSettings(true);
	};

	self.getFilterDateCount = function (filter) {

		if (filter.filtertype == "year") {
			var num = self.getFilterTasksYear(filter.id);
			return num.length;
		} else if (filter.filtertype == "month") {
			var num = self.getFilterTasksMonth(filter.parent().id, filter.id);
			return num.length;
		} else if (filter.filtertype == "week") {
			//todo fixme insane numbers
			var num = self.getFilterTasksWeek(666, filter.id);
			return num.length;
		}
		return 0;
	};

	self.getFilterTasksMonth = function (year, month) {
		year = parseInt(year);
		month = parseInt(month);

		var data = [];

		for (var i = 0; i < self.currentTasks().length; i++) {
			var item = self.currentTasks()[i];

			if (item.date().getFullYear() == year && item.date().getMonth() == month)
				data.push(item);

		}
		return data;
	};

	self.getFilterTasksWeek = function (year, week) {
		year = parseInt(year);
		week = parseInt(week);

		var data = [];

		for (var i = 0; i < self.currentTasks().length; i++) {
			var item = self.currentTasks()[i];
			var itemweek = getWeekFromDate(item.date());
			if (
				/* TODO FIXME item.date().getFullYear()==year &&*/
				week == itemweek)
				data.push(item);

		}
		return data;
	};

	self.getFilterTasksYear = function (year) {
		year = parseInt(year);
		var data = [];

		for (var i = 0; i < self.currentTasks().length; i++) {
			var item = self.currentTasks()[i];

			if (item.date().getFullYear() == year)
				data.push(item);

		}
		return data;
	};

	self.setFilterTasksDate = function (year, month, week, day, time) {
		self.filteredTasks([]);
		var date = [];

		if (year != undefined && month == undefined && week == undefined) {
			var data = self.getFilterTasksYear(year);
		} else if (year != undefined && month != undefined && week == undefined && day == undefined) {
			var data = self.getFilterTasksMonth(year, month);
		} else if (year != undefined && month == undefined && week != undefined && day == undefined) {
			var data = self.getFilterTasksWeek(year, week);
		}
		self.filteredTasks(data);
	};

	self.selectYearFilter = function (item) {

		if (self.selectedDay() != undefined)
			self.selectedDay().selected(false);
		if (self.selectedWeek() != undefined)
			self.selectedWeek().selected(false);

		if (self.selectedYear() != undefined)
			self.selectedYear().selected(false);

		item.selected(true);
		self.selectedYear(item);

		self.months(getMonths(item));
		self.weeks(getWeeks(item));
		makeDroppable();
		self.setFilterTasksDate(item.id);
		makeDraggable();
	};

	self.selectDayFilter = function (item) {
		if (self.selectedDay() != undefined)
			self.selectedDay().selected(false);

		item.selected(true);
		self.selectedDay(item);
	};

	self.addTask = function () {
		var filter = 0;
		if (self.selectedWeek() != undefined) {
			filter = self.selectedWeek().id;
		}

		var item = new DelegatorTaskModel("Untitled", false, true);
		self.currentTask(item);
	};
};
