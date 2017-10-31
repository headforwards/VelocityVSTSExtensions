define(["require", "exports", "TFS/WorkItemTracking/Contracts", "TFS/WorkItemTracking/RestClient"], function (require, exports, WIT_Contracts, WIT_Client) {
    "use strict";
    var VSTSApi = (function () {
        function VSTSApi() {
        }
        VSTSApi.getWorkItemReferencesInIterationAtDate = function (asOfDate, iterationPath, projectId) {
            var query = { query: "" };
            query.query = "SELECT [System.Id] From WorkItems WHERE ([System.WorkItemType] = 'User Story' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Defect' OR [System.WorkItemType] = 'Bug') AND [Iteration Path] = '" +
                iterationPath + "' ASOF '" +
                asOfDate.toISOString() + "'";
            return WIT_Client.getClient().queryByWiql(query, projectId);
        };
        ;
        VSTSApi.getWorkItemDetails = function (ids, returnFields, date) {
            if (ids.length === 0) {
                return;
            }
            var client = WIT_Client.getClient();
            var expand = WIT_Contracts.WorkItemExpand.None;
            var errorPolicy = WIT_Contracts.WorkItemErrorPolicy.Omit;
            return client.getWorkItems(ids, returnFields, date, expand, errorPolicy);
        };
        ;
        VSTSApi.getWorkItemRevisions = function (id) {
            var client = WIT_Client.getClient();
            var expand = WIT_Contracts.WorkItemExpand.None;
            return client.getRevisions(id, 200, 0, expand);
        };
        ;
        return VSTSApi;
    }());
    return VSTSApi;
});
//# sourceMappingURL=vsts-api.js.map