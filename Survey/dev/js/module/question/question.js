/*jslint devel: true, expr:true */ /*globals angular*/
angular.module('question', []).controller('questionController', ['$scope', '$timeout', 'service',
    function($scope, $timeout, service) {
        /**
            $http.get('../resource/json/questions.json').success(function(data) {
                $scope.questions = data;
            }).error(function(data){
                $scope.questions = data;
            });
        */

        var test = service;

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
        $scope.activityLog = [];
        log({
            activity: 'INIT'
        });

        //Using to forward cache more data;
        var cache = {};
        cache.questions = {};

        //Using to record current question group index.
        $scope.currentGroupIndex = 0;
        var totalGroups = mockData.question.length;
        $scope.currentProgress = Math.floor(($scope.currentGroupIndex + 1) / totalGroups * 100) + '%';

        onLoad();

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
                if (maxSelected > 1 || selectedOptions.length > minSelected) {
                    option.isSelected = false;
                }

                log({
                    question: question,
                    option: option,
                    activity: 'UNSELECT'
                });
            } else {
                if (maxSelected === 1) {
                    selectedOptions.forEach(function(option) {
                        option.isSelected = false;
                    });
                    option.isSelected = true;
                } else {
                    if (selectedOptions.length < maxSelected) {
                        option.isSelected = true;
                    } else {
                        questionWarning(question);
                    }
                }

                log({
                    question: question,
                    option: option,
                    activity: 'SELECT'
                });
            }

        };

        $scope.onPrevQuestion = function() {
            onSave();
            if (validateAnswers() && $scope.currentGroupIndex > 0) {
                $scope.currentGroupIndex--;
                onLoad();
                scrollTop();
            }
        };

        $scope.onNextQuestion = function() {
            var totalGroups = mockData.question.length;
            if (validateAnswers()) {
                if ($scope.currentGroupIndex < totalGroups - 1) {
                    log({
                        activity: 'NEXT_SUCCEED'
                    });
                    onSave();
                    $scope.currentGroupIndex++;
                    onLoad();
                    scrollTop();
                } else {
                    log({
                        activity: 'COMPLETED'
                    });
                    onSave();
                    //window.open(oStatic.getUrl('EVALUATION'), '_self');
                }
            } else {
                log({
                    activity: 'NEXT_FAILED'
                });
            }
        };

        //  ##################################################
        //  private function
        //  ##################################################
        function buildQuestionWarningMessage(questions) {
            questions.forEach(function(question) {
                var questionMode = '';
                if (question.selectMode.minSelected > 0) {
                    questionMode += '锟角必达拷锟斤拷';
                } else {
                    questionMode += '锟斤拷锟角必达拷锟斤拷';
                }
                question.warningMessage = '锟斤拷锟斤拷锟斤拷锟斤拷' + questionMode + '锟斤拷锟斤拷锟斤拷锟斤拷只锟斤拷选锟斤拷锟斤拷' + question.selectMode.maxSelected + '锟斤拷锟斤拷选锟筋！';
            });
        }

        function scrollTop() {
            //window.scrollTo(0,0);
            $('html,body').animate({
                scrollTop: 0
            }, 500);
        }

        function updateProgress() {
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
                    questionWarning(question);
                }
            });
            if (!isValid) {
                scrollTop();
            }
            return isValid;
        }

        function questionWarning(question) {
            question.isWarning = true;
            setTimeout(function() {
                question.isWarning = false;
                $scope.$digest();
            }, 5000);
        }

        function onSave() {
            //save logs
            oServices.saveLogs($scope.activityLog);
            $scope.activityLog = [];

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

        function forwardLoading() {
            var forwardGroupIndex = $scope.currentGroupIndex + 1;
            if (!cache.questions[forwardGroupIndex]) {
                oServices.getQuestions({
                    currentGroupIndex: forwardGroupIndex
                }, function(data) {
                    cache.questions[forwardGroupIndex] = data;
                });
            }
        }

        function onLoad() {
            function fnSCallback(data) {
                updateProgress();
                buildQuestionWarningMessage(data.questions);
                $scope.questions = data.questions;
                $scope.currentGroupIndex = data.currentGroupIndex;
                cache.questions[data.currentGroupIndex] = data;
                forwardLoading();
                $timeout(function() {
                    $scope.$digest();
                });

            }
            if (cache.questions[$scope.currentGroupIndex]) {
                fnSCallback(cache.questions[$scope.currentGroupIndex]);
            } else {
                oServices.getQuestions({
                    currentGroupIndex: $scope.currentGroupIndex
                }, fnSCallback);
            }

        }

        function log(param) {
            if (!param) {
                return;
            }
            var questionId, optionId;
            if (param && param.question && param.question.id) {
                questionId = param.question.id;
            }
            if (param && param.option && param.option.id) {
                optionId = param.option.id;
            }
            var currentDate = new Date();
            $scope.activityLog.push({
                datetime: "Last Sync: " + currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + " @ " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds(),
                activity: param.activity,
                option: optionId,
                question: questionId,
                currentGroupIndex: $scope.currentGroupIndex
            });
        }

        //  ##################################################
        //  oStatic //TODO: need move to Static module
        //  ##################################################
        function initStatic() {
            var oStatic = {};
            oStatic.TEXT = {};
            oStatic.URL = {};
            oStatic.TEXT.PREV_BUTTON_TEXT = '锟斤拷一页';
            oStatic.TEXT.NEXT_BUTTON_TEXT = '锟斤拷一页';
            oStatic.TEXT.PAGE_TITLE = '';
            oStatic.URL.LOGO = '../../../../resource/img/logo_be22f55.png';
            oStatic.URL.THEME = '../../../css/theme/default.css';
            oStatic.URL.EVALUATION = '../appEvaluation/evaluation.html';

            return {
                getText: function(index) {
                    return oStatic.TEXT[index];
                },
                getUrl: function(index) {
                    return oStatic.URL[index];
                }
            };
        }

        //  ##################################################
        //  Service //TODO: need to move to Service module
        //  ##################################################
        function initService() {
            return {
                getQuestions: function(oParam, fnSCallback, fnFCallback) {
                    var userId = oParam.id;
                    var currentGroupIndex = oParam.currentGroupIndex;
                    if (oParam) {
                        setTimeout(function() {
                            if (currentGroupIndex < 0) {
                                var users = mockData.filter(function(u) {
                                    return u.id === userId;
                                });
                                if (users && users.length > 0) {
                                    currentGroupIndex = users[0].currentGroupIndex;
                                }
                            }
                            fnSCallback && fnSCallback({
                                questions: mockData.question[currentGroupIndex],
                                currentGroupIndex: currentGroupIndex
                            });
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
                    currentGroupIndex: 1,
                    isCompleted: false
                }, {
                    id: 'I003',
                    name: 'KKKK',
                    currentGroupIndex: 2,
                    isCompleted: true
                }],
                question: [
                    [{
                        id: 'q1',
                        title: '锟斤拷识锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷为锟斤拷',
                        selectMode: {
                            minSelected: 1,
                            maxSelected: 1
                        },
                        options: [{
                            id: 'q1o1',
                            title: '锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷'
                        }, {
                            id: 'q1o2',
                            title: '锟竭硷拷锟斤拷锟斤拷确'
                        }]
                    }, {
                        id: 'q2',
                        title: '锟斤拷锟斤拷锟斤拷一锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟饺斤拷锟斤拷锟斤拷锟姐？',
                        selectMode: {
                            minSelected: 0,
                            maxSelected: 1
                        },
                        options: [{
                            id: 'q2o1',
                            title: '锟斤拷锟斤拷锟剿碉拷锟叫很讹拷锟斤拷锟斤拷锟界交锟筋动频锟斤拷锟侥地凤拷'
                        }, {
                            id: 'q2o2',
                            title: '锟斤拷锟节硷拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷一些锟截憋拷锟斤拷锟斤拷锟介，锟斤拷锟斤拷锟斤拷锟斤拷一锟斤拷锟斤拷趣锟侥碉拷影锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷喜锟斤拷锟斤拷锟斤拷锟斤拷食锟斤拷'
                        }]
                    }, {
                        id: 'q3',
                        title: '锟斤拷锟斤拷锟斤拷什么锟斤拷锟斤拷锟斤拷锟剿成筹拷锟斤拷',
                        selectMode: {
                            minSelected: 1,
                            maxSelected: 3
                        },
                        options: [{
                            id: 'q3o1',
                            title: '锟竭硷拷锟斤拷锟斤拷确',
                            img: '../../../../resource/img/20151009135928_51a73a@iclarge.jpg'
                        }, {
                            id: 'q3o2',
                            title: '锟竭硷拷锟斤拷锟斤拷确',
                            img: '../../../../resource/img/20151009135928_54dff4@iclarge.jpg'
                        }, {
                            id: 'q3o3',
                            title: '锟竭硷拷锟斤拷锟斤拷确',
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
                        title: '锟斤拷锟斤拷锟斤拷通锟斤拷锟斤拷锟斤拷锟斤拷锟街凤拷式锟秸硷拷锟斤拷息? ',
                        selectMode: {
                            minSelected: 1,
                            maxSelected: 1
                        },
                        options: [{
                            id: 'q4o1',
                            title: '锟斤拷锟斤拷锟叫匡拷锟杰凤拷锟斤拷之锟铰碉拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷'
                        }, {
                            id: 'q4o2',
                            title: '锟斤拷锟斤拷目前状锟斤拷锟斤拷实锟斤拷锟斤拷知'
                        }]
                    }, {
                        id: 'q5',
                        title: '锟斤拷锟窖大部分和憋拷锟剿碉拷锟斤拷锟斤拷锟斤拷为',
                        selectMode: {
                            minSelected: 1,
                            maxSelected: 1
                        },
                        options: [{
                            id: 'q5o1',
                            title: '锟斤拷锟狡硷拷锟斤拷要锟斤拷'
                        }, {
                            id: 'q5o2',
                            title: '锟斤拷锟斤拷目锟斤拷'
                        }]
                    }, {
                        id: 'q6',
                        title: '锟斤拷什么时锟斤拷锟斤拷锟斤拷平时锟斤拷锟侥革拷锟洁？',
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
                        title: '锟斤拷锟斤拷某锟剿凤拷锟斤拷时 ',
                        selectMode: {
                            minSelected: 1,
                            maxSelected: 1
                        },
                        options: [{
                            id: 'q7o1',
                            title: '锟斤拷通锟斤拷锟斤拷锟皆硷拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟叫ｏ拷锟斤拷锟窖筹拷锟斤拷锟斤拷锟斤拷锟斤拷'
                        }, {
                            id: 'q7o2',
                            title: '锟斤拷然锟斤拷锟斤拷锟斤拷锟斤拷锟剿ｏ拷锟斤拷一锟斤拷锟铰讹拷锟斤拷锟侥ｏ拷锟斤拷锟斤拷直锟斤拷锟剿碉拷锟截斤拷锟斤拷去锟斤拷锟剿碉拷影锟斤拷甩锟斤拷'
                        }]
                    }, {
                        id: 'q8',
                        title: '锟斤拷锟斤拷一锟斤拷锟剿斤拷锟斤拷时锟斤拷锟斤拷锟斤拷锟斤拷锟节匡拷锟斤拷',
                        selectMode: {
                            minSelected: 1,
                            maxSelected: 1
                        },
                        options: [{
                            id: 'q8o1',
                            title: '锟斤拷锟斤拷锟较碉拷锟斤拷锟斤拷锟皆ｏ拷锟斤拷锟斤爱锟斤拷锟酵讹拷锟斤拷一锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟叫★拷'
                        }, {
                            id: 'q8o2',
                            title: '锟角伙拷锟较碉拷锟斤拷锟斤拷锟皆ｏ拷锟斤拷通锟斤拷要锟斤拷锟诫法锟斤拷锟酵观碉拷锟斤拷锟桔和憋拷锟斤拷锟斤拷锟斤拷'
                        }]
                    }, {
                        id: 'q9',
                        title: '锟斤拷锟斤拷锟侥革拷锟斤拷锟斤拷锟斤拷锟斤拷锟侥ｏ拷',
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
    }
]);
