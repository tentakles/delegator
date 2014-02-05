function getISOWeeks(y) {
	var d,
	isLeap;

	d = new Date(y, 0, 1);
	isLeap = new Date(y, 1, 29).getMonth() === 1;

	//check for a Jan 1 that's a Thursday or a leap year that has a
	//Wednesday jan 1. Otherwise it's 52
	return d.getDay() === 4 || isLeap && d.getDay() === 3 ? 53 : 52;
}

function getDateOfISOWeek(w, y) {
	var simple = new Date(y, 0, 1 + (w - 1) * 7);
	var dow = simple.getDay();
	var ISOweekStart = simple;
	if (dow <= 4)
		ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
	else
		ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
	return ISOweekStart;
}

function getWeekFromDate(date) {
	var onejan = new Date(date.getFullYear(), 0, 1);
	return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

Date.prototype.getMonthWeek = function () {
	var firstDay = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
	return Math.ceil((this.getDate() + firstDay) / 7);
};



Date.prototype.getWeek = function(){
	var onejan = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

function weekCount(year, month_number) {
	var firstOfMonth = new Date(year, month_number - 1, 1);
	var lastOfMonth = new Date(year, month_number, 0);

	var used = firstOfMonth.getDay() + lastOfMonth.getDate();

	return Math.ceil(used / 7);
}

function getYears() {
	var result = [];

	var currentYear = new Date(Date.now()).getFullYear();

	for (var i = currentYear - 2; i < currentYear + 3; i++) {
		result.push(new filterModel(i, i, undefined, "year"));
	}

	return result;
}

function getMonths(parent) {
	var result = [];
	//(val,id,parent,filtertype)
	var filtertype = "month";
	result.push(new filterModel("Januari", 0, parent, filtertype));
	result.push(new filterModel("Februari", 1, parent, filtertype));
	result.push(new filterModel("Mars", 2, parent, filtertype));
	result.push(new filterModel("April", 3, parent, filtertype));
	result.push(new filterModel("Maj", 4, parent, filtertype));
	result.push(new filterModel("Juni", 5, parent, filtertype));
	result.push(new filterModel("Juli", 6, parent, filtertype));
	result.push(new filterModel("Augusti", 7, parent, filtertype));
	result.push(new filterModel("September", 8, parent, filtertype));
	result.push(new filterModel("Oktober", 9, parent, filtertype));
	result.push(new filterModel("November", 10, parent, filtertype));
	result.push(new filterModel("December", 11, parent, filtertype));
	return result;
}

function getWeeks(parent) {
	var result = [];
	var filtertype = "week";

	var num = 0;
	var start = 1;
	if (parent.filtertype == "year")
		num = getISOWeeks(parent.id);
	if (parent.filtertype == "month") {
		var month = parent.id;
		start = ((month) * 4) + 1;
		num = start + 3;

	}

	for (var i = start; i <= num; i++) {
		result.push(new filterModel(i, i, parent, filtertype));
	}
	return result;
}

function getDays() {
	var result = [];
	var filtertype = "day";
	for (var i = 1; i < 30; i++) {
		result.push(new filterModel(i));
	}
	return result;
}

function getTimepoints() {
	var result = [];
	var filtertype = "time";
	for (var i = 0; i < 24; i++) {
		result.push(new filterModel(i));
	}
	return result;
}

function resizeFilters() {
	var upperLists = $(".upperListContainer:visible");
	var perc = parseInt(100 / upperLists.length) - (6 / upperLists.length);
	upperLists.css("width", perc + "%");
}

function makeDroppable() {
	$(".listFilter").droppable({
		hoverClass : "filterHover",
		drop : function (event, ui) {
			//  $(this).css("background-color", "lightgreen")
		},
		out : function (event, ui) {
			//    $(this).css("background-color", "")
		}
	});
}

function makeDraggable() {

	$(".taskItem").draggable({

		revert : function (dropped) {

			// if(!dropped) alert("I'm reverting!");

			var target = $(dropped[0]);
			var item = $(this.context);
			var pc = $(dropped[0]).parent().parent();

			var vpH = pc.height(); // Viewport Height
			var st = pc.scrollTop(); // Scroll Top
			var offset = $(dropped[0]).offset();
			offset = offset ? offset.top : 0;

			var tempoffset = $(dropped[0]).parent().offset();
			offset -= tempoffset ? tempoffset.top : 0;

			var inView = offset < vpH;

			dropped = dropped && inView;
			if (dropped) {
				var myitem = ko.dataFor(item.context);
				var myfilter = ko.dataFor(target.context);

				$(item.context).fadeTo(500, 0, function () {
					$(item.context).slideUp(500);
				});

				if (myfilter.filtertype == "year") {
					var year = parseInt(myfilter.id);
					var newdate = new Date(year, 0);
					myitem.date(newdate);
				} else if (myfilter.filtertype == "month") {
					var year = parseInt(myfilter.parent().id);
					var newdate = new Date(year, myfilter.id);
					myitem.date(newdate);
				} else if (myfilter.filtertype == "week") {
					var year = 0;

					if (myfilter.parent().filtertype == "month") {
						year = parseInt(myfilter.parent().parent().id);
					} else if (myfilter.parent().filtertype == "year") {
						year = parseInt(myfilter.parent().id);
					}

					var newdate = new Date(getDateOfISOWeek(myfilter.id, year));

					myitem.date(newdate);
				}

				target.effect("highlight", {
					color : "#ff00ff"
				}, 1500);

			}
			return !dropped;
		}
		//helper: 'clone',
	});
}

$(function () {
	$("button").button();
	var delegatorViewModel = new DelegatorViewModel();
	ko.applyBindings(delegatorViewModel);
		
	//todo fixme: dummy data
	delegatorViewModel.currentTasks.push(new DelegatorTaskModel("Ernie", true, false));
	delegatorViewModel.currentTasks.push(new DelegatorTaskModel("Bert", true, false));
	delegatorViewModel.currentTasks.push(new DelegatorTaskModel("Ernie 2", true, false));

	resizeFilters();
	makeDraggable();
	makeDroppable();
});


