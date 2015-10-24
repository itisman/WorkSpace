/*jslint devel: true, expr:true */ /*globals angular*/
(function() {
    var surveyApp = angular.module('surveyApp', [
        'ngRoute',
        'ngResource',
        'question',
        'evaluation',
        'about',
        'home',
        'service'
    ]);

    surveyApp.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.
            when('/', {
                templateUrl: 'js/module/home/home.html',
                controller: 'home'
            }).
            when('/question', {
                templateUrl: 'js/module/question/question.html',
                controller: 'question'
            }).
            when('/evaluation', {
                templateUrl: 'js/module/evaluation/evaluation.html',
                controller: 'evaluation'
            }).
            when('/about', {
                templateUrl: 'js/module/about/about.html',
                controller: 'about'
            }).
            otherwise({
                redirectTo: '/'
            });
        }
    ]);
})();
