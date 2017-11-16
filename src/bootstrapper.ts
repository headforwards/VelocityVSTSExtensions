/// <reference path="./main.ts" />
/// <reference path="../typings/tsd.d.ts" />


import Main = require("./main");
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import Q = require("Q");
import Velocity = require("./velocity");
import VelocityChart = require("./velocity-chart");
import VelocityControlChart = require("./velocity-control-chart");
import VelocityChartDataTable = require("./velocity-data-table");
import VelocityControlChartDataTable = require("./velocity-control-data-table");
import IVelocityChart = require("./chart-interface");

var chart: IVelocityChart;

function drawCharts() {
    if (chart !== undefined) {
        chart.draw();
    }
}

function processTfsData(widgetSettings: any, velocity: Velocity) {

    var settings = JSON.parse(widgetSettings.customSettings.data);

    if (settings && settings.chartType === "control-chart") {
        chart = new VelocityControlChart(velocity, "plot-chart", widgetSettings.name)
    } else if (settings && settings.chartType === "control-data") {
        chart = new VelocityControlChartDataTable(velocity, "plot-chart", widgetSettings.name)
    } else if (settings && settings.chartType === "velocity-data") {
        chart = new VelocityChartDataTable(velocity, "plot-chart", widgetSettings.name)
    } else {
        chart = new VelocityChart(velocity, "plot-chart", widgetSettings.name);
    }

    drawCharts();
    Main.clearProgressMessage();
}

var getData = (context) => {
    return {
        load: function (widgetSettings: any) {
            Main.getTfsData(widgetSettings).then((velocity: Velocity) => {
                processTfsData(widgetSettings, velocity);
            });
            return WidgetHelpers.WidgetStatusHelper.Success();
        },
        reload: function (widgetSettings) {

            Main.getTfsData(widgetSettings).then((velocity: Velocity) => {
                processTfsData(widgetSettings, velocity);
            });
            return WidgetHelpers.WidgetStatusHelper.Success();
        }
    }
}

// register the google chart libraries
// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart', 'bar', 'line', 'table'] });
// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawCharts);

let extensionContext = VSS.getExtensionContext();
// this format is needed for VSTS and VS2017
VSS.register(`${extensionContext.publisherId}.${extensionContext.extensionId}.VelocityControlChart`, getData);
// this format is needed for VS2015
VSS.register("VelocityControlChart", getData);