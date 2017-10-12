/// <reference path="./main.ts" />

import Main = require("./main");
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import Q = require("Q");
import Velocity = require("./velocity");
import VelocityChart = require("./velocity-chart");
import VelocityControlChart = require("./velocity-control-chart");

var velocityChart: VelocityChart;
var controlChart: VelocityControlChart;
var projectVelocity: Velocity;

function drawCharts() {
    if (velocityChart != undefined) {
        velocityChart.draw();
    }

    if (controlChart != undefined) {
        controlChart.draw();
    }
}

var getData = (context) => {
    return {
        load: function (widgetSettings: any) {
            Main.getTfsData(widgetSettings).then((velocity: Velocity) => {

                this.projectVelocity = velocity;

                var settings = JSON.parse(widgetSettings.customSettings.data);

                if (settings && settings.chartType == "control-chart") {
                    controlChart = new VelocityControlChart(this.projectVelocity, "plot-chart", widgetSettings.name)
                } else {
                    velocityChart = new VelocityChart(this.projectVelocity, "plot-chart", widgetSettings.name);
                }

                drawCharts();
                Main.clearProgressMessage();
            });
            return WidgetHelpers.WidgetStatusHelper.Success();
        },
        reload: function (widgetSettings) {

            Main.getTfsData(widgetSettings).then((velocity: Velocity) => {

                this.projectVelocity = velocity;

                var settings = JSON.parse(widgetSettings.customSettings.data);

                if (settings && settings.chartType == "control-chart") {
                    controlChart = new VelocityControlChart(this.projectVelocity, "plot-chart", widgetSettings.name)
                } else {
                    velocityChart = new VelocityChart(this.projectVelocity, "plot-chart", widgetSettings.name);
                }

                drawCharts();
                Main.clearProgressMessage();
            });
            return WidgetHelpers.WidgetStatusHelper.Success();
        }
    }
}

// register the google chart libraries
// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart', 'bar', 'line'] });
// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawCharts);

let extensionContext = VSS.getExtensionContext();
// this format is needed for VSTS and VS2017
VSS.register(`${extensionContext.publisherId}.${extensionContext.extensionId}.VelocityControlChart`, getData);
// this format is needed for VS2015
VSS.register("VelocityControlChart", getData);