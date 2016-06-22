eventControllers.directive('calendar', function () {
  return {
    restrict: 'E',
    templateUrl: 'pages/calendar.html',
    scope: {
      selected: '=',
      details: '=',
    },
    link: function (scope) {
      var start = scope.selected.clone();
      start.date(1);
      _removeTime(start.day(0));

      //watch scope.details to retrieve information from the server
      scope.$watch('details', function(newVal) {
        if(newVal) {
          //if date is only on one day
          if (newVal.hasOwnProperty("start") && newVal.hasOwnProperty("end")) {
            if (newVal.start === newVal.end) {
              _select(moment(newVal.start));
              _select(_removeTimes(scope.selected));
              scope.month = scope.selected.clone();
              var day = {name: scope.selected.format("dd").substring(0, 2)};
              scope.showTimes(day);
            };
          }
          //build the month
          scope.month = scope.selected.clone();
          var start = scope.selected.clone();
          start.date(1);
          _removeTime(start.day(0));
          _buildMonth(scope, start, scope.month);

        }
    }, true);

      //select a day
      scope.select = function(day) {
        scope.showConfirmationScreen = false;
        scope.showTimeScreen = false;
        scope.selected = day.date;
      };

      //select a time
      scope.selectTimes = function(time) {
        scope.selectedTime = time;
        scope.showConfirmationScreen = true;
      };

      //return if the time is selectedTime
      scope.timeIsSelected = function(time) {
        return scope.selectedTime == time
      };

      //internal function for selecting a day
      function _select(day) {
        scope.selected = day
        scope.selectedFormatted = day.format("dddd, MMMM Do YYYY");
      }

      //build times available for the selected day
      scope.showTimes = function(day) {
        scope.showTimeScreen = true;
        scope.showConfirmationScreen = false;
        scope.times = [];
        _select(day.date);
        scope.selectedTime = '';
        //check name of day and set the times available for that day
        //times are build off of start, end, and Availability
        //TODO: there must be a better way to do this
        if (day.name == 'Mo') {
          console.log(scope.details);
          for (let timeValue = moment(scope.details.MondayStart); timeValue.isBefore(scope.details.MondayEnd); timeValue.add(scope.details.mondayDuration, 'm')) {
            scope.times.push(timeValue.format('h:mm A'));
          }
          if (scope.times<1) {
            scope.times.push('No Availability');
          }
          scope.length = scope.details.mondayDuration/60;
        } else if (day.name == 'Tu') {
          for (let timeValue = moment(scope.details.tuesdayStart); timeValue.isBefore(scope.details.tuesdayEnd); timeValue.add(scope.details.tuesdayDuration, 'm')) {
            scope.times.push(timeValue.format('h:mm A'));
          }
          if (scope.times<1) {
            scope.times.push('No Availability');
          }
          scope.length = scope.details.tuesdayDuration/60;
        } else if (day.name == 'We') {
          for (let timeValue = moment(scope.details.wednesdayStart); timeValue.isBefore(scope.details.wednesdayEnd); timeValue.add(scope.details.wednesdayDuration, 'm')) {
            scope.times.push(timeValue.format('h:mm A'));
          }
          if (scope.times<1) {
            scope.times.push('No Availability');
          }
          scope.length = scope.details.wednesdayDuration/60;
        } else if (day.name == 'Th') {
          for (let timeValue = moment(scope.details.thursdayStart); timeValue.isBefore(scope.details.thursdayEnd); timeValue.add(scope.details.thursdayDuration, 'm')) {
            scope.times.push(timeValue.format('h:mm A'));
          }
          if (scope.times<1) {
            scope.times.push('No Availability');
          }
          scope.length = scope.details.thursdayDuration/60;
        } else if (day.name == 'Fr') {
          for (let timeValue = moment(scope.details.fridayStart); timeValue.isBefore(scope.details.fridayEnd); timeValue.add(scope.details.fridayDuration, 'm')) {
            scope.times.push(timeValue.format('h:mm A'));
          }
          if (scope.times<1) {
            scope.times.push('No Availability');
          }
          scope.length = scope.details.fridayDuration/60;
        } else if (day.name == 'Sa') {
          for (let timeValue = moment(scope.details.saturdayStart); timeValue.isBefore(scope.details.saturdayEnd); timeValue.add(scope.details.saturdayDuration, 'm')) {
            scope.times.push(timeValue.format('h:mm A'));
          }
          if (scope.times<1) {
            scope.times.push('No Availability');
          }
          scope.length = scope.details.saturdayDuration/60;
        } else if (day.name == 'Su') {
          for (let timeValue = moment(scope.details.sundayStart); timeValue.isBefore(scope.details.sundayEnd); timeValue.add(scope.details.sundayDuration, 'm')) {
            scope.times.push(timeValue.format('h:mm A'));
          }
          if (scope.times<1) {
            scope.times.push('No Availability');
          }
          scope.length = scope.details.sundayDuration/60;
        } else{
          console.log('unknown day');
          scope.times = ['error', 'unknown day', 'unknown times'];
        }
      };


      //build and load next month
      scope.next = function() {
        var next = scope.month.clone();
        _removeTime(next.month(next.month()+1).date(1));
        scope.month.month(scope.month.month()+1);
        _buildMonth(scope, next, scope.month);
      };

      //build and load previous month
      scope.previous = function() {
        var previous = scope.month.clone();
        _removeTime(previous.month(previous.month()-1).date(1));
        scope.month.month(scope.month.month()-1);
        _buildMonth(scope, previous, scope.month);
      };
    }
  };

  //set start to beginning of week
  function _removeTime(date) {
    return date.startOf('week');
  }

  //set start to beginning of day
  function _removeTimes(date) {
    return date.startOf('day');
  }

  //build the month including getting properties ready for building weeks
  function _buildMonth(scope, start, month) {
    scope.weeks = [];
    var daysAvailable = [];
    var dayRange = {};
    if (scope.details.hasOwnProperty("start")) {
      dayRange['start'] = scope.details.start;
    }
    if (scope.details.hasOwnProperty("end")) {
      dayRange['end'] = scope.details.end;
    }
    //go through the details and set each day that there is an event
    //TODO: there must be a better way of doing this
    if (scope.details.hasOwnProperty("MondayStart")) {
      daysAvailable.push('Mo');
    }
    if (scope.details.hasOwnProperty("tuesdayStart")) {
      daysAvailable.push('Tu');
    }
    if (scope.details.hasOwnProperty("wednesdayStart")) {
      daysAvailable.push('We');
    }
    if (scope.details.hasOwnProperty("thursdayStart")) {
      daysAvailable.push('Th');
    }
    if (scope.details.hasOwnProperty("fridayStart")) {
      daysAvailable.push('Fr');
    }
    if (scope.details.hasOwnProperty("saturdayStart")) {
      daysAvailable.push('Sa');
    }
    if (scope.details.hasOwnProperty("sundayStart")) {
      daysAvailable.push('Su');
    }

    var done = false;
    var date = start.clone();
    var monthIndex = date.month();
    var count = 0;
    while (!done) {
      scope.weeks.push({ days: _buildWeek(date.clone(), month, daysAvailable, dayRange) });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  //build the weeks
  function _buildWeek(date, month, daysAvailable, dayRange) {
    // console.log(daysAvailable);
    var days = [];
    for (var i = 0; i < 7; i++) {
      //check if that day is available var a = true if available, false if not
      var a = daysAvailable.indexOf(date.format("dd").substring(0, 2)) > -1;
      var today = moment();
      if (moment(date).isBefore(today, 'day')){
        a = false;
      } else if (moment(date).isBefore(dayRange.start, 'day')) {
        a = false;
      } else if (moment(date).isAfter(dayRange.end, 'day')) {
        a = false
      }
      //push a day onto the array with its associated properties
      days.push({
        name: date.format("dd").substring(0, 2),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        isAvailable: a,//date.isBefore('2016 6 13', 'day') && date.isAfter('2016 5 13', 'day'),
        date: date
      });
      date = date.clone();
      date.add(1, "d");
    }
    return days;
  }
});
