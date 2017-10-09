/// <reference path="./main.ts" />

import Main = require("./main");
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");

var getData = (context) => {
    return {
        load: function (widgetSettings : any) {
            console.log("Load function called");
            console.log(widgetSettings);

            console.log("Setting Widget Title to " + widgetSettings.name);
            var $title = $('h2.title');
            $title.text(widgetSettings.name);

            var main : Main = new Main();
            main.getVelocityData();

            return WidgetHelpers.WidgetStatusHelper.Success();
            // main.getVelocityData();
        },
        reload: function (widgetSettings) {
            console.log("Reload function called");
            console.log(widgetSettings);

            console.log("Setting Widget Title to " + widgetSettings.name);
            var $title = $('h2.title');
            $title.text(widgetSettings.name);

            var main : Main = new Main();
            main.getVelocityData();

            return WidgetHelpers.WidgetStatusHelper.Success();
            // main.getVelocityData();
        }
    } 
}

let extensionContext = VSS.getExtensionContext();
// this format is needed for VSTS and VS2017
VSS.register(`${extensionContext.publisherId}.${extensionContext.extensionId}.VelocityControlChart`, getData);
// this format is needed for VS2015
VSS.register("VelocityControlChart", getData);