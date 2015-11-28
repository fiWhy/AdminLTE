app.directive('dTable', function(){
    return {
        restrict: 'E',
        templateUrl:'/Admin/angular/app/templates/datatables.build.html',
        scope: {
            src: '@',
            fields: '@',
            model: '@',
            withCheckbox: '=checkbox',
            withDelete: '=delete',
            withFieldUpdate: '=update',

        },
        controller: ['$scope', '$http', '$compile', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', function($scope, $http, $compile, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder){
            $scope.data = [];
            $scope.dtColumns = [];
            $scope.selected = {};
            $scope.selectAll = false;

            /**
             * Additional options
             * @type {{checkbox: {title: string, body: Function, functions: {toggleAll: Function, toggleOne: Function}}}}
             */
            $scope.additionalColumns = {
                checkbox: {
                    title: '<input ng-model="selectAll" ng-click="additionalColumns.checkbox.functions.toggleAll(selectAll, selected)" type="checkbox">',
                    body: function(){
                        return DTColumnBuilder.newColumn(null).withTitle($scope.additionalColumns.checkbox.title).notSortable()
                            .renderWith(function(data, type, full, meta) {
                                $scope.selected[full.id] = false;
                                return '<input ng-model="selected[' + data.id + ']" ng-click="additionalColumns.checkbox.functions.toggleOne(selected)" type="checkbox">';
                            });
                    },
                    functions:{
                        toggleAll:function (selectAll, selectedItems) {
                            for (var id in selectedItems) {
                                if (selectedItems.hasOwnProperty(id)) {
                                    selectedItems[id] = selectAll;
                                }
                            }
                        },
                        toggleOne:function(selectedItems) {
                            for (var id in selectedItems) {
                                if (selectedItems.hasOwnProperty(id)) {
                                    if(!selectedItems[id]) {
                                        $scope.selectAll = false;
                                        return;
                                    }
                                }
                            }
                            $scope.selectAll = true;
                        }
                    }
                }
            }


            $scope.toggleAll = $scope.additionalColumns.checkbox.functions.toggleAll;
            $scope.toggleOne = $scope.additionalColumns.checkbox.functions.toggleOne;

            /**
             * End
             */
            $scope.dtOptions = DTOptionsBuilder
                .newOptions()
                .withOption('serverSide', true)
                .withOption('ajax', {
                    url: $scope.src,
                    type: 'POST'
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!$scope.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        $scope.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                });





            (function(){
                /**
                 * Add main fields
                 */

                //Adding checkbox
                if($scope.withCheckbox) {
                    //$scope.dtColumns.push($scope.additionalColumns.checkbox.body());
                }


                angular.forEach(angular.fromJson($scope.fields), function(value, key){
                    var b = DTColumnBuilder.newColumn(key);
                    if(value instanceof Object){
                        b.withTitle(value.title);
                        b.withOption('name', value.title);
                        if(value.sortable != undefined && !value.sortable)
                            b.notSortable();
                        if(value.visible != undefined && !value.visible)
                            b.notVisible();
                        if(value.searchable != undefined && !value.searchable)
                            b.withOption('searchable', false);
                    }else {
                        b.withTitle(value);
                        b.withOption('name', value);
                    }


                        $scope.dtColumns.push(b);
                })
                $scope.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle('Hello').renderWith(function(data, type, full, meta) {return 'y'}));
            })();


        }],
    }
});

