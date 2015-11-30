/**
 * Created by denis on 30.11.15.
 */
app.factory('SmartTable', ['$http', function($http){
    /**
     * Ajax call
     * @param url
     * @param start
     * @param number
     * @returns {*}
     */
    function getPage(url, start, number) {
           return $http.post(url, {offset:start, limit:number})
               .then(function(response){
                   return response;
               });
    }

    return {
        getPage: getPage
    };
}]);

app.directive('tSelect', function(){
    return {
        require: '^dTable',
        template: '<input type="checkbox"/>',
        scope: {
            row: '=csSelect'
        },
        link: function (scope, element, attr, ctrl) {

            element.bind('change', function (evt) {
                scope.$apply(function () {
                    ctrl.select(scope.row, 'multiple');
                });
            });

            scope.$watch('row.isSelected', function (newValue, oldValue) {
                if (newValue === true) {
                    element.parent().addClass('st-selected');
                } else {
                    element.parent().removeClass('st-selected');
                }
            });
        }
    };
});