Date.prototype.getNextWeekDay = function () {
    var dt = new Date(this);
    switch (this.getDay()) {
        case 5:
            dt.setUTCDate(this.getUTCDate() + 3);
            return dt;
        case 6:
            dt.setUTCDate(this.getUTCDate() + 2);
            return dt;
        default:
            dt.setUTCDate(this.getUTCDate() + 1);
            return dt;
    }
};
Date.prototype.getNextWeekDayAtMidday = function () {
    var dt = this.getNextWeekDay();
    dt.setUTCHours(12);
    dt.setUTCMinutes(0);
    dt.setUTCSeconds(0);
    dt.setUTCMilliseconds(0);
    return dt;
};
Date.prototype.endOfDay = function () {
    this.setUTCHours(23);
    this.setUTCMinutes(59);
    this.setUTCSeconds(59);
    this.setUTCMilliseconds(0);
    return this;
};
//# sourceMappingURL=date.js.map