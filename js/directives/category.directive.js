'use strict';
var app = angular.module('codeforfoco');

app.directive('category', function () {
    return {
    	restrict : "E",
    	//template: '{{ result }}',
    	templateUrl: '/views/partials/list-posts.html',
    	scope : {
    		result : "=name"
    	},
    	link : function(scope, element, attrs) {
      		//console.log("Directive attrs: ", attrs);
      	}
    }
});