/// <reference path="../typings/tsd.d.ts" />

import Q = require("q");
import WIT_Client = require("TFS/WorkItemTracking/RestClient");
import Work_Client = require("TFS/Work/RestClient");
import WIT_Contracts = require("TFS/WorkItemTracking/Contracts");
import Work_Contracts = require("TFS/Work/Contracts");
import Core_Contracts = require("TFS/Core/Contracts");
import WidgetHelpers = require("TFS/Dashboards/WidgetHelpers");
import Velocity = require("./velocity");
import "./date";
import Iteration = require("./iteration");
import ITfsConfig = require("./config");
import TfsConfig = require("./config");

class Main {

    static progressMessage = $("#progress-message");
    static progressIndicator = $("#progress-indicator");

    public static logMessage(message: string) {
        Main.progressMessage.empty();
        Main.progressMessage.append("<p>" + message + "</p>");
    }

    public static clearProgressMessage() {
        Main.progressMessage.remove();
        Main.progressIndicator.remove();
    }

    public static loadWidgetSettings(widgetSettings: any): TfsConfig {
        console.log(widgetSettings);
        Main.logMessage("Retrieved widget settings");

        var settings = JSON.parse(widgetSettings.customSettings.data);

        if (settings) {
            return new TfsConfig(settings.unstartedWorkFields,
                settings.committedWorkFields,
                settings.completedWorkFields,
                settings.closedWorkFields,
                settings.effortField,
                settings.stateField
                , "System.Id,System.Title,System.State,System.BoardColumn,Microsoft.VSTS.Scheduling.Effort,Microsoft.VSTS.Scheduling.StoryPoints,System.WorkItemType");
        } else {
            return new TfsConfig("approved,ready for review,1. new,2. ready for review,3. approved"
                , "committed,4. committed"
                , "deployed to staging,ready for release,ready for staging,ready for environments team,5. ready for environments team,6. deployed to staging,ready for uat"
                , "done,released/done,deployed to production,7. released/done"
                , "Microsoft.VSTS.Scheduling.Effort"
                , "System.BoardColumn"
                , "System.Id,System.Title,System.State,System.BoardColumn,Microsoft.VSTS.Scheduling.Effort,Microsoft.VSTS.Scheduling.StoryPoints,System.WorkItemType");
        }
    }

    public static getTfsData(widgetSettings: any): Q.Promise<{}> {

        var config = this.loadWidgetSettings(widgetSettings);
        var deferred = Q.defer();

        Main.logMessage("Retrieving velocity data");

        Main.getVelocityData(config).then((velocity) => {
            Main.logMessage("Retrieved velocity data");
            // var $title = $('h2.title');
            // $title.text(widgetSettings.name);
            Main.addVelocityDataToView(<Velocity>velocity);

            deferred.resolve(<Velocity>velocity);
        });

        return deferred.promise;

    }


    public static getVelocityData(config: ITfsConfig): Q.Promise<{}> {
        // get data from TFS :-)
        // connect to TFS and retrieve all the iterations
        // build Iteration[]{startDate, endDate, id, name}
        var deferred = Q.defer();
        var velocity: Velocity;

        var workApiClient = Work_Client.getClient();
        var iterations = workApiClient.getTeamIterations(config.TeamContext());
        Main.logMessage("Retrieving iterations");

        iterations.then(function (iteration) {

            Main.logMessage("Retrieved iterations");
            velocity = new Velocity();

            iteration.forEach(element => {
                velocity.iterations.push(new Iteration(element, config));
            });

            Main.logMessage("There are " + velocity.iterations.length + " iterations");
            var promises = [];

            velocity.iterations.forEach((iteration: Iteration) => {
                promises.push(iteration.getWorkItemInformation());
            });

            Main.logMessage("Retrieving iteration details");
            Q.all(promises).then(() => {
                deferred.resolve(velocity);
            });

        });

        return deferred.promise;
    }

    public static addVelocityDataToView(velocity: Velocity) {

        Main.logMessage("Updating Velocity Statistics");

        // var $container = $('#iteration-info-container');
        // $container.empty();
        // $container.append("<p>There are <strong>" + velocity.iterations.length + "</strong> iterations in this project. The average story size is <strong>" + velocity.average + "</strong></p>");
    }
}
export = Main;