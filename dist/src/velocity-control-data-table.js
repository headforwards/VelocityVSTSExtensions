var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "./velocity-control-chart"], function (require, exports, VelocityControlChart) {
    "use strict";
    var VelocityControlChartDataTable = (function (_super) {
        __extends(VelocityControlChartDataTable, _super);
        function VelocityControlChartDataTable(velocity, divId, chartTitle) {
            return _super.call(this, velocity, divId, chartTitle) || this;
        }
        VelocityControlChartDataTable.prototype.draw = function () {
            var options = {
                width: '90%',
                height: '90%'
            };
            var dataTable = new google.visualization.Table(this.outputLocation);
            dataTable.draw(this.data, options);
        };
        return VelocityControlChartDataTable;
    }(VelocityControlChart));
    return VelocityControlChartDataTable;
});
//# sourceMappingURL=velocity-control-data-table.js.map