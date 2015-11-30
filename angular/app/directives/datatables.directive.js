app.directive('dTable', function(){
    return {
        restrict: 'E',
        templateUrl:'/Admin/angular/app/templates/datatables.build.html',
        scope: {
            src: '@',
            fields: '@',
            model: '@',
            limit: '@',
            deletable: '@'

        },
        controller: ['$scope', '$http', '$compile', 'SmartTable', function($scope, $http, $compile, SmartTable){
            $scope.data = [];
            $scope.loading = false;
            $scope.headers = [];
            $scope.limit = $scope.limit || 10;

            $scope.prepareFields = function(fields){
                var index = 0;
                angular.forEach(angular.fromJson(fields), function(value, key){
                    $scope.headers.push({
                        field:key
                    })

                    if(typeof value == 'object') {
                        $scope.headers[index].title = value.title;
                        if(value.searchable)
                            $scope.headers[index].searchable = true;
                    }
                    else
                        $scope.headers[index].title = value;
                    index++;
                })
            }

            $scope.call = function(tableState){

                var pagination = tableState.pagination;
                var start = pagination.start;
                var number = pagination.number;

                $scope.loading = true;

                SmartTable.getPage($scope.src, start, number).then(function(response){
                    angular.copy(response.data, $scope.data);
                    tableState.pagination.numberOfPages = response.data.numberOfPages;
                    $scope.loading = false;
                });
            }

            $scope.prepareFields($scope.fields);

        }],
    }
});

