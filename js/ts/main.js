define(["require", "exports", "q", "TFS/Work/RestClient", "./velocity", "./iteration", "./config", "./date"], function (require, exports, Q, Work_Client, Velocity, Iteration, TfsConfig) {
    "use strict";
    var Main = (function () {
        function Main() {
        }
        Main.logMessage = function (message) {
            Main.progressMessage.empty();
            Main.progressMessage.append("<p>" + message + "</p>");
        };
        Main.clearProgressMessage = function () {
            Main.progressMessage.remove();
            Main.progressIndicator.remove();
        };
        Main.getTfsData = function (widgetSettings) {
            console.log(widgetSettings);
            Main.logMessage("Retrieved widget settings");
            var deferred = Q.defer();
            Main.logMessage("Retrieving velocity data");
            Main.getVelocityData().then(function (velocity) {
                Main.logMessage("Retrieved velocity data");
                Main.addVelocityDataToView(velocity);
                deferred.resolve(velocity);
            });
            return deferred.promise;
        };
        Main.getVelocityData = function () {
            var deferred = Q.defer();
            var config = new TfsConfig();
            var velocity;
            var workApiClient = Work_Client.getClient();
            var iterations = workApiClient.getTeamIterations(config.TeamContext());
            Main.logMessage("Retrieving iterations");
            iterations.then(function (iteration) {
                Main.logMessage("Retrieved iterations");
                velocity = new Velocity();
                iteration.forEach(function (element) {
                    velocity.iterations.push(new Iteration(element, config));
                });
                Main.logMessage("There are " + velocity.iterations.length + " iterations");
                var promises = [];
                velocity.iterations.forEach(function (iteration) {
                    promises.push(iteration.getWorkItemInformation());
                });
                Main.logMessage("Retrieving iteration details");
                Q.all(promises).then(function () {
                    deferred.resolve(velocity);
                });
            });
            return deferred.promise;
        };
        Main.addVelocityDataToView = function (velocity) {
            Main.logMessage("Updating Velocity Statistics");
        };
        return Main;
    }());
    Main.progressMessage = $("#progress-message");
    Main.progressIndicator = $("#progress-indicator");
    return Main;
});
//# sourceMappingURL=main.js.map