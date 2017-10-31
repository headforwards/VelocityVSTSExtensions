define(["require", "exports", "./main", "TFS/Dashboards/WidgetHelpers", "./velocity-chart", "./velocity-control-chart", "./velocity-data-table", "./velocity-control-data-table"], function (require, exports, Main, WidgetHelpers, VelocityChart, VelocityControlChart, VelocityChartDataTable, VelocityControlChartDataTable) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var chart;
    function drawCharts() {
        if (chart != undefined) {
            chart.draw();
        }
    }
    function processTfsData(widgetSettings, velocity) {
        var settings = JSON.parse(widgetSettings.customSettings.data);
        if (settings && settings.chartType == "control-chart") {
            chart = new VelocityControlChart(velocity, "plot-chart", widgetSettings.name);
        }
        else if (settings && settings.chartType == "control-data") {
            chart = new VelocityControlChartDataTable(velocity, "plot-chart", widgetSettings.name);
        }
        else if (settings && settings.chartType == "velocity-data") {
            chart = new VelocityChartDataTable(velocity, "plot-chart", widgetSettings.name);
        }
        else {
            chart = new VelocityChart(velocity, "plot-chart", widgetSettings.name);
        }
        drawCharts();
        Main.clearProgressMessage();
    }
    var getData = function (context) {
        return {
            load: function (widgetSettings) {
                Main.getTfsData(widgetSettings).then(function (velocity) {
                    processTfsData(widgetSettings, velocity);
                });
                return WidgetHelpers.WidgetStatusHelper.Success();
            },
            reload: function (widgetSettings) {
                Main.getTfsData(widgetSettings).then(function (velocity) {
                    processTfsData(widgetSettings, velocity);
                });
                return WidgetHelpers.WidgetStatusHelper.Success();
            }
        };
    };
    google.charts.load('current', { 'packages': ['corechart', 'bar', 'line', 'table'] });
    google.charts.setOnLoadCallback(drawCharts);
    var extensionContext = VSS.getExtensionContext();
    VSS.register(extensionContext.publisherId + "." + extensionContext.extensionId + ".VelocityControlChart", getData);
    VSS.register("VelocityControlChart", getData);
});
//# sourceMappingURL=bootstrapper.js.map