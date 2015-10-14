angular.module('question', []).controller('questionController', function($scope) {
    //$http.get('../resource/json/questions.json').success(function(data) {
    //    $scope.questions = data;
    //}).error(function(data){
    //    $scope.questions = data;
    //});
    $scope.onSelectOption = function($event, question, option) {
        question.options.forEach(function(option){
            option.isSelected = false; 
        });
        option.isSelected = true;
        question.answer = option;
    };

    $scope.onPrevQuestion = function(){
        window.console.log(this.questions);
    };

    $scope.onPrevQuestion = function(){
        window.console.log(this.questions);
        var temp = this.questions[2];
        this.questions[2] = this.questions[0];
        this.questions[0] = temp;
    };

    //setTimeout(function(){
        $scope.questions = [{
        title: 'How to make the require in node.js to be always relative to the root folder of the project?',
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
        title: 'What is your greatest strength?',
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
        title: 'Do you consider yourself successful? Why? ',
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
    //}, 2000);
    
});
