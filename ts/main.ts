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
import TfsConfig = require("./config");

class Main {

    public static getTfsData(widgetSettings: any): Q.Promise<{}> {
        
        var deferred = Q.defer();

        Main.getVelocityData().then((velocity) => {
            console.log("Load function called");
            console.log(widgetSettings);
    
            console.log("Setting Widget Title to " + widgetSettings.name);
            var $title = $('h2.title');
            $title.text(widgetSettings.name);
            Main.addVelocityDataToView(<Velocity>velocity);

            deferred.resolve(this);
        });

        return deferred.promise;

    }


    public static getVelocityData(): Q.Promise<{}> {
        // get data from TFS :-)
        // connect to TFS and retrieve all the iterations
        // build Iteration[]{startDate, endDate, id, name}
        var deferred = Q.defer();
        var config: TfsConfig = new TfsConfig();
        var velocity: Velocity;

        var workApiClient = Work_Client.getClient();
        var iterations = workApiClient.getTeamIterations(config.TeamContext());

        iterations.then(function (iteration) {

            velocity = new Velocity();

            iteration.forEach(element => {
                velocity.iterations.push(new Iteration(element, config));
            });

            console.log("Now we can get the data from TFS");
            console.log("There are " + velocity.iterations.length + " iterations in velocity");
            var promises = [];

            velocity.iterations.forEach((iteration: Iteration) => {
                promises.push(iteration.getWorkItemInformation());
            });

            Q.all(promises).then(() => {
                console.log("Retrieved all iterations");
                console.log(velocity);
                deferred.resolve(velocity);
            });

        });

        return deferred.promise;
    }

    public static addVelocityDataToView(velocity: Velocity) {

        // Append the workitem count to the query-info-container
        var $container = $('#iteration-info-container');
        $container.empty();
        $container.append("<p>There are <strong>" + velocity.iterations.length + "</strong> iterations in this project.</p>");
        $container.append("<p>The average story size is <strong>" + velocity.average + "</strong></p>");
        $container.append("<ul>");

        velocity.iterations.forEach(function (element) {
            $container.append("<li><strong>" + element.name + "</strong> [" + element.startDate + " - " + element.endDate + "]</li>");
        }, this);

        $container.append("</ul>");
    }
}
export = Main;