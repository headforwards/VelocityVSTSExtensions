/// <reference path="./velocity-chart.ts" />
/// <reference path="../node_modules/@types/google.visualization/index.d.ts" />

import Velocity = require("./velocity");
import VelocityChart = require("./velocity-chart");

class VelocityChartDataTable extends VelocityChart {

    constructor(velocity: Velocity, divId: string, chartTitle: string) {
        super(velocity, divId, chartTitle);
    }

    public draw() {

        // configure the chart options we need
        let options: google.visualization.TableOptions = {
            width: '90%',
            height: '90%'
        };

        // draw the chart
        var dataTable = new google.visualization.Table(this.outputLocation);
        dataTable.draw(this.data, options);
    }
}
export = VelocityChartDataTable;