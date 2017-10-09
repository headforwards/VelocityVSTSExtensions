class DateTimeHelper {

    /**
     * Returns the next weekday from the given date
     * @param date the date to process
     */
    private static getNextWeekDay(date: Date) : Date {
        
        console.log("'getNextWeekDay': Processing date: ");
        console.log(date);
        
        console.log("getFullYear() = " + date.getFullYear());
        console.log("getMonth() = " + date.getMonth());
        console.log("getDay() = " + date.getDay());

        switch (date.getDay()) {
            case 5:
                return new Date(date.getFullYear(), date.getMonth(), date.getDay()+3)
            case 6:
                return new Date(date.getFullYear(), date.getMonth(), date.getDay()+2)
            default:
                return new Date(date.getFullYear(), date.getMonth(), date.getDay()+1)
        }
    }
    
    /**
     * Returns a new Date object with the hours set to the specified value
     * @param date The date to process
     * @param hours The value to set the hours to
     */
    private static setTimePartOfDateTime(date : Date,  hours : number) : Date
    {
        if ((hours < 0) || (hours > 23))
        {
            throw new Error("the hours parameter must be between 0 and 23.");
        }
        else
        {
            return new Date(date.getFullYear(), 
                date.getMonth(), 
                date.getDay(), 
                (hours - date.getHours()), 
                date.getMinutes(), 
                date.getSeconds() );
        }
    }

    /**
     * Returns a new Date object with the time set to midnight
     * @param date The date to process
     */
    public static endOfDay(date: Date) : Date {
        return this.setTimePartOfDateTime(date, 23);
    }

    /**
     * Returns a new Date object with the time set to midday on the next weekday after the parameter
     * @param date The date to process
     */
    public static getNextWeekDayAtMidday(date : Date) : Date {
        return this.setTimePartOfDateTime(this.getNextWeekDay(date), 12);
    }
}
export = DateTimeHelper;