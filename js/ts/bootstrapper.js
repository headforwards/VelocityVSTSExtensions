define(["require", "exports", "./main", "TFS/Dashboards/WidgetHelpers"], function (require, exports, Main, WidgetHelpers) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getData = function (context) {
        return {
            load: function (widgetSettings) {
                console.log("Load function called");
                console.log(widgetSettings);
                console.log("Setting Widget Title to " + widgetSettings.name);
                var $title = $('h2.title');
                $title.text(widgetSettings.name);
                var main = new Main();
                main.getVelocityData();
                return WidgetHelpers.WidgetStatusHelper.Success();
            },
            reload: function (widgetSettings) {
                console.log("Reload function called");
                console.log(widgetSettings);
                console.log("Setting Widget Title to " + widgetSettings.name);
                var $title = $('h2.title');
                $title.text(widgetSettings.name);
                var main = new Main();
                main.getVelocityData();
                return WidgetHelpers.WidgetStatusHelper.Success();
            }
        };
    };
    var extensionContext = VSS.getExtensionContext();
    VSS.register(extensionContext.publisherId + "." + extensionContext.extensionId + ".VelocityControlChart", getData);
    VSS.register("VelocityControlChart", getData);
});
//# sourceMappingURL=bootstrapper.js.map