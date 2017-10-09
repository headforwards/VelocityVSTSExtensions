/// <reference path="../date.ts" />

import "mocha";
import { expect } from "chai";
import "../date";

describe("Date Extension methods ", () => {

    describe("endOfDay extension method ", () => {

        it("should return 23:59:59 given lunchtime", () => {
            var dt = new Date(Date.UTC(2017, 2, 4, 1, 3, 0)); // months are zero based - March 4th 2017 01:03:00
            expect(dt.endOfDay().toISOString()).to.equal("2017-03-04T23:59:59.000Z");
        });


    });

    describe("getNextWeekDay extension method ", () => {

        it("should return Tuesday if given Monday", () => {
            var dt = new Date(Date.UTC(2017, 9, 9, 0, 0, 0)); // zero based months - October 9th 2017 00:00:00
            expect(dt.getNextWeekDay().getDay()).to.equal(2);
        });

        it("should return Wednesday if given Tuesday", () => {
            var dt = new Date(Date.UTC(2017, 9, 10, 0, 0, 0)); // zero based months - October 10th 2017 00:00:00
            expect(dt.getNextWeekDay().getDay()).to.equal(3);
        });

        it("should return Thursday if given Wednesday", () => {
            var dt = new Date(Date.UTC(2017, 9, 11, 0, 0, 0)); // zero based months - October 11th 2017 00:00:00
            expect(dt.getNextWeekDay().getDay()).to.equal(4);
        });

        it("should return Friday if given Thursday", () => {
            var dt = new Date(Date.UTC(2017, 9, 12, 0, 0, 0)); // zero based months - October 12th 2017 00:00:00
            expect(dt.getNextWeekDay().getDay()).to.equal(5);
        });

        it("should return Monday if given Friday", () => {
            var dt = new Date(Date.UTC(2017, 9, 13, 0, 0, 0)); // zero based months - October 13th 2017 00:00:00
            expect(dt.getNextWeekDay().getDay()).to.equal(1);
        });

        it("should return Monday if given Saturday", () => {
            var dt = new Date(Date.UTC(2017, 9, 14, 0, 0, 0)); // zero based months - October 14th 2017 00:00:00
            expect(dt.getNextWeekDay().getDay()).to.equal(1);
        });

        it("should return Monday if given Sunday", () => {
            var dt = new Date(Date.UTC(2017, 9, 15, 0, 0, 0)); // zero based months - October 15th 2017 00:00:00
            expect(dt.getNextWeekDay().getDay()).to.equal(1);
        });

    });

    describe("getNextWeekDayAtMidday extension method ", () => {

        it("should return Tuesday 12:00:00 if given Monday 00:00:00", () => {
            var dt = new Date(Date.UTC(2017, 9, 9, 0, 0, 0)); // zero based months - October 9th 2017 00:00:00
            expect(dt.getNextWeekDayAtMidday().toISOString()).to.equal("2017-10-10T12:00:00.000Z");
        });

        it("should return Tuesday 12:00:00 if given Monday 01:00:00", () => {
            var dt = new Date(Date.UTC(2017, 9, 9, 1, 0, 0)); // zero based months - October 9th 2017 01:00:00
            expect(dt.getNextWeekDayAtMidday().toISOString()).to.equal("2017-10-10T12:00:00.000Z");
        });

        it("should return Tuesday 12:00:00 if given Monday 12:00:00", () => {
            var dt = new Date(Date.UTC(2017, 9, 9, 12, 0, 0)); // zero based months - October 9th 2017 12:00:00
            expect(dt.getNextWeekDayAtMidday().toISOString()).to.equal("2017-10-10T12:00:00.000Z");
        });
    });

});


