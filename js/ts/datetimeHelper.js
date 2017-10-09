define(["require", "exports"], function (require, exports) {
    "use strict";
    var DateTimeHelper = (function () {
        function DateTimeHelper() {
        }
        DateTimeHelper.getNextWeekDay = function (date) {
            console.log("'getNextWeekDay': Processing date: ");
            console.log(date);
            console.log("getFullYear() = " + date.getFullYear());
            console.log("getMonth() = " + date.getMonth());
            console.log("getDay() = " + date.getDay());
            switch (date.getDay()) {
                case 5:
                    return new Date(date.getFullYear(), date.getMonth(), date.getDay() + 3);
                case 6:
                    return new Date(date.getFullYear(), date.getMonth(), date.getDay() + 2);
                default:
                    return new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1);
            }
        };
        DateTimeHelper.setTimePartOfDateTime = function (date, hours) {
            if ((hours < 0) || (hours > 23)) {
                throw new Error("the hours parameter must be between 0 and 23.");
            }
            else {
                return new Date(date.getFullYear(), date.getMonth(), date.getDay(), (hours - date.getHours()), date.getMinutes(), date.getSeconds());
            }
        };
        DateTimeHelper.endOfDay = function (date) {
            return this.setTimePartOfDateTime(date, 23);
        };
        DateTimeHelper.getNextWeekDayAtMidday = function (date) {
            return this.setTimePartOfDateTime(this.getNextWeekDay(date), 12);
        };
        return DateTimeHelper;
    }());
    return DateTimeHelper;
});
//# sourceMappingURL=datetimeHelper.js.map