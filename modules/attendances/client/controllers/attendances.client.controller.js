'use strict';

// Attendances controller
angular.module('attendances').controller('AttendancesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Attendances',
  function ($scope, $stateParams, $location, Authentication, Attendances) {
    $scope.authentication = Authentication;
    $scope.dateFormat='yyyy-MM-dd';
    $scope.altInputFormats = ['dd/MM/yyyy'];
    $scope.fromdate = new Date();
    $scope.todate = new Date();
    $scope.dateOptions = {
      dateDisabled: disabled,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 1, 1),
      minDate: new Date(),
      startingDay: 1
    };
    // Disable weekend selection
    function disabled(data) {
      var date = data.date,
          mode = data.mode;
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.popupFromdate={
      opened : false
    };
    $scope.popupTodate={
      opened : false
    };

    $scope.openFromdate= function(){
      $scope.popupFromdate.opened = true;
    };

    $scope.openTodate= function(){
      $scope.popupTodate.opened = true;
    };

    // Create new Attendance
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'attendanceForm');

        return false;
      }

      // Create new Attendance object
      var attendance = new Attendances({
        fromdate: this.fromdate,
        todate : this.todate,
        dest: this.dest,
        remark: this.remark
      });

      // Redirect after save
      attendance.$save(function (response) {
        $location.path('attendances/' + response._id);

        // Clear form fields
        $scope.fromdate = new Date();
        $scope.todate = new Date();
        $scope.dest = '';
        $scope.remark = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Attendance
    $scope.remove = function (attendance) {
      if (attendance) {
        attendance.$remove();

        for (var i in $scope.attendances) {
          if ($scope.attendances[i] === attendance) {
            $scope.attendances.splice(i, 1);
          }
        }
      } else {
        $scope.attendance.$remove(function () {
          $location.path('attendances');
        });
      }
    };

    // Update existing Attendance
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'attendanceForm');

        return false;
      }

      var attendance = $scope.attendance;

      attendance.$update(function () {
        $location.path('attendances/' + attendance._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Attendances
    $scope.find = function () {
      $scope.attendances = Attendances.query();
    };

    // Find existing Attendance
    $scope.findOne = function () {
      $scope.attendance = Attendances.get({
        attendanceId: $stateParams.attendanceId
      });
    };
  }
]);
