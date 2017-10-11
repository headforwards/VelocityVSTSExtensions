/// <reference path="./main.ts" />

import Main = require("./main");
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import Q = require("Q");

var getData = (context) => {
    return {
        load: function (widgetSettings : any) {
            Main.getTfsData(widgetSettings).then( () => {
                console.log("Data retrieved");
            });
            return WidgetHelpers.WidgetStatusHelper.Success();
        },
        reload: function (widgetSettings) {
            Main.getTfsData(widgetSettings).then( () => {
                console.log("Data retrieved");
            });
            return WidgetHelpers.WidgetStatusHelper.Success();
        }
    } 
}

let extensionContext = VSS.getExtensionContext();
// this format is needed for VSTS and VS2017
VSS.register(`${extensionContext.publisherId}.${extensionContext.extensionId}.VelocityControlChart`, getData);
// this format is needed for VS2015
VSS.register("VelocityControlChart", getData);