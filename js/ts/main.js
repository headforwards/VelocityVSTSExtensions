define(["require", "exports", "q", "TFS/Work/RestClient", "./velocity", "./iteration", "./config", "./date"], function (require, exports, Q, Work_Client, Velocity, Iteration, TfsConfig) {
    "use strict";
    var Main = (function () {
        function Main() {
        }
        Main.getTfsData = function (widgetSettings) {
            var _this = this;
            var deferred = Q.defer();
            Main.getVelocityData().then(function (velocity) {
                console.log("Load function called");
                console.log(widgetSettings);
                console.log("Setting Widget Title to " + widgetSettings.name);
                var $title = $('h2.title');
                $title.text(widgetSettings.name);
                Main.addVelocityDataToView(velocity);
                deferred.resolve(_this);
            });
            return deferred.promise;
        };
        Main.getVelocityData = function () {
            var deferred = Q.defer();
            var config = new TfsConfig();
            var velocity;
            var workApiClient = Work_Client.getClient();
            var iterations = workApiClient.getTeamIterations(config.TeamContext());
            iterations.then(function (iteration) {
                velocity = new Velocity();
                iteration.forEach(function (element) {
                    velocity.iterations.push(new Iteration(element, config));
                });
                console.log("Now we can get the data from TFS");
                console.log("There are " + velocity.iterations.length + " iterations in velocity");
                var promises = [];
                velocity.iterations.forEach(function (iteration) {
                    promises.push(iteration.getWorkItemInformation());
                });
                Q.all(promises).then(function () {
                    console.log("Retrieved all iterations");
                    console.log(velocity);
                    deferred.resolve(velocity);
                });
            });
            return deferred.promise;
        };
        Main.addVelocityDataToView = function (velocity) {
            var $container = $('#iteration-info-container');
            $container.empty();
            $container.append("<p>There are <strong>" + velocity.iterations.length + "</strong> iterations in this project.</p>");
            $container.append("<p>The average story size is <strong>" + velocity.average + "</strong></p>");
            $container.append("<ul>");
            velocity.iterations.forEach(function (element) {
                $container.append("<li><strong>" + element.name + "</strong> [" + element.startDate + " - " + element.endDate + "]</li>");
            }, this);
            $container.append("</ul>");
        };
        return Main;
    }());
    return Main;
});
//# sourceMappingURL=main.js.map