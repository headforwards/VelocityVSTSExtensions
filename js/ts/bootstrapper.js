define(["require", "exports", "./main", "TFS/Dashboards/WidgetHelpers", "./velocity-chart", "./velocity-control-chart"], function (require, exports, Main, WidgetHelpers, VelocityChart, VelocityControlChart) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var velocityChart;
    var controlChart;
    var projectVelocity;
    function drawCharts() {
        if (velocityChart != undefined) {
            velocityChart.draw();
        }
        if (controlChart != undefined) {
            controlChart.draw();
        }
    }
    var getData = function (context) {
        return {
            load: function (widgetSettings) {
                var _this = this;
                Main.getTfsData(widgetSettings).then(function (velocity) {
                    _this.projectVelocity = velocity;
                    var settings = JSON.parse(widgetSettings.customSettings.data);
                    if (settings && settings.chartType == "control-chart") {
                        controlChart = new VelocityControlChart(_this.projectVelocity, "plot-chart", widgetSettings.name);
                    }
                    else {
                        velocityChart = new VelocityChart(_this.projectVelocity, "plot-chart", widgetSettings.name);
                    }
                    drawCharts();
                    Main.clearProgressMessage();
                });
                return WidgetHelpers.WidgetStatusHelper.Success();
            },
            reload: function (widgetSettings) {
                var _this = this;
                Main.getTfsData(widgetSettings).then(function (velocity) {
                    _this.projectVelocity = velocity;
                    var settings = JSON.parse(widgetSettings.customSettings.data);
                    if (settings && settings.chartType == "control-chart") {
                        controlChart = new VelocityControlChart(_this.projectVelocity, "plot-chart", widgetSettings.name);
                    }
                    else {
                        velocityChart = new VelocityChart(_this.projectVelocity, "plot-chart", widgetSettings.name);
                    }
                    drawCharts();
                    Main.clearProgressMessage();
                });
                return WidgetHelpers.WidgetStatusHelper.Success();
            }
        };
    };
    google.charts.load('current', { 'packages': ['corechart', 'bar', 'line'] });
    google.charts.setOnLoadCallback(drawCharts);
    var extensionContext = VSS.getExtensionContext();
    VSS.register(extensionContext.publisherId + "." + extensionContext.extensionId + ".VelocityControlChart", getData);
    VSS.register("VelocityControlChart", getData);
});
//# sourceMappingURL=bootstrapper.js.map