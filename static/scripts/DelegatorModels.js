function DelegatorTaskModel(name, done, isnew) {
	var self = this;
	self.name = ko.observable(name);
	self.done = ko.observable(done);
	self.priority = ko.observable(1);
	self.notes = ko.observable("");
	self.project = ko.observable();
	self.new = ko.observable(isnew);
	self.date = ko.observable(new Date(Date.now()));
}

function projectModel(color,name){
	var self=this;
	self.color=color;
	self.name=name;


}

function filterModel(val, id, parent, filtertype) {
	var self = this;
	self.name = val;
	self.filtertype = filtertype;
	self.id = id;
	self.selected = ko.observable(false);
	self.parent = ko.observable(parent);
}

function settingsModel() {
	var self = this;
	self.showProjects = ko.observable(true);
	self.showYears = ko.observable(true);
	self.showMonths = ko.observable(false);
	self.showWeeks = ko.observable(true);
	self.showDays = ko.observable(true);
	self.showTime = ko.observable(false);
	self.showSettings = ko.observable(false);
	self.moveMissed = ko.observable(true);
	self.showOnStart = ko.observable("today");
}

function getSettings() {
	if (localStorage.settings) {
		var data = ko.utils.parseJson(localStorage.settings);
		return ko.mapping.fromJS(data);

	} else {
		return new settingsModel();
	}
}

function saveSettings(settings) {
	localStorage.settings = ko.toJSON(settings);
}


