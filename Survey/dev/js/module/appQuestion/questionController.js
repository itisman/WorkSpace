/*jslint devel: true, expr:true */ /*globals angular*/
angular.module('question', []).controller('questionController', function($scope) {
    'use strict';

    /**
        $http.get('../resource/json/questions.json').success(function(data) {
            $scope.questions = data;
        }).error(function(data){
            $scope.questions = data;
        });
    */


    //  ##################################################
    //  Init
    //  ##################################################
    var mockData = initMockData();
    var oServices = initService();

    //Using to record the activities.
    $scope.activityLog = [];

    //Using to record current question group index.
    $scope.currentGroupIndex = 0;

    oServices.getQuestions({}, function(data) {
        $scope.questions = data;
    });



    //  ##################################################
    //  Event
    //  ##################################################
    $scope.onSelectOption = function($event, question, option) {
        question.options.forEach(function(option) {
            option.isSelected = false;
        });
        option.isSelected = true;
        question.answer = option;

        var currentDate = new Date();
        $scope.activityLog.push({
            datetime: "Last Sync: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + " @ " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds(),
            activity: 'CLICK',
            question: question.title,
            option: option.title
        });
    };

    $scope.onPrevQuestion = function() {
        if ($scope.currentGroupIndex > 0) {
            oServices.saveLogs($scope.activityLog);
            oServices.saveAnswers($scope.questions);
            $scope.currentGroupIndex -= 1;
            oServices.getQuestions({}, function(data) {
                $scope.questions = data;
            });
            $('html,body').animate({
                scrollTop: 0
            }, 500);
        }
    };

    $scope.onNextQuestion = function() {
        var totalGroups = mockData.question.length;
        if ($scope.currentGroupIndex < totalGroups - 1) {
            oServices.saveLogs($scope.activityLog);
            oServices.saveAnswers($scope.questions);
            $scope.currentGroupIndex += 1;
            oServices.getQuestions({}, function(data) {
                $scope.questions = data;
            });
            //window.scrollTo(0,0);
            $('html,body').animate({
                scrollTop: 0
            }, 500);
        }
    };


    //  ##################################################
    //  Service
    //  ##################################################
    function initService() {
        return {
            getQuestions: function(oParam, fnSCallback, fnFCallback) {
                if (oParam) {
                    fnSCallback && fnSCallback(mockData.question[$scope.currentGroupIndex]);
                } else {

                    fnFCallback && fnFCallback();
                }
            },
            saveLogs: function(oParam, fnSCallback, fnFCallback) {
                if (oParam) {
                    window.console.log(oParam);
                    fnSCallback && fnSCallback();
                } else {
                    fnFCallback && fnFCallback();
                }
            },
            saveAnswers: function(oParam, fnSCallback, fnFCallback) {
                if (oParam) {
                    console.log(oParam);
                    fnSCallback && fnSCallback();
                } else {
                    fnFCallback && fnFCallback();
                }
            }
        };
    }

    function initMockData() {
        return {
            question: [
                [{
                    title: '认识您的人倾向形容你为？',
                    selectMode: 1,
                    options: [{
                        title: '热情和敏感'
                    }, {
                        title: '逻辑和明确'
                    }]
                }, {
                    title: '下列哪一件事听起来比较吸引你？',
                    selectMode: 1,
                    options: [{
                        title: '与情人到有很多人且社交活动频繁的地方',
                    }, {
                        title: '待在家里与情人做一些特别的事情，例如观赏一部有趣的电影并享用你最喜欢的外卖食物',
                    }]
                }, {
                    title: '您觉得什么最能让人成长？',
                    selectMode: 1,
                    options: [{
                        img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135928_54dff4@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135928_97ebcf@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135928_583823@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135928_954393@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135932_717faa@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135933_448a5b@iclarge.jpg'
                    }]
                }],
                [{
                    title: '你倾向通过以下哪种方式收集信息? ',
                    selectMode: 1,
                    options: [{
                        title: '你对有可能发生之事的相像和期望'
                    }, {
                        title: '你对目前状况的实际认知'
                    }]
                }, {
                    title: '你把大部分和别人的相遇视为',
                    selectMode: 1,
                    options: [{
                        title: '友善及重要的'
                    }, {
                        title: '另有目的'
                    }]
                }, {
                    title: '您什么时候会比平时花的更多？',
                    selectMode: 1,
                    options: [{
                        img: '../../../../resource/img/20151009135645_b3b879@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135642_76149b@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135641_6da218@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135641_1232c6@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135641_4bc6d7@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135641_4bc6d7@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135641_744e09@iclarge.jpg'
                    }]
                }],
                [{
                    title: '当和某人分手时 ',
                    selectMode: 1,
                    options: [{
                        title: '你通常让自己的情绪深陷其中，很难抽身出来。'
                    }, {
                        title: '虽然你觉得受伤，但一旦下定决心，你会直截了当地将过去恋人的影子甩开'
                    }]
                }, {
                    title: '当与一个人交往时，你倾向于看重',
                    selectMode: 1,
                    options: [{
                        title: '情感上的相容性：表达爱意和对另一半的需求很敏感。'
                    }, {
                        title: '智慧上的相容性：沟通重要的想法；客观地讨论和辩论事情'
                    }]
                }, {
                    title: '以下哪个让您更开心？',
                    selectMode: 1,
                    options: [{
                        img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
                    }, {
                        img: '../../../../resource/img/20151009135928_54dff4@iclarge.jpg'
                    }]
                }]
            ]
        }
    }
});
