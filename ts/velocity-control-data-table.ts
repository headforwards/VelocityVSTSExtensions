/// <reference path="./velocity-control-chart.ts" />
/// <reference path="../node_modules/@types/google.visualization/index.d.ts" />

import Velocity = require("./velocity");
import VelocityControlChart = require("./velocity-control-chart");

class VelocityControlChartDataTable extends VelocityControlChart {

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
export = VelocityControlChartDataTable;