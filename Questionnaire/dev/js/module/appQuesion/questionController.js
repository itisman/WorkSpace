angular.module('question', []).controller('questionController', function($scope) {
    //$http.get('../resource/json/questions.json').success(function(data) {
    //    $scope.questions = data;
    //}).error(function(data){
    //    $scope.questions = data;
    //});
    $scope.onSelectOption = function(option) {
        window.console.log(option);
    };

    $scope.questions = [{
        title: 'Im question 1',
        description: 'Im question 1 description',
        options: [{
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }, {
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }, {
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }, {
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }]
    }, {
        title: 'Im question 1',
        description: 'Im question 1 description',
        options: [{
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }, {
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }, {
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }, {
            title: 'im option1',
            description: 'Im option 1 description',
            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
        }]
    }, {
        title: 'Im question 1',
        description: 'Im question 1 description',
        options: [{
            title: 'im option1',
            description: 'Im option 1 description'
        }, {
            title: 'Im an much longer longer longer longer longer longer longer longer longer answer!!!! option1',
            description: 'Im option 1 description'
        }, {
            title: 'Im an much longer longer longer longer longer longer longer longer longer answer!!!! option1 option1',
            description: 'Im option 1 description'
        }, {
            title: 'im option1',
            description: 'Im option 1 description'
        }]
    }];
});
