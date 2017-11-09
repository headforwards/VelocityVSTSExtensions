define(["require", "exports"], function (require, exports) {
    "use strict";
    var TfsConfig = (function () {
        function TfsConfig(newStates, committedStates, completedStates, closedStates, effortField, stateField, returnFields) {
            this.NewStates = this.parseString(newStates, ",");
            this.CommittedStates = this.parseString(committedStates, ",");
            this.CompletedStates = this.parseString(completedStates, ",");
            this.ClosedStates = this.parseString(closedStates, ",");
            this.Fields = this.parseString(returnFields, ",");
            var effort = (effortField === undefined) ? "" : effortField.trim();
            if (effort == "vsts-effort") {
                this.EffortField = "Microsoft.VSTS.Scheduling.StoryPoints";
            }
            else {
                this.EffortField = "Microsoft.VSTS.Scheduling.Effort";
            }
            var state = (stateField === undefined) ? "" : stateField.trim();
            if (state == "") {
                this.StateField = "System.BoardColumn";
            }
            else {
                this.StateField = "System.BoardColumn";
            }
        }
        TfsConfig.prototype.parseString = function (data, separator) {
            if (data === undefined)
                return [];
            return data.split(separator).map(function (item) {
                return item.trim();
            });
        };
        TfsConfig.prototype.TeamContext = function () {
            var ctx = VSS.getWebContext();
            return {
                projectId: ctx.project.id,
                teamId: ctx.team.id,
                project: ctx.project.name,
                team: ctx.team.name
            };
        };
        ;
        return TfsConfig;
    }());
    return TfsConfig;
});
//# sourceMappingURL=config.js.map