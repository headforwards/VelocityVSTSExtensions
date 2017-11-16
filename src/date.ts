interface Date {
    getNextWeekDay(): Date;
    endOfDay(): Date;
    getNextWeekDayAtMidday(): Date;
}

/**
 * Sets the Date object to the next weekday
 */
Date.prototype.getNextWeekDay = function(): Date {
    var dt: Date = new Date(this);
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
}

/**
 * Sets the date element of the Date object to the next 
 * weekday and sets the time element to 12:00:00:000
 */
Date.prototype.getNextWeekDayAtMidday = function () : Date {
    var dt: Date = this.getNextWeekDay();
    dt.setUTCHours(12);
    dt.setUTCMinutes(0);
    dt.setUTCSeconds(0);
    dt.setUTCMilliseconds(0);
    return dt;
}

/**
* Sets the time element of the Date object to 23:59:59:000
*/
Date.prototype.endOfDay = function() : Date {
    var dt: Date = this;
    dt.setUTCHours(23);
    dt.setUTCMinutes(59);
    dt.setUTCSeconds(59);
    dt.setUTCMilliseconds(0);
    return dt;
}