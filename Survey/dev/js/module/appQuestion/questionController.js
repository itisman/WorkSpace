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
    var oStatic = initStatic();
    $scope.prevButtonText = oStatic.getText('PREV_BUTTON_TEXT');
    $scope.nextButtonText = oStatic.getText('NEXT_BUTTON_TEXT');
    $scope.title = oStatic.getText('PAGE_TITLE');
    $scope.themeUrl = oStatic.getUrl('THEME');
    $scope.logoUrl = oStatic.getUrl('LOGO');


    //$scope.$on('$locationChangeStart', function( event ) {
    //    alert('aa');
    //});

    //window.onbeforeunload = function(){
    //    alert('aa');
    //};

    //Using to record the activities.
    $scope.activityLog = {};

    //Using to record current question group index.
    $scope.currentGroupIndex = 0;
    var totalGroups = mockData.question.length;
    $scope.currentProgress = Math.floor(($scope.currentGroupIndex + 1) / totalGroups * 100) + '%';

    oServices.getQuestions({}, function(data) {
        $scope.questions = data;
        $scope.$digest();
    });



    //  ##################################################
    //  Event
    //  ##################################################
    $scope.onSelectOption = function($event, question, option) {
        var selectedOptions = question.options.filter(function(option) {
            return option.isSelected;
        });
        var minSelected = question.selectMode.minSelected;
        var maxSelected = question.selectMode.maxSelected;
        if (option.isSelected === true) {
            if (selectedOptions.length > minSelected) {
                option.isSelected = false;
            }

            log(question, option, 'UNSELECT');
        } else {
            if (question.selectMode.maxSelected === 1) {
                selectedOptions.forEach(function(option) {
                    option.isSelected = false;
                });
                option.isSelected = true;
            } else {
                if (selectedOptions.length < question.selectMode.maxSelected) {
                    option.isSelected = true;
                } else {
                    questionWarning.call(question);
                }
            }

            log(question, option, 'SELECT');
        }

    };

    $scope.onPrevQuestion = function() {
        if (validateAnswers() && $scope.currentGroupIndex > 0) {
            onSave();
            onLoad();
            updateProgress(-1);
            scrollTop();
        }
    };

    $scope.onNextQuestion = function() {
        var totalGroups = mockData.question.length;
        if (validateAnswers() && $scope.currentGroupIndex < totalGroups - 1) {
            onSave();
            onLoad();
            updateProgress(1);
            scrollTop();
        }
    };

    //  ##################################################
    //  private function
    //  ##################################################
    function scrollTop() {
        //window.scrollTo(0,0);
        $('html,body').animate({
            scrollTop: 0
        }, 500);
    }

    function updateProgress(index) {
        $scope.currentGroupIndex = $scope.currentGroupIndex + index;
        $scope.currentProgress = Math.floor(($scope.currentGroupIndex + 1) / totalGroups * 100) + '%';
    }

    function validateAnswers() {
        var isValid = true;
        $scope.questions.forEach(function(question) {
            var selectedOptions = question.options.filter(function(option) {
                return option.isSelected;
            });
            var minSelected = question.selectMode.minSelected;
            var maxSelected = question.selectMode.maxSelected;
            if (minSelected > selectedOptions.length || maxSelected < selectedOptions.length) {
                isValid = false;
                questionWarning.call(question);
            }
        });
        if (!isValid) {
            scrollTop();
        }
        return isValid;
    }

    function questionWarning() {
        var that = this;
        this.warningMessage = '这个问题是必答题，且只能选择‘' + this.selectMode.maxSelected + '’个选项！';
        setTimeout(function() {
            that.warningMessage = '';
            $scope.$digest();
        }, 5000);
    }

    function onSave(oParam) {
        //save logs
        oServices.saveLogs($scope.activityLog);
        $scope.activityLog = {};

        //save result
        var result = {};
        $scope.questions.forEach(function(question) {
            result[question.id] = {};
            result[question.id].answers = [];
            question.options.forEach(function(option) {
                if (option.isSelected === true) {
                    result[question.id].answers.push(option.id);
                }
            });
        });
        oServices.saveAnswers(result);
    }

    function onLoad(oParam) {
        oServices.getQuestions({}, function(data) {
            $scope.questions = data;
            $scope.$digest();
        });
    }

    function log(question, option, activity) {
        var currentDate = new Date();
        var questionId = question.id;
        if (!$scope.activityLog[questionId]) {
            $scope.activityLog[questionId] = {
                activities: []
            };
        };
        $scope.activityLog[questionId].activities.push({
            datetime: "Last Sync: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + " @ " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds(),
            activity: activity,
            option: option.id
        });
    }

    //  ##################################################
    //  oStatic
    //  ##################################################
    function initStatic() {
        var oStatic = {};
        oStatic.TEXT = {};
        oStatic.URL = {};
        oStatic.TEXT.PREV_BUTTON_TEXT = '上一页';
        oStatic.TEXT.NEXT_BUTTON_TEXT = '下一页';
        oStatic.TEXT.PAGE_TITLE = '';
        oStatic.URL.LOGO = '../../../../resource/img/logo_be22f55.png';
        oStatic.URL.THEME = '../../../css/theme/default.css';
        return {
            getText: function(index) {
                return oStatic.TEXT[index];
            },
            getUrl: function(index) {
                return oStatic.URL[index];
            }
        }
    }

    //  ##################################################
    //  Service
    //  ##################################################
    function initService() {
        return {
            getQuestions: function(oParam, fnSCallback, fnFCallback) {
                var userId = oParam.id;
                var currentGroupIndex = oParam.currentGroupIndex;
                if (oParam) {
                    setTimeout(function() {
                        if(currentGroupIndex < 0){
                            var users = mockData.filter(function(u){
                                return u.id === userId;
                            });
                            if(users && users.length > 0){
                                 currentGroupIndex = users[0].currentGroupIndex 
                            }
                        }
                        fnSCallback && fnSCallback(mockData.question[currentGroupIndex]);
                    }, 1000);
                } else {
                    fnFCallback && fnFCallback();
                }
            },
            saveLogs: function(oParam, fnSCallback, fnFCallback) {
                if (oParam) {
                    setTimeout(function() {
                        window.console.log(oParam);
                        fnSCallback && fnSCallback();
                    }, 1000);
                } else {
                    fnFCallback && fnFCallback();
                }
            },
            saveAnswers: function(oParam, fnSCallback, fnFCallback) {
                if (oParam) {
                    setTimeout(function() {
                        console.log(oParam);
                        fnSCallback && fnSCallback();
                    }, 1000);
                } else {
                    fnFCallback && fnFCallback();
                }
            }
        };
    }

    function initMockData() {
        return {
            users: [{
                id: 'I001',
                name: 'YIZHOU',
                currentGroupIndex: 0,
                isCompleted: false
            }, {
                id: 'I002',
                name: 'GAOPENG',
                currentGroupIndex: 2,
                isCompleted: false
            }, {
                id: 'I003',
                name: 'KKKK',
                currentGroupIndex: 3,
                isCompleted: true
            }, ],
            question: [
                [{
                    id: 'q1',
                    title: '认识您的人倾向形容你为？',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 1
                    },
                    options: [{
                        id: 'q1o1',
                        title: '热情和敏感'
                    }, {
                        id: 'q1o2',
                        title: '逻辑和明确'
                    }]
                }, {
                    id: 'q2',
                    title: '下列哪一件事听起来比较吸引你？',
                    selectMode: {
                        minSelected: 0,
                        maxSelected: 1
                    },
                    options: [{
                        id: 'q2o1',
                        title: '与情人到有很多人且社交活动频繁的地方'
                    }, {
                        id: 'q2o2',
                        title: '待在家里与情人做一些特别的事情，例如观赏一部有趣的电影并享用你最喜欢的外卖食物'
                    }]
                }, {
                    id: 'q3',
                    title: '您觉得什么最能让人成长？',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 3
                    },
                    options: [{
                        id: 'q3o1',
                        title: '逻辑和明确',
                        img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
                    }, {
                        id: 'q3o2',
                        title: '逻辑和明确',
                        img: '../../../../resource/img/20151009135928_54dff4@iclarge.jpg'
                    }, {
                        id: 'q3o3',
                        title: '逻辑和明确',
                        img: '../../../../resource/img/20151009135928_97ebcf@iclarge.jpg'
                    }, {
                        id: 'q3o4',
                        img: '../../../../resource/img/20151009135928_583823@iclarge.jpg'
                    }, {
                        id: 'q3o5',
                        img: '../../../../resource/img/20151009135928_954393@iclarge.jpg'
                    }, {
                        id: 'q3o6',
                        img: '../../../../resource/img/20151009135932_717faa@iclarge.jpg'
                    }, {
                        id: 'q3o7',
                        img: '../../../../resource/img/20151009135933_448a5b@iclarge.jpg'
                    }]
                }],
                [{
                    id: 'q4',
                    title: '你倾向通过以下哪种方式收集信息? ',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 1
                    },
                    options: [{
                        id: 'q4o1',
                        title: '你对有可能发生之事的相像和期望'
                    }, {
                        id: 'q4o2',
                        title: '你对目前状况的实际认知'
                    }]
                }, {
                    id: 'q5',
                    title: '你把大部分和别人的相遇视为',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 1
                    },
                    options: [{
                        id: 'q5o1',
                        title: '友善及重要的'
                    }, {
                        id: 'q5o2',
                        title: '另有目的'
                    }]
                }, {
                    id: 'q6',
                    title: '您什么时候会比平时花的更多？',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 2
                    },
                    options: [{
                        id: 'q6o1',
                        img: '../../../../resource/img/20151009135645_b3b879@iclarge.jpg'
                    }, {
                        id: 'q6o2',
                        img: '../../../../resource/img/20151009135642_76149b@iclarge.jpg'
                    }, {
                        id: 'q6o3',
                        img: '../../../../resource/img/20151009135641_6da218@iclarge.jpg'
                    }, {
                        id: 'q6o4',
                        img: '../../../../resource/img/20151009135641_1232c6@iclarge.jpg'
                    }, {
                        id: 'q6o5',
                        img: '../../../../resource/img/20151009135641_4bc6d7@iclarge.jpg'
                    }, {
                        id: 'q6o6',
                        img: '../../../../resource/img/20151009135641_4bc6d7@iclarge.jpg'
                    }, {
                        id: 'q6o7',
                        img: '../../../../resource/img/20151009135641_744e09@iclarge.jpg'
                    }]
                }],
                [{
                    id: 'q7',
                    title: '当和某人分手时 ',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 1
                    },
                    options: [{
                        id: 'q7o1',
                        title: '你通常让自己的情绪深陷其中，很难抽身出来。'
                    }, {
                        id: 'q7o2',
                        title: '虽然你觉得受伤，但一旦下定决心，你会直截了当地将过去恋人的影子甩开'
                    }]
                }, {
                    id: 'q8',
                    title: '当与一个人交往时，你倾向于看重',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 1
                    },
                    options: [{
                        id: 'q8o1',
                        title: '情感上的相容性：表达爱意和对另一半的需求很敏感。'
                    }, {
                        id: 'q8o2',
                        title: '智慧上的相容性：沟通重要的想法；客观地讨论和辩论事情'
                    }]
                }, {
                    id: 'q9',
                    title: '以下哪个让您更开心？',
                    selectMode: {
                        minSelected: 1,
                        maxSelected: 1
                    },
                    options: [{
                        id: 'q9o1',
                        img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
                    }, {
                        id: 'q9o2',
                        img: '../../../../resource/img/20151009135928_54dff4@iclarge.jpg'
                    }]
                }]
            ]
        };
    }
});
