
import DateTimeHelper = require("../datetimeHelper");
import "mocha";
import {expect} from "chai";

describe("DateTimeHelper ", () => {

    describe("endOfDay static method ", () => {
        
        beforeEach(() => {
            //
        });
    
        it("should return midnight given lunchtime", () => {
            var dt = new Date(2017,3,4,1,3,0); // March 4th 2017 01:03:00
            expect(DateTimeHelper.endOfDay(dt).toISOString()).to.equal("2017-04-02T21:03:00.000Z");
        });
    
        
    });

    describe("getNextWeekDayAtMidday static method ", () => {

        it("should return Tuesday if given Monday", () => {
            var dt = new Date(2017, 10, 9);
            expect(DateTimeHelper.getNextWeekDayAtMidday(dt).toISOString()).to.equal("2017-10-10T12:00:00.000Z");
        })

    })

});


