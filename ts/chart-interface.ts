/// <reference path="../node_modules/@types/google.visualization/index.d.ts" />

import Velocity = require("./velocity");

interface IVelocityChart {
    data: google.visualization.DataTable;
    outputLocation: Element;
    title: string;
    draw();
    //constructor(velocity: Velocity, divId: string, chartTitle: string): IVelocityChart;
}
export = IVelocityChart;