define(["require", "exports", "./main", "TFS/Dashboards/WidgetHelpers"], function (require, exports, Main, WidgetHelpers) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getData = function (context) {
        return {
            load: function (widgetSettings) {
                Main.getTfsData(widgetSettings).then(function () {
                    console.log("Data retrieved");
                });
                return WidgetHelpers.WidgetStatusHelper.Success();
            },
            reload: function (widgetSettings) {
                Main.getTfsData(widgetSettings).then(function () {
                    console.log("Data retrieved");
                });
                return WidgetHelpers.WidgetStatusHelper.Success();
            }
        };
    };
    var extensionContext = VSS.getExtensionContext();
    VSS.register(extensionContext.publisherId + "." + extensionContext.extensionId + ".VelocityControlChart", getData);
    VSS.register("VelocityControlChart", getData);
});
//# sourceMappingURL=bootstrapper.js.map