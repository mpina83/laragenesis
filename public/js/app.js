'use strict';


// Genesis App configuration
var appName = 'Root';
var breadcrumbPrefix = true;
var breadcrumbPrefixName = 'Root';

// General
var headTitle = 'Root Admin';

//Default colours
var brandPrimary =  '#20a8d8';
var brandSuccess =  '#4dbd74';
var brandInfo =     '#63c2de';
var brandWarning =  '#f8cb00';
var brandDanger =   '#f86c6b';

var grayDark =      '#2a2c36';
var gray =          '#55595c';
var grayLight =     '#818a91';
var grayLighter =   '#d1d4d7';
var grayLightest =  '#f8f9fa';

angular
    .module('app', [
        'ngAnimate',
        'ui.router',
        'oc.lazyLoad',
        'pascalprecht.translate',
        'ncy-angular-breadcrumb',
        'angular-loading-bar'
    ])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 1;
    }])
    .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
        $rootScope.$on('$stateChangeSuccess',function(){
            /* jshint browser: true */
            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        return $rootScope.$stateParams;
    }]);

// controller.js
'use strict';
angular
    .module('app')
    .controller('languageCtrl', languageCtrl);

/*jshint latedef: nofunc */
languageCtrl.$inject = ['$translate', '$scope'];
function languageCtrl($translate, $scope) {
    function checkLanguage(languages, langKey) {
        languages.map(function (language) {
            if (language.langKey === langKey) {
                $scope.flag = language.flag;
                $scope.lang = language.lang;
                return language;
            } else {

                return null;
            }
        });
    }

    var languages = [
        {
            lang: 'Polish',
            langKey: 'pl',
            flag: 'Poland.png'
        },
        {
            lang: 'English',
            langKey: 'en',
            flag: 'United-Kingdom.png'
        },
        {
            lang: 'Español',
            langKey: 'es',
            flag: 'Spain.png'
        }
    ];
    $scope.languages = languages;
    checkLanguage(languages, $translate.use());
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        checkLanguage(languages, langKey);
    };
}

'use strict';
/*jshint latedef: nofunc */
/* jshint browser: true */
angular
    .module('app')
    .directive('title', titleDirective)
    .directive('breadcrumb', breadcrumbPrefixDirective)
    .directive('a', preventClickDirective)
    .directive('a', bootstrapCollapseDirective)
    .directive('a', navigationDirective)
    .directive('nav', sidebarNavDynamicResizeDirective)
    .directive('nav', topNavSmartResizeDirective)
    .directive('button', layoutToggleDirective)
    .directive('a', layoutToggleDirective)
    .directive('button', collapseMenuTogglerDirective)
    .directive('div', bootstrapCarouselDirective)
    .directive('toggle', bootstrapTooltipsPopoversDirective)
    .directive('tab', bootstrapTabsDirective)
    .directive('button', cardCollapseDirective)
    .directive('ionslider', ionSliderDirective)
    .directive('vamiddle', verticalAlignMiddleDirective)
    .directive('emailapp', emailAppDirective)
    .directive('gaugejs', gaugeJsDirective);


/**
* @desc this directive add meta title
* @example <title></title>
*/

function titleDirective() {
    var directive = {
        restrict: 'E',
        template: headTitle
    };
    return directive;
}

//Breadcrumb Prefix
function breadcrumbPrefixDirective() {
    var directive = {
        restrict: 'A',
        link: link
    };
    return directive;

    function link(scope, element) {
        if (breadcrumbPrefix) {
            element.prepend('<li><span>' + breadcrumbPrefixName + '</span></li>');
        }
    }
}

function preventClickDirective() {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        if (attrs.href === '#'){
            element.on('click', function(event){
                event.preventDefault();
            });
        }
    }
}

//Bootstrap Collapse
function bootstrapCollapseDirective() {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        if (attrs.toggle === 'collapse'){
            element.attr('href','javascript;;').attr('data-target',attrs.href.replace('index.html',''));
        }
    }
}

/**
* @desc Genesis main navigation - Siedebar menu
* @example <li class="nav-item nav-dropdown"></li>
*/
function navigationDirective() {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        if(element.hasClass('nav-dropdown-toggle') && angular.element('body').hasClass('sidebar-nav') && angular.element('body').width() > 782) {
            element.on('click', function(){
                if(!angular.element('body').hasClass('compact-nav')) {
                    element.parent().toggleClass('open').find('.open').removeClass('open');
                }
            });
        } else if (element.hasClass('nav-dropdown-toggle') && angular.element('body').width() < 783) {
            element.on('click', function(){
                element.parent().toggleClass('open').find('.open').removeClass('open');
            });
        }
    }
}

//Dynamic resize .sidebar-nav
sidebarNavDynamicResizeDirective.$inject = ['$window', '$timeout'];
function sidebarNavDynamicResizeDirective($window, $timeout) {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {

        if (element.hasClass('sidebar-nav') && angular.element('body').hasClass('fixed-nav')) {
            var bodyHeight = angular.element(window).height();
            scope.$watch(function(){
                var headerHeight = angular.element('header').outerHeight();
                var sidebarHeaderHeight = angular.element('.sidebar-header').outerHeight();
                var sidebarFooterHeight = angular.element('.sidebar-footer').outerHeight();

                if (angular.element('body').hasClass('sidebar-off-canvas')) {
                    element.css('height', bodyHeight - sidebarHeaderHeight - sidebarFooterHeight);
                } else {
                    element.css('height', bodyHeight - headerHeight - sidebarHeaderHeight - sidebarFooterHeight);
                }
            });

            angular.element($window).bind('resize', function(){
                var bodyHeight = angular.element(window).height();
                var headerHeight = angular.element('header').outerHeight();
                var sidebarHeaderHeight = angular.element('.sidebar-header').outerHeight();
                var sidebarFooterHeight = angular.element('.sidebar-footer').outerHeight();

                if (angular.element('body').hasClass('sidebar-off-canvas')) {
                    element.css('height', bodyHeight - sidebarHeaderHeight - sidebarFooterHeight);
                } else {
                    element.css('height', bodyHeight - headerHeight - sidebarHeaderHeight - sidebarFooterHeight);
                }
            });
        }
    }
}

topNavSmartResizeDirective.$inject = ['$window', '$timeout'];
function topNavSmartResizeDirective($window, $timeout) {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {

        if (element.hasClass('top-nav')) {

            var oldNav = element.find('ul.nav').clone();
            var more = '<li class="nav-item nav-more nav-dropdown"><a class="nav-link nav-dropdown-toggle" href="#"><i class="icon-options-vertical"></i> More</a><ul class="nav-dropdown-items items-more"></ul></li>';
            var offcanvas = false;
            var offCanvasLi = [];

            $timeout(function(){
                angular.forEach(element.find('ul.nav li'), function(value, key){
                    var li = angular.element(value);
                    if (li.parent().hasClass('nav')) {

                        if (offcanvas === true) {
                            offCanvasLi.push(li[0].outerHTML);
                            li.remove();
                        } else {
                            var rect = li[0].getBoundingClientRect();
                            if (rect.right < (window.innerWidth || document.documentElement.clientWidth)) {

                                var nextLi = li.next();
                                if (nextLi[0]) {
                                    var nextLiRect = nextLi[0].getBoundingClientRect();

                                    if (nextLiRect.right >= (window.innerWidth || document.documentElement.clientWidth)) {
                                        offcanvas = true;
                                        offCanvasLi.push(li[0].outerHTML);
                                    }
                                }

                            } else {
                                offcanvas = true;
                                offCanvasLi.push(li[0].outerHTML);
                            }

                            if (offcanvas === true) {
                                li.remove();
                            }
                        }
                    }
                }, offCanvasLi);

                if (offCanvasLi.length > 0) {
                    element.find('ul.nav').append(more).find('.items-more').append(offCanvasLi.join(''));
                }

            },0);

            angular.element($window).bind('resize', function(){

                var offcanvas = false;
                var offCanvasLi = [];

                var cloneMore = element.find('.items-more').html();

                element.find('.nav-more').remove();
                element.find('ul.nav').append(cloneMore);

                angular.forEach(element.find('ul.nav li'), function(value, key){
                    var li = angular.element(value);
                    if (li.parent().hasClass('nav')) {

                        if (offcanvas === true) {
                            offCanvasLi.push(li[0].outerHTML);
                            li.remove();
                        } else {
                            var rect = li[0].getBoundingClientRect();
                            if (rect.right < (window.innerWidth || document.documentElement.clientWidth)) {

                                var nextLi = li.next();
                                if (nextLi[0]) {
                                    var nextLiRect = nextLi[0].getBoundingClientRect();

                                    if (nextLiRect.right >= (window.innerWidth || document.documentElement.clientWidth)) {
                                        offcanvas = true;
                                        offCanvasLi.push(li[0].outerHTML);
                                    }
                                }
                            } else {
                                offcanvas = true;
                                offCanvasLi.push(li[0].outerHTML);
                            }

                            if (offcanvas === true) {
                                li.remove();
                            }
                        }
                    }
                }, offCanvasLi);

                if (offCanvasLi.length > 0) {
                    element.find('ul.nav').append(more).find('.items-more').append(offCanvasLi.join(''));
                }

                scope.$digest();

            });
        }
    }
}

//LayoutToggle
layoutToggleDirective.$inject = ['$interval'];
function layoutToggleDirective($interval) {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        element.on('click', function(){

            var bodyClass = localStorage.getItem('body-class');

            if ((element.hasClass('layout-toggler') || element.hasClass('sidebar-close')) && angular.element('body').hasClass('sidebar-off-canvas')) {
                angular.element('body').toggleClass('sidebar-opened').parent().toggleClass('sidebar-opened');

                $interval(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 100, 5);

            } else if (element.hasClass('layout-toggler') && (angular.element('body').hasClass('sidebar-nav') || bodyClass === 'sidebar-nav')) {
                angular.element('body').toggleClass('sidebar-nav');
                localStorage.setItem('body-class', 'sidebar-nav');
                if (bodyClass === 'sidebar-nav') {
                    localStorage.clear();
                }

                $interval(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 100, 5);
            }

            if (element.hasClass('aside-toggle')) {
                angular.element('body').toggleClass('aside-menu-open');

                $interval(function () {
                    window.dispatchEvent(new Event('resize'));
                }, 100, 5);
            }
        });
    }
}

//Collapse menu toggler
function collapseMenuTogglerDirective() {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        element.on('click', function(){
            if (element.hasClass('navbar-toggler') && !element.hasClass('layout-toggler')) {
                angular.element('body').toggleClass('mobile-open');
            }
        });
    }
}

//Bootstrap Carousel
function bootstrapCarouselDirective() {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        if (attrs.ride === 'carousel'){
            element.find('a').each(function(){
                $(this).attr('data-target',$(this).attr('href').replace('index.html','')).attr('href','javascript;;');
            });
        }
    }
}

//Bootstrap Tooltips & Popovers
function bootstrapTooltipsPopoversDirective() {
    var directive = {
        restrict: 'A',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        if (attrs.toggle === 'tooltip'){
            angular.element(element).tooltip();
        }
        if (attrs.toggle === 'popover'){
            angular.element(element).popover();
        }
    }
}

//Bootstrap Tabs
function bootstrapTabsDirective() {
    var directive = {
        restrict: 'A',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        element.click(function(e) {
            e.preventDefault();
            angular.element(element).tab('show');
        });
    }
}

//Card Collapse
function cardCollapseDirective() {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        if (attrs.toggle === 'collapse' && element.parent().hasClass('card-actions')){

            if (element.parent().parent().parent().find('.card-block').hasClass('in')) {
                element.find('i').addClass('r180');
            }

            var id = 'collapse-' + Math.floor((Math.random() * 1000000000) + 1);
            element.attr('data-target','#'+id);
            element.parent().parent().parent().find('.card-block').attr('id',id);

            element.on('click', function(){
                element.find('i').toggleClass('r180');
            });
        }
    }
}

ionSliderDirective.$inject = ['$timeout'];
function ionSliderDirective($timeout) {
    var directive = {
        require: 'ngModel',
        restrict:'E',
        scope:{
            min:'=',
            max:'=',
            type:'@',
            prefix:'@',
            maxPostfix:'@',
            prettify:'@',
            grid:'@',
            gridMargin:'@',
            postfix:'@',
            step:'@',
            hideMinMax:'@',
            hideFromTo:'@',
            from:'=',
            disable:'=',
            onChange:'=',
            onFinish:'=',
            ngModel : '&'
        },
        template:'<input type="text" value=""/>',
        replace:true,
        link: link
    };
    return directive;

    function link(scope, element, attrs, ngModel) {
        scope.$watch(function(){
            return ngModel.$modelValue;
        }, function(modelValue){
            if (modelValue.options) {
                element.ionRangeSlider(modelValue.options);
            } else {
                element.ionRangeSlider({
                    min: scope.min,
                    max: scope.max,
                    type: scope.type,
                    prefix: scope.prefix,
                    maxPostfix: scope.maxPostfix,
                    prettify: scope.prettify,
                    grid: scope.grid,
                    gridMargin: scope.gridMargin,
                    postfix:scope.postfix,
                    step:scope.step,
                    hideMinMax:scope.hideMinMax,
                    hideFromTo:scope.hideFromTo,
                    from:scope.from,
                    disable:scope.disable,
                    onChange:scope.onChange,
                    onFinish:scope.onFinish
                });
            }
        });
        scope.$watch('min', function(value) {
            $timeout(function(){ element.data('ionRangeSlider').update({min: value}); });
        },true);
        scope.$watch('max', function(value) {
            $timeout(function(){ element.data('ionRangeSlider').update({max: value}); });
        });
        scope.$watch('from', function(value) {
            $timeout(function(){ element.data('ionRangeSlider').update({from: value}); });
        });
        scope.$watch('disable', function(value) {
            $timeout(function(){ element.data('ionRangeSlider').update({disable: value}); });
        });
    }
}

verticalAlignMiddleDirective.$inject = ['$window'];
function verticalAlignMiddleDirective($window) {
    var directive = {
        restrict: 'A',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        var bodyHeight = angular.element(window).height();
        var formHeight = element.height();
        var marginTop = (bodyHeight / 2) - (formHeight / 2);

        if (marginTop > 0) {
            element.css('margin-top', marginTop);
        }

        angular.element($window).bind('resize', function(){
            var bodyHeight = angular.element(window).height();
            var formHeight = element.height();
            var marginTop = (bodyHeight / 2) - (formHeight / 2);

            if (marginTop > 0) {
                element.css('margin-top', marginTop);
            }

            scope.$digest();
        });
    }
}

emailAppDirective.$inject = ['$window'];
function emailAppDirective($window) {
    var directive = {
        restrict: 'A',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        var height = angular.element(window).height() - angular.element('.navbar').outerHeight() - angular.element('.breadcrumb').outerHeight() - angular.element('#footer').outerHeight() - 158;
        element.css('min-height', height);
    }
}

function gaugeJsDirective() {
    var directive = {
        restrict: 'AC',
        scope: {
            'animationTime': '=',
            'value': '=',
            'options': '=',
            'maxValue': '=',
            'gaugeType': '='
        },
        controller: controller
    };
    return directive;

    function controller($scope, $element) {
        if ($scope.gaugeType === 'donut') {
            $scope.gauge = new Donut($element[0]);
        } else {
            $scope.gauge = new Gauge($element[0]);
        }
        $element.addClass('gaugejs');
        $scope.gauge.maxValue = $scope.maxValue;
        $scope.$watchCollection('[options, value]', function(newValues){
            $scope.gauge.setOptions(newValues[0]);
            if (!isNaN(newValues[1])){
                $scope.gauge.set(newValues[1]);
            }
        });
    }
}

'use strict';
angular
    .module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

        $urlRouterProvider.otherwise('/dashboard');

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: true
        });

        $breadcrumbProvider.setOptions({
            prefixStateName: 'app.main',
            includeAbstract: true,
            template: '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
        });

        $stateProvider
            .state('app', {
                abstract: true,
                templateUrl: 'views/common/layouts/full.html',
                //page title goes here
                ncyBreadcrumb: {
                    label: 'Root',
                    skip: true
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'chart.js',
                            files: ['assets/js/libs/Chart.min.js', 'assets/js/libs/angular-chart.min.js']
                        }]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/shared.js']
                        });
                    }]
                }
            })
            .state('app.main', {
                url: '/dashboard',
                templateUrl: 'views/main.html',
                //page title goes here
                ncyBreadcrumb: {
                    label: '{{ "HOME" | translate }}'
                },
                //page subtitle goes here
                params: { subtitle: 'Welcome to ROOT powerfull Bootstrap & AngularJS UI Kit' },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: ['assets/js/libs/moment.min.js']
                            },
                            {
                                serie: true,
                                files: ['assets/js/libs/daterangepicker.min.js', 'assets/js/libs/angular-daterangepicker.min.js']
                            },
                            {
                                serie: true,
                                name: 'chart.js',
                                files: ['assets/js/libs/Chart.min.js', 'assets/js/libs/angular-chart.min.js']
                            },
                            {
                                serie: true,
                                files: ['assets/js/libs/gauge.min.js']
                            },
                            {
                                serie: true,
                                files: ['assets/js/libs/angular-toastr.tpls.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/main.js']
                        });
                    }]
                }
            })
            .state('app.main2', {
                url: '/dashboard2',
                templateUrl: 'views/main2.html',
                ncyBreadcrumb: {
                    label: 'Alternative'
                },
                params: { subtitle: 'Subtitle goes here!' },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: ['assets/js/libs/moment.min.js']
                            },
                            {
                                serie: true,
                                files: ['assets/js/libs/daterangepicker.min.js', 'assets/js/libs/angular-daterangepicker.min.js']
                            },
                            {
                                serie: true,
                                name: 'chart.js',
                                files: ['assets/js/libs/Chart.min.js', 'assets/js/libs/angular-chart.min.js']
                            },
                            {
                                serie: true,
                                files: ['assets/js/libs/gauge.min.js']
                            },
                            {
                                serie: true,
                                files: ['assets/js/libs/angular-toastr.tpls.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/main.js']
                        });
                    }]
                }
            })
            .state('appSimple', {
                abstract: true,
                templateUrl: 'views/common/layouts/simple.html'
            })

            // Additional Pages
            .state('appSimple.login', {
                url: '/login',
                templateUrl: 'views/pages/login.html'
            })
            .state('appSimple.register', {
                url: '/register',
                templateUrl: 'views/pages/register.html'
            })
            .state('appSimple.404', {
                url: '/404',
                templateUrl: 'views/pages/404.html'
            })
            .state('appSimple.500', {
                url: '/500',
                templateUrl: 'views/pages/500.html'
            })

            //UI Kits
            .state('app.uikits', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'UI Kits'
                }
            })

            //UI Kits - Invoicing App
            .state('app.uikits.invoicing', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Invoicing'
                }
            })
            .state('app.uikits.invoicing.invoice', {
                url: '/uikits/invoicing/invoice',
                templateUrl: 'views/UIkits/invoicing/invoice.html',
                ncyBreadcrumb: {
                    label: '{{ "INVOICE" | translate }}'
                }
            })

            //UI Kits - Email App
            .state('app.uikits.email', {
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Email'
                }
            })
            .state('app.uikits.email.inbox', {
                url: '/uikits/email/inbox',
                templateUrl: 'views/UIkits/email/inbox.html',
                ncyBreadcrumb: {
                    label: '{{ "INBOX" | translate }}'
                }
            })
            .state('app.uikits.email.message', {
                url: '/uikits/email/message',
                templateUrl: 'views/UIkits/email/message.html',
                ncyBreadcrumb: {
                    label: '{{ "INBOX" | translate }}'
                }
            })
            .state('app.uikits.email.compose', {
                url: '/uikits/email/compose',
                templateUrl: 'views/UIkits/email/compose.html',
                ncyBreadcrumb: {
                    label: '{{ "INBOX" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load([
                            {
                                files: ['assets/js/libs/select.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/uikits/email.js']
                        });
                    }]
                }
            });
    }]);

'use strict';

angular
    .module('app')
    .config(["$translateProvider", function($translateProvider) {
        $translateProvider
        .useSanitizeValueStrategy('escape')
        .translations('en', {
            CHOOSE_LANGUAGE:'Choose language',
            HOME:           'Home',
            DASHBOARD:      'Dashboard',
            ICONS:          'Icons',
            FORMS:          'Forms',
            WIDGETS:        'Widgets',
            BUTTONS:        'Buttons',
            NOTIFICATIONS:  'Notifications',
            TABLES:         'Tables',
            SLIDERS:        'Sliders',
            CHARTS:         'Charts',
            ACCOUNT:        'Account',
            UPDATES:        'Updates',
            MESSAGES:       'Messages',
            TASKS:          'Tasks',
            COMMENTS:       'Comments',
            SETTINGS:       'Settings',
            PROFILE:        'Profile',
            PAYMENTS:       'Payments',
            PROJECTS:       'Projects',
            LOCK_ACCOUNT:   'Lock account',
            LOGOUT:         'Logout',
            CALENDAR:       'Calendar',
            ANIMATIONS:     'Animations'
        })
        .translations('es', {
            CHOOSE_LANGUAGE:'Elige lengua',
            HOME:           'Empezar',
            DASHBOARD:      'Tablero',
            ICONS:          'Iconos',
            FORMS:          'Formas',
            WIDGETS:        'Widget',
            BUTTONS:        'Botón',
            NOTIFICATIONS:  'Notificaciones',
            TABLES:         'Mesas',
            SLIDERS:        'Deslizador',
            CHARTS:         'Gráficas',
            ACCOUNT:        'Cuenta',
            UPDATES:        'Actualizaciones',
            MESSAGES:       'Mensajes',
            TASKS:          'Tareas',
            COMMENTS:       'Comentarios',
            SETTINGS:       'Ajustes',
            PROFILE:        'Perfilar',
            PAYMENTS:       'Pagos',
            PROJECTS:       'Proyectos',
            LOCK_ACCOUNT:   'Bloqueo de cuenta',
            LOGOUT:         'Cerrar sesion',
            CALENDAR:       'Calendario',
            ANIMATIONS:     'Animaciones'
        })
        .translations('pl', {
            CHOOSE_LANGUAGE:'Wybierz język',
            HOME:           'Start',
            DASHBOARD:      'Panel',
            ICONS:          'Ikony',
            FORMS:          'Formularze',
            WIDGETS:        'Widżety',
            BUTTONS:        'Przyciski',
            NOTIFICATIONS:  'Notyfikacje',
            TABLES:         'Tabele',
            SLIDERS:        'Suwaki',
            CHARTS:         'Wykresy',
            ACCOUNT:        'Konto',
            UPDATES:        'Aktualizacje',
            MESSAGES:       'Wiadomości',
            TASKS:          'Zadania',
            COMMENTS:       'Komentarze',
            SETTINGS:       'Ustawienia',
            PROFILE:        'Profil',
            PAYMENTS:       'Płatności',
            PROJECTS:       'Projekty',
            LOCK_ACCOUNT:   'Zablokuj konto',
            LOGOUT:         'Wyloguj',
            CALENDAR:       'Kalendarz',
            ANIMATIONS:     'Animacje'
        });
        $translateProvider.preferredLanguage('en');
    }]);

//calendar.js
'use strict';
angular
    .module('app')
    .controller('CalendarCtrl', CalendarCtrl);

CalendarCtrl.$inject = ['$scope', '$compile', 'uiCalendarConfig'];
function CalendarCtrl($scope, $compile, uiCalendarConfig) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
        url: 'http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic',
        className: 'gcal-event',           // an option!
        currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
        {title: 'All Day Event',start: new Date(y, m, 1)},
        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
        {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
        callback(events);
    };

    $scope.calEventsExt = {
        color: '#f00',
        textColor: 'yellow',
        events: [
            {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
            {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
            {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
        $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
        var canAdd = 0;
        angular.forEach(sources,function(value, key){
            if(sources[key] === source){
                sources.splice(key,1);
                canAdd = 1;
            }
        });
        if(canAdd === 0){
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function() {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function(index) {
        $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
        if(uiCalendarConfig.calendars[calendar]){
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
        'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };

    $scope.changeLang = function() {
        if($scope.changeTo === 'Hungarian'){
            $scope.uiConfig.calendar.dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
            $scope.uiConfig.calendar.dayNamesShort = ['Vas', 'Hét', 'Kedd', 'Sze', 'Csüt', 'Pén', 'Szo'];
            $scope.changeTo= 'English';
        } else {
            $scope.uiConfig.calendar.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $scope.uiConfig.calendar.dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            $scope.changeTo = 'Hungarian';
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
}

//chart.js
'use strict';
angular
    .module('app')
    .controller('LineCtrl', LineCtrl)
    .controller('BarCtrl', BarCtrl)
    .controller('DoughnutCtrl', DoughnutCtrl)
    .controller('RadarCtrl', RadarCtrl)
    .controller('PieCtrl', PieCtrl)
    .controller('PolarAreaCtrl', PolarAreaCtrl)
    .controller('BaseCtrl', BaseCtrl);

LineCtrl.$inject = ['$scope'];
function LineCtrl($scope) {
    $scope.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
}

BarCtrl.$inject = ['$scope'];
function BarCtrl($scope) {
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.series = ['Series A', 'Series B'];

    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
}

DoughnutCtrl.$inject = ['$scope'];
function DoughnutCtrl($scope) {
    $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    $scope.data = [300, 500, 100];
}

RadarCtrl.$inject = ['$scope'];
function RadarCtrl($scope) {
    $scope.labels =['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

    $scope.data = [
        [65, 59, 90, 81, 56, 55, 40],
        [28, 48, 40, 19, 96, 27, 100]
    ];
}

PieCtrl.$inject = ['$scope'];
function PieCtrl($scope) {
    $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
    $scope.data = [300, 500, 100];
}

PolarAreaCtrl.$inject = ['$scope'];
function PolarAreaCtrl($scope) {
    $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'Tele Sales', 'Corporate Sales'];
    $scope.data = [300, 500, 100, 40, 120];
}

BaseCtrl.$inject = ['$scope'];
function BaseCtrl($scope) {
    $scope.labels = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales', 'Tele Sales', 'Corporate Sales'];
    $scope.data = [300, 500, 100, 40, 120];
    $scope.type = 'PolarArea';

    $scope.toggle = function () {
        $scope.type = $scope.type === 'PolarArea' ?
        'Pie' : 'PolarArea';
    };
}

//forms.js
'use strict';
angular
    .module('app')
    //UI Select controller
    .controller('selectDemoCtrl', selectDemoCtrl)
    .filter('propsFilter', propsFilter)
    //dateRangePicker controller
    .controller('dateRangeCtrl', dateRangeCtrl);

selectDemoCtrl.$inject = ['$scope', '$http', '$timeout'];
function selectDemoCtrl($scope, $http, $timeout) {

    $scope.country = {};
    $scope.countries = [ // Taken from https://gist.github.com/unceus/6501985
        {name: 'Afghanistan', code: 'AF'},
        {name: 'Åland Islands', code: 'AX'},
        {name: 'Albania', code: 'AL'},
        {name: 'Algeria', code: 'DZ'},
        {name: 'American Samoa', code: 'AS'},
        {name: 'Andorra', code: 'AD'},
        {name: 'Angola', code: 'AO'},
        {name: 'Anguilla', code: 'AI'},
        {name: 'Antarctica', code: 'AQ'},
        {name: 'Antigua and Barbuda', code: 'AG'},
        {name: 'Argentina', code: 'AR'},
        {name: 'Armenia', code: 'AM'},
        {name: 'Aruba', code: 'AW'},
        {name: 'Australia', code: 'AU'},
        {name: 'Austria', code: 'AT'},
        {name: 'Azerbaijan', code: 'AZ'},
        {name: 'Bahamas', code: 'BS'},
        {name: 'Bahrain', code: 'BH'},
        {name: 'Bangladesh', code: 'BD'},
        {name: 'Barbados', code: 'BB'},
        {name: 'Belarus', code: 'BY'},
        {name: 'Belgium', code: 'BE'},
        {name: 'Belize', code: 'BZ'},
        {name: 'Benin', code: 'BJ'},
        {name: 'Bermuda', code: 'BM'},
        {name: 'Bhutan', code: 'BT'},
        {name: 'Bolivia', code: 'BO'},
        {name: 'Bosnia and Herzegovina', code: 'BA'},
        {name: 'Botswana', code: 'BW'},
        {name: 'Bouvet Island', code: 'BV'},
        {name: 'Brazil', code: 'BR'},
        {name: 'British Indian Ocean Territory', code: 'IO'},
        {name: 'Brunei Darussalam', code: 'BN'},
        {name: 'Bulgaria', code: 'BG'},
        {name: 'Burkina Faso', code: 'BF'},
        {name: 'Burundi', code: 'BI'},
        {name: 'Cambodia', code: 'KH'},
        {name: 'Cameroon', code: 'CM'},
        {name: 'Canada', code: 'CA'},
        {name: 'Cape Verde', code: 'CV'},
        {name: 'Cayman Islands', code: 'KY'},
        {name: 'Central African Republic', code: 'CF'},
        {name: 'Chad', code: 'TD'},
        {name: 'Chile', code: 'CL'},
        {name: 'China', code: 'CN'},
        {name: 'Christmas Island', code: 'CX'},
        {name: 'Cocos (Keeling) Islands', code: 'CC'},
        {name: 'Colombia', code: 'CO'},
        {name: 'Comoros', code: 'KM'},
        {name: 'Congo', code: 'CG'},
        {name: 'Congo, The Democratic Republic of the', code: 'CD'},
        {name: 'Cook Islands', code: 'CK'},
        {name: 'Costa Rica', code: 'CR'},
        {name: 'Cote D\'Ivoire', code: 'CI'},
        {name: 'Croatia', code: 'HR'},
        {name: 'Cuba', code: 'CU'},
        {name: 'Cyprus', code: 'CY'},
        {name: 'Czech Republic', code: 'CZ'},
        {name: 'Denmark', code: 'DK'},
        {name: 'Djibouti', code: 'DJ'},
        {name: 'Dominica', code: 'DM'},
        {name: 'Dominican Republic', code: 'DO'},
        {name: 'Ecuador', code: 'EC'},
        {name: 'Egypt', code: 'EG'},
        {name: 'El Salvador', code: 'SV'},
        {name: 'Equatorial Guinea', code: 'GQ'},
        {name: 'Eritrea', code: 'ER'},
        {name: 'Estonia', code: 'EE'},
        {name: 'Ethiopia', code: 'ET'},
        {name: 'Falkland Islands (Malvinas)', code: 'FK'},
        {name: 'Faroe Islands', code: 'FO'},
        {name: 'Fiji', code: 'FJ'},
        {name: 'Finland', code: 'FI'},
        {name: 'France', code: 'FR'},
        {name: 'French Guiana', code: 'GF'},
        {name: 'French Polynesia', code: 'PF'},
        {name: 'French Southern Territories', code: 'TF'},
        {name: 'Gabon', code: 'GA'},
        {name: 'Gambia', code: 'GM'},
        {name: 'Georgia', code: 'GE'},
        {name: 'Germany', code: 'DE'},
        {name: 'Ghana', code: 'GH'},
        {name: 'Gibraltar', code: 'GI'},
        {name: 'Greece', code: 'GR'},
        {name: 'Greenland', code: 'GL'},
        {name: 'Grenada', code: 'GD'},
        {name: 'Guadeloupe', code: 'GP'},
        {name: 'Guam', code: 'GU'},
        {name: 'Guatemala', code: 'GT'},
        {name: 'Guernsey', code: 'GG'},
        {name: 'Guinea', code: 'GN'},
        {name: 'Guinea-Bissau', code: 'GW'},
        {name: 'Guyana', code: 'GY'},
        {name: 'Haiti', code: 'HT'},
        {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
        {name: 'Holy See (Vatican City State)', code: 'VA'},
        {name: 'Honduras', code: 'HN'},
        {name: 'Hong Kong', code: 'HK'},
        {name: 'Hungary', code: 'HU'},
        {name: 'Iceland', code: 'IS'},
        {name: 'India', code: 'IN'},
        {name: 'Indonesia', code: 'ID'},
        {name: 'Iran, Islamic Republic Of', code: 'IR'},
        {name: 'Iraq', code: 'IQ'},
        {name: 'Ireland', code: 'IE'},
        {name: 'Isle of Man', code: 'IM'},
        {name: 'Israel', code: 'IL'},
        {name: 'Italy', code: 'IT'},
        {name: 'Jamaica', code: 'JM'},
        {name: 'Japan', code: 'JP'},
        {name: 'Jersey', code: 'JE'},
        {name: 'Jordan', code: 'JO'},
        {name: 'Kazakhstan', code: 'KZ'},
        {name: 'Kenya', code: 'KE'},
        {name: 'Kiribati', code: 'KI'},
        {name: 'Korea, Democratic People\'s Republic of', code: 'KP'},
        {name: 'Korea, Republic of', code: 'KR'},
        {name: 'Kuwait', code: 'KW'},
        {name: 'Kyrgyzstan', code: 'KG'},
        {name: 'Lao People\'s Democratic Republic', code: 'LA'},
        {name: 'Latvia', code: 'LV'},
        {name: 'Lebanon', code: 'LB'},
        {name: 'Lesotho', code: 'LS'},
        {name: 'Liberia', code: 'LR'},
        {name: 'Libyan Arab Jamahiriya', code: 'LY'},
        {name: 'Liechtenstein', code: 'LI'},
        {name: 'Lithuania', code: 'LT'},
        {name: 'Luxembourg', code: 'LU'},
        {name: 'Macao', code: 'MO'},
        {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
        {name: 'Madagascar', code: 'MG'},
        {name: 'Malawi', code: 'MW'},
        {name: 'Malaysia', code: 'MY'},
        {name: 'Maldives', code: 'MV'},
        {name: 'Mali', code: 'ML'},
        {name: 'Malta', code: 'MT'},
        {name: 'Marshall Islands', code: 'MH'},
        {name: 'Martinique', code: 'MQ'},
        {name: 'Mauritania', code: 'MR'},
        {name: 'Mauritius', code: 'MU'},
        {name: 'Mayotte', code: 'YT'},
        {name: 'Mexico', code: 'MX'},
        {name: 'Micronesia, Federated States of', code: 'FM'},
        {name: 'Moldova, Republic of', code: 'MD'},
        {name: 'Monaco', code: 'MC'},
        {name: 'Mongolia', code: 'MN'},
        {name: 'Montserrat', code: 'MS'},
        {name: 'Morocco', code: 'MA'},
        {name: 'Mozambique', code: 'MZ'},
        {name: 'Myanmar', code: 'MM'},
        {name: 'Namibia', code: 'NA'},
        {name: 'Nauru', code: 'NR'},
        {name: 'Nepal', code: 'NP'},
        {name: 'Netherlands', code: 'NL'},
        {name: 'Netherlands Antilles', code: 'AN'},
        {name: 'New Caledonia', code: 'NC'},
        {name: 'New Zealand', code: 'NZ'},
        {name: 'Nicaragua', code: 'NI'},
        {name: 'Niger', code: 'NE'},
        {name: 'Nigeria', code: 'NG'},
        {name: 'Niue', code: 'NU'},
        {name: 'Norfolk Island', code: 'NF'},
        {name: 'Northern Mariana Islands', code: 'MP'},
        {name: 'Norway', code: 'NO'},
        {name: 'Oman', code: 'OM'},
        {name: 'Pakistan', code: 'PK'},
        {name: 'Palau', code: 'PW'},
        {name: 'Palestinian Territory, Occupied', code: 'PS'},
        {name: 'Panama', code: 'PA'},
        {name: 'Papua New Guinea', code: 'PG'},
        {name: 'Paraguay', code: 'PY'},
        {name: 'Peru', code: 'PE'},
        {name: 'Philippines', code: 'PH'},
        {name: 'Pitcairn', code: 'PN'},
        {name: 'Poland', code: 'PL'},
        {name: 'Portugal', code: 'PT'},
        {name: 'Puerto Rico', code: 'PR'},
        {name: 'Qatar', code: 'QA'},
        {name: 'Reunion', code: 'RE'},
        {name: 'Romania', code: 'RO'},
        {name: 'Russian Federation', code: 'RU'},
        {name: 'Rwanda', code: 'RW'},
        {name: 'Saint Helena', code: 'SH'},
        {name: 'Saint Kitts and Nevis', code: 'KN'},
        {name: 'Saint Lucia', code: 'LC'},
        {name: 'Saint Pierre and Miquelon', code: 'PM'},
        {name: 'Saint Vincent and the Grenadines', code: 'VC'},
        {name: 'Samoa', code: 'WS'},
        {name: 'San Marino', code: 'SM'},
        {name: 'Sao Tome and Principe', code: 'ST'},
        {name: 'Saudi Arabia', code: 'SA'},
        {name: 'Senegal', code: 'SN'},
        {name: 'Serbia and Montenegro', code: 'CS'},
        {name: 'Seychelles', code: 'SC'},
        {name: 'Sierra Leone', code: 'SL'},
        {name: 'Singapore', code: 'SG'},
        {name: 'Slovakia', code: 'SK'},
        {name: 'Slovenia', code: 'SI'},
        {name: 'Solomon Islands', code: 'SB'},
        {name: 'Somalia', code: 'SO'},
        {name: 'South Africa', code: 'ZA'},
        {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
        {name: 'Spain', code: 'ES'},
        {name: 'Sri Lanka', code: 'LK'},
        {name: 'Sudan', code: 'SD'},
        {name: 'Suriname', code: 'SR'},
        {name: 'Svalbard and Jan Mayen', code: 'SJ'},
        {name: 'Swaziland', code: 'SZ'},
        {name: 'Sweden', code: 'SE'},
        {name: 'Switzerland', code: 'CH'},
        {name: 'Syrian Arab Republic', code: 'SY'},
        {name: 'Taiwan, Province of China', code: 'TW'},
        {name: 'Tajikistan', code: 'TJ'},
        {name: 'Tanzania, United Republic of', code: 'TZ'},
        {name: 'Thailand', code: 'TH'},
        {name: 'Timor-Leste', code: 'TL'},
        {name: 'Togo', code: 'TG'},
        {name: 'Tokelau', code: 'TK'},
        {name: 'Tonga', code: 'TO'},
        {name: 'Trinidad and Tobago', code: 'TT'},
        {name: 'Tunisia', code: 'TN'},
        {name: 'Turkey', code: 'TR'},
        {name: 'Turkmenistan', code: 'TM'},
        {name: 'Turks and Caicos Islands', code: 'TC'},
        {name: 'Tuvalu', code: 'TV'},
        {name: 'Uganda', code: 'UG'},
        {name: 'Ukraine', code: 'UA'},
        {name: 'United Arab Emirates', code: 'AE'},
        {name: 'United Kingdom', code: 'GB'},
        {name: 'United States', code: 'US'},
        {name: 'United States Minor Outlying Islands', code: 'UM'},
        {name: 'Uruguay', code: 'UY'},
        {name: 'Uzbekistan', code: 'UZ'},
        {name: 'Vanuatu', code: 'VU'},
        {name: 'Venezuela', code: 'VE'},
        {name: 'Vietnam', code: 'VN'},
        {name: 'Virgin Islands, British', code: 'VG'},
        {name: 'Virgin Islands, U.S.', code: 'VI'},
        {name: 'Wallis and Futuna', code: 'WF'},
        {name: 'Western Sahara', code: 'EH'},
        {name: 'Yemen', code: 'YE'},
        {name: 'Zambia', code: 'ZM'},
        {name: 'Zimbabwe', code: 'ZW'}
    ];

    $scope.someGroupFn = function (item){

        if (item.name[0] >= 'A' && item.name[0] <= 'M'){
            return 'From A - M';
        }

        if (item.name[0] >= 'N' && item.name[0] <= 'Z'){
            return 'From N - Z';
        }
    };

    $scope.personAsync = {selected : 'wladimir@email.com'};
    $scope.peopleAsync = [];

    $timeout(function(){
        $scope.peopleAsync = [
            { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
            { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
            { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
            { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
            { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
            { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
            { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
            { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
            { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
            { name: 'Nicolás',   email: 'nicole@email.com',    age: 43, country: 'Colombia' }
        ];
    },3000);

    $scope.counter = 0;
    $scope.someFunction = function (item, model){
        $scope.counter++;
        $scope.eventResult = {item: item, model: model};
    };

    $scope.person = {};
    $scope.people = [
        { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
        { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
        { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
        { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
        { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
        { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
        { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
        { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
        { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
        { name: 'Nicolás',   email: 'nicolas@email.com',    age: 43, country: 'Colombia' }
    ];

    $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];

    $scope.multipleDemo = {};
    $scope.multipleDemo.colors = ['Blue','Red'];
    $scope.multipleDemo.selectedPeople = [$scope.people[5], $scope.people[4]];
    $scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];
    $scope.multipleDemo.selectedPeopleSimple = ['samantha@email.com','wladimir@email.com'];


    $scope.address = {};
    $scope.refreshAddresses = function(address) {
        var params = {address: address, sensor: false};
        return $http.get(
            'http://maps.googleapis.com/maps/api/geocode/json',
            {params: params}
        ).then(function(response) {
            $scope.addresses = response.data.results;
        });
    };

    $scope.country = {};
    $scope.countries = [ // Taken from https://gist.github.com/unceus/6501985
        {name: 'Afghanistan', code: 'AF'},
        {name: 'Åland Islands', code: 'AX'},
        {name: 'Albania', code: 'AL'},
        {name: 'Algeria', code: 'DZ'},
        {name: 'American Samoa', code: 'AS'},
        {name: 'Andorra', code: 'AD'},
        {name: 'Angola', code: 'AO'},
        {name: 'Anguilla', code: 'AI'},
        {name: 'Antarctica', code: 'AQ'},
        {name: 'Antigua and Barbuda', code: 'AG'},
        {name: 'Argentina', code: 'AR'},
        {name: 'Armenia', code: 'AM'},
        {name: 'Aruba', code: 'AW'},
        {name: 'Australia', code: 'AU'},
        {name: 'Austria', code: 'AT'},
        {name: 'Azerbaijan', code: 'AZ'},
        {name: 'Bahamas', code: 'BS'},
        {name: 'Bahrain', code: 'BH'},
        {name: 'Bangladesh', code: 'BD'},
        {name: 'Barbados', code: 'BB'},
        {name: 'Belarus', code: 'BY'},
        {name: 'Belgium', code: 'BE'},
        {name: 'Belize', code: 'BZ'},
        {name: 'Benin', code: 'BJ'},
        {name: 'Bermuda', code: 'BM'},
        {name: 'Bhutan', code: 'BT'},
        {name: 'Bolivia', code: 'BO'},
        {name: 'Bosnia and Herzegovina', code: 'BA'},
        {name: 'Botswana', code: 'BW'},
        {name: 'Bouvet Island', code: 'BV'},
        {name: 'Brazil', code: 'BR'},
        {name: 'British Indian Ocean Territory', code: 'IO'},
        {name: 'Brunei Darussalam', code: 'BN'},
        {name: 'Bulgaria', code: 'BG'},
        {name: 'Burkina Faso', code: 'BF'},
        {name: 'Burundi', code: 'BI'},
        {name: 'Cambodia', code: 'KH'},
        {name: 'Cameroon', code: 'CM'},
        {name: 'Canada', code: 'CA'},
        {name: 'Cape Verde', code: 'CV'},
        {name: 'Cayman Islands', code: 'KY'},
        {name: 'Central African Republic', code: 'CF'},
        {name: 'Chad', code: 'TD'},
        {name: 'Chile', code: 'CL'},
        {name: 'China', code: 'CN'},
        {name: 'Christmas Island', code: 'CX'},
        {name: 'Cocos (Keeling) Islands', code: 'CC'},
        {name: 'Colombia', code: 'CO'},
        {name: 'Comoros', code: 'KM'},
        {name: 'Congo', code: 'CG'},
        {name: 'Congo, The Democratic Republic of the', code: 'CD'},
        {name: 'Cook Islands', code: 'CK'},
        {name: 'Costa Rica', code: 'CR'},
        {name: 'Cote D\'Ivoire', code: 'CI'},
        {name: 'Croatia', code: 'HR'},
        {name: 'Cuba', code: 'CU'},
        {name: 'Cyprus', code: 'CY'},
        {name: 'Czech Republic', code: 'CZ'},
        {name: 'Denmark', code: 'DK'},
        {name: 'Djibouti', code: 'DJ'},
        {name: 'Dominica', code: 'DM'},
        {name: 'Dominican Republic', code: 'DO'},
        {name: 'Ecuador', code: 'EC'},
        {name: 'Egypt', code: 'EG'},
        {name: 'El Salvador', code: 'SV'},
        {name: 'Equatorial Guinea', code: 'GQ'},
        {name: 'Eritrea', code: 'ER'},
        {name: 'Estonia', code: 'EE'},
        {name: 'Ethiopia', code: 'ET'},
        {name: 'Falkland Islands (Malvinas)', code: 'FK'},
        {name: 'Faroe Islands', code: 'FO'},
        {name: 'Fiji', code: 'FJ'},
        {name: 'Finland', code: 'FI'},
        {name: 'France', code: 'FR'},
        {name: 'French Guiana', code: 'GF'},
        {name: 'French Polynesia', code: 'PF'},
        {name: 'French Southern Territories', code: 'TF'},
        {name: 'Gabon', code: 'GA'},
        {name: 'Gambia', code: 'GM'},
        {name: 'Georgia', code: 'GE'},
        {name: 'Germany', code: 'DE'},
        {name: 'Ghana', code: 'GH'},
        {name: 'Gibraltar', code: 'GI'},
        {name: 'Greece', code: 'GR'},
        {name: 'Greenland', code: 'GL'},
        {name: 'Grenada', code: 'GD'},
        {name: 'Guadeloupe', code: 'GP'},
        {name: 'Guam', code: 'GU'},
        {name: 'Guatemala', code: 'GT'},
        {name: 'Guernsey', code: 'GG'},
        {name: 'Guinea', code: 'GN'},
        {name: 'Guinea-Bissau', code: 'GW'},
        {name: 'Guyana', code: 'GY'},
        {name: 'Haiti', code: 'HT'},
        {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
        {name: 'Holy See (Vatican City State)', code: 'VA'},
        {name: 'Honduras', code: 'HN'},
        {name: 'Hong Kong', code: 'HK'},
        {name: 'Hungary', code: 'HU'},
        {name: 'Iceland', code: 'IS'},
        {name: 'India', code: 'IN'},
        {name: 'Indonesia', code: 'ID'},
        {name: 'Iran, Islamic Republic Of', code: 'IR'},
        {name: 'Iraq', code: 'IQ'},
        {name: 'Ireland', code: 'IE'},
        {name: 'Isle of Man', code: 'IM'},
        {name: 'Israel', code: 'IL'},
        {name: 'Italy', code: 'IT'},
        {name: 'Jamaica', code: 'JM'},
        {name: 'Japan', code: 'JP'},
        {name: 'Jersey', code: 'JE'},
        {name: 'Jordan', code: 'JO'},
        {name: 'Kazakhstan', code: 'KZ'},
        {name: 'Kenya', code: 'KE'},
        {name: 'Kiribati', code: 'KI'},
        {name: 'Korea, Democratic People\'s Republic of', code: 'KP'},
        {name: 'Korea, Republic of', code: 'KR'},
        {name: 'Kuwait', code: 'KW'},
        {name: 'Kyrgyzstan', code: 'KG'},
        {name: 'Lao People\'s Democratic Republic', code: 'LA'},
        {name: 'Latvia', code: 'LV'},
        {name: 'Lebanon', code: 'LB'},
        {name: 'Lesotho', code: 'LS'},
        {name: 'Liberia', code: 'LR'},
        {name: 'Libyan Arab Jamahiriya', code: 'LY'},
        {name: 'Liechtenstein', code: 'LI'},
        {name: 'Lithuania', code: 'LT'},
        {name: 'Luxembourg', code: 'LU'},
        {name: 'Macao', code: 'MO'},
        {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
        {name: 'Madagascar', code: 'MG'},
        {name: 'Malawi', code: 'MW'},
        {name: 'Malaysia', code: 'MY'},
        {name: 'Maldives', code: 'MV'},
        {name: 'Mali', code: 'ML'},
        {name: 'Malta', code: 'MT'},
        {name: 'Marshall Islands', code: 'MH'},
        {name: 'Martinique', code: 'MQ'},
        {name: 'Mauritania', code: 'MR'},
        {name: 'Mauritius', code: 'MU'},
        {name: 'Mayotte', code: 'YT'},
        {name: 'Mexico', code: 'MX'},
        {name: 'Micronesia, Federated States of', code: 'FM'},
        {name: 'Moldova, Republic of', code: 'MD'},
        {name: 'Monaco', code: 'MC'},
        {name: 'Mongolia', code: 'MN'},
        {name: 'Montserrat', code: 'MS'},
        {name: 'Morocco', code: 'MA'},
        {name: 'Mozambique', code: 'MZ'},
        {name: 'Myanmar', code: 'MM'},
        {name: 'Namibia', code: 'NA'},
        {name: 'Nauru', code: 'NR'},
        {name: 'Nepal', code: 'NP'},
        {name: 'Netherlands', code: 'NL'},
        {name: 'Netherlands Antilles', code: 'AN'},
        {name: 'New Caledonia', code: 'NC'},
        {name: 'New Zealand', code: 'NZ'},
        {name: 'Nicaragua', code: 'NI'},
        {name: 'Niger', code: 'NE'},
        {name: 'Nigeria', code: 'NG'},
        {name: 'Niue', code: 'NU'},
        {name: 'Norfolk Island', code: 'NF'},
        {name: 'Northern Mariana Islands', code: 'MP'},
        {name: 'Norway', code: 'NO'},
        {name: 'Oman', code: 'OM'},
        {name: 'Pakistan', code: 'PK'},
        {name: 'Palau', code: 'PW'},
        {name: 'Palestinian Territory, Occupied', code: 'PS'},
        {name: 'Panama', code: 'PA'},
        {name: 'Papua New Guinea', code: 'PG'},
        {name: 'Paraguay', code: 'PY'},
        {name: 'Peru', code: 'PE'},
        {name: 'Philippines', code: 'PH'},
        {name: 'Pitcairn', code: 'PN'},
        {name: 'Poland', code: 'PL'},
        {name: 'Portugal', code: 'PT'},
        {name: 'Puerto Rico', code: 'PR'},
        {name: 'Qatar', code: 'QA'},
        {name: 'Reunion', code: 'RE'},
        {name: 'Romania', code: 'RO'},
        {name: 'Russian Federation', code: 'RU'},
        {name: 'Rwanda', code: 'RW'},
        {name: 'Saint Helena', code: 'SH'},
        {name: 'Saint Kitts and Nevis', code: 'KN'},
        {name: 'Saint Lucia', code: 'LC'},
        {name: 'Saint Pierre and Miquelon', code: 'PM'},
        {name: 'Saint Vincent and the Grenadines', code: 'VC'},
        {name: 'Samoa', code: 'WS'},
        {name: 'San Marino', code: 'SM'},
        {name: 'Sao Tome and Principe', code: 'ST'},
        {name: 'Saudi Arabia', code: 'SA'},
        {name: 'Senegal', code: 'SN'},
        {name: 'Serbia and Montenegro', code: 'CS'},
        {name: 'Seychelles', code: 'SC'},
        {name: 'Sierra Leone', code: 'SL'},
        {name: 'Singapore', code: 'SG'},
        {name: 'Slovakia', code: 'SK'},
        {name: 'Slovenia', code: 'SI'},
        {name: 'Solomon Islands', code: 'SB'},
        {name: 'Somalia', code: 'SO'},
        {name: 'South Africa', code: 'ZA'},
        {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
        {name: 'Spain', code: 'ES'},
        {name: 'Sri Lanka', code: 'LK'},
        {name: 'Sudan', code: 'SD'},
        {name: 'Suriname', code: 'SR'},
        {name: 'Svalbard and Jan Mayen', code: 'SJ'},
        {name: 'Swaziland', code: 'SZ'},
        {name: 'Sweden', code: 'SE'},
        {name: 'Switzerland', code: 'CH'},
        {name: 'Syrian Arab Republic', code: 'SY'},
        {name: 'Taiwan, Province of China', code: 'TW'},
        {name: 'Tajikistan', code: 'TJ'},
        {name: 'Tanzania, United Republic of', code: 'TZ'},
        {name: 'Thailand', code: 'TH'},
        {name: 'Timor-Leste', code: 'TL'},
        {name: 'Togo', code: 'TG'},
        {name: 'Tokelau', code: 'TK'},
        {name: 'Tonga', code: 'TO'},
        {name: 'Trinidad and Tobago', code: 'TT'},
        {name: 'Tunisia', code: 'TN'},
        {name: 'Turkey', code: 'TR'},
        {name: 'Turkmenistan', code: 'TM'},
        {name: 'Turks and Caicos Islands', code: 'TC'},
        {name: 'Tuvalu', code: 'TV'},
        {name: 'Uganda', code: 'UG'},
        {name: 'Ukraine', code: 'UA'},
        {name: 'United Arab Emirates', code: 'AE'},
        {name: 'United Kingdom', code: 'GB'},
        {name: 'United States', code: 'US'},
        {name: 'United States Minor Outlying Islands', code: 'UM'},
        {name: 'Uruguay', code: 'UY'},
        {name: 'Uzbekistan', code: 'UZ'},
        {name: 'Vanuatu', code: 'VU'},
        {name: 'Venezuela', code: 'VE'},
        {name: 'Vietnam', code: 'VN'},
        {name: 'Virgin Islands, British', code: 'VG'},
        {name: 'Virgin Islands, U.S.', code: 'VI'},
        {name: 'Wallis and Futuna', code: 'WF'},
        {name: 'Western Sahara', code: 'EH'},
        {name: 'Yemen', code: 'YE'},
        {name: 'Zambia', code: 'ZM'},
        {name: 'Zimbabwe', code: 'ZW'}
    ];
}

function propsFilter() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
}

dateRangeCtrl.$inject = ['$scope'];
function dateRangeCtrl($scope) {
    $scope.date = {
        startDate: moment().subtract(5, 'days'),
        endDate: moment()
    };
    $scope.opts = {
        drops: 'up',
        opens: 'left',
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract('days', 1), moment().subtract('days', 1)],
            'Last 7 days': [moment().subtract('days', 7), moment()],
            'Last 30 days': [moment().subtract('days', 30), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        }
    };

    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        //console.log('New date set: ', newDate);
    }, false);
}

//main.js
'use strict';
angular
    .module('app')
    .controller('toastrWelcome', toastrWelcome)
    .controller('trafficDemoCtrl', trafficDemoCtrl)
    .controller('socialBoxCtrl', socialBoxCtrl)
    .controller('dateRangeCtrl', dateRangeCtrl)
    .controller('sparklineChartCtrl', sparklineChartCtrl)
    .controller('gaugeCtrl', gaugeCtrl)
    .controller('barChartCtrl', barChartCtrl)
    .controller('gaugeJSDemoCtrl', gaugeJSDemoCtrl)
    .controller('horizontalBarsCtrl', horizontalBarsCtrl)
    .controller('horizontalBarsType2Ctrl', horizontalBarsType2Ctrl)
    .controller('usersTableCtrl', usersTableCtrl)
    .controller('clientsTableCtrl', clientsTableCtrl)
    .controller('cardChartCtrl1', cardChartCtrl1)
    .controller('cardChartCtrl2', cardChartCtrl2)
    .controller('cardChartCtrl3', cardChartCtrl3)
    .controller('cardChartCtrl4', cardChartCtrl4);


toastrWelcome.$inject = ['$scope', 'toastr'];
function toastrWelcome($scope, toastr) {
    toastr.info('Bootstrap 4 & AngularJS UI Kit', 'Welcome to ROOT Admin', {
        closeButton: true,
        progressBar: true,
    });
}

//convert Hex to RGBA
function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

trafficDemoCtrl.$inject = ['$scope'];
function trafficDemoCtrl($scope){

    function random(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    var elements = 27;
    var data1 = [];
    var data2 = [];
    var data3 = [];

    for (var i = 0; i <= elements; i++) {
        data1.push(random(50,200));
        data2.push(random(80,100));
        data3.push(65);
    }

    $scope.labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
    $scope.series = ['Current', 'Previous', 'BEP'];
    $scope.data = [ data1, data2, data3];
    $scope.colours = [{
        fillColor: convertHex(brandInfo,10),
        strokeColor: brandInfo,
        pointColor: brandInfo,
        pointStrokeColor: 'transparent'
    }, {
        fillColor: 'transparent',
        strokeColor: brandSuccess,
        pointColor: brandSuccess,
        pointStrokeColor: 'transparent'
    },{
        fillColor: 'transparent',
        strokeColor: brandDanger,
        pointColor: brandDanger,
        pointStrokeColor: 'transparent'
    }];
    $scope.options = {
        tooltipFillColor: '#2a2c36',
        tooltipTitleFontSize: 12,
        tooltipCornerRadius: 0,
        responsive: true,
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
        scaleOverride: true,
        scaleSteps: 5,
        scaleStepWidth: Math.ceil(250 / 5),
        //bezierCurve : false,
        scaleStartValue: 0,
        pointDot : false,
    };
}

dateRangeCtrl.$inject = ['$scope'];
function dateRangeCtrl($scope) {
    $scope.date = {
       startDate: moment().subtract(5, 'days'),
       endDate: moment()
   };
   $scope.opts = {
        drops: 'down',
        opens: 'left',
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 days': [moment().subtract(7, 'days'), moment()],
            'Last 30 days': [moment().subtract(30, 'days'), moment()],
            'This month': [moment().startOf('month'), moment().endOf('month')]
        }
    };

    //Watch for date changes
    $scope.$watch('date', function(newDate) {
        //console.log('New date set: ', newDate);
    }, false);

    function gd(year, month, day) {
        return new Date(year, month - 1, day).getTime();
    }
}

socialBoxCtrl.$inject = ['$scope'];
function socialBoxCtrl($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data1 = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.data2 = [
        [1, 13, 9, 17, 34, 41, 38]
    ];
    $scope.data3 = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        pointHitDetectionRadius : 0,
        showScale: false,
        scaleLineWidth: 0.001,
        scaleShowLabels : false,
        scaleShowGridLines : false,
        pointDot : false,
        showTooltips: false
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.1)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
}

sparklineChartCtrl.$inject = ['$scope'];
function sparklineChartCtrl($scope) {
    $scope.labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    $scope.data1 = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.data2 = [
        [1, 13, 9, 17, 34, 41, 38]
    ];
    $scope.data3 = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        pointHitDetectionRadius : 0,
        showScale: false,
        scaleLineWidth: 0.001,
        scaleShowLabels : false,
        scaleShowGridLines : false,
        pointDot : false,
        showTooltips: false
    };
    $scope.default = [{
        fillColor: 'transparent',
        strokeColor: '#d1d4d7',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.primary = [{
        fillColor: 'transparent',
        strokeColor: brandPrimary,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.info = [{
        fillColor: 'transparent',
        strokeColor: brandInfo,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.danger = [{
        fillColor: 'transparent',
        strokeColor: brandDanger,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.warning = [{
        fillColor: 'transparent',
        strokeColor: brandWarning,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
    $scope.success = [{
        fillColor: 'transparent',
        strokeColor: brandSuccess,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)'
    }];
}

horizontalBarsCtrl.$inject = ['$scope'];
function horizontalBarsCtrl($scope) {

    $scope.data = [
        {
            day: 'Monday',    new: 34, recurring: 78
        },
        {
            day: 'Tuesday',   new: 56, recurring: 94
        },
        {
            day: 'Wednesday', new: 12, recurring: 67
        },
        {
            day: 'Thursday',  new: 43, recurring: 91
        },
        {
            day: 'Friday',    new: 22, recurring: 73
        },
        {
            day: 'Saturday',  new: 53, recurring: 82
        },
        {
            day: 'Sunday',    new: 9,  recurring: 69
        }
    ];
}

horizontalBarsType2Ctrl.$inject = ['$scope'];
function horizontalBarsType2Ctrl($scope) {

    $scope.gender = [
        {
            title: 'Male',
            icon: 'icon-user',
            value: 43
        },
        {
            title: 'Female',
            icon: 'icon-user-female',
            value: 37
        },
    ];

    $scope.source = [
        {
            title: 'Organic Search',
            icon: 'icon-globe',
            value: 191235,
            percent: 56
        },
        {
            title: 'Facebook',
            icon: 'icon-social-facebook',
            value: 51223,
            percent: 15
        },
        {
            title: 'Twitter',
            icon: 'icon-social-twitter',
            value: 37564,
            percent: 11
        },
        {
            title: 'LinkedIn',
            icon: 'icon-social-linkedin',
            value: 27319,
            percent: 8
        }
    ];
}

usersTableCtrl.$inject = ['$scope', '$timeout'];
function usersTableCtrl($scope, $timeout) {

    $scope.users = [
        {
            avatar: '1.jpg',
            status: 'active',
            name: 'Yiorgos Avraamu',
            new: true,
            registered: 'Jan 1, 2015',
            country: 'USA',
            flag: 'USA.png',
            usage: '50',
            period: 'Jun 11, 2015 - Jul 10, 2015',
            payment: 'mastercard',
            activity: '10 sec ago',
            satisfaction: '48'
        },
        {
            avatar: '2.jpg',
            status: 'busy',
            name: 'Avram Tarasios',
            new: false,
            registered: 'Jan 1, 2015',
            country: 'Brazil',
            flag: 'Brazil.png',
            usage: '10',
            period: 'Jun 11, 2015 - Jul 10, 2015',
            payment: 'visa',
            activity: '5 minutes ago',
            satisfaction: '61'
        },
        {
            avatar: '3.jpg',
            status: 'away',
            name: 'Quintin Ed',
            new: true,
            registered: 'Jan 1, 2015',
            country: 'India',
            flag: 'India.png',
            usage: '74',
            period: 'Jun 11, 2015 - Jul 10, 2015',
            payment: 'stripe',
            activity: '1 hour ago',
            satisfaction: '33'
        },
        {
            avatar: '4.jpg',
            status: 'offline',
            name: 'Enéas Kwadwo',
            new: true,
            registered: 'Jan 1, 2015',
            country: 'France',
            flag: 'France.png',
            usage: '98',
            period: 'Jun 11, 2015 - Jul 10, 2015',
            payment: 'paypal',
            activity: 'Last month',
            satisfaction: '23'
        },
        {
            avatar: '5.jpg',
            status: 'active',
            name: 'Agapetus Tadeáš',
            new: true,
            registered: 'Jan 1, 2015',
            country: 'Spain',
            flag: 'Spain.png',
            usage: '22',
            period: 'Jun 11, 2015 - Jul 10, 2015',
            payment: 'google',
            activity: 'Last week',
            satisfaction: '78'
        },
        {
            avatar: '6.jpg',
            status: 'busy',
            name: 'Friderik Dávid',
            new: true,
            registered: 'Jan 1, 2015',
            country: 'Poland',
            flag: 'Poland.png',
            usage: '43',
            period: 'Jun 11, 2015 - Jul 10, 2015',
            payment: 'amex',
            activity: 'Yesterday',
            satisfaction: '11'
        }
    ];


    function random(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    $scope.gauge = {
        animationTime: 10,
        value: random(0,100),
        maxValue: 100,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.08,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandInfo,
            // Colors
            colorStop: brandInfo,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };
}

clientsTableCtrl.$inject = ['$scope', '$timeout'];
function clientsTableCtrl($scope, $timeout) {

    $scope.users = [
        {
            avatar: '1.jpg',
            status: 'active',
            name: 'Yiorgos Avraamu',
            registered: 'Jan 1, 2015',
            activity: '10 sec ago',
            transactions: 189,
            comments: 72
        },
        {
            avatar: '2.jpg',
            status: 'busy',
            name: 'Avram Tarasios',
            registered: 'Jan 1, 2015',
            activity: '5 minutes ago',
            transactions: 156,
            comments: 76
        },
        {
            avatar: '3.jpg',
            status: 'away',
            name: 'Quintin Ed',
            registered: 'Jan 1, 2015',
            activity: '1 hour ago',
            transactions: 189,
            comments: 72
        },
        {
            avatar: '4.jpg',
            status: 'offline',
            name: 'Enéas Kwadwo',
            registered: 'Jan 1, 2015',
            activity: 'Last month',
            transactions: 189,
            comments: 72
        },
        {
            avatar: '5.jpg',
            status: 'active',
            name: 'Agapetus Tadeáš',
            registered: 'Jan 1, 2015',
            activity: 'Last week',
            transactions: 189,
            comments: 72
        },
        {
            avatar: '6.jpg',
            status: 'busy',
            name: 'Friderik Dávid',
            registered: 'Jan 1, 2015',
            activity: 'Yesterday',
            transactions: 189,
            comments: 72
        }
    ];
}


gaugeCtrl.$inject = ['$scope'];
function gaugeCtrl($scope) {
    function random(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    $scope.gauge1 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandInfo,
            // Colors
            colorStop: brandInfo,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge2 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandSuccess,
            // Colors
            colorStop: brandSuccess,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge3 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandWarning,
            // Colors
            colorStop: brandWarning,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge4 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.05,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandDanger,
            // Colors
            colorStop: brandDanger,
            // just experiment with them
            strokeColor: '#d1d4d7',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };
}

function random(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

barChartCtrl.$inject = ['$scope'];
function barChartCtrl($scope) {

    var elements = 16;
    var labels = [];
    var data = [];
    var data1 = [];
    var data2 = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40,100));
        data1.push(random(20,100));
        data2.push(random(60,100));
    }

    $scope.labels = labels;

    $scope.data = [data];
    $scope.data1 = [data1];
    $scope.data2 = [data2];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barStrokeWidth : 0,
        barBackground: 'rgba(221, 224, 229, 1)',

        // pointDot :false,
        // scaleLineColor: 'transparent',
    };

    $scope.colours = [{
        fillColor : brandInfo,
		strokeColor : 'rgba(0,0,0,1)',
		highlightFill: '#818a91',
        pointStrokeColor: '#000'
    }];
}

gaugeJSDemoCtrl.$inject = ['$scope', '$timeout'];
function gaugeJSDemoCtrl($scope, $timeout) {

    function random(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    $scope.gauge1 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandInfo,
            // Colors
            colorStop: brandInfo,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge2 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandSuccess,
            // Colors
            colorStop: brandSuccess,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge3 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandWarning,
            // Colors
            colorStop: brandWarning,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge4 = {
        animationTime: 10,
        value: random(0,3000),
        maxValue: 3000,
        gaugeType: 'donut',
        options: {
            lines: 12,
            // The number of lines to draw
            angle: 0.5,
            // The length of each line
            lineWidth: 0.1,
            // The line thickness
            pointer: {
                length: 0.09,
                // The radius of the inner circle
                strokeWidth: 0.0035,
                // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',
            // If true, the pointer will not go past the end of the gauge
            colorStart: brandDanger,
            // Colors
            colorStop: brandDanger,
            // just experiment with them
            strokeColor: '#E0E0E0',
            // to see which ones work best for you
            generateGradient: true,
            responsive: true
        }
    };
}

cardChartCtrl1.$inject = ['$scope'];
function cardChartCtrl1($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.options = {
        showScale: true,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        scaleFontSize: 5,
        scaleLineColor: 'rgba(0,0,0,0)',
        scaleFontColor: 'rgba(0,0,0,0)'
    };
    $scope.colours = [{
        fillColor: brandPrimary,
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl2.$inject = ['$scope'];
function cardChartCtrl2($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [1, 18, 9, 17, 34, 22, 11]
    ];
    $scope.data3 = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        showScale: true,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        scaleFontSize: 5,
        scaleLineColor: 'rgba(0,0,0,0)',
        scaleFontColor: 'rgba(0,0,0,0)',
        bezierCurve : false,
    };
    $scope.colours = [{
        fillColor: brandInfo,
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl3.$inject = ['$scope'];
function cardChartCtrl3($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        showScale: false,
        scaleShowGridLines: false,
        pointDot: false,
        pointDotStrokeWidth : 0,
        pointDotRadius : 0,
        scaleGridLineWidth : 0,
        //pointHitDetectionRadius : 0,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.2)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

function random(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

cardChartCtrl4.$inject = ['$scope'];
function cardChartCtrl4($scope) {

    var elements = 16;
    var labels = [];
    var data = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40,100));
    }

    $scope.labels = labels;

    $scope.data = [data];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barShowStroke : false,
        barStrokeWidth : 0,
        scaleGridLineWidth : 0,
        barValueSpacing : 3,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.3)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(255,255,255,.55)',
        highlightStroke: 'rgba(255,255,255,.55)',
        tooltipCornerRadius: 0,
    }];
}

//notifications.js
'use strict';
angular
    .module('app')
    .factory('randomQuotes', randomQuotes)
    //toastr controller
    .controller('toastrDemoCtrl', toastrDemoCtrl);

function randomQuotes() {
    var quotes = [
        {
            title: 'Come to Freenode',
            message: 'We rock at <em>#angularjs</em>',
            options: {
                allowHtml: true
            }
        },
        {
            title: 'Looking for bootstrap?',
            message: 'Try ui-bootstrap out!'
        },
        {
            title: 'Wants a better router?',
            message: 'We have you covered with ui-router'
        },
        {
            title: 'Angular 2',
            message: 'Is gonna rock the world'
        },
        {
            title: null,
            message: 'Titles are not always needed'
        },
        {
            title: null,
            message: 'Toastr rock!'
        },
        {
            title: 'What about nice html?',
            message: '<strong>Sure you <em>can!</em></strong>',
            options: {
                allowHtml: true
            }
        },
        {
            title: 'Ionic is <em>cool</em>',
            message: 'Best mobile framework ever',
            options: {
                allowHtml: true
            }
        }
    ];

    var types = ['success', 'error', 'info', 'warning'];

    return {
        quotes: quotes,
        types: types
    };
}
toastrDemoCtrl.$inject = ['$scope', '$templateCache', '$templateRequest', 'randomQuotes', 'toastr', 'toastrConfig'];
function toastrDemoCtrl($scope, $templateCache, $templateRequest, randomQuotes, toastr, toastrConfig) {
    var openedToasts = [];

    $scope.toast = {
        title: '',
        message: ''
    };

    $scope.options = {
        autoDismiss: false,
        position: 'toast-top-right',
        type: 'success',
        timeout: '5000',
        extendedTimeout: '1000',
        html: false,
        closeButton: false,
        tapToDismiss: true,
        progressBar: false,
        closeHtml: '<button>&times;</button>',
        newestOnTop: true,
        maxOpened: 0,
        preventDuplicates: false,
        preventOpenDuplicates: false
    };

    $scope.$watchCollection('options', function(newValue) {
        toastrConfig.autoDismiss = newValue.autoDismiss;
        toastrConfig.allowHtml = newValue.html;
        toastrConfig.extendedTimeOut = parseInt(newValue.extendedTimeout, 10);
        toastrConfig.positionClass = newValue.position;
        toastrConfig.timeOut = parseInt(newValue.timeout, 10);
        toastrConfig.closeButton = newValue.closeButton;
        toastrConfig.tapToDismiss = newValue.tapToDismiss;
        toastrConfig.progressBar = newValue.progressBar;
        toastrConfig.closeHtml = newValue.closeHtml;
        toastrConfig.newestOnTop = newValue.newestOnTop;
        toastrConfig.maxOpened = newValue.maxOpened;
        toastrConfig.preventDuplicates = newValue.preventDuplicates;
        toastrConfig.preventOpenDuplicates = newValue.preventOpenDuplicates;
        if (newValue.customTemplate) {
            toastrConfig.templates.toast = 'custom';
        }
    });

    $scope.$watch('toast.customTemplate', function(newVal) {
        if ($templateCache.get('custom')) {
            $templateCache.remove('custom');
        }
        $templateCache.put('custom', newVal);
    });

    $scope.clearLastToast = function() {
        var toast = openedToasts.pop();
        toastr.clear(toast);
    };

    $scope.clearToasts = function() {
        toastr.clear();
    };

    $scope.openPinkToast = function() {
        openedToasts.push(toastr.info('I am totally custom!', 'Happy toast', {
            iconClass: 'toast-pink'
        }));
    };

    $scope.openRandomToast = function() {
        var type = Math.floor(Math.random() * 4);
        var quote = Math.floor(Math.random() * 7);
        var toastType = randomQuotes.types[type];
        var toastQuote = randomQuotes.quotes[quote];
        openedToasts.push(toastr[toastType](toastQuote.message, toastQuote.title, toastQuote.options));
    };

    $scope.openToast = function() {
        openedToasts.push(toastr[$scope.options.type]($scope.toast.message, $scope.toast.title));
    };
}

//shared.js
'use strict';
angular
    .module('app')
    .controller('chartsCtrl', chartsCtrl);

function random(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

chartsCtrl.$inject = ['$scope'];
function chartsCtrl($scope) {

    var elements = 16;
    var labels = [];
    var data = [];
    var data1 = [];
    var data2 = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40,100));
        data1.push(random(20,100));
        data2.push(random(60,100));
    }

    $scope.labels = labels;

    $scope.data = [data];
    $scope.data1 = [data1];
    $scope.data2 = [data2];

    $scope.options = {
        pointHitDetectionRadius : 0,
		showScale: false,
		scaleLineWidth: 0.001,
		scaleShowLabels : false,
		scaleShowGridLines : false,
		pointDot : false,
		showTooltips: false,
		responsive: true,
    };

    $scope.colours = [{
        fillColor : "rgba(0,0,0,0)",
		strokeColor : brandInfo,
		highlightFill: '#818a91',
        pointStrokeColor: '#fff'
    }];

    $scope.colours2 = [{
        fillColor : "rgba(0,0,0,0)",
		strokeColor : brandWarning,
		highlightFill: '#818a91',
        pointStrokeColor: '#fff'
    }];

    $scope.colours3 = [{
        fillColor : "rgba(0,0,0,0)",
		strokeColor : brandSuccess,
		highlightFill: '#818a91',
        pointStrokeColor: '#fff'
    }];
}

'use strict';
//sliders.js
angular
    .module('app')
    .controller('slidersDemoCtrl', slidersDemoCtrl);

slidersDemoCtrl.$inject = ['$scope'];
function slidersDemoCtrl($scope) {
    $scope.range1 = {};
    $scope.range2 = {
        options: {
            min: 100,
            max: 1000,
            from: 550
        }
    };

    $scope.range3 = {
        options: {
            type: 'double',
            grid: true,
            min: 0,
            max: 1000,
            from: 200,
            to: 800,
            prefix: '$'
        }
    };

    $scope.range4 = {
        options: {
            type: 'double',
            grid: true,
            min: -1000,
            max: 1000,
            from: -500,
            to: 500
        }
    };

    $scope.range5 = {
        options: {
            type: 'double',
            grid: true,
            min: -1000,
            max: 1000,
            from: -500,
            to: 500,
            step: 250
        }
    };

    $scope.range6 = {
        options: {
            type: 'double',
            grid: true,
            min: -12.8,
            max: 12.8,
            from: -3.2,
            to: 3.2,
            step: 0.1
        }
    };

    $scope.range7 = {
        options: {
            type: 'double',
            grid: true,
            from: 1,
            to: 5,
            values: [0, 10, 100, 1000, 10000, 100000, 1000000]
        }
    };

    $scope.range8 = {
        options: {
            grid: true,
            from: 5,
            values: [
                'zero', 'one',
                'two', 'three',
                'four', 'five',
                'six', 'seven',
                'eight', 'nine',
                'ten'
            ]
        }
    };

    $scope.range9 = {
        options: {
            grid: true,
            from: 3,
            values: [
                'January', 'February', 'March',
                'April', 'May', 'June',
                'July', 'August', 'September',
                'October', 'November', 'December'
            ]
        }
    };

    $scope.range10 = {
        options: {
            grid: true,
            min: 1000,
            max: 1000000,
            from: 100000,
            step: 1000,
            prettify_enabled: false
        }
    };

    $scope.range11 = {
        options: {
            grid: true,
            min: 1000,
            max: 1000000,
            from: 200000,
            step: 1000,
            prettify_enabled: true
        }
    };

    $scope.range12 = {
        options: {
            grid: true,
            min: 1000,
            max: 1000000,
            from: 300000,
            step: 1000,
            prettify_enabled: true,
            prettify_separator: '.'
        }
    };

    $scope.range13 = {
        options: {
            grid: true,
            min: 1000,
            max: 1000000,
            from: 400000,
            step: 1000,
            prettify_enabled: true,
            prettify: function (num) {
                return (Math.random() * num).toFixed(0);
            }
        }
    };

    $scope.range14 = {
        options: {
            type: 'double',
            grid: true,
            min: 0,
            max: 10000,
            from: 1000,
            step: 9000,
            prefix: '$'
        }
    };

    $scope.range15 = {
        options: {
            type: 'single',
            grid: true,
            min: -90,
            max: 90,
            from: 0,
            postfix: '°'
        }
    };

    $scope.range16 = {
        options: {
            grid: true,
            min: 18,
            max: 70,
            from: 30,
            prefix: 'Age ',
            max_postfix: '+'
        }
    };

    $scope.range17 = {
        options: {
            type: 'double',
            min: 100,
            max: 200,
            from: 145,
            to: 155,
            prefix: 'Weight: ',
            postfix: ' million pounds',
            decorate_both: true
        }
    };

    $scope.range18 = {
        options: {
            type: 'double',
            min: 100,
            max: 200,
            from: 145,
            to: 155,
            prefix: 'Weight: ',
            postfix: ' million pounds',
            decorate_both: false
        }
    };

    $scope.range19 = {
        options: {
            type: 'double',
            min: 100,
            max: 200,
            from: 148,
            to: 152,
            prefix: 'Weight: ',
            postfix: ' million pounds',
            values_separator: ' → '
        }
    };

    $scope.range20 = {
        options: {
            type: 'double',
            min: 100,
            max: 200,
            from: 148,
            to: 152,
            prefix: 'Range: ',
            postfix: ' light years',
            decorate_both: false,
            values_separator: ' to '
        }
    };

    $scope.range21 = {
        options: {
            type: 'double',
            min: 1000,
            max: 2000,
            from: 1200,
            to: 1800,
            hide_min_max: true,
            hide_from_to: true,
            grid: false
        }
    };

    $scope.range22 = {
        options: {
            type: 'double',
            min: 1000,
            max: 2000,
            from: 1200,
            to: 1800,
            hide_min_max: true,
            hide_from_to: true,
            grid: false
        }
    };

    $scope.range23 = {
        options: {
            type: 'double',
            min: 1000,
            max: 2000,
            from: 1200,
            to: 1800,
            hide_min_max: false,
            hide_from_to: true,
            grid: false
        }
    };

    $scope.range24 = {
        options: {
            type: 'double',
            min: 1000,
            max: 2000,
            from: 1200,
            to: 1800,
            hide_min_max: true,
            hide_from_to: false,
            grid: false
        }
    };
}

'use strict';
//tables.js
angular
    .module('app')
    .controller('BootstrapIntegrationCtrl', BootstrapIntegrationCtrl);

BootstrapIntegrationCtrl.$inject = ['DTOptionsBuilder', 'DTColumnBuilder'];
function BootstrapIntegrationCtrl(DTOptionsBuilder, DTColumnBuilder) {
    var vm = this;
    vm.dtOptions = DTOptionsBuilder
        .fromSource('data.json')
        // Add Bootstrap compatibility
        .withBootstrap()
        .withBootstrapOptions({
            pagination: {
                classes: {
                    ul: 'pagination pagination-datatables'
                }
            }
        });
    vm.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID').withClass('text-danger'),
        DTColumnBuilder.newColumn('firstName').withTitle('First name'),
        DTColumnBuilder.newColumn('lastName').withTitle('Last name')
    ];
}

'use strict';
//widgets.js
angular
    .module('app')
    .controller('cardChartCtrl1', cardChartCtrl1)
    .controller('cardChartCtrl2', cardChartCtrl2)
    .controller('cardChartCtrl3', cardChartCtrl3)
    .controller('cardChartCtrl4', cardChartCtrl4)
    .controller('cardChartCtrl5', cardChartCtrl5)
    .controller('cardChartCtrl6', cardChartCtrl6)
    .controller('cardChartCtrl7', cardChartCtrl7)
    .controller('cardChartCtrl8', cardChartCtrl8)
    .controller('cardChartCtrl9', cardChartCtrl9)
    .controller('cardChartCtrl10', cardChartCtrl10)
    .controller('cardChartCtrl11', cardChartCtrl11)
    .controller('cardChartCtrl12', cardChartCtrl12)
    .controller('cardChartCtrl13', cardChartCtrl13)
    .controller('gaugeCtrl', gaugeCtrl);

//convert Hex to RGBA
function convertHex(hex,opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

cardChartCtrl1.$inject = ['$scope'];
function cardChartCtrl1($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.options = {
        showScale: true,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        scaleFontSize: 5,
        scaleLineColor: 'rgba(0,0,0,0)',
        scaleFontColor: 'rgba(0,0,0,0)'
    };
    $scope.colours = [{
        fillColor: brandPrimary,
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl2.$inject = ['$scope'];
function cardChartCtrl2($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [1, 18, 9, 17, 34, 22, 11]
    ];
    $scope.data3 = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        showScale: true,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        scaleFontSize: 5,
        scaleLineColor: 'rgba(0,0,0,0)',
        scaleFontColor: 'rgba(0,0,0,0)',
        bezierCurve : false,
    };
    $scope.colours = [{
        fillColor: brandInfo,
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl3.$inject = ['$scope'];
function cardChartCtrl3($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [78, 81, 80, 45, 34, 12, 40]
    ];
    $scope.data4 = [
        [35, 23, 56, 22, 97, 23, 64]
    ];
    $scope.options = {
        showScale: false,
        scaleShowGridLines: false,
        pointDot: false,
        pointDotStrokeWidth : 0,
        pointDotRadius : 0,
        scaleGridLineWidth : 0,
        //pointHitDetectionRadius : 0,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.2)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

function random(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

cardChartCtrl4.$inject = ['$scope'];
function cardChartCtrl4($scope) {

    var elements = 16;
    var labels = [];
    var data = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40,100));
    }

    $scope.labels = labels;

    $scope.data = [data];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barShowStroke : false,
        barStrokeWidth : 0,
        scaleGridLineWidth : 0,
        barValueSpacing : 3,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,.3)',
        strokeColor: 'rgba(255,255,255,.55)',
        highlightFill: 'rgba(255,255,255,.55)',
        highlightStroke: 'rgba(255,255,255,.55)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl5.$inject = ['$scope'];
function cardChartCtrl5($scope) {

    var elements = 15;
    var labels = [];
    var data = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40,100));
    }

    $scope.labels = labels;

    $scope.data = [data];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barShowStroke : false,
        barStrokeWidth : 0,
        scaleGridLineWidth : 0,
        barValueSpacing : 1,
        responsive: false,
        maintainAspectRatio: false,

    };
    $scope.colours = [{
        fillColor: brandPrimary,
        strokeColor: brandPrimary,
        highlightFill: 'rgba(255,255,255,.55)',
        highlightStroke: 'rgba(255,255,255,.55)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl6.$inject = ['$scope'];
function cardChartCtrl6($scope) {

    var elements = 15;
    var labels = [];
    var data = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40,100));
    }

    $scope.labels = labels;

    $scope.data = [data];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barShowStroke : false,
        barStrokeWidth : 0,
        scaleGridLineWidth : 0,
        barValueSpacing : 1,
        responsive: false,
        maintainAspectRatio: false,

    };
    $scope.colours = [{
        fillColor: brandDanger,
        strokeColor: brandDanger,
        highlightFill: 'rgba(255,255,255,.55)',
        highlightStroke: 'rgba(255,255,255,.55)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl7.$inject = ['$scope'];
function cardChartCtrl7($scope) {

    var elements = 15;
    var labels = [];
    var data = [];

    for (var i = 0; i <= elements; i++) {
        labels.push('1');
        data.push(random(40,100));
    }

    $scope.labels = labels;

    $scope.data = [data];

    $scope.options = {
        showScale: false,
        scaleFontSize: 0,
        scaleShowGridLines: false,
        barShowStroke : false,
        barStrokeWidth : 0,
        scaleGridLineWidth : 0,
        barValueSpacing : 1,
        responsive: false,
        maintainAspectRatio: false,

    };
    $scope.colours = [{
        fillColor: brandSuccess,
        strokeColor: brandSuccess,
        highlightFill: 'rgba(255,255,255,.55)',
        highlightStroke: 'rgba(255,255,255,.55)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl8.$inject = ['$scope'];
function cardChartCtrl8($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.options = {
        showScale: false,
        scaleShowGridLines: false,
        pointDot: false,
        responsive: false,
        maintainAspectRatio: false,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,0)',
        strokeColor: brandInfo,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl9.$inject = ['$scope'];
function cardChartCtrl9($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.options = {
        showScale: false,
        scaleShowGridLines: false,
        pointDot: false,
        responsive: false,
        maintainAspectRatio: false,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,0)',
        strokeColor: brandSuccess,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl10.$inject = ['$scope'];
function cardChartCtrl10($scope) {

    $scope.labels = ['January','February','March','April','May','June','July'];
    $scope.data = [
        [65, 59, 84, 84, 51, 55, 40]
    ];
    $scope.options = {
        showScale: false,
        scaleShowGridLines: false,
        pointDot: false,
        responsive: false,
        maintainAspectRatio: false,
    };
    $scope.colours = [{
        fillColor: 'rgba(255,255,255,0)',
        strokeColor: brandWarning,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
        tooltipCornerRadius: 0,
    }];
}

cardChartCtrl11.$inject = ['$scope'];
function cardChartCtrl11($scope) {

    $scope.labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
    $scope.data = [
        [4, 18, 9, 17, 34, 22, 11, 3, 15, 12, 18, 9, 9, 17, 34, 22, 11]
    ];
    $scope.options = {
        showScale: false,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        pointDot: false,
        datasetStrokeWidth : 2,
    };
    $scope.colours = [{
        fillColor: 'transparent',
        strokeColor: 'rgba(255,255,255,.55)',
    }];

    $scope.options2 = {
        showScale: false,
        scaleShowGridLines: false,
        barShowStroke : false,
        scaleGridLineWidth : 0,
        barValueSpacing : 5,
    };

    $scope.colours2 = [{
        fillColor: 'rgba(0,0,0,.2)',
    }];

    $scope.labels3 = ['M','T','W','T','F','S','S'];
    $scope.data3 = [
        [17, 34, 22, 11, 3, 15, 12]
    ];

    $scope.options3 = {
        scaleLineWidth: 0.00001,
        responsive: false,
        maintainAspectRatio: false,
        scaleShowGridLines: false,
        scaleShowLabels: false,
        barShowStroke : false,
        barValueSpacing : 4,
        scaleFontSize: 10,
        scaleFontColor: grayLight,
    };

    $scope.colours3 = [{
        fillColor: grayLight,
    }];
}

cardChartCtrl12.$inject = ['$scope'];
function cardChartCtrl12($scope) {

    $scope.labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    $scope.data = [
        [75, 59, 94, 104, 151, 155, 240]
    ];
    $scope.options = {
        scaleLineWidth: 0.00001,
        showScale: true,
        scaleShowLabels: false,
        scaleShowGridLines: false,
        datasetStrokeWidth : 3,
        pointDotStrokeWidth: 3,
        responsive: true,
        maintainAspectRatio: false,
    };
    $scope.colours = [{
        fillColor: 'transparent',
        strokeColor: grayLighter,
        pointColor: '#fff',
    }];
}

cardChartCtrl13.$inject = ['$scope'];
function cardChartCtrl13($scope) {

    $scope.labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    $scope.data = [
        [31000, 34000, 27000, 24000, 28000, 42500, 42000, 30000, 35500, 35500, 41500, 41600]
    ];
    $scope.options = {
        showScale: true,
        scaleGridLineColor : 'rgba(255,255,255,.2)',
        scaleShowVerticalLines: false,
        scaleLineColor: 'rgba(255,255,255,.0)',
        scaleOverride: true,
        scaleSteps: 5,
        scaleStepWidth: 5000,
        scaleStartValue: 20000,
        scaleLabel: "<%= '$' + value %>",
        bezierCurve : false,
        scaleFontColor: '#fff',
        datasetStrokeWidth : 4,
        pointDotStrokeWidth: 4,
        responsive: true,
        maintainAspectRatio: false,
    };
    $scope.colours = [{
        fillColor: 'transparent',
        strokeColor: '#fff',
        pointColor: brandPrimary,
        highlightFill: 'rgba(47, 132, 71, 0.8)',
        highlightStroke: 'rgba(47, 132, 71, 0.8)',
    }];

    $scope.labels2 = ['US','PL','GB','DE','NL','CA','FI', 'RU', 'AU', 'N/A'];
    $scope.data2 = [
        [35, 14, 10, 8, 6, 6, 5, 4, 3, 9]
    ];

    $scope.options2 = {
        scaleLineColor: 'rgba(255,255,255,.0)',
        responsive: true,
        maintainAspectRatio: false,
        scaleShowGridLines: false,
        scaleShowLabels: false,
        barShowStroke : false,
        barValueSpacing : 10,
        scaleFontColor: gray,
        scaleIntegersOnly: true,
        scaleBeginAtZero: true,
    };

    $scope.colours2 = [{
        fillColor: brandSuccess,
    }];
}

gaugeCtrl.$inject = ['$scope', '$timeout'];
function gaugeCtrl($scope, $timeout) {

    function random(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    $scope.gauge1 = {
        animationSpeed: 32,
        value: random(0,3000),
        maxValue: 3000,
        options: {
            lines: 12,
            angle: 0.15,
            lineWidth: 0.44,
            pointer: {
                length: 0.8,
                strokeWidth: 0.035,
                color: grayDark
            },
            limitMax: 'false',
            colorStart: brandInfo,
            colorStop: brandInfo,
            strokeColor: grayLighter,
            generateGradient: true,
            responsive: true,
        }
    };

    $scope.gauge2 = {
        animationSpeed: 32,
        value: random(0,3000),
        maxValue: 3000,
        options: {
            lines: 12,
            angle: 0.15,
            lineWidth: 0.44,
            pointer: {
                length: 0.8,
                strokeWidth: 0.035,
                color: gray
            },
            limitMax: 'false',
            colorStart: brandSuccess,
            colorStop: brandSuccess,
            strokeColor: grayLighter,
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge3 = {
        animationSpeed: 32,
        value: random(0,3000),
        maxValue: 3000,
        options: {
            lines: 12,
            angle: 0.15,
            lineWidth: 0.44,
            pointer: {
                length: 0.8,
                strokeWidth: 0.035,
                color: gray
            },
            limitMax: 'false',
            colorStart: brandWarning,
            colorStop: brandWarning,
            strokeColor: grayLighter,
            generateGradient: true,
            responsive: true
        }
    };

    $scope.gauge4 = {
        animationSpeed: 32,
        value: random(0,3000),
        maxValue: 3000,
        options: {
            lines: 12,
            angle: 0.15,
            lineWidth: 0.44,
            pointer: {
                length: 0.8,
                strokeWidth: 0.035,
                color: gray
            },
            limitMax: 'false',
            colorStart: brandDanger,
            colorStop: brandDanger,
            strokeColor: grayLighter,
            generateGradient: true,
            responsive: true
        }
    };
}

'use strict';
angular
    .module('app')

    // List of navigations elements
    .controller('bootstrapElements', bootstrapElements);

bootstrapElements.$inject = ['$scope'];

function bootstrapElements($scope) {
    $scope.layout = [
        {
            name: 'overview',
            desc: 'Overview'
        },
        {
            name: 'grid',
            desc: 'Grid'
        },
        {
            name: 'media-object',
            desc: 'Media object'
        },
        {
            name: 'responsive-utilities',
            desc: 'Responsive utilities'
        }
    ];
    $scope.content = [
        {
            name: 'reboot',
            desc: 'Reboot'
        },
        {
            name: 'typography',
            desc: 'Typography'
        },
        {
            name: 'code',
            desc: 'Code'
        },
        {
            name: 'images',
            desc: 'Images'
        },
        {
            name: 'tables',
            desc: 'Tables'
        },
        {
            name: 'figures',
            desc: 'Figures'
        }
    ];
    $scope.components = [
        {
            name: 'alerts',
            desc: 'Alerts'
        },
        {
            name: 'breadcrumb',
            desc: 'Breadcrumb'
        },
        {
            name: 'buttondropdown',
            desc: 'Button Dropdown'
        },
        {
            name: 'buttongroup',
            desc: 'Button Group'
        },
        {
            name: 'buttons',
            desc: 'Buttons'
        },
        {
            name: 'card',
            desc: 'Card'
        },
        {
            name: 'carousel',
            desc: 'Carousel'
        },
        {
            name: 'collapse',
            desc: 'Collapse'
        },
        {
            name: 'dropdowns',
            desc: 'Dropdowns'
        },
        {
            name: 'forms',
            desc: 'Forms'
        },
        {
            name: 'inputgroup',
            desc: 'Input Group'
        },
        {
            name: 'jumbotron',
            desc: 'Jumbotron'
        },
        {
            name: 'label',
            desc: 'Label'
        },
        {
            name: 'listgroup',
            desc: 'List Group'
        },
        {
            name: 'modal',
            desc: 'Modal'
        },
        {
            name: 'navbar',
            desc: 'Navbar'
        },
        {
            name: 'navs',
            desc: 'Navs'
        },
        {
            name: 'pagination',
            desc: 'Pagination'
        },
        {
            name: 'popovers',
            desc: 'Popovers'
        },
        {
            name: 'progress',
            desc: 'Progress'
        },
        {
            name: 'scrollspy',
            desc: 'Scrollspy'
        },
        {
            name: 'tooltips',
            desc: 'Tooltips'
        },
        {
            name: 'utilities',
            desc: 'Utilities'
        }
    ];
}

'use strict';
angular
    .module('app')
    .directive('getdocscontent', getDocsContentDirective)
    .directive('img', holderJsDirective);

getDocsContentDirective.$inject = ['$http', '$compile'];

function getDocsContentDirective($http, $compile) {
    var directive = {
        restrict: 'A',
        transclude: true,
        replace: true,
        scope:{
            src: '@src'
        },
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        $http.get(scope.src).success(function (response) {
            var contents = angular.element("<div>").html(response).find(".bd-content >");
            element.empty().append($compile(contents)(scope));
        });
    }
}

//Holder.js fix
function holderJsDirective() {
    var directive = {
        restrict: 'E',
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
        if (attrs.src){
            Holder.run({ images: element[0], nocss: true });
        }
    }
}

'use strict';
angular
    .module('app')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {
        $stateProvider

            .state('bootstrap', {
                abstract: true,
                templateUrl: 'views/common/layouts/full.html',
                ncyBreadcrumb: {
                    label: 'Bootstrap'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            serie: true,
                            name: 'chart.js',
                            files: ['assets/js/libs/Chart.min.js', 'assets/js/libs/angular-chart.min.js']
                        }]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/shared.js']
                        });
                    }]
                }
            })
            .state('bootstrap.layout', {
                abstract: true,
                templateUrl: 'views/common/bootstrap.html',
                ncyBreadcrumb: {
                    label: 'Content'
                }
            })
            .state('bootstrap.layout.overview', {
                url: '/bootstrap/layout/overview',
                template: '<div getDocsContent src="views/bootstrap/layout/overview/index.html"></div>',
                params: {
                    subtitle: 'Bootstrap includes several components and options for laying out your project, including wrapping containers, a powerful grid system, a flexible media object, and responsive utility classes.'
                },
                ncyBreadcrumb: {
                    label: 'Overview',
                }
            })
            .state('bootstrap.layout.grid', {
                url: '/bootstrap/layout/grid',
                template: '<div getDocsContent src="views/bootstrap/layout/grid/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Grid',
                }
            })
            .state('bootstrap.layout.media-object', {
                url: '/bootstrap/layout/media-object',
                template: '<div getDocsContent src="views/bootstrap/layout/media-object/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Media Object',
                }
            })
            .state('bootstrap.layout.responsive-utilities', {
                url: '/bootstrap/layout/responsive-utilities',
                template: '<div getDocsContent src="views/bootstrap/layout/responsive-utilities/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Responsive Utilities',
                }
            })
            .state('bootstrap.content', {
                abstract: true,
                templateUrl: 'views/common/bootstrap.html',
                ncyBreadcrumb: {
                    label: 'Content'
                }
            })
            .state('bootstrap.content.reboot', {
                url: '/bootstrap/content/reboot',
                template: '<div getDocsContent src="views/bootstrap/content/reboot/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Reboot',
                }
            })
            .state('bootstrap.content.code', {
                url: '/bootstrap/content/code',
                template: '<div getDocsContent src="views/bootstrap/content/code/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Code',
                }
            })
            .state('bootstrap.content.typography', {
                url: '/bootstrap/content/typography',
                template: '<div getDocsContent src="views/bootstrap/content/typography/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Typography',
                }
            })
            .state('bootstrap.content.images', {
                url: '/bootstrap/content/images',
                template: '<div getDocsContent src="views/bootstrap/content/images/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Images',
                },

            })
            .state('bootstrap.content.tables', {
                url: '/bootstrap/content/tables',
                template: '<div getDocsContent src="views/bootstrap/content/tables/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Tables',
                }
            })
            .state('bootstrap.content.figures', {
                url: '/bootstrap/content/figures',
                template: '<div getDocsContent src="views/bootstrap/content/figures/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Figures',
                }
            })
            .state('bootstrap.components', {
                abstract: true,
                templateUrl: 'views/common/bootstrap.html',
                ncyBreadcrumb: {
                    label: 'Components'
                }
            })
            .state('bootstrap.components.alerts', {
                url: '/bootstrap/components/alerts',
                template: '<div getDocsContent src="views/bootstrap/components/alerts/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Alerts',
                }
            })
            .state('bootstrap.components.breadcrumb', {
                url: '/bootstrap/components/breadcrumb',
                template: '<div getDocsContent src="views/bootstrap/components/breadcrumb/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Breadcrumb',
                }
            })
            .state('bootstrap.components.buttondropdown', {
                url: '/bootstrap/components/buttondropdown',
                template: '<div getDocsContent src="views/bootstrap/components/button-dropdown/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Button Dropdown',
                }
            })
            .state('bootstrap.components.buttongroup', {
                url: '/bootstrap/components/buttongroup',
                template: '<div getDocsContent src="views/bootstrap/components/button-group/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Button Group',
                }
            })
            .state('bootstrap.components.buttons', {
                url: '/bootstrap/components/buttons',
                template: '<div getDocsContent src="views/bootstrap/components/buttons/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Buttons',
                }
            })
            .state('bootstrap.components.card', {
                url: '/bootstrap/components/card',
                template: '<div getDocsContent src="views/bootstrap/components/card/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Card',
                }
            })
            .state('bootstrap.components.carousel', {
                url: '/bootstrap/components/carousel',
                template: '<div getDocsContent src="views/bootstrap/components/carousel/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Carousel',
                }
            })
            .state('bootstrap.components.collapse', {
                url: '/bootstrap/components/collapse',
                template: '<div getDocsContent src="views/bootstrap/components/collapse/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Collapse',
                }
            })
            .state('bootstrap.components.dropdowns', {
                url: '/bootstrap/components/dropdowns',
                template: '<div getDocsContent src="views/bootstrap/components/dropdowns/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Dropdowns',
                }
            })
            .state('bootstrap.components.forms', {
                url: '/bootstrap/components/forms',
                template: '<div getDocsContent src="views/bootstrap/components/forms/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Forms',
                }
            })
            .state('bootstrap.components.inputgroup', {
                url: '/bootstrap/components/inputgroup',
                template: '<div getDocsContent src="views/bootstrap/components/input-group/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Input Group',
                }
            })
            .state('bootstrap.components.jumbotron', {
                url: '/bootstrap/components/jumbotron',
                template: '<div getDocsContent src="views/bootstrap/components/jumbotron/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Jumbotron',
                }
            })
            .state('bootstrap.components.label', {
                url: '/bootstrap/components/label',
                template: '<div getDocsContent src="views/bootstrap/components/label/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Label',
                }
            })
            .state('bootstrap.components.listgroup', {
                url: '/bootstrap/components/listgroup',
                template: '<div getDocsContent src="views/bootstrap/components/list-group/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'List Group',
                }
            })
            .state('bootstrap.components.modal', {
                url: '/bootstrap/components/modal',
                template: '<div getDocsContent src="views/bootstrap/components/modal/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Modal',
                }
            })
            .state('bootstrap.components.nav', {
                url: '/bootstrap/components/nav',
                template: '<div getDocsContent src="views/bootstrap/components/nav/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Nav',
                }
            })
            .state('bootstrap.components.navbar', {
                url: '/bootstrap/components/navbar',
                template: '<div getDocsContent src="views/bootstrap/components/navbar/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Navbar',
                }
            })
            .state('bootstrap.components.navs', {
                url: '/bootstrap/components/navs',
                template: '<div getDocsContent src="views/bootstrap/components/navs/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'navs',
                }
            })
            .state('bootstrap.components.pagination', {
                url: '/bootstrap/components/pagination',
                template: '<div getDocsContent src="views/bootstrap/components/pagination/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Pagination',
                }
            })
            .state('bootstrap.components.popovers', {
                url: '/bootstrap/components/popovers',
                template: '<div getDocsContent src="views/bootstrap/components/popovers/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Popovers',
                }
            })
            .state('bootstrap.components.progress', {
                url: '/bootstrap/components/progress',
                template: '<div getDocsContent src="views/bootstrap/components/progress/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Progress',
                }
            })
            .state('bootstrap.components.reboot', {
                url: '/bootstrap/components/reboot',
                template: '<div getDocsContent src="views/bootstrap/components/reboot/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Reboot',
                }
            })
            .state('bootstrap.components.scrollspy', {
                url: '/bootstrap/components/scrollspy',
                template: '<div getDocsContent src="views/bootstrap/components/scrollspy/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Scrollspy',
                }
            })
            .state('bootstrap.components.tooltips', {
                url: '/bootstrap/components/tooltips',
                template: '<div getDocsContent src="views/bootstrap/components/tooltips/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Label',
                }
            })
            .state('bootstrap.components.transitions', {
                url: '/bootstrap/components/transitions',
                template: '<div getDocsContent src="views/bootstrap/components/transitions/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Transitions',
                }
            })
            .state('bootstrap.components.utilities', {
                url: '/bootstrap/components/utilities',
                template: '<div getDocsContent src="views/bootstrap/components/utilities/index.html"></div>',
                ncyBreadcrumb: {
                    label: 'Utilities',
                }
            })
            .state('app.icons', {
                url: "/icons",
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: '{{ "ICONS" | translate }}'
                }
            })
            .state('app.icons.fontawesome', {
                url: '/font-awesome',
                templateUrl: 'views/icons/font-awesome.html',
                ncyBreadcrumb: {
                    label: 'Font Awesome'
                }
            })
            .state('app.icons.simplelineicons', {
                url: '/simple-line-icons',
                templateUrl: 'views/icons/simple-line-icons.html',
                ncyBreadcrumb: {
                    label: 'Simple Line Icons'
                }
            })
            .state('app.components', {
                url: "/components",
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Components'
                }
            })
            .state('app.components.buttons', {
                url: '/buttons',
                templateUrl: 'views/components/buttons.html',
                ncyBreadcrumb: {
                    label: '{{ "BUTTONS" | translate }}'
                }
            })
            .state('app.components.social-buttons', {
                url: '/social-buttons',
                templateUrl: 'views/components/social-buttons.html',
                ncyBreadcrumb: {
                    label: 'Social Buttons'
                }
            })
            .state('app.components.cards', {
                url: '/cards',
                templateUrl: 'views/components/cards.html',
                ncyBreadcrumb: {
                    label: 'Cards'
                }
            })
            .state('app.components.forms', {
                url: '/forms',
                templateUrl: 'views/components/forms.html',
                ncyBreadcrumb: {
                    label: 'Forms'
                }
            })
            .state('app.components.switches', {
                url: '/switches',
                templateUrl: 'views/components/switches.html',
                ncyBreadcrumb: {
                    label: 'Switches'
                }
            })
            .state('app.components.tables', {
                url: '/tables',
                templateUrl: 'views/components/tables.html',
                ncyBreadcrumb: {
                    label: '{{ "TABLES" | translate }}'
                }
            })
            .state('app.plugins', {
                url: "/plugins",
                abstract: true,
                template: '<ui-view></ui-view>',
                ncyBreadcrumb: {
                    label: 'Plugins'
                }
            })
            .state('app.plugins.calendar', {
                url: '/calendar',
                templateUrl: 'views/plugins/calendar.html',
                ncyBreadcrumb: {
                    label: '{{ "CALENDAR" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serial: true,
                                files: ['assets/js/libs/moment.min.js','assets/js/libs/fullcalendar.min.js','assets/js/libs/gcal.min.js','assets/js/libs/calendar.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/calendar.js']
                        });
                    }]
                }
            })
            .state('app.plugins.notifications', {
                url: '/notifications',
                templateUrl: 'views/plugins/notifications.html',
                ncyBreadcrumb: {
                    label: '{{ "NOTIFICATIONS" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: ['assets/js/libs/angular-toastr.tpls.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/notifications.js']
                        });
                    }]
                }
            })
            .state('app.plugins.sliders', {
                url: '/sliders',
                templateUrl: 'views/plugins/sliders.html',
                ncyBreadcrumb: {
                    label: '{{ "SLIDERS" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: ['assets/js/libs/ion.rangeSlider.min.js', 'assets/js/libs/rzslider.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/sliders.js']
                        });
                    }]
                }
            })
            .state('app.plugins.tables', {
                url: '/tables',
                templateUrl: 'views/plugins/tables.html',
                ncyBreadcrumb: {
                    label: '{{ "TABLES" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                files: ['assets/js/libs/jquery.dataTables.min.js', 'assets/js/libs/angular-datatables.min.js', 'assets/js/libs/angular-datatables.bootstrap.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/tables.js']
                        });
                    }]
                }
            })
            .state('app.forms', {
                url: '/forms',
                templateUrl: 'views/forms.html',
                ncyBreadcrumb: {
                    label: '{{ "FORMS" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: ['assets/js/libs/moment.min.js']
                            },
                            {
                                serie: true,
                                files: ['assets/js/libs/daterangepicker.min.js', 'assets/js/libs/angular-daterangepicker.min.js']
                            },
                            {
                                files: ['assets/js/libs/mask.min.js']
                            },
                            {
                                files: ['assets/js/libs/select.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/forms.js']
                        });
                    }]
                }
            })
            .state('app.widgets', {
                url: '/widgets',
                templateUrl: 'views/widgets.html',
                ncyBreadcrumb: {
                    label: '{{ "WIDGETS" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serie: true,
                                files: ['assets/js/libs/gauge.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load controllers
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/widgets.js']
                        });
                    }]
                }
            })
            .state('app.charts', {
                url: '/charts',
                templateUrl: 'views/charts.html',
                ncyBreadcrumb: {
                    label: '{{ "CHARTS" | translate }}'
                },
                resolve: {
                    // Plugins loaded before
                    // loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                    //     return $ocLazyLoad.load([
                    //         {
                    //             serial: true,
                    //             files: ['assets/js/libs/Chart.min.js', 'assets/js/libs/angular-chart.min.js']
                    //         }
                    //     ]);
                    // }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/charts.js']
                        });
                    }]
                }
            })
            .state('app.echarts', {
                url: '/echarts',
                templateUrl: 'views/echarts.html',
                ncyBreadcrumb: {
                    label: '{{ "CHARTS" | translate }}'
                },
                resolve: {
                    loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            {
                                serial: true,
                                files: ['assets/js/libs/echarts-all.min.js', 'assets/js/libs/angular-echarts.min.js']
                            }
                        ]);
                    }],
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        // you can lazy load files for an existing module
                        return $ocLazyLoad.load({
                            files: ['assets/js/controllers/echarts.js']
                        });
                    }]
                }
            })
            .state('app.animations', {
                url: '/animations',
                templateUrl: 'views/animations.html',
                ncyBreadcrumb: {
                    label: '{{ "ANIMATIONS" | translate }}'
                }
            });
    }]);


//email.js
'use strict';
angular
    .module('app')
    .controller('newMailCtrl', newMailCtrl)
    .filter('propsFilter', propsFilter);

newMailCtrl.$inject = ['$scope', '$http', '$timeout'];
function newMailCtrl($scope, $http, $timeout) {

    $scope.person = {};
    $scope.people = [
        { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
        { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
        { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
        { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
        { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
        { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
        { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
        { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
        { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
        { name: 'Nicolás',   email: 'nicolas@email.com',   age: 43, country: 'Colombia' }
    ];

    $scope.multipleDemo = {};
    $scope.multipleDemo.selectedPeople = [];

}

function propsFilter() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }
        return out;
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcFxcYXBwLmpzIiwiYXBwXFxjb250cm9sbGVycy5qcyIsImFwcFxcZGlyZWN0aXZlcy5qcyIsImFwcFxccm91dGVzLmpzIiwiYXBwXFx0cmFuc2xhdGlvbnMuanMiLCJhcHBcXGNvbnRyb2xsZXJzXFxjYWxlbmRhci5qcyIsImFwcFxcY29udHJvbGxlcnNcXGNoYXJ0cy5qcyIsImFwcFxcY29udHJvbGxlcnNcXGZvcm1zLmpzIiwiYXBwXFxjb250cm9sbGVyc1xcbWFpbi5qcyIsImFwcFxcY29udHJvbGxlcnNcXG5vdGlmaWNhdGlvbnMuanMiLCJhcHBcXGNvbnRyb2xsZXJzXFxzaGFyZWQuanMiLCJhcHBcXGNvbnRyb2xsZXJzXFxzbGlkZXJzLmpzIiwiYXBwXFxjb250cm9sbGVyc1xcdGFibGVzLmpzIiwiYXBwXFxjb250cm9sbGVyc1xcd2lkZ2V0cy5qcyIsImFwcFxcZGVtb1xcY29udHJvbGxlcnMuanMiLCJhcHBcXGRlbW9cXGRpcmVjdGl2ZXMuanMiLCJhcHBcXGRlbW9cXHJvdXRlcy5qcyIsImRpcmVjdGl2ZXNcXG1vZGFsXFxtb2RhbC5qcyIsImFwcFxcY29udHJvbGxlcnNcXHVpa2l0c1xcZW1haWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbGlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdm5CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ241QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6a0JBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cblxuLy8gR2VuZXNpcyBBcHAgY29uZmlndXJhdGlvblxudmFyIGFwcE5hbWUgPSAnUm9vdCc7XG52YXIgYnJlYWRjcnVtYlByZWZpeCA9IHRydWU7XG52YXIgYnJlYWRjcnVtYlByZWZpeE5hbWUgPSAnUm9vdCc7XG5cbi8vIEdlbmVyYWxcbnZhciBoZWFkVGl0bGUgPSAnUm9vdCBBZG1pbic7XG5cbi8vRGVmYXVsdCBjb2xvdXJzXG52YXIgYnJhbmRQcmltYXJ5ID0gICcjMjBhOGQ4JztcbnZhciBicmFuZFN1Y2Nlc3MgPSAgJyM0ZGJkNzQnO1xudmFyIGJyYW5kSW5mbyA9ICAgICAnIzYzYzJkZSc7XG52YXIgYnJhbmRXYXJuaW5nID0gICcjZjhjYjAwJztcbnZhciBicmFuZERhbmdlciA9ICAgJyNmODZjNmInO1xuXG52YXIgZ3JheURhcmsgPSAgICAgICcjMmEyYzM2JztcbnZhciBncmF5ID0gICAgICAgICAgJyM1NTU5NWMnO1xudmFyIGdyYXlMaWdodCA9ICAgICAnIzgxOGE5MSc7XG52YXIgZ3JheUxpZ2h0ZXIgPSAgICcjZDFkNGQ3JztcbnZhciBncmF5TGlnaHRlc3QgPSAgJyNmOGY5ZmEnO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJywgW1xuICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICdvYy5sYXp5TG9hZCcsXG4gICAgICAgICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJyxcbiAgICAgICAgJ25jeS1hbmd1bGFyLWJyZWFkY3J1bWInLFxuICAgICAgICAnYW5ndWxhci1sb2FkaW5nLWJhcidcbiAgICBdKVxuICAgIC5jb25maWcoWydjZnBMb2FkaW5nQmFyUHJvdmlkZXInLCBmdW5jdGlvbihjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIHtcbiAgICAgICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2U7XG4gICAgICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5sYXRlbmN5VGhyZXNob2xkID0gMTtcbiAgICB9XSlcbiAgICAucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAvKiBqc2hpbnQgYnJvd3NlcjogdHJ1ZSAqL1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgfSk7XG4gICAgICAgICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZVBhcmFtcyA9ICRzdGF0ZVBhcmFtcztcbiAgICAgICAgcmV0dXJuICRyb290U2NvcGUuJHN0YXRlUGFyYW1zO1xuICAgIH1dKTtcbiIsIi8vIGNvbnRyb2xsZXIuanNcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdsYW5ndWFnZUN0cmwnLCBsYW5ndWFnZUN0cmwpO1xuXG4vKmpzaGludCBsYXRlZGVmOiBub2Z1bmMgKi9cbmxhbmd1YWdlQ3RybC4kaW5qZWN0ID0gWyckdHJhbnNsYXRlJywgJyRzY29wZSddO1xuZnVuY3Rpb24gbGFuZ3VhZ2VDdHJsKCR0cmFuc2xhdGUsICRzY29wZSkge1xuICAgIGZ1bmN0aW9uIGNoZWNrTGFuZ3VhZ2UobGFuZ3VhZ2VzLCBsYW5nS2V5KSB7XG4gICAgICAgIGxhbmd1YWdlcy5tYXAoZnVuY3Rpb24gKGxhbmd1YWdlKSB7XG4gICAgICAgICAgICBpZiAobGFuZ3VhZ2UubGFuZ0tleSA9PT0gbGFuZ0tleSkge1xuICAgICAgICAgICAgICAgICRzY29wZS5mbGFnID0gbGFuZ3VhZ2UuZmxhZztcbiAgICAgICAgICAgICAgICAkc2NvcGUubGFuZyA9IGxhbmd1YWdlLmxhbmc7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhbmd1YWdlO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgbGFuZ3VhZ2VzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBsYW5nOiAnUG9saXNoJyxcbiAgICAgICAgICAgIGxhbmdLZXk6ICdwbCcsXG4gICAgICAgICAgICBmbGFnOiAnUG9sYW5kLnBuZydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbGFuZzogJ0VuZ2xpc2gnLFxuICAgICAgICAgICAgbGFuZ0tleTogJ2VuJyxcbiAgICAgICAgICAgIGZsYWc6ICdVbml0ZWQtS2luZ2RvbS5wbmcnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxhbmc6ICdFc3Bhw7FvbCcsXG4gICAgICAgICAgICBsYW5nS2V5OiAnZXMnLFxuICAgICAgICAgICAgZmxhZzogJ1NwYWluLnBuZydcbiAgICAgICAgfVxuICAgIF07XG4gICAgJHNjb3BlLmxhbmd1YWdlcyA9IGxhbmd1YWdlcztcbiAgICBjaGVja0xhbmd1YWdlKGxhbmd1YWdlcywgJHRyYW5zbGF0ZS51c2UoKSk7XG4gICAgJHNjb3BlLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24gKGxhbmdLZXkpIHtcbiAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZ0tleSk7XG4gICAgICAgIGNoZWNrTGFuZ3VhZ2UobGFuZ3VhZ2VzLCBsYW5nS2V5KTtcbiAgICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLypqc2hpbnQgbGF0ZWRlZjogbm9mdW5jICovXG4vKiBqc2hpbnQgYnJvd3NlcjogdHJ1ZSAqL1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgndGl0bGUnLCB0aXRsZURpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCdicmVhZGNydW1iJywgYnJlYWRjcnVtYlByZWZpeERpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCdhJywgcHJldmVudENsaWNrRGlyZWN0aXZlKVxuICAgIC5kaXJlY3RpdmUoJ2EnLCBib290c3RyYXBDb2xsYXBzZURpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCdhJywgbmF2aWdhdGlvbkRpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCduYXYnLCBzaWRlYmFyTmF2RHluYW1pY1Jlc2l6ZURpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCduYXYnLCB0b3BOYXZTbWFydFJlc2l6ZURpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCdidXR0b24nLCBsYXlvdXRUb2dnbGVEaXJlY3RpdmUpXG4gICAgLmRpcmVjdGl2ZSgnYScsIGxheW91dFRvZ2dsZURpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCdidXR0b24nLCBjb2xsYXBzZU1lbnVUb2dnbGVyRGlyZWN0aXZlKVxuICAgIC5kaXJlY3RpdmUoJ2RpdicsIGJvb3RzdHJhcENhcm91c2VsRGlyZWN0aXZlKVxuICAgIC5kaXJlY3RpdmUoJ3RvZ2dsZScsIGJvb3RzdHJhcFRvb2x0aXBzUG9wb3ZlcnNEaXJlY3RpdmUpXG4gICAgLmRpcmVjdGl2ZSgndGFiJywgYm9vdHN0cmFwVGFic0RpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCdidXR0b24nLCBjYXJkQ29sbGFwc2VEaXJlY3RpdmUpXG4gICAgLmRpcmVjdGl2ZSgnaW9uc2xpZGVyJywgaW9uU2xpZGVyRGlyZWN0aXZlKVxuICAgIC5kaXJlY3RpdmUoJ3ZhbWlkZGxlJywgdmVydGljYWxBbGlnbk1pZGRsZURpcmVjdGl2ZSlcbiAgICAuZGlyZWN0aXZlKCdlbWFpbGFwcCcsIGVtYWlsQXBwRGlyZWN0aXZlKVxuICAgIC5kaXJlY3RpdmUoJ2dhdWdlanMnLCBnYXVnZUpzRGlyZWN0aXZlKTtcblxuXG4vKipcbiogQGRlc2MgdGhpcyBkaXJlY3RpdmUgYWRkIG1ldGEgdGl0bGVcbiogQGV4YW1wbGUgPHRpdGxlPjwvdGl0bGU+XG4qL1xuXG5mdW5jdGlvbiB0aXRsZURpcmVjdGl2ZSgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICB0ZW1wbGF0ZTogaGVhZFRpdGxlXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xufVxuXG4vL0JyZWFkY3J1bWIgUHJlZml4XG5mdW5jdGlvbiBicmVhZGNydW1iUHJlZml4RGlyZWN0aXZlKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICAgIGxpbms6IGxpbmtcbiAgICB9O1xuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50KSB7XG4gICAgICAgIGlmIChicmVhZGNydW1iUHJlZml4KSB7XG4gICAgICAgICAgICBlbGVtZW50LnByZXBlbmQoJzxsaT48c3Bhbj4nICsgYnJlYWRjcnVtYlByZWZpeE5hbWUgKyAnPC9zcGFuPjwvbGk+Jyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHByZXZlbnRDbGlja0RpcmVjdGl2ZSgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzLmhyZWYgPT09ICcjJyl7XG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vQm9vdHN0cmFwIENvbGxhcHNlXG5mdW5jdGlvbiBib290c3RyYXBDb2xsYXBzZURpcmVjdGl2ZSgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzLnRvZ2dsZSA9PT0gJ2NvbGxhcHNlJyl7XG4gICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2hyZWYnLCdqYXZhc2NyaXB0OzsnKS5hdHRyKCdkYXRhLXRhcmdldCcsYXR0cnMuaHJlZi5yZXBsYWNlKCdpbmRleC5odG1sJywnJykpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiogQGRlc2MgR2VuZXNpcyBtYWluIG5hdmlnYXRpb24gLSBTaWVkZWJhciBtZW51XG4qIEBleGFtcGxlIDxsaSBjbGFzcz1cIm5hdi1pdGVtIG5hdi1kcm9wZG93blwiPjwvbGk+XG4qL1xuZnVuY3Rpb24gbmF2aWdhdGlvbkRpcmVjdGl2ZSgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYoZWxlbWVudC5oYXNDbGFzcygnbmF2LWRyb3Bkb3duLXRvZ2dsZScpICYmIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmhhc0NsYXNzKCdzaWRlYmFyLW5hdicpICYmIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLndpZHRoKCkgPiA3ODIpIHtcbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpZighYW5ndWxhci5lbGVtZW50KCdib2R5JykuaGFzQ2xhc3MoJ2NvbXBhY3QtbmF2JykpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS50b2dnbGVDbGFzcygnb3BlbicpLmZpbmQoJy5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lmhhc0NsYXNzKCduYXYtZHJvcGRvd24tdG9nZ2xlJykgJiYgYW5ndWxhci5lbGVtZW50KCdib2R5Jykud2lkdGgoKSA8IDc4Mykge1xuICAgICAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGVsZW1lbnQucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ29wZW4nKS5maW5kKCcub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy9EeW5hbWljIHJlc2l6ZSAuc2lkZWJhci1uYXZcbnNpZGViYXJOYXZEeW5hbWljUmVzaXplRGlyZWN0aXZlLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnJHRpbWVvdXQnXTtcbmZ1bmN0aW9uIHNpZGViYXJOYXZEeW5hbWljUmVzaXplRGlyZWN0aXZlKCR3aW5kb3csICR0aW1lb3V0KSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgbGluazogbGlua1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQuaGFzQ2xhc3MoJ3NpZGViYXItbmF2JykgJiYgYW5ndWxhci5lbGVtZW50KCdib2R5JykuaGFzQ2xhc3MoJ2ZpeGVkLW5hdicpKSB7XG4gICAgICAgICAgICB2YXIgYm9keUhlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCgnaGVhZGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2lkZWJhckhlYWRlckhlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCgnLnNpZGViYXItaGVhZGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2lkZWJhckZvb3RlckhlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCgnLnNpZGViYXItZm9vdGVyJykub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5oYXNDbGFzcygnc2lkZWJhci1vZmYtY2FudmFzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jc3MoJ2hlaWdodCcsIGJvZHlIZWlnaHQgLSBzaWRlYmFySGVhZGVySGVpZ2h0IC0gc2lkZWJhckZvb3RlckhlaWdodCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jc3MoJ2hlaWdodCcsIGJvZHlIZWlnaHQgLSBoZWFkZXJIZWlnaHQgLSBzaWRlYmFySGVhZGVySGVpZ2h0IC0gc2lkZWJhckZvb3RlckhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBib2R5SGVpZ2h0ID0gYW5ndWxhci5lbGVtZW50KHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlckhlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCgnaGVhZGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2lkZWJhckhlYWRlckhlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCgnLnNpZGViYXItaGVhZGVyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgc2lkZWJhckZvb3RlckhlaWdodCA9IGFuZ3VsYXIuZWxlbWVudCgnLnNpZGViYXItZm9vdGVyJykub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgICAgIGlmIChhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5oYXNDbGFzcygnc2lkZWJhci1vZmYtY2FudmFzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jc3MoJ2hlaWdodCcsIGJvZHlIZWlnaHQgLSBzaWRlYmFySGVhZGVySGVpZ2h0IC0gc2lkZWJhckZvb3RlckhlaWdodCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jc3MoJ2hlaWdodCcsIGJvZHlIZWlnaHQgLSBoZWFkZXJIZWlnaHQgLSBzaWRlYmFySGVhZGVySGVpZ2h0IC0gc2lkZWJhckZvb3RlckhlaWdodCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnRvcE5hdlNtYXJ0UmVzaXplRGlyZWN0aXZlLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAnJHRpbWVvdXQnXTtcbmZ1bmN0aW9uIHRvcE5hdlNtYXJ0UmVzaXplRGlyZWN0aXZlKCR3aW5kb3csICR0aW1lb3V0KSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgbGluazogbGlua1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICAgaWYgKGVsZW1lbnQuaGFzQ2xhc3MoJ3RvcC1uYXYnKSkge1xuXG4gICAgICAgICAgICB2YXIgb2xkTmF2ID0gZWxlbWVudC5maW5kKCd1bC5uYXYnKS5jbG9uZSgpO1xuICAgICAgICAgICAgdmFyIG1vcmUgPSAnPGxpIGNsYXNzPVwibmF2LWl0ZW0gbmF2LW1vcmUgbmF2LWRyb3Bkb3duXCI+PGEgY2xhc3M9XCJuYXYtbGluayBuYXYtZHJvcGRvd24tdG9nZ2xlXCIgaHJlZj1cIiNcIj48aSBjbGFzcz1cImljb24tb3B0aW9ucy12ZXJ0aWNhbFwiPjwvaT4gTW9yZTwvYT48dWwgY2xhc3M9XCJuYXYtZHJvcGRvd24taXRlbXMgaXRlbXMtbW9yZVwiPjwvdWw+PC9saT4nO1xuICAgICAgICAgICAgdmFyIG9mZmNhbnZhcyA9IGZhbHNlO1xuICAgICAgICAgICAgdmFyIG9mZkNhbnZhc0xpID0gW107XG5cbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1lbnQuZmluZCgndWwubmF2IGxpJyksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGkgPSBhbmd1bGFyLmVsZW1lbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGkucGFyZW50KCkuaGFzQ2xhc3MoJ25hdicpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZjYW52YXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZDYW52YXNMaS5wdXNoKGxpWzBdLm91dGVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN0ID0gbGlbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY3QucmlnaHQgPCAod2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0TGkgPSBsaS5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0TGlbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0TGlSZWN0ID0gbmV4dExpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dExpUmVjdC5yaWdodCA+PSAod2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZmNhbnZhcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmQ2FudmFzTGkucHVzaChsaVswXS5vdXRlckhUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZjYW52YXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZDYW52YXNMaS5wdXNoKGxpWzBdLm91dGVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9mZmNhbnZhcyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBvZmZDYW52YXNMaSk7XG5cbiAgICAgICAgICAgICAgICBpZiAob2ZmQ2FudmFzTGkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoJ3VsLm5hdicpLmFwcGVuZChtb3JlKS5maW5kKCcuaXRlbXMtbW9yZScpLmFwcGVuZChvZmZDYW52YXNMaS5qb2luKCcnKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LDApO1xuXG4gICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQoJHdpbmRvdykuYmluZCgncmVzaXplJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgIHZhciBvZmZjYW52YXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB2YXIgb2ZmQ2FudmFzTGkgPSBbXTtcblxuICAgICAgICAgICAgICAgIHZhciBjbG9uZU1vcmUgPSBlbGVtZW50LmZpbmQoJy5pdGVtcy1tb3JlJykuaHRtbCgpO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudC5maW5kKCcubmF2LW1vcmUnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoJ3VsLm5hdicpLmFwcGVuZChjbG9uZU1vcmUpO1xuXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKGVsZW1lbnQuZmluZCgndWwubmF2IGxpJyksIGZ1bmN0aW9uKHZhbHVlLCBrZXkpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGkgPSBhbmd1bGFyLmVsZW1lbnQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGkucGFyZW50KCkuaGFzQ2xhc3MoJ25hdicpKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZjYW52YXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZDYW52YXNMaS5wdXNoKGxpWzBdLm91dGVySFRNTCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWN0ID0gbGlbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlY3QucmlnaHQgPCAod2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0TGkgPSBsaS5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0TGlbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXh0TGlSZWN0ID0gbmV4dExpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV4dExpUmVjdC5yaWdodCA+PSAod2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZmNhbnZhcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmQ2FudmFzTGkucHVzaChsaVswXS5vdXRlckhUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmY2FudmFzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2ZmQ2FudmFzTGkucHVzaChsaVswXS5vdXRlckhUTUwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvZmZjYW52YXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgb2ZmQ2FudmFzTGkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9mZkNhbnZhc0xpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5maW5kKCd1bC5uYXYnKS5hcHBlbmQobW9yZSkuZmluZCgnLml0ZW1zLW1vcmUnKS5hcHBlbmQob2ZmQ2FudmFzTGkuam9pbignJykpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vTGF5b3V0VG9nZ2xlXG5sYXlvdXRUb2dnbGVEaXJlY3RpdmUuJGluamVjdCA9IFsnJGludGVydmFsJ107XG5mdW5jdGlvbiBsYXlvdXRUb2dnbGVEaXJlY3RpdmUoJGludGVydmFsKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgbGluazogbGlua1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyIGJvZHlDbGFzcyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdib2R5LWNsYXNzJyk7XG5cbiAgICAgICAgICAgIGlmICgoZWxlbWVudC5oYXNDbGFzcygnbGF5b3V0LXRvZ2dsZXInKSB8fCBlbGVtZW50Lmhhc0NsYXNzKCdzaWRlYmFyLWNsb3NlJykpICYmIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLmhhc0NsYXNzKCdzaWRlYmFyLW9mZi1jYW52YXMnKSkge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLnRvZ2dsZUNsYXNzKCdzaWRlYmFyLW9wZW5lZCcpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKCdzaWRlYmFyLW9wZW5lZCcpO1xuXG4gICAgICAgICAgICAgICAgJGludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdyZXNpemUnKSk7XG4gICAgICAgICAgICAgICAgfSwgMTAwLCA1KTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChlbGVtZW50Lmhhc0NsYXNzKCdsYXlvdXQtdG9nZ2xlcicpICYmIChhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKS5oYXNDbGFzcygnc2lkZWJhci1uYXYnKSB8fCBib2R5Q2xhc3MgPT09ICdzaWRlYmFyLW5hdicpKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdib2R5JykudG9nZ2xlQ2xhc3MoJ3NpZGViYXItbmF2Jyk7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2JvZHktY2xhc3MnLCAnc2lkZWJhci1uYXYnKTtcbiAgICAgICAgICAgICAgICBpZiAoYm9keUNsYXNzID09PSAnc2lkZWJhci1uYXYnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCwgNSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0NsYXNzKCdhc2lkZS10b2dnbGUnKSkge1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudCgnYm9keScpLnRvZ2dsZUNsYXNzKCdhc2lkZS1tZW51LW9wZW4nKTtcblxuICAgICAgICAgICAgICAgICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgncmVzaXplJykpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCwgNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy9Db2xsYXBzZSBtZW51IHRvZ2dsZXJcbmZ1bmN0aW9uIGNvbGxhcHNlTWVudVRvZ2dsZXJEaXJlY3RpdmUoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgbGluazogbGlua1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmIChlbGVtZW50Lmhhc0NsYXNzKCduYXZiYXItdG9nZ2xlcicpICYmICFlbGVtZW50Lmhhc0NsYXNzKCdsYXlvdXQtdG9nZ2xlcicpKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCdib2R5JykudG9nZ2xlQ2xhc3MoJ21vYmlsZS1vcGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy9Cb290c3RyYXAgQ2Fyb3VzZWxcbmZ1bmN0aW9uIGJvb3RzdHJhcENhcm91c2VsRGlyZWN0aXZlKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIGxpbms6IGxpbmtcbiAgICB9O1xuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnMucmlkZSA9PT0gJ2Nhcm91c2VsJyl7XG4gICAgICAgICAgICBlbGVtZW50LmZpbmQoJ2EnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKCdkYXRhLXRhcmdldCcsJCh0aGlzKS5hdHRyKCdocmVmJykucmVwbGFjZSgnaW5kZXguaHRtbCcsJycpKS5hdHRyKCdocmVmJywnamF2YXNjcmlwdDs7Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy9Cb290c3RyYXAgVG9vbHRpcHMgJiBQb3BvdmVyc1xuZnVuY3Rpb24gYm9vdHN0cmFwVG9vbHRpcHNQb3BvdmVyc0RpcmVjdGl2ZSgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzLnRvZ2dsZSA9PT0gJ3Rvb2x0aXAnKXtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS50b29sdGlwKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJzLnRvZ2dsZSA9PT0gJ3BvcG92ZXInKXtcbiAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChlbGVtZW50KS5wb3BvdmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vQm9vdHN0cmFwIFRhYnNcbmZ1bmN0aW9uIGJvb3RzdHJhcFRhYnNEaXJlY3RpdmUoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogbGlua1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIGVsZW1lbnQuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KGVsZW1lbnQpLnRhYignc2hvdycpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8vQ2FyZCBDb2xsYXBzZVxuZnVuY3Rpb24gY2FyZENvbGxhcHNlRGlyZWN0aXZlKCkge1xuICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIGxpbms6IGxpbmtcbiAgICB9O1xuICAgIHJldHVybiBkaXJlY3RpdmU7XG5cbiAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBpZiAoYXR0cnMudG9nZ2xlID09PSAnY29sbGFwc2UnICYmIGVsZW1lbnQucGFyZW50KCkuaGFzQ2xhc3MoJ2NhcmQtYWN0aW9ucycpKXtcblxuICAgICAgICAgICAgaWYgKGVsZW1lbnQucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuZmluZCgnLmNhcmQtYmxvY2snKS5oYXNDbGFzcygnaW4nKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZmluZCgnaScpLmFkZENsYXNzKCdyMTgwJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpZCA9ICdjb2xsYXBzZS0nICsgTWF0aC5mbG9vcigoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwMDApICsgMSk7XG4gICAgICAgICAgICBlbGVtZW50LmF0dHIoJ2RhdGEtdGFyZ2V0JywnIycraWQpO1xuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCcuY2FyZC1ibG9jaycpLmF0dHIoJ2lkJyxpZCk7XG5cbiAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmZpbmQoJ2knKS50b2dnbGVDbGFzcygncjE4MCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmlvblNsaWRlckRpcmVjdGl2ZS4kaW5qZWN0ID0gWyckdGltZW91dCddO1xuZnVuY3Rpb24gaW9uU2xpZGVyRGlyZWN0aXZlKCR0aW1lb3V0KSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgICByZXN0cmljdDonRScsXG4gICAgICAgIHNjb3BlOntcbiAgICAgICAgICAgIG1pbjonPScsXG4gICAgICAgICAgICBtYXg6Jz0nLFxuICAgICAgICAgICAgdHlwZTonQCcsXG4gICAgICAgICAgICBwcmVmaXg6J0AnLFxuICAgICAgICAgICAgbWF4UG9zdGZpeDonQCcsXG4gICAgICAgICAgICBwcmV0dGlmeTonQCcsXG4gICAgICAgICAgICBncmlkOidAJyxcbiAgICAgICAgICAgIGdyaWRNYXJnaW46J0AnLFxuICAgICAgICAgICAgcG9zdGZpeDonQCcsXG4gICAgICAgICAgICBzdGVwOidAJyxcbiAgICAgICAgICAgIGhpZGVNaW5NYXg6J0AnLFxuICAgICAgICAgICAgaGlkZUZyb21UbzonQCcsXG4gICAgICAgICAgICBmcm9tOic9JyxcbiAgICAgICAgICAgIGRpc2FibGU6Jz0nLFxuICAgICAgICAgICAgb25DaGFuZ2U6Jz0nLFxuICAgICAgICAgICAgb25GaW5pc2g6Jz0nLFxuICAgICAgICAgICAgbmdNb2RlbCA6ICcmJ1xuICAgICAgICB9LFxuICAgICAgICB0ZW1wbGF0ZTonPGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJcIi8+JyxcbiAgICAgICAgcmVwbGFjZTp0cnVlLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIG5nTW9kZWwpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXR1cm4gbmdNb2RlbC4kbW9kZWxWYWx1ZTtcbiAgICAgICAgfSwgZnVuY3Rpb24obW9kZWxWYWx1ZSl7XG4gICAgICAgICAgICBpZiAobW9kZWxWYWx1ZS5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5pb25SYW5nZVNsaWRlcihtb2RlbFZhbHVlLm9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmlvblJhbmdlU2xpZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgbWluOiBzY29wZS5taW4sXG4gICAgICAgICAgICAgICAgICAgIG1heDogc2NvcGUubWF4LFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBzY29wZS50eXBlLFxuICAgICAgICAgICAgICAgICAgICBwcmVmaXg6IHNjb3BlLnByZWZpeCxcbiAgICAgICAgICAgICAgICAgICAgbWF4UG9zdGZpeDogc2NvcGUubWF4UG9zdGZpeCxcbiAgICAgICAgICAgICAgICAgICAgcHJldHRpZnk6IHNjb3BlLnByZXR0aWZ5LFxuICAgICAgICAgICAgICAgICAgICBncmlkOiBzY29wZS5ncmlkLFxuICAgICAgICAgICAgICAgICAgICBncmlkTWFyZ2luOiBzY29wZS5ncmlkTWFyZ2luLFxuICAgICAgICAgICAgICAgICAgICBwb3N0Zml4OnNjb3BlLnBvc3RmaXgsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA6c2NvcGUuc3RlcCxcbiAgICAgICAgICAgICAgICAgICAgaGlkZU1pbk1heDpzY29wZS5oaWRlTWluTWF4LFxuICAgICAgICAgICAgICAgICAgICBoaWRlRnJvbVRvOnNjb3BlLmhpZGVGcm9tVG8sXG4gICAgICAgICAgICAgICAgICAgIGZyb206c2NvcGUuZnJvbSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZTpzY29wZS5kaXNhYmxlLFxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZTpzY29wZS5vbkNoYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgb25GaW5pc2g6c2NvcGUub25GaW5pc2hcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNjb3BlLiR3YXRjaCgnbWluJywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7IGVsZW1lbnQuZGF0YSgnaW9uUmFuZ2VTbGlkZXInKS51cGRhdGUoe21pbjogdmFsdWV9KTsgfSk7XG4gICAgICAgIH0sdHJ1ZSk7XG4gICAgICAgIHNjb3BlLiR3YXRjaCgnbWF4JywgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7IGVsZW1lbnQuZGF0YSgnaW9uUmFuZ2VTbGlkZXInKS51cGRhdGUoe21heDogdmFsdWV9KTsgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzY29wZS4kd2F0Y2goJ2Zyb20nLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXsgZWxlbWVudC5kYXRhKCdpb25SYW5nZVNsaWRlcicpLnVwZGF0ZSh7ZnJvbTogdmFsdWV9KTsgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzY29wZS4kd2F0Y2goJ2Rpc2FibGUnLCBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXsgZWxlbWVudC5kYXRhKCdpb25SYW5nZVNsaWRlcicpLnVwZGF0ZSh7ZGlzYWJsZTogdmFsdWV9KTsgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxudmVydGljYWxBbGlnbk1pZGRsZURpcmVjdGl2ZS4kaW5qZWN0ID0gWyckd2luZG93J107XG5mdW5jdGlvbiB2ZXJ0aWNhbEFsaWduTWlkZGxlRGlyZWN0aXZlKCR3aW5kb3cpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIGJvZHlIZWlnaHQgPSBhbmd1bGFyLmVsZW1lbnQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGZvcm1IZWlnaHQgPSBlbGVtZW50LmhlaWdodCgpO1xuICAgICAgICB2YXIgbWFyZ2luVG9wID0gKGJvZHlIZWlnaHQgLyAyKSAtIChmb3JtSGVpZ2h0IC8gMik7XG5cbiAgICAgICAgaWYgKG1hcmdpblRvcCA+IDApIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKCdtYXJnaW4tdG9wJywgbWFyZ2luVG9wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuZ3VsYXIuZWxlbWVudCgkd2luZG93KS5iaW5kKCdyZXNpemUnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIGJvZHlIZWlnaHQgPSBhbmd1bGFyLmVsZW1lbnQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgICAgICAgIHZhciBmb3JtSGVpZ2h0ID0gZWxlbWVudC5oZWlnaHQoKTtcbiAgICAgICAgICAgIHZhciBtYXJnaW5Ub3AgPSAoYm9keUhlaWdodCAvIDIpIC0gKGZvcm1IZWlnaHQgLyAyKTtcblxuICAgICAgICAgICAgaWYgKG1hcmdpblRvcCA+IDApIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNzcygnbWFyZ2luLXRvcCcsIG1hcmdpblRvcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5lbWFpbEFwcERpcmVjdGl2ZS4kaW5qZWN0ID0gWyckd2luZG93J107XG5mdW5jdGlvbiBlbWFpbEFwcERpcmVjdGl2ZSgkd2luZG93KSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgbGluazogbGlua1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBoZWlnaHQgPSBhbmd1bGFyLmVsZW1lbnQod2luZG93KS5oZWlnaHQoKSAtIGFuZ3VsYXIuZWxlbWVudCgnLm5hdmJhcicpLm91dGVySGVpZ2h0KCkgLSBhbmd1bGFyLmVsZW1lbnQoJy5icmVhZGNydW1iJykub3V0ZXJIZWlnaHQoKSAtIGFuZ3VsYXIuZWxlbWVudCgnI2Zvb3RlcicpLm91dGVySGVpZ2h0KCkgLSAxNTg7XG4gICAgICAgIGVsZW1lbnQuY3NzKCdtaW4taGVpZ2h0JywgaGVpZ2h0KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGdhdWdlSnNEaXJlY3RpdmUoKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBQycsXG4gICAgICAgIHNjb3BlOiB7XG4gICAgICAgICAgICAnYW5pbWF0aW9uVGltZSc6ICc9JyxcbiAgICAgICAgICAgICd2YWx1ZSc6ICc9JyxcbiAgICAgICAgICAgICdvcHRpb25zJzogJz0nLFxuICAgICAgICAgICAgJ21heFZhbHVlJzogJz0nLFxuICAgICAgICAgICAgJ2dhdWdlVHlwZSc6ICc9J1xuICAgICAgICB9LFxuICAgICAgICBjb250cm9sbGVyOiBjb250cm9sbGVyXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gY29udHJvbGxlcigkc2NvcGUsICRlbGVtZW50KSB7XG4gICAgICAgIGlmICgkc2NvcGUuZ2F1Z2VUeXBlID09PSAnZG9udXQnKSB7XG4gICAgICAgICAgICAkc2NvcGUuZ2F1Z2UgPSBuZXcgRG9udXQoJGVsZW1lbnRbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHNjb3BlLmdhdWdlID0gbmV3IEdhdWdlKCRlbGVtZW50WzBdKTtcbiAgICAgICAgfVxuICAgICAgICAkZWxlbWVudC5hZGRDbGFzcygnZ2F1Z2VqcycpO1xuICAgICAgICAkc2NvcGUuZ2F1Z2UubWF4VmFsdWUgPSAkc2NvcGUubWF4VmFsdWU7XG4gICAgICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCdbb3B0aW9ucywgdmFsdWVdJywgZnVuY3Rpb24obmV3VmFsdWVzKXtcbiAgICAgICAgICAgICRzY29wZS5nYXVnZS5zZXRPcHRpb25zKG5ld1ZhbHVlc1swXSk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKG5ld1ZhbHVlc1sxXSkpe1xuICAgICAgICAgICAgICAgICRzY29wZS5nYXVnZS5zZXQobmV3VmFsdWVzWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsICckb2NMYXp5TG9hZFByb3ZpZGVyJywgJyRicmVhZGNydW1iUHJvdmlkZXInLCBmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyLCAkb2NMYXp5TG9hZFByb3ZpZGVyLCAkYnJlYWRjcnVtYlByb3ZpZGVyKSB7XG5cbiAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2Rhc2hib2FyZCcpO1xuXG4gICAgICAgICRvY0xhenlMb2FkUHJvdmlkZXIuY29uZmlnKHtcbiAgICAgICAgICAgIC8vIFNldCB0byB0cnVlIGlmIHlvdSB3YW50IHRvIHNlZSB3aGF0IGFuZCB3aGVuIGlzIGR5bmFtaWNhbGx5IGxvYWRlZFxuICAgICAgICAgICAgZGVidWc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGJyZWFkY3J1bWJQcm92aWRlci5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgIHByZWZpeFN0YXRlTmFtZTogJ2FwcC5tYWluJyxcbiAgICAgICAgICAgIGluY2x1ZGVBYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGxpIG5nLXJlcGVhdD1cInN0ZXAgaW4gc3RlcHNcIiBuZy1jbGFzcz1cInthY3RpdmU6ICRsYXN0fVwiIG5nLXN3aXRjaD1cIiRsYXN0IHx8ICEhc3RlcC5hYnN0cmFjdFwiPjxhIG5nLXN3aXRjaC13aGVuPVwiZmFsc2VcIiBocmVmPVwie3tzdGVwLm5jeUJyZWFkY3J1bWJMaW5rfX1cIj57e3N0ZXAubmN5QnJlYWRjcnVtYkxhYmVsfX08L2E+PHNwYW4gbmctc3dpdGNoLXdoZW49XCJ0cnVlXCI+e3tzdGVwLm5jeUJyZWFkY3J1bWJMYWJlbH19PC9zcGFuPjwvbGk+J1xuICAgICAgICB9KTtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tb24vbGF5b3V0cy9mdWxsLmh0bWwnLFxuICAgICAgICAgICAgICAgIC8vcGFnZSB0aXRsZSBnb2VzIGhlcmVcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnUm9vdCcsXG4gICAgICAgICAgICAgICAgICAgIHNraXA6IHRydWVcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFBsdWdpbjogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uICgkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geW91IGNhbiBsYXp5IGxvYWQgZmlsZXMgZm9yIGFuIGV4aXN0aW5nIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2hhcnQuanMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL0NoYXJ0Lm1pbi5qcycsICdhc3NldHMvanMvbGlicy9hbmd1bGFyLWNoYXJ0Lm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICBsb2FkTXlDdHJsOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24oJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gbGF6eSBsb2FkIGNvbnRyb2xsZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2NvbnRyb2xsZXJzL3NoYXJlZC5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWFpbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvZGFzaGJvYXJkJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL21haW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgLy9wYWdlIHRpdGxlIGdvZXMgaGVyZVxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICd7eyBcIkhPTUVcIiB8IHRyYW5zbGF0ZSB9fSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vcGFnZSBzdWJ0aXRsZSBnb2VzIGhlcmVcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHsgc3VidGl0bGU6ICdXZWxjb21lIHRvIFJPT1QgcG93ZXJmdWxsIEJvb3RzdHJhcCAmIEFuZ3VsYXJKUyBVSSBLaXQnIH0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsb2FkUGx1Z2luOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24gKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB5b3UgY2FuIGxhenkgbG9hZCBmaWxlcyBmb3IgYW4gZXhpc3RpbmcgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2xpYnMvbW9tZW50Lm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9kYXRlcmFuZ2VwaWNrZXIubWluLmpzJywgJ2Fzc2V0cy9qcy9saWJzL2FuZ3VsYXItZGF0ZXJhbmdlcGlja2VyLm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2hhcnQuanMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9DaGFydC5taW4uanMnLCAnYXNzZXRzL2pzL2xpYnMvYW5ndWxhci1jaGFydC5taW4uanMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2xpYnMvZ2F1Z2UubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL2FuZ3VsYXItdG9hc3RyLnRwbHMubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRNeUN0cmw6IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbigkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geW91IGNhbiBsYXp5IGxvYWQgY29udHJvbGxlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvY29udHJvbGxlcnMvbWFpbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAubWFpbjInLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Rhc2hib2FyZDInLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvbWFpbjIuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0FsdGVybmF0aXZlJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7IHN1YnRpdGxlOiAnU3VidGl0bGUgZ29lcyBoZXJlIScgfSxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRQbHVnaW46IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbiAoJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gbGF6eSBsb2FkIGZpbGVzIGZvciBhbiBleGlzdGluZyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9tb21lbnQubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL2RhdGVyYW5nZXBpY2tlci5taW4uanMnLCAnYXNzZXRzL2pzL2xpYnMvYW5ndWxhci1kYXRlcmFuZ2VwaWNrZXIubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjaGFydC5qcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL0NoYXJ0Lm1pbi5qcycsICdhc3NldHMvanMvbGlicy9hbmd1bGFyLWNoYXJ0Lm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9nYXVnZS5taW4uanMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2xpYnMvYW5ndWxhci10b2FzdHIudHBscy5taW4uanMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZE15Q3RybDogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB5b3UgY2FuIGxhenkgbG9hZCBjb250cm9sbGVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9jb250cm9sbGVycy9tYWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcFNpbXBsZScsIHtcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW1vbi9sYXlvdXRzL3NpbXBsZS5odG1sJ1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gQWRkaXRpb25hbCBQYWdlc1xuICAgICAgICAgICAgLnN0YXRlKCdhcHBTaW1wbGUubG9naW4nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3BhZ2VzL2xvZ2luLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHBTaW1wbGUucmVnaXN0ZXInLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3JlZ2lzdGVyJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3BhZ2VzL3JlZ2lzdGVyLmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHBTaW1wbGUuNDA0Jywge1xuICAgICAgICAgICAgICAgIHVybDogJy80MDQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGFnZXMvNDA0Lmh0bWwnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHBTaW1wbGUuNTAwJywge1xuICAgICAgICAgICAgICAgIHVybDogJy81MDAnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvcGFnZXMvNTAwLmh0bWwnXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAvL1VJIEtpdHNcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVpa2l0cycsIHtcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzx1aS12aWV3PjwvdWktdmlldz4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdVSSBLaXRzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vVUkgS2l0cyAtIEludm9pY2luZyBBcHBcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVpa2l0cy5pbnZvaWNpbmcnLCB7XG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8dWktdmlldz48L3VpLXZpZXc+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnSW52b2ljaW5nJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51aWtpdHMuaW52b2ljaW5nLmludm9pY2UnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3Vpa2l0cy9pbnZvaWNpbmcvaW52b2ljZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9VSWtpdHMvaW52b2ljaW5nL2ludm9pY2UuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ3t7IFwiSU5WT0lDRVwiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIC8vVUkgS2l0cyAtIEVtYWlsIEFwcFxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudWlraXRzLmVtYWlsJywge1xuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVpLXZpZXc+PC91aS12aWV3PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0VtYWlsJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC51aWtpdHMuZW1haWwuaW5ib3gnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3Vpa2l0cy9lbWFpbC9pbmJveCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9VSWtpdHMvZW1haWwvaW5ib3guaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ3t7IFwiSU5CT1hcIiB8IHRyYW5zbGF0ZSB9fSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAudWlraXRzLmVtYWlsLm1lc3NhZ2UnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3Vpa2l0cy9lbWFpbC9tZXNzYWdlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL1VJa2l0cy9lbWFpbC9tZXNzYWdlLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICd7eyBcIklOQk9YXCIgfCB0cmFuc2xhdGUgfX0nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnVpa2l0cy5lbWFpbC5jb21wb3NlJywge1xuICAgICAgICAgICAgICAgIHVybDogJy91aWtpdHMvZW1haWwvY29tcG9zZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9VSWtpdHMvZW1haWwvY29tcG9zZS5odG1sJyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAne3sgXCJJTkJPWFwiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsb2FkUGx1Z2luOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24gKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB5b3UgY2FuIGxhenkgbG9hZCBmaWxlcyBmb3IgYW4gZXhpc3RpbmcgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9zZWxlY3QubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRNeUN0cmw6IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbigkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geW91IGNhbiBsYXp5IGxvYWQgY29udHJvbGxlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvY29udHJvbGxlcnMvdWlraXRzL2VtYWlsLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbmZpZyhmdW5jdGlvbigkdHJhbnNsYXRlUHJvdmlkZXIpIHtcbiAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyXG4gICAgICAgIC51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZScpXG4gICAgICAgIC50cmFuc2xhdGlvbnMoJ2VuJywge1xuICAgICAgICAgICAgQ0hPT1NFX0xBTkdVQUdFOidDaG9vc2UgbGFuZ3VhZ2UnLFxuICAgICAgICAgICAgSE9NRTogICAgICAgICAgICdIb21lJyxcbiAgICAgICAgICAgIERBU0hCT0FSRDogICAgICAnRGFzaGJvYXJkJyxcbiAgICAgICAgICAgIElDT05TOiAgICAgICAgICAnSWNvbnMnLFxuICAgICAgICAgICAgRk9STVM6ICAgICAgICAgICdGb3JtcycsXG4gICAgICAgICAgICBXSURHRVRTOiAgICAgICAgJ1dpZGdldHMnLFxuICAgICAgICAgICAgQlVUVE9OUzogICAgICAgICdCdXR0b25zJyxcbiAgICAgICAgICAgIE5PVElGSUNBVElPTlM6ICAnTm90aWZpY2F0aW9ucycsXG4gICAgICAgICAgICBUQUJMRVM6ICAgICAgICAgJ1RhYmxlcycsXG4gICAgICAgICAgICBTTElERVJTOiAgICAgICAgJ1NsaWRlcnMnLFxuICAgICAgICAgICAgQ0hBUlRTOiAgICAgICAgICdDaGFydHMnLFxuICAgICAgICAgICAgQUNDT1VOVDogICAgICAgICdBY2NvdW50JyxcbiAgICAgICAgICAgIFVQREFURVM6ICAgICAgICAnVXBkYXRlcycsXG4gICAgICAgICAgICBNRVNTQUdFUzogICAgICAgJ01lc3NhZ2VzJyxcbiAgICAgICAgICAgIFRBU0tTOiAgICAgICAgICAnVGFza3MnLFxuICAgICAgICAgICAgQ09NTUVOVFM6ICAgICAgICdDb21tZW50cycsXG4gICAgICAgICAgICBTRVRUSU5HUzogICAgICAgJ1NldHRpbmdzJyxcbiAgICAgICAgICAgIFBST0ZJTEU6ICAgICAgICAnUHJvZmlsZScsXG4gICAgICAgICAgICBQQVlNRU5UUzogICAgICAgJ1BheW1lbnRzJyxcbiAgICAgICAgICAgIFBST0pFQ1RTOiAgICAgICAnUHJvamVjdHMnLFxuICAgICAgICAgICAgTE9DS19BQ0NPVU5UOiAgICdMb2NrIGFjY291bnQnLFxuICAgICAgICAgICAgTE9HT1VUOiAgICAgICAgICdMb2dvdXQnLFxuICAgICAgICAgICAgQ0FMRU5EQVI6ICAgICAgICdDYWxlbmRhcicsXG4gICAgICAgICAgICBBTklNQVRJT05TOiAgICAgJ0FuaW1hdGlvbnMnXG4gICAgICAgIH0pXG4gICAgICAgIC50cmFuc2xhdGlvbnMoJ2VzJywge1xuICAgICAgICAgICAgQ0hPT1NFX0xBTkdVQUdFOidFbGlnZSBsZW5ndWEnLFxuICAgICAgICAgICAgSE9NRTogICAgICAgICAgICdFbXBlemFyJyxcbiAgICAgICAgICAgIERBU0hCT0FSRDogICAgICAnVGFibGVybycsXG4gICAgICAgICAgICBJQ09OUzogICAgICAgICAgJ0ljb25vcycsXG4gICAgICAgICAgICBGT1JNUzogICAgICAgICAgJ0Zvcm1hcycsXG4gICAgICAgICAgICBXSURHRVRTOiAgICAgICAgJ1dpZGdldCcsXG4gICAgICAgICAgICBCVVRUT05TOiAgICAgICAgJ0JvdMOzbicsXG4gICAgICAgICAgICBOT1RJRklDQVRJT05TOiAgJ05vdGlmaWNhY2lvbmVzJyxcbiAgICAgICAgICAgIFRBQkxFUzogICAgICAgICAnTWVzYXMnLFxuICAgICAgICAgICAgU0xJREVSUzogICAgICAgICdEZXNsaXphZG9yJyxcbiAgICAgICAgICAgIENIQVJUUzogICAgICAgICAnR3LDoWZpY2FzJyxcbiAgICAgICAgICAgIEFDQ09VTlQ6ICAgICAgICAnQ3VlbnRhJyxcbiAgICAgICAgICAgIFVQREFURVM6ICAgICAgICAnQWN0dWFsaXphY2lvbmVzJyxcbiAgICAgICAgICAgIE1FU1NBR0VTOiAgICAgICAnTWVuc2FqZXMnLFxuICAgICAgICAgICAgVEFTS1M6ICAgICAgICAgICdUYXJlYXMnLFxuICAgICAgICAgICAgQ09NTUVOVFM6ICAgICAgICdDb21lbnRhcmlvcycsXG4gICAgICAgICAgICBTRVRUSU5HUzogICAgICAgJ0FqdXN0ZXMnLFxuICAgICAgICAgICAgUFJPRklMRTogICAgICAgICdQZXJmaWxhcicsXG4gICAgICAgICAgICBQQVlNRU5UUzogICAgICAgJ1BhZ29zJyxcbiAgICAgICAgICAgIFBST0pFQ1RTOiAgICAgICAnUHJveWVjdG9zJyxcbiAgICAgICAgICAgIExPQ0tfQUNDT1VOVDogICAnQmxvcXVlbyBkZSBjdWVudGEnLFxuICAgICAgICAgICAgTE9HT1VUOiAgICAgICAgICdDZXJyYXIgc2VzaW9uJyxcbiAgICAgICAgICAgIENBTEVOREFSOiAgICAgICAnQ2FsZW5kYXJpbycsXG4gICAgICAgICAgICBBTklNQVRJT05TOiAgICAgJ0FuaW1hY2lvbmVzJ1xuICAgICAgICB9KVxuICAgICAgICAudHJhbnNsYXRpb25zKCdwbCcsIHtcbiAgICAgICAgICAgIENIT09TRV9MQU5HVUFHRTonV3liaWVyeiBqxJl6eWsnLFxuICAgICAgICAgICAgSE9NRTogICAgICAgICAgICdTdGFydCcsXG4gICAgICAgICAgICBEQVNIQk9BUkQ6ICAgICAgJ1BhbmVsJyxcbiAgICAgICAgICAgIElDT05TOiAgICAgICAgICAnSWtvbnknLFxuICAgICAgICAgICAgRk9STVM6ICAgICAgICAgICdGb3JtdWxhcnplJyxcbiAgICAgICAgICAgIFdJREdFVFM6ICAgICAgICAnV2lkxbxldHknLFxuICAgICAgICAgICAgQlVUVE9OUzogICAgICAgICdQcnp5Y2lza2knLFxuICAgICAgICAgICAgTk9USUZJQ0FUSU9OUzogICdOb3R5ZmlrYWNqZScsXG4gICAgICAgICAgICBUQUJMRVM6ICAgICAgICAgJ1RhYmVsZScsXG4gICAgICAgICAgICBTTElERVJTOiAgICAgICAgJ1N1d2FraScsXG4gICAgICAgICAgICBDSEFSVFM6ICAgICAgICAgJ1d5a3Jlc3knLFxuICAgICAgICAgICAgQUNDT1VOVDogICAgICAgICdLb250bycsXG4gICAgICAgICAgICBVUERBVEVTOiAgICAgICAgJ0FrdHVhbGl6YWNqZScsXG4gICAgICAgICAgICBNRVNTQUdFUzogICAgICAgJ1dpYWRvbW/Fm2NpJyxcbiAgICAgICAgICAgIFRBU0tTOiAgICAgICAgICAnWmFkYW5pYScsXG4gICAgICAgICAgICBDT01NRU5UUzogICAgICAgJ0tvbWVudGFyemUnLFxuICAgICAgICAgICAgU0VUVElOR1M6ICAgICAgICdVc3Rhd2llbmlhJyxcbiAgICAgICAgICAgIFBST0ZJTEU6ICAgICAgICAnUHJvZmlsJyxcbiAgICAgICAgICAgIFBBWU1FTlRTOiAgICAgICAnUMWCYXRub8WbY2knLFxuICAgICAgICAgICAgUFJPSkVDVFM6ICAgICAgICdQcm9qZWt0eScsXG4gICAgICAgICAgICBMT0NLX0FDQ09VTlQ6ICAgJ1phYmxva3VqIGtvbnRvJyxcbiAgICAgICAgICAgIExPR09VVDogICAgICAgICAnV3lsb2d1aicsXG4gICAgICAgICAgICBDQUxFTkRBUjogICAgICAgJ0thbGVuZGFyeicsXG4gICAgICAgICAgICBBTklNQVRJT05TOiAgICAgJ0FuaW1hY2plJ1xuICAgICAgICB9KTtcbiAgICAgICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnByZWZlcnJlZExhbmd1YWdlKCdlbicpO1xuICAgIH0pO1xuIiwiLy9jYWxlbmRhci5qc1xuJ3VzZSBzdHJpY3QnO1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0NhbGVuZGFyQ3RybCcsIENhbGVuZGFyQ3RybCk7XG5cbkNhbGVuZGFyQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGNvbXBpbGUnLCAndWlDYWxlbmRhckNvbmZpZyddO1xuZnVuY3Rpb24gQ2FsZW5kYXJDdHJsKCRzY29wZSwgJGNvbXBpbGUsIHVpQ2FsZW5kYXJDb25maWcpIHtcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGQgPSBkYXRlLmdldERhdGUoKTtcbiAgICB2YXIgbSA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICB2YXIgeSA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcblxuICAgICRzY29wZS5jaGFuZ2VUbyA9ICdIdW5nYXJpYW4nO1xuICAgIC8qIGV2ZW50IHNvdXJjZSB0aGF0IHB1bGxzIGZyb20gZ29vZ2xlLmNvbSAqL1xuICAgICRzY29wZS5ldmVudFNvdXJjZSA9IHtcbiAgICAgICAgdXJsOiAnaHR0cDovL3d3dy5nb29nbGUuY29tL2NhbGVuZGFyL2ZlZWRzL3VzYV9fZW4lNDBob2xpZGF5LmNhbGVuZGFyLmdvb2dsZS5jb20vcHVibGljL2Jhc2ljJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZ2NhbC1ldmVudCcsICAgICAgICAgICAvLyBhbiBvcHRpb24hXG4gICAgICAgIGN1cnJlbnRUaW1lem9uZTogJ0FtZXJpY2EvQ2hpY2FnbycgLy8gYW4gb3B0aW9uIVxuICAgIH07XG4gICAgLyogZXZlbnQgc291cmNlIHRoYXQgY29udGFpbnMgY3VzdG9tIGV2ZW50cyBvbiB0aGUgc2NvcGUgKi9cbiAgICAkc2NvcGUuZXZlbnRzID0gW1xuICAgICAgICB7dGl0bGU6ICdBbGwgRGF5IEV2ZW50JyxzdGFydDogbmV3IERhdGUoeSwgbSwgMSl9LFxuICAgICAgICB7dGl0bGU6ICdMb25nIEV2ZW50JyxzdGFydDogbmV3IERhdGUoeSwgbSwgZCAtIDUpLGVuZDogbmV3IERhdGUoeSwgbSwgZCAtIDIpfSxcbiAgICAgICAge2lkOiA5OTksdGl0bGU6ICdSZXBlYXRpbmcgRXZlbnQnLHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkIC0gMywgMTYsIDApLGFsbERheTogZmFsc2V9LFxuICAgICAgICB7aWQ6IDk5OSx0aXRsZTogJ1JlcGVhdGluZyBFdmVudCcsc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQgKyA0LCAxNiwgMCksYWxsRGF5OiBmYWxzZX0sXG4gICAgICAgIHt0aXRsZTogJ0JpcnRoZGF5IFBhcnR5JyxzdGFydDogbmV3IERhdGUoeSwgbSwgZCArIDEsIDE5LCAwKSxlbmQ6IG5ldyBEYXRlKHksIG0sIGQgKyAxLCAyMiwgMzApLGFsbERheTogZmFsc2V9LFxuICAgICAgICB7dGl0bGU6ICdDbGljayBmb3IgR29vZ2xlJyxzdGFydDogbmV3IERhdGUoeSwgbSwgMjgpLGVuZDogbmV3IERhdGUoeSwgbSwgMjkpLHVybDogJ2h0dHA6Ly9nb29nbGUuY29tLyd9XG4gICAgXTtcbiAgICAvKiBldmVudCBzb3VyY2UgdGhhdCBjYWxscyBhIGZ1bmN0aW9uIG9uIGV2ZXJ5IHZpZXcgc3dpdGNoICovXG4gICAgJHNjb3BlLmV2ZW50c0YgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCwgdGltZXpvbmUsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBzID0gbmV3IERhdGUoc3RhcnQpLmdldFRpbWUoKSAvIDEwMDA7XG4gICAgICAgIHZhciBlID0gbmV3IERhdGUoZW5kKS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgICB2YXIgbSA9IG5ldyBEYXRlKHN0YXJ0KS5nZXRNb250aCgpO1xuICAgICAgICB2YXIgZXZlbnRzID0gW3t0aXRsZTogJ0ZlZWQgTWUgJyArIG0sc3RhcnQ6IHMgKyAoNTAwMDApLGVuZDogcyArICgxMDAwMDApLGFsbERheTogZmFsc2UsIGNsYXNzTmFtZTogWydjdXN0b21GZWVkJ119XTtcbiAgICAgICAgY2FsbGJhY2soZXZlbnRzKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbEV2ZW50c0V4dCA9IHtcbiAgICAgICAgY29sb3I6ICcjZjAwJyxcbiAgICAgICAgdGV4dENvbG9yOiAneWVsbG93JyxcbiAgICAgICAgZXZlbnRzOiBbXG4gICAgICAgICAgICB7dHlwZToncGFydHknLHRpdGxlOiAnTHVuY2gnLHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCBkLCAxMiwgMCksZW5kOiBuZXcgRGF0ZSh5LCBtLCBkLCAxNCwgMCksYWxsRGF5OiBmYWxzZX0sXG4gICAgICAgICAgICB7dHlwZToncGFydHknLHRpdGxlOiAnTHVuY2ggMicsc3RhcnQ6IG5ldyBEYXRlKHksIG0sIGQsIDEyLCAwKSxlbmQ6IG5ldyBEYXRlKHksIG0sIGQsIDE0LCAwKSxhbGxEYXk6IGZhbHNlfSxcbiAgICAgICAgICAgIHt0eXBlOidwYXJ0eScsdGl0bGU6ICdDbGljayBmb3IgR29vZ2xlJyxzdGFydDogbmV3IERhdGUoeSwgbSwgMjgpLGVuZDogbmV3IERhdGUoeSwgbSwgMjkpLHVybDogJ2h0dHA6Ly9nb29nbGUuY29tLyd9XG4gICAgICAgIF1cbiAgICB9O1xuICAgIC8qIGFsZXJ0IG9uIGV2ZW50Q2xpY2sgKi9cbiAgICAkc2NvcGUuYWxlcnRPbkV2ZW50Q2xpY2sgPSBmdW5jdGlvbiggZGF0ZSwganNFdmVudCwgdmlldyl7XG4gICAgICAgICRzY29wZS5hbGVydE1lc3NhZ2UgPSAoZGF0ZS50aXRsZSArICcgd2FzIGNsaWNrZWQgJyk7XG4gICAgfTtcbiAgICAvKiBhbGVydCBvbiBEcm9wICovXG4gICAgJHNjb3BlLmFsZXJ0T25Ecm9wID0gZnVuY3Rpb24oZXZlbnQsIGRlbHRhLCByZXZlcnRGdW5jLCBqc0V2ZW50LCB1aSwgdmlldyl7XG4gICAgICAgICRzY29wZS5hbGVydE1lc3NhZ2UgPSAoJ0V2ZW50IERyb3BlZCB0byBtYWtlIGRheURlbHRhICcgKyBkZWx0YSk7XG4gICAgfTtcbiAgICAvKiBhbGVydCBvbiBSZXNpemUgKi9cbiAgICAkc2NvcGUuYWxlcnRPblJlc2l6ZSA9IGZ1bmN0aW9uKGV2ZW50LCBkZWx0YSwgcmV2ZXJ0RnVuYywganNFdmVudCwgdWksIHZpZXcgKXtcbiAgICAgICAgJHNjb3BlLmFsZXJ0TWVzc2FnZSA9ICgnRXZlbnQgUmVzaXplZCB0byBtYWtlIGRheURlbHRhICcgKyBkZWx0YSk7XG4gICAgfTtcbiAgICAvKiBhZGQgYW5kIHJlbW92ZXMgYW4gZXZlbnQgc291cmNlIG9mIGNob2ljZSAqL1xuICAgICRzY29wZS5hZGRSZW1vdmVFdmVudFNvdXJjZSA9IGZ1bmN0aW9uKHNvdXJjZXMsc291cmNlKSB7XG4gICAgICAgIHZhciBjYW5BZGQgPSAwO1xuICAgICAgICBhbmd1bGFyLmZvckVhY2goc291cmNlcyxmdW5jdGlvbih2YWx1ZSwga2V5KXtcbiAgICAgICAgICAgIGlmKHNvdXJjZXNba2V5XSA9PT0gc291cmNlKXtcbiAgICAgICAgICAgICAgICBzb3VyY2VzLnNwbGljZShrZXksMSk7XG4gICAgICAgICAgICAgICAgY2FuQWRkID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKGNhbkFkZCA9PT0gMCl7XG4gICAgICAgICAgICBzb3VyY2VzLnB1c2goc291cmNlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyogYWRkIGN1c3RvbSBldmVudCovXG4gICAgJHNjb3BlLmFkZEV2ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5ldmVudHMucHVzaCh7XG4gICAgICAgICAgICB0aXRsZTogJ09wZW4gU2VzYW1lJyxcbiAgICAgICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSh5LCBtLCAyOCksXG4gICAgICAgICAgICBlbmQ6IG5ldyBEYXRlKHksIG0sIDI5KSxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogWydvcGVuU2VzYW1lJ11cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKiByZW1vdmUgZXZlbnQgKi9cbiAgICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgJHNjb3BlLmV2ZW50cy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgfTtcbiAgICAvKiBDaGFuZ2UgVmlldyAqL1xuICAgICRzY29wZS5jaGFuZ2VWaWV3ID0gZnVuY3Rpb24odmlldyxjYWxlbmRhcikge1xuICAgICAgICB1aUNhbGVuZGFyQ29uZmlnLmNhbGVuZGFyc1tjYWxlbmRhcl0uZnVsbENhbGVuZGFyKCdjaGFuZ2VWaWV3Jyx2aWV3KTtcbiAgICB9O1xuICAgIC8qIENoYW5nZSBWaWV3ICovXG4gICAgJHNjb3BlLnJlbmRlckNhbGVuZGVyID0gZnVuY3Rpb24oY2FsZW5kYXIpIHtcbiAgICAgICAgaWYodWlDYWxlbmRhckNvbmZpZy5jYWxlbmRhcnNbY2FsZW5kYXJdKXtcbiAgICAgICAgICAgIHVpQ2FsZW5kYXJDb25maWcuY2FsZW5kYXJzW2NhbGVuZGFyXS5mdWxsQ2FsZW5kYXIoJ3JlbmRlcicpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKiBSZW5kZXIgVG9vbHRpcCAqL1xuICAgICRzY29wZS5ldmVudFJlbmRlciA9IGZ1bmN0aW9uKCBldmVudCwgZWxlbWVudCwgdmlldyApIHtcbiAgICAgICAgZWxlbWVudC5hdHRyKHsndG9vbHRpcCc6IGV2ZW50LnRpdGxlLFxuICAgICAgICAndG9vbHRpcC1hcHBlbmQtdG8tYm9keSc6IHRydWV9KTtcbiAgICAgICAgJGNvbXBpbGUoZWxlbWVudCkoJHNjb3BlKTtcbiAgICB9O1xuICAgIC8qIGNvbmZpZyBvYmplY3QgKi9cbiAgICAkc2NvcGUudWlDb25maWcgPSB7XG4gICAgICAgIGNhbGVuZGFyOntcbiAgICAgICAgICAgIGhlaWdodDogNDUwLFxuICAgICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBoZWFkZXI6e1xuICAgICAgICAgICAgICAgIGxlZnQ6ICd0aXRsZScsXG4gICAgICAgICAgICAgICAgY2VudGVyOiAnJyxcbiAgICAgICAgICAgICAgICByaWdodDogJ3RvZGF5IHByZXYsbmV4dCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudENsaWNrOiAkc2NvcGUuYWxlcnRPbkV2ZW50Q2xpY2ssXG4gICAgICAgICAgICBldmVudERyb3A6ICRzY29wZS5hbGVydE9uRHJvcCxcbiAgICAgICAgICAgIGV2ZW50UmVzaXplOiAkc2NvcGUuYWxlcnRPblJlc2l6ZSxcbiAgICAgICAgICAgIGV2ZW50UmVuZGVyOiAkc2NvcGUuZXZlbnRSZW5kZXJcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuY2hhbmdlTGFuZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZigkc2NvcGUuY2hhbmdlVG8gPT09ICdIdW5nYXJpYW4nKXtcbiAgICAgICAgICAgICRzY29wZS51aUNvbmZpZy5jYWxlbmRhci5kYXlOYW1lcyA9IFsnVmFzw6FybmFwJywgJ0jDqXRmxZEnLCAnS2VkZCcsICdTemVyZGEnLCAnQ3PDvHTDtnJ0w7ZrJywgJ1DDqW50ZWsnLCAnU3pvbWJhdCddO1xuICAgICAgICAgICAgJHNjb3BlLnVpQ29uZmlnLmNhbGVuZGFyLmRheU5hbWVzU2hvcnQgPSBbJ1ZhcycsICdIw6l0JywgJ0tlZGQnLCAnU3plJywgJ0Nzw7x0JywgJ1DDqW4nLCAnU3pvJ107XG4gICAgICAgICAgICAkc2NvcGUuY2hhbmdlVG89ICdFbmdsaXNoJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRzY29wZS51aUNvbmZpZy5jYWxlbmRhci5kYXlOYW1lcyA9IFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknXTtcbiAgICAgICAgICAgICRzY29wZS51aUNvbmZpZy5jYWxlbmRhci5kYXlOYW1lc1Nob3J0ID0gWydTdW4nLCAnTW9uJywgJ1R1ZScsICdXZWQnLCAnVGh1JywgJ0ZyaScsICdTYXQnXTtcbiAgICAgICAgICAgICRzY29wZS5jaGFuZ2VUbyA9ICdIdW5nYXJpYW4nO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKiBldmVudCBzb3VyY2VzIGFycmF5Ki9cbiAgICAkc2NvcGUuZXZlbnRTb3VyY2VzID0gWyRzY29wZS5ldmVudHMsICRzY29wZS5ldmVudFNvdXJjZSwgJHNjb3BlLmV2ZW50c0ZdO1xuICAgICRzY29wZS5ldmVudFNvdXJjZXMyID0gWyRzY29wZS5jYWxFdmVudHNFeHQsICRzY29wZS5ldmVudHNGLCAkc2NvcGUuZXZlbnRzXTtcbn1cbiIsIi8vY2hhcnQuanNcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdMaW5lQ3RybCcsIExpbmVDdHJsKVxuICAgIC5jb250cm9sbGVyKCdCYXJDdHJsJywgQmFyQ3RybClcbiAgICAuY29udHJvbGxlcignRG91Z2hudXRDdHJsJywgRG91Z2hudXRDdHJsKVxuICAgIC5jb250cm9sbGVyKCdSYWRhckN0cmwnLCBSYWRhckN0cmwpXG4gICAgLmNvbnRyb2xsZXIoJ1BpZUN0cmwnLCBQaWVDdHJsKVxuICAgIC5jb250cm9sbGVyKCdQb2xhckFyZWFDdHJsJywgUG9sYXJBcmVhQ3RybClcbiAgICAuY29udHJvbGxlcignQmFzZUN0cmwnLCBCYXNlQ3RybCk7XG5cbkxpbmVDdHJsLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gTGluZUN0cmwoJHNjb3BlKSB7XG4gICAgJHNjb3BlLmxhYmVscyA9IFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5J107XG4gICAgJHNjb3BlLnNlcmllcyA9IFsnU2VyaWVzIEEnLCAnU2VyaWVzIEInXTtcbiAgICAkc2NvcGUuZGF0YSA9IFtcbiAgICAgICAgWzY1LCA1OSwgODAsIDgxLCA1NiwgNTUsIDQwXSxcbiAgICAgICAgWzI4LCA0OCwgNDAsIDE5LCA4NiwgMjcsIDkwXVxuICAgIF07XG59XG5cbkJhckN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBCYXJDdHJsKCRzY29wZSkge1xuICAgICRzY29wZS5sYWJlbHMgPSBbJzIwMDYnLCAnMjAwNycsICcyMDA4JywgJzIwMDknLCAnMjAxMCcsICcyMDExJywgJzIwMTInXTtcbiAgICAkc2NvcGUuc2VyaWVzID0gWydTZXJpZXMgQScsICdTZXJpZXMgQiddO1xuXG4gICAgJHNjb3BlLmRhdGEgPSBbXG4gICAgICAgIFs2NSwgNTksIDgwLCA4MSwgNTYsIDU1LCA0MF0sXG4gICAgICAgIFsyOCwgNDgsIDQwLCAxOSwgODYsIDI3LCA5MF1cbiAgICBdO1xufVxuXG5Eb3VnaG51dEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBEb3VnaG51dEN0cmwoJHNjb3BlKSB7XG4gICAgJHNjb3BlLmxhYmVscyA9IFsnRG93bmxvYWQgU2FsZXMnLCAnSW4tU3RvcmUgU2FsZXMnLCAnTWFpbC1PcmRlciBTYWxlcyddO1xuICAgICRzY29wZS5kYXRhID0gWzMwMCwgNTAwLCAxMDBdO1xufVxuXG5SYWRhckN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBSYWRhckN0cmwoJHNjb3BlKSB7XG4gICAgJHNjb3BlLmxhYmVscyA9WydFYXRpbmcnLCAnRHJpbmtpbmcnLCAnU2xlZXBpbmcnLCAnRGVzaWduaW5nJywgJ0NvZGluZycsICdDeWNsaW5nJywgJ1J1bm5pbmcnXTtcblxuICAgICRzY29wZS5kYXRhID0gW1xuICAgICAgICBbNjUsIDU5LCA5MCwgODEsIDU2LCA1NSwgNDBdLFxuICAgICAgICBbMjgsIDQ4LCA0MCwgMTksIDk2LCAyNywgMTAwXVxuICAgIF07XG59XG5cblBpZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBQaWVDdHJsKCRzY29wZSkge1xuICAgICRzY29wZS5sYWJlbHMgPSBbJ0Rvd25sb2FkIFNhbGVzJywgJ0luLVN0b3JlIFNhbGVzJywgJ01haWwtT3JkZXIgU2FsZXMnXTtcbiAgICAkc2NvcGUuZGF0YSA9IFszMDAsIDUwMCwgMTAwXTtcbn1cblxuUG9sYXJBcmVhQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIFBvbGFyQXJlYUN0cmwoJHNjb3BlKSB7XG4gICAgJHNjb3BlLmxhYmVscyA9IFsnRG93bmxvYWQgU2FsZXMnLCAnSW4tU3RvcmUgU2FsZXMnLCAnTWFpbC1PcmRlciBTYWxlcycsICdUZWxlIFNhbGVzJywgJ0NvcnBvcmF0ZSBTYWxlcyddO1xuICAgICRzY29wZS5kYXRhID0gWzMwMCwgNTAwLCAxMDAsIDQwLCAxMjBdO1xufVxuXG5CYXNlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIEJhc2VDdHJsKCRzY29wZSkge1xuICAgICRzY29wZS5sYWJlbHMgPSBbJ0Rvd25sb2FkIFNhbGVzJywgJ0luLVN0b3JlIFNhbGVzJywgJ01haWwtT3JkZXIgU2FsZXMnLCAnVGVsZSBTYWxlcycsICdDb3Jwb3JhdGUgU2FsZXMnXTtcbiAgICAkc2NvcGUuZGF0YSA9IFszMDAsIDUwMCwgMTAwLCA0MCwgMTIwXTtcbiAgICAkc2NvcGUudHlwZSA9ICdQb2xhckFyZWEnO1xuXG4gICAgJHNjb3BlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLnR5cGUgPSAkc2NvcGUudHlwZSA9PT0gJ1BvbGFyQXJlYScgP1xuICAgICAgICAnUGllJyA6ICdQb2xhckFyZWEnO1xuICAgIH07XG59XG4iLCIvL2Zvcm1zLmpzXG4ndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAvL1VJIFNlbGVjdCBjb250cm9sbGVyXG4gICAgLmNvbnRyb2xsZXIoJ3NlbGVjdERlbW9DdHJsJywgc2VsZWN0RGVtb0N0cmwpXG4gICAgLmZpbHRlcigncHJvcHNGaWx0ZXInLCBwcm9wc0ZpbHRlcilcbiAgICAvL2RhdGVSYW5nZVBpY2tlciBjb250cm9sbGVyXG4gICAgLmNvbnRyb2xsZXIoJ2RhdGVSYW5nZUN0cmwnLCBkYXRlUmFuZ2VDdHJsKTtcblxuc2VsZWN0RGVtb0N0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRodHRwJywgJyR0aW1lb3V0J107XG5mdW5jdGlvbiBzZWxlY3REZW1vQ3RybCgkc2NvcGUsICRodHRwLCAkdGltZW91dCkge1xuXG4gICAgJHNjb3BlLmNvdW50cnkgPSB7fTtcbiAgICAkc2NvcGUuY291bnRyaWVzID0gWyAvLyBUYWtlbiBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3VuY2V1cy82NTAxOTg1XG4gICAgICAgIHtuYW1lOiAnQWZnaGFuaXN0YW4nLCBjb2RlOiAnQUYnfSxcbiAgICAgICAge25hbWU6ICfDhWxhbmQgSXNsYW5kcycsIGNvZGU6ICdBWCd9LFxuICAgICAgICB7bmFtZTogJ0FsYmFuaWEnLCBjb2RlOiAnQUwnfSxcbiAgICAgICAge25hbWU6ICdBbGdlcmlhJywgY29kZTogJ0RaJ30sXG4gICAgICAgIHtuYW1lOiAnQW1lcmljYW4gU2Ftb2EnLCBjb2RlOiAnQVMnfSxcbiAgICAgICAge25hbWU6ICdBbmRvcnJhJywgY29kZTogJ0FEJ30sXG4gICAgICAgIHtuYW1lOiAnQW5nb2xhJywgY29kZTogJ0FPJ30sXG4gICAgICAgIHtuYW1lOiAnQW5ndWlsbGEnLCBjb2RlOiAnQUknfSxcbiAgICAgICAge25hbWU6ICdBbnRhcmN0aWNhJywgY29kZTogJ0FRJ30sXG4gICAgICAgIHtuYW1lOiAnQW50aWd1YSBhbmQgQmFyYnVkYScsIGNvZGU6ICdBRyd9LFxuICAgICAgICB7bmFtZTogJ0FyZ2VudGluYScsIGNvZGU6ICdBUid9LFxuICAgICAgICB7bmFtZTogJ0FybWVuaWEnLCBjb2RlOiAnQU0nfSxcbiAgICAgICAge25hbWU6ICdBcnViYScsIGNvZGU6ICdBVyd9LFxuICAgICAgICB7bmFtZTogJ0F1c3RyYWxpYScsIGNvZGU6ICdBVSd9LFxuICAgICAgICB7bmFtZTogJ0F1c3RyaWEnLCBjb2RlOiAnQVQnfSxcbiAgICAgICAge25hbWU6ICdBemVyYmFpamFuJywgY29kZTogJ0FaJ30sXG4gICAgICAgIHtuYW1lOiAnQmFoYW1hcycsIGNvZGU6ICdCUyd9LFxuICAgICAgICB7bmFtZTogJ0JhaHJhaW4nLCBjb2RlOiAnQkgnfSxcbiAgICAgICAge25hbWU6ICdCYW5nbGFkZXNoJywgY29kZTogJ0JEJ30sXG4gICAgICAgIHtuYW1lOiAnQmFyYmFkb3MnLCBjb2RlOiAnQkInfSxcbiAgICAgICAge25hbWU6ICdCZWxhcnVzJywgY29kZTogJ0JZJ30sXG4gICAgICAgIHtuYW1lOiAnQmVsZ2l1bScsIGNvZGU6ICdCRSd9LFxuICAgICAgICB7bmFtZTogJ0JlbGl6ZScsIGNvZGU6ICdCWid9LFxuICAgICAgICB7bmFtZTogJ0JlbmluJywgY29kZTogJ0JKJ30sXG4gICAgICAgIHtuYW1lOiAnQmVybXVkYScsIGNvZGU6ICdCTSd9LFxuICAgICAgICB7bmFtZTogJ0JodXRhbicsIGNvZGU6ICdCVCd9LFxuICAgICAgICB7bmFtZTogJ0JvbGl2aWEnLCBjb2RlOiAnQk8nfSxcbiAgICAgICAge25hbWU6ICdCb3NuaWEgYW5kIEhlcnplZ292aW5hJywgY29kZTogJ0JBJ30sXG4gICAgICAgIHtuYW1lOiAnQm90c3dhbmEnLCBjb2RlOiAnQlcnfSxcbiAgICAgICAge25hbWU6ICdCb3V2ZXQgSXNsYW5kJywgY29kZTogJ0JWJ30sXG4gICAgICAgIHtuYW1lOiAnQnJhemlsJywgY29kZTogJ0JSJ30sXG4gICAgICAgIHtuYW1lOiAnQnJpdGlzaCBJbmRpYW4gT2NlYW4gVGVycml0b3J5JywgY29kZTogJ0lPJ30sXG4gICAgICAgIHtuYW1lOiAnQnJ1bmVpIERhcnVzc2FsYW0nLCBjb2RlOiAnQk4nfSxcbiAgICAgICAge25hbWU6ICdCdWxnYXJpYScsIGNvZGU6ICdCRyd9LFxuICAgICAgICB7bmFtZTogJ0J1cmtpbmEgRmFzbycsIGNvZGU6ICdCRid9LFxuICAgICAgICB7bmFtZTogJ0J1cnVuZGknLCBjb2RlOiAnQkknfSxcbiAgICAgICAge25hbWU6ICdDYW1ib2RpYScsIGNvZGU6ICdLSCd9LFxuICAgICAgICB7bmFtZTogJ0NhbWVyb29uJywgY29kZTogJ0NNJ30sXG4gICAgICAgIHtuYW1lOiAnQ2FuYWRhJywgY29kZTogJ0NBJ30sXG4gICAgICAgIHtuYW1lOiAnQ2FwZSBWZXJkZScsIGNvZGU6ICdDVid9LFxuICAgICAgICB7bmFtZTogJ0NheW1hbiBJc2xhbmRzJywgY29kZTogJ0tZJ30sXG4gICAgICAgIHtuYW1lOiAnQ2VudHJhbCBBZnJpY2FuIFJlcHVibGljJywgY29kZTogJ0NGJ30sXG4gICAgICAgIHtuYW1lOiAnQ2hhZCcsIGNvZGU6ICdURCd9LFxuICAgICAgICB7bmFtZTogJ0NoaWxlJywgY29kZTogJ0NMJ30sXG4gICAgICAgIHtuYW1lOiAnQ2hpbmEnLCBjb2RlOiAnQ04nfSxcbiAgICAgICAge25hbWU6ICdDaHJpc3RtYXMgSXNsYW5kJywgY29kZTogJ0NYJ30sXG4gICAgICAgIHtuYW1lOiAnQ29jb3MgKEtlZWxpbmcpIElzbGFuZHMnLCBjb2RlOiAnQ0MnfSxcbiAgICAgICAge25hbWU6ICdDb2xvbWJpYScsIGNvZGU6ICdDTyd9LFxuICAgICAgICB7bmFtZTogJ0NvbW9yb3MnLCBjb2RlOiAnS00nfSxcbiAgICAgICAge25hbWU6ICdDb25nbycsIGNvZGU6ICdDRyd9LFxuICAgICAgICB7bmFtZTogJ0NvbmdvLCBUaGUgRGVtb2NyYXRpYyBSZXB1YmxpYyBvZiB0aGUnLCBjb2RlOiAnQ0QnfSxcbiAgICAgICAge25hbWU6ICdDb29rIElzbGFuZHMnLCBjb2RlOiAnQ0snfSxcbiAgICAgICAge25hbWU6ICdDb3N0YSBSaWNhJywgY29kZTogJ0NSJ30sXG4gICAgICAgIHtuYW1lOiAnQ290ZSBEXFwnSXZvaXJlJywgY29kZTogJ0NJJ30sXG4gICAgICAgIHtuYW1lOiAnQ3JvYXRpYScsIGNvZGU6ICdIUid9LFxuICAgICAgICB7bmFtZTogJ0N1YmEnLCBjb2RlOiAnQ1UnfSxcbiAgICAgICAge25hbWU6ICdDeXBydXMnLCBjb2RlOiAnQ1knfSxcbiAgICAgICAge25hbWU6ICdDemVjaCBSZXB1YmxpYycsIGNvZGU6ICdDWid9LFxuICAgICAgICB7bmFtZTogJ0Rlbm1hcmsnLCBjb2RlOiAnREsnfSxcbiAgICAgICAge25hbWU6ICdEamlib3V0aScsIGNvZGU6ICdESid9LFxuICAgICAgICB7bmFtZTogJ0RvbWluaWNhJywgY29kZTogJ0RNJ30sXG4gICAgICAgIHtuYW1lOiAnRG9taW5pY2FuIFJlcHVibGljJywgY29kZTogJ0RPJ30sXG4gICAgICAgIHtuYW1lOiAnRWN1YWRvcicsIGNvZGU6ICdFQyd9LFxuICAgICAgICB7bmFtZTogJ0VneXB0JywgY29kZTogJ0VHJ30sXG4gICAgICAgIHtuYW1lOiAnRWwgU2FsdmFkb3InLCBjb2RlOiAnU1YnfSxcbiAgICAgICAge25hbWU6ICdFcXVhdG9yaWFsIEd1aW5lYScsIGNvZGU6ICdHUSd9LFxuICAgICAgICB7bmFtZTogJ0VyaXRyZWEnLCBjb2RlOiAnRVInfSxcbiAgICAgICAge25hbWU6ICdFc3RvbmlhJywgY29kZTogJ0VFJ30sXG4gICAgICAgIHtuYW1lOiAnRXRoaW9waWEnLCBjb2RlOiAnRVQnfSxcbiAgICAgICAge25hbWU6ICdGYWxrbGFuZCBJc2xhbmRzIChNYWx2aW5hcyknLCBjb2RlOiAnRksnfSxcbiAgICAgICAge25hbWU6ICdGYXJvZSBJc2xhbmRzJywgY29kZTogJ0ZPJ30sXG4gICAgICAgIHtuYW1lOiAnRmlqaScsIGNvZGU6ICdGSid9LFxuICAgICAgICB7bmFtZTogJ0ZpbmxhbmQnLCBjb2RlOiAnRkknfSxcbiAgICAgICAge25hbWU6ICdGcmFuY2UnLCBjb2RlOiAnRlInfSxcbiAgICAgICAge25hbWU6ICdGcmVuY2ggR3VpYW5hJywgY29kZTogJ0dGJ30sXG4gICAgICAgIHtuYW1lOiAnRnJlbmNoIFBvbHluZXNpYScsIGNvZGU6ICdQRid9LFxuICAgICAgICB7bmFtZTogJ0ZyZW5jaCBTb3V0aGVybiBUZXJyaXRvcmllcycsIGNvZGU6ICdURid9LFxuICAgICAgICB7bmFtZTogJ0dhYm9uJywgY29kZTogJ0dBJ30sXG4gICAgICAgIHtuYW1lOiAnR2FtYmlhJywgY29kZTogJ0dNJ30sXG4gICAgICAgIHtuYW1lOiAnR2VvcmdpYScsIGNvZGU6ICdHRSd9LFxuICAgICAgICB7bmFtZTogJ0dlcm1hbnknLCBjb2RlOiAnREUnfSxcbiAgICAgICAge25hbWU6ICdHaGFuYScsIGNvZGU6ICdHSCd9LFxuICAgICAgICB7bmFtZTogJ0dpYnJhbHRhcicsIGNvZGU6ICdHSSd9LFxuICAgICAgICB7bmFtZTogJ0dyZWVjZScsIGNvZGU6ICdHUid9LFxuICAgICAgICB7bmFtZTogJ0dyZWVubGFuZCcsIGNvZGU6ICdHTCd9LFxuICAgICAgICB7bmFtZTogJ0dyZW5hZGEnLCBjb2RlOiAnR0QnfSxcbiAgICAgICAge25hbWU6ICdHdWFkZWxvdXBlJywgY29kZTogJ0dQJ30sXG4gICAgICAgIHtuYW1lOiAnR3VhbScsIGNvZGU6ICdHVSd9LFxuICAgICAgICB7bmFtZTogJ0d1YXRlbWFsYScsIGNvZGU6ICdHVCd9LFxuICAgICAgICB7bmFtZTogJ0d1ZXJuc2V5JywgY29kZTogJ0dHJ30sXG4gICAgICAgIHtuYW1lOiAnR3VpbmVhJywgY29kZTogJ0dOJ30sXG4gICAgICAgIHtuYW1lOiAnR3VpbmVhLUJpc3NhdScsIGNvZGU6ICdHVyd9LFxuICAgICAgICB7bmFtZTogJ0d1eWFuYScsIGNvZGU6ICdHWSd9LFxuICAgICAgICB7bmFtZTogJ0hhaXRpJywgY29kZTogJ0hUJ30sXG4gICAgICAgIHtuYW1lOiAnSGVhcmQgSXNsYW5kIGFuZCBNY2RvbmFsZCBJc2xhbmRzJywgY29kZTogJ0hNJ30sXG4gICAgICAgIHtuYW1lOiAnSG9seSBTZWUgKFZhdGljYW4gQ2l0eSBTdGF0ZSknLCBjb2RlOiAnVkEnfSxcbiAgICAgICAge25hbWU6ICdIb25kdXJhcycsIGNvZGU6ICdITid9LFxuICAgICAgICB7bmFtZTogJ0hvbmcgS29uZycsIGNvZGU6ICdISyd9LFxuICAgICAgICB7bmFtZTogJ0h1bmdhcnknLCBjb2RlOiAnSFUnfSxcbiAgICAgICAge25hbWU6ICdJY2VsYW5kJywgY29kZTogJ0lTJ30sXG4gICAgICAgIHtuYW1lOiAnSW5kaWEnLCBjb2RlOiAnSU4nfSxcbiAgICAgICAge25hbWU6ICdJbmRvbmVzaWEnLCBjb2RlOiAnSUQnfSxcbiAgICAgICAge25hbWU6ICdJcmFuLCBJc2xhbWljIFJlcHVibGljIE9mJywgY29kZTogJ0lSJ30sXG4gICAgICAgIHtuYW1lOiAnSXJhcScsIGNvZGU6ICdJUSd9LFxuICAgICAgICB7bmFtZTogJ0lyZWxhbmQnLCBjb2RlOiAnSUUnfSxcbiAgICAgICAge25hbWU6ICdJc2xlIG9mIE1hbicsIGNvZGU6ICdJTSd9LFxuICAgICAgICB7bmFtZTogJ0lzcmFlbCcsIGNvZGU6ICdJTCd9LFxuICAgICAgICB7bmFtZTogJ0l0YWx5JywgY29kZTogJ0lUJ30sXG4gICAgICAgIHtuYW1lOiAnSmFtYWljYScsIGNvZGU6ICdKTSd9LFxuICAgICAgICB7bmFtZTogJ0phcGFuJywgY29kZTogJ0pQJ30sXG4gICAgICAgIHtuYW1lOiAnSmVyc2V5JywgY29kZTogJ0pFJ30sXG4gICAgICAgIHtuYW1lOiAnSm9yZGFuJywgY29kZTogJ0pPJ30sXG4gICAgICAgIHtuYW1lOiAnS2F6YWtoc3RhbicsIGNvZGU6ICdLWid9LFxuICAgICAgICB7bmFtZTogJ0tlbnlhJywgY29kZTogJ0tFJ30sXG4gICAgICAgIHtuYW1lOiAnS2lyaWJhdGknLCBjb2RlOiAnS0knfSxcbiAgICAgICAge25hbWU6ICdLb3JlYSwgRGVtb2NyYXRpYyBQZW9wbGVcXCdzIFJlcHVibGljIG9mJywgY29kZTogJ0tQJ30sXG4gICAgICAgIHtuYW1lOiAnS29yZWEsIFJlcHVibGljIG9mJywgY29kZTogJ0tSJ30sXG4gICAgICAgIHtuYW1lOiAnS3V3YWl0JywgY29kZTogJ0tXJ30sXG4gICAgICAgIHtuYW1lOiAnS3lyZ3l6c3RhbicsIGNvZGU6ICdLRyd9LFxuICAgICAgICB7bmFtZTogJ0xhbyBQZW9wbGVcXCdzIERlbW9jcmF0aWMgUmVwdWJsaWMnLCBjb2RlOiAnTEEnfSxcbiAgICAgICAge25hbWU6ICdMYXR2aWEnLCBjb2RlOiAnTFYnfSxcbiAgICAgICAge25hbWU6ICdMZWJhbm9uJywgY29kZTogJ0xCJ30sXG4gICAgICAgIHtuYW1lOiAnTGVzb3RobycsIGNvZGU6ICdMUyd9LFxuICAgICAgICB7bmFtZTogJ0xpYmVyaWEnLCBjb2RlOiAnTFInfSxcbiAgICAgICAge25hbWU6ICdMaWJ5YW4gQXJhYiBKYW1haGlyaXlhJywgY29kZTogJ0xZJ30sXG4gICAgICAgIHtuYW1lOiAnTGllY2h0ZW5zdGVpbicsIGNvZGU6ICdMSSd9LFxuICAgICAgICB7bmFtZTogJ0xpdGh1YW5pYScsIGNvZGU6ICdMVCd9LFxuICAgICAgICB7bmFtZTogJ0x1eGVtYm91cmcnLCBjb2RlOiAnTFUnfSxcbiAgICAgICAge25hbWU6ICdNYWNhbycsIGNvZGU6ICdNTyd9LFxuICAgICAgICB7bmFtZTogJ01hY2Vkb25pYSwgVGhlIEZvcm1lciBZdWdvc2xhdiBSZXB1YmxpYyBvZicsIGNvZGU6ICdNSyd9LFxuICAgICAgICB7bmFtZTogJ01hZGFnYXNjYXInLCBjb2RlOiAnTUcnfSxcbiAgICAgICAge25hbWU6ICdNYWxhd2knLCBjb2RlOiAnTVcnfSxcbiAgICAgICAge25hbWU6ICdNYWxheXNpYScsIGNvZGU6ICdNWSd9LFxuICAgICAgICB7bmFtZTogJ01hbGRpdmVzJywgY29kZTogJ01WJ30sXG4gICAgICAgIHtuYW1lOiAnTWFsaScsIGNvZGU6ICdNTCd9LFxuICAgICAgICB7bmFtZTogJ01hbHRhJywgY29kZTogJ01UJ30sXG4gICAgICAgIHtuYW1lOiAnTWFyc2hhbGwgSXNsYW5kcycsIGNvZGU6ICdNSCd9LFxuICAgICAgICB7bmFtZTogJ01hcnRpbmlxdWUnLCBjb2RlOiAnTVEnfSxcbiAgICAgICAge25hbWU6ICdNYXVyaXRhbmlhJywgY29kZTogJ01SJ30sXG4gICAgICAgIHtuYW1lOiAnTWF1cml0aXVzJywgY29kZTogJ01VJ30sXG4gICAgICAgIHtuYW1lOiAnTWF5b3R0ZScsIGNvZGU6ICdZVCd9LFxuICAgICAgICB7bmFtZTogJ01leGljbycsIGNvZGU6ICdNWCd9LFxuICAgICAgICB7bmFtZTogJ01pY3JvbmVzaWEsIEZlZGVyYXRlZCBTdGF0ZXMgb2YnLCBjb2RlOiAnRk0nfSxcbiAgICAgICAge25hbWU6ICdNb2xkb3ZhLCBSZXB1YmxpYyBvZicsIGNvZGU6ICdNRCd9LFxuICAgICAgICB7bmFtZTogJ01vbmFjbycsIGNvZGU6ICdNQyd9LFxuICAgICAgICB7bmFtZTogJ01vbmdvbGlhJywgY29kZTogJ01OJ30sXG4gICAgICAgIHtuYW1lOiAnTW9udHNlcnJhdCcsIGNvZGU6ICdNUyd9LFxuICAgICAgICB7bmFtZTogJ01vcm9jY28nLCBjb2RlOiAnTUEnfSxcbiAgICAgICAge25hbWU6ICdNb3phbWJpcXVlJywgY29kZTogJ01aJ30sXG4gICAgICAgIHtuYW1lOiAnTXlhbm1hcicsIGNvZGU6ICdNTSd9LFxuICAgICAgICB7bmFtZTogJ05hbWliaWEnLCBjb2RlOiAnTkEnfSxcbiAgICAgICAge25hbWU6ICdOYXVydScsIGNvZGU6ICdOUid9LFxuICAgICAgICB7bmFtZTogJ05lcGFsJywgY29kZTogJ05QJ30sXG4gICAgICAgIHtuYW1lOiAnTmV0aGVybGFuZHMnLCBjb2RlOiAnTkwnfSxcbiAgICAgICAge25hbWU6ICdOZXRoZXJsYW5kcyBBbnRpbGxlcycsIGNvZGU6ICdBTid9LFxuICAgICAgICB7bmFtZTogJ05ldyBDYWxlZG9uaWEnLCBjb2RlOiAnTkMnfSxcbiAgICAgICAge25hbWU6ICdOZXcgWmVhbGFuZCcsIGNvZGU6ICdOWid9LFxuICAgICAgICB7bmFtZTogJ05pY2FyYWd1YScsIGNvZGU6ICdOSSd9LFxuICAgICAgICB7bmFtZTogJ05pZ2VyJywgY29kZTogJ05FJ30sXG4gICAgICAgIHtuYW1lOiAnTmlnZXJpYScsIGNvZGU6ICdORyd9LFxuICAgICAgICB7bmFtZTogJ05pdWUnLCBjb2RlOiAnTlUnfSxcbiAgICAgICAge25hbWU6ICdOb3Jmb2xrIElzbGFuZCcsIGNvZGU6ICdORid9LFxuICAgICAgICB7bmFtZTogJ05vcnRoZXJuIE1hcmlhbmEgSXNsYW5kcycsIGNvZGU6ICdNUCd9LFxuICAgICAgICB7bmFtZTogJ05vcndheScsIGNvZGU6ICdOTyd9LFxuICAgICAgICB7bmFtZTogJ09tYW4nLCBjb2RlOiAnT00nfSxcbiAgICAgICAge25hbWU6ICdQYWtpc3RhbicsIGNvZGU6ICdQSyd9LFxuICAgICAgICB7bmFtZTogJ1BhbGF1JywgY29kZTogJ1BXJ30sXG4gICAgICAgIHtuYW1lOiAnUGFsZXN0aW5pYW4gVGVycml0b3J5LCBPY2N1cGllZCcsIGNvZGU6ICdQUyd9LFxuICAgICAgICB7bmFtZTogJ1BhbmFtYScsIGNvZGU6ICdQQSd9LFxuICAgICAgICB7bmFtZTogJ1BhcHVhIE5ldyBHdWluZWEnLCBjb2RlOiAnUEcnfSxcbiAgICAgICAge25hbWU6ICdQYXJhZ3VheScsIGNvZGU6ICdQWSd9LFxuICAgICAgICB7bmFtZTogJ1BlcnUnLCBjb2RlOiAnUEUnfSxcbiAgICAgICAge25hbWU6ICdQaGlsaXBwaW5lcycsIGNvZGU6ICdQSCd9LFxuICAgICAgICB7bmFtZTogJ1BpdGNhaXJuJywgY29kZTogJ1BOJ30sXG4gICAgICAgIHtuYW1lOiAnUG9sYW5kJywgY29kZTogJ1BMJ30sXG4gICAgICAgIHtuYW1lOiAnUG9ydHVnYWwnLCBjb2RlOiAnUFQnfSxcbiAgICAgICAge25hbWU6ICdQdWVydG8gUmljbycsIGNvZGU6ICdQUid9LFxuICAgICAgICB7bmFtZTogJ1FhdGFyJywgY29kZTogJ1FBJ30sXG4gICAgICAgIHtuYW1lOiAnUmV1bmlvbicsIGNvZGU6ICdSRSd9LFxuICAgICAgICB7bmFtZTogJ1JvbWFuaWEnLCBjb2RlOiAnUk8nfSxcbiAgICAgICAge25hbWU6ICdSdXNzaWFuIEZlZGVyYXRpb24nLCBjb2RlOiAnUlUnfSxcbiAgICAgICAge25hbWU6ICdSd2FuZGEnLCBjb2RlOiAnUlcnfSxcbiAgICAgICAge25hbWU6ICdTYWludCBIZWxlbmEnLCBjb2RlOiAnU0gnfSxcbiAgICAgICAge25hbWU6ICdTYWludCBLaXR0cyBhbmQgTmV2aXMnLCBjb2RlOiAnS04nfSxcbiAgICAgICAge25hbWU6ICdTYWludCBMdWNpYScsIGNvZGU6ICdMQyd9LFxuICAgICAgICB7bmFtZTogJ1NhaW50IFBpZXJyZSBhbmQgTWlxdWVsb24nLCBjb2RlOiAnUE0nfSxcbiAgICAgICAge25hbWU6ICdTYWludCBWaW5jZW50IGFuZCB0aGUgR3JlbmFkaW5lcycsIGNvZGU6ICdWQyd9LFxuICAgICAgICB7bmFtZTogJ1NhbW9hJywgY29kZTogJ1dTJ30sXG4gICAgICAgIHtuYW1lOiAnU2FuIE1hcmlubycsIGNvZGU6ICdTTSd9LFxuICAgICAgICB7bmFtZTogJ1NhbyBUb21lIGFuZCBQcmluY2lwZScsIGNvZGU6ICdTVCd9LFxuICAgICAgICB7bmFtZTogJ1NhdWRpIEFyYWJpYScsIGNvZGU6ICdTQSd9LFxuICAgICAgICB7bmFtZTogJ1NlbmVnYWwnLCBjb2RlOiAnU04nfSxcbiAgICAgICAge25hbWU6ICdTZXJiaWEgYW5kIE1vbnRlbmVncm8nLCBjb2RlOiAnQ1MnfSxcbiAgICAgICAge25hbWU6ICdTZXljaGVsbGVzJywgY29kZTogJ1NDJ30sXG4gICAgICAgIHtuYW1lOiAnU2llcnJhIExlb25lJywgY29kZTogJ1NMJ30sXG4gICAgICAgIHtuYW1lOiAnU2luZ2Fwb3JlJywgY29kZTogJ1NHJ30sXG4gICAgICAgIHtuYW1lOiAnU2xvdmFraWEnLCBjb2RlOiAnU0snfSxcbiAgICAgICAge25hbWU6ICdTbG92ZW5pYScsIGNvZGU6ICdTSSd9LFxuICAgICAgICB7bmFtZTogJ1NvbG9tb24gSXNsYW5kcycsIGNvZGU6ICdTQid9LFxuICAgICAgICB7bmFtZTogJ1NvbWFsaWEnLCBjb2RlOiAnU08nfSxcbiAgICAgICAge25hbWU6ICdTb3V0aCBBZnJpY2EnLCBjb2RlOiAnWkEnfSxcbiAgICAgICAge25hbWU6ICdTb3V0aCBHZW9yZ2lhIGFuZCB0aGUgU291dGggU2FuZHdpY2ggSXNsYW5kcycsIGNvZGU6ICdHUyd9LFxuICAgICAgICB7bmFtZTogJ1NwYWluJywgY29kZTogJ0VTJ30sXG4gICAgICAgIHtuYW1lOiAnU3JpIExhbmthJywgY29kZTogJ0xLJ30sXG4gICAgICAgIHtuYW1lOiAnU3VkYW4nLCBjb2RlOiAnU0QnfSxcbiAgICAgICAge25hbWU6ICdTdXJpbmFtZScsIGNvZGU6ICdTUid9LFxuICAgICAgICB7bmFtZTogJ1N2YWxiYXJkIGFuZCBKYW4gTWF5ZW4nLCBjb2RlOiAnU0onfSxcbiAgICAgICAge25hbWU6ICdTd2F6aWxhbmQnLCBjb2RlOiAnU1onfSxcbiAgICAgICAge25hbWU6ICdTd2VkZW4nLCBjb2RlOiAnU0UnfSxcbiAgICAgICAge25hbWU6ICdTd2l0emVybGFuZCcsIGNvZGU6ICdDSCd9LFxuICAgICAgICB7bmFtZTogJ1N5cmlhbiBBcmFiIFJlcHVibGljJywgY29kZTogJ1NZJ30sXG4gICAgICAgIHtuYW1lOiAnVGFpd2FuLCBQcm92aW5jZSBvZiBDaGluYScsIGNvZGU6ICdUVyd9LFxuICAgICAgICB7bmFtZTogJ1RhamlraXN0YW4nLCBjb2RlOiAnVEonfSxcbiAgICAgICAge25hbWU6ICdUYW56YW5pYSwgVW5pdGVkIFJlcHVibGljIG9mJywgY29kZTogJ1RaJ30sXG4gICAgICAgIHtuYW1lOiAnVGhhaWxhbmQnLCBjb2RlOiAnVEgnfSxcbiAgICAgICAge25hbWU6ICdUaW1vci1MZXN0ZScsIGNvZGU6ICdUTCd9LFxuICAgICAgICB7bmFtZTogJ1RvZ28nLCBjb2RlOiAnVEcnfSxcbiAgICAgICAge25hbWU6ICdUb2tlbGF1JywgY29kZTogJ1RLJ30sXG4gICAgICAgIHtuYW1lOiAnVG9uZ2EnLCBjb2RlOiAnVE8nfSxcbiAgICAgICAge25hbWU6ICdUcmluaWRhZCBhbmQgVG9iYWdvJywgY29kZTogJ1RUJ30sXG4gICAgICAgIHtuYW1lOiAnVHVuaXNpYScsIGNvZGU6ICdUTid9LFxuICAgICAgICB7bmFtZTogJ1R1cmtleScsIGNvZGU6ICdUUid9LFxuICAgICAgICB7bmFtZTogJ1R1cmttZW5pc3RhbicsIGNvZGU6ICdUTSd9LFxuICAgICAgICB7bmFtZTogJ1R1cmtzIGFuZCBDYWljb3MgSXNsYW5kcycsIGNvZGU6ICdUQyd9LFxuICAgICAgICB7bmFtZTogJ1R1dmFsdScsIGNvZGU6ICdUVid9LFxuICAgICAgICB7bmFtZTogJ1VnYW5kYScsIGNvZGU6ICdVRyd9LFxuICAgICAgICB7bmFtZTogJ1VrcmFpbmUnLCBjb2RlOiAnVUEnfSxcbiAgICAgICAge25hbWU6ICdVbml0ZWQgQXJhYiBFbWlyYXRlcycsIGNvZGU6ICdBRSd9LFxuICAgICAgICB7bmFtZTogJ1VuaXRlZCBLaW5nZG9tJywgY29kZTogJ0dCJ30sXG4gICAgICAgIHtuYW1lOiAnVW5pdGVkIFN0YXRlcycsIGNvZGU6ICdVUyd9LFxuICAgICAgICB7bmFtZTogJ1VuaXRlZCBTdGF0ZXMgTWlub3IgT3V0bHlpbmcgSXNsYW5kcycsIGNvZGU6ICdVTSd9LFxuICAgICAgICB7bmFtZTogJ1VydWd1YXknLCBjb2RlOiAnVVknfSxcbiAgICAgICAge25hbWU6ICdVemJla2lzdGFuJywgY29kZTogJ1VaJ30sXG4gICAgICAgIHtuYW1lOiAnVmFudWF0dScsIGNvZGU6ICdWVSd9LFxuICAgICAgICB7bmFtZTogJ1ZlbmV6dWVsYScsIGNvZGU6ICdWRSd9LFxuICAgICAgICB7bmFtZTogJ1ZpZXRuYW0nLCBjb2RlOiAnVk4nfSxcbiAgICAgICAge25hbWU6ICdWaXJnaW4gSXNsYW5kcywgQnJpdGlzaCcsIGNvZGU6ICdWRyd9LFxuICAgICAgICB7bmFtZTogJ1ZpcmdpbiBJc2xhbmRzLCBVLlMuJywgY29kZTogJ1ZJJ30sXG4gICAgICAgIHtuYW1lOiAnV2FsbGlzIGFuZCBGdXR1bmEnLCBjb2RlOiAnV0YnfSxcbiAgICAgICAge25hbWU6ICdXZXN0ZXJuIFNhaGFyYScsIGNvZGU6ICdFSCd9LFxuICAgICAgICB7bmFtZTogJ1llbWVuJywgY29kZTogJ1lFJ30sXG4gICAgICAgIHtuYW1lOiAnWmFtYmlhJywgY29kZTogJ1pNJ30sXG4gICAgICAgIHtuYW1lOiAnWmltYmFid2UnLCBjb2RlOiAnWlcnfVxuICAgIF07XG5cbiAgICAkc2NvcGUuc29tZUdyb3VwRm4gPSBmdW5jdGlvbiAoaXRlbSl7XG5cbiAgICAgICAgaWYgKGl0ZW0ubmFtZVswXSA+PSAnQScgJiYgaXRlbS5uYW1lWzBdIDw9ICdNJyl7XG4gICAgICAgICAgICByZXR1cm4gJ0Zyb20gQSAtIE0nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0ubmFtZVswXSA+PSAnTicgJiYgaXRlbS5uYW1lWzBdIDw9ICdaJyl7XG4gICAgICAgICAgICByZXR1cm4gJ0Zyb20gTiAtIFonO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5wZXJzb25Bc3luYyA9IHtzZWxlY3RlZCA6ICd3bGFkaW1pckBlbWFpbC5jb20nfTtcbiAgICAkc2NvcGUucGVvcGxlQXN5bmMgPSBbXTtcblxuICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5wZW9wbGVBc3luYyA9IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ0FkYW0nLCAgICAgIGVtYWlsOiAnYWRhbUBlbWFpbC5jb20nLCAgICAgIGFnZTogMTIsIGNvdW50cnk6ICdVbml0ZWQgU3RhdGVzJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQW1hbGllJywgICAgZW1haWw6ICdhbWFsaWVAZW1haWwuY29tJywgICAgYWdlOiAxMiwgY291bnRyeTogJ0FyZ2VudGluYScgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ0VzdGVmYW7DrWEnLCBlbWFpbDogJ2VzdGVmYW5pYUBlbWFpbC5jb20nLCBhZ2U6IDIxLCBjb3VudHJ5OiAnQXJnZW50aW5hJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQWRyaWFuJywgICAgZW1haWw6ICdhZHJpYW5AZW1haWwuY29tJywgICAgYWdlOiAyMSwgY291bnRyeTogJ0VjdWFkb3InIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdXbGFkaW1pcicsICBlbWFpbDogJ3dsYWRpbWlyQGVtYWlsLmNvbScsICBhZ2U6IDMwLCBjb3VudHJ5OiAnRWN1YWRvcicgfSxcbiAgICAgICAgICAgIHsgbmFtZTogJ1NhbWFudGhhJywgIGVtYWlsOiAnc2FtYW50aGFAZW1haWwuY29tJywgIGFnZTogMzAsIGNvdW50cnk6ICdVbml0ZWQgU3RhdGVzJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnTmljb2xlJywgICAgZW1haWw6ICduaWNvbGVAZW1haWwuY29tJywgICAgYWdlOiA0MywgY291bnRyeTogJ0NvbG9tYmlhJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnTmF0YXNoYScsICAgZW1haWw6ICduYXRhc2hhQGVtYWlsLmNvbScsICAgYWdlOiA1NCwgY291bnRyeTogJ0VjdWFkb3InIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdNaWNoYWVsJywgICBlbWFpbDogJ21pY2hhZWxAZW1haWwuY29tJywgICBhZ2U6IDE1LCBjb3VudHJ5OiAnQ29sb21iaWEnIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdOaWNvbMOhcycsICAgZW1haWw6ICduaWNvbGVAZW1haWwuY29tJywgICAgYWdlOiA0MywgY291bnRyeTogJ0NvbG9tYmlhJyB9XG4gICAgICAgIF07XG4gICAgfSwzMDAwKTtcblxuICAgICRzY29wZS5jb3VudGVyID0gMDtcbiAgICAkc2NvcGUuc29tZUZ1bmN0aW9uID0gZnVuY3Rpb24gKGl0ZW0sIG1vZGVsKXtcbiAgICAgICAgJHNjb3BlLmNvdW50ZXIrKztcbiAgICAgICAgJHNjb3BlLmV2ZW50UmVzdWx0ID0ge2l0ZW06IGl0ZW0sIG1vZGVsOiBtb2RlbH07XG4gICAgfTtcblxuICAgICRzY29wZS5wZXJzb24gPSB7fTtcbiAgICAkc2NvcGUucGVvcGxlID0gW1xuICAgICAgICB7IG5hbWU6ICdBZGFtJywgICAgICBlbWFpbDogJ2FkYW1AZW1haWwuY29tJywgICAgICBhZ2U6IDEyLCBjb3VudHJ5OiAnVW5pdGVkIFN0YXRlcycgfSxcbiAgICAgICAgeyBuYW1lOiAnQW1hbGllJywgICAgZW1haWw6ICdhbWFsaWVAZW1haWwuY29tJywgICAgYWdlOiAxMiwgY291bnRyeTogJ0FyZ2VudGluYScgfSxcbiAgICAgICAgeyBuYW1lOiAnRXN0ZWZhbsOtYScsIGVtYWlsOiAnZXN0ZWZhbmlhQGVtYWlsLmNvbScsIGFnZTogMjEsIGNvdW50cnk6ICdBcmdlbnRpbmEnIH0sXG4gICAgICAgIHsgbmFtZTogJ0FkcmlhbicsICAgIGVtYWlsOiAnYWRyaWFuQGVtYWlsLmNvbScsICAgIGFnZTogMjEsIGNvdW50cnk6ICdFY3VhZG9yJyB9LFxuICAgICAgICB7IG5hbWU6ICdXbGFkaW1pcicsICBlbWFpbDogJ3dsYWRpbWlyQGVtYWlsLmNvbScsICBhZ2U6IDMwLCBjb3VudHJ5OiAnRWN1YWRvcicgfSxcbiAgICAgICAgeyBuYW1lOiAnU2FtYW50aGEnLCAgZW1haWw6ICdzYW1hbnRoYUBlbWFpbC5jb20nLCAgYWdlOiAzMCwgY291bnRyeTogJ1VuaXRlZCBTdGF0ZXMnIH0sXG4gICAgICAgIHsgbmFtZTogJ05pY29sZScsICAgIGVtYWlsOiAnbmljb2xlQGVtYWlsLmNvbScsICAgIGFnZTogNDMsIGNvdW50cnk6ICdDb2xvbWJpYScgfSxcbiAgICAgICAgeyBuYW1lOiAnTmF0YXNoYScsICAgZW1haWw6ICduYXRhc2hhQGVtYWlsLmNvbScsICAgYWdlOiA1NCwgY291bnRyeTogJ0VjdWFkb3InIH0sXG4gICAgICAgIHsgbmFtZTogJ01pY2hhZWwnLCAgIGVtYWlsOiAnbWljaGFlbEBlbWFpbC5jb20nLCAgIGFnZTogMTUsIGNvdW50cnk6ICdDb2xvbWJpYScgfSxcbiAgICAgICAgeyBuYW1lOiAnTmljb2zDoXMnLCAgIGVtYWlsOiAnbmljb2xhc0BlbWFpbC5jb20nLCAgICBhZ2U6IDQzLCBjb3VudHJ5OiAnQ29sb21iaWEnIH1cbiAgICBdO1xuXG4gICAgJHNjb3BlLmF2YWlsYWJsZUNvbG9ycyA9IFsnUmVkJywnR3JlZW4nLCdCbHVlJywnWWVsbG93JywnTWFnZW50YScsJ01hcm9vbicsJ1VtYnJhJywnVHVycXVvaXNlJ107XG5cbiAgICAkc2NvcGUubXVsdGlwbGVEZW1vID0ge307XG4gICAgJHNjb3BlLm11bHRpcGxlRGVtby5jb2xvcnMgPSBbJ0JsdWUnLCdSZWQnXTtcbiAgICAkc2NvcGUubXVsdGlwbGVEZW1vLnNlbGVjdGVkUGVvcGxlID0gWyRzY29wZS5wZW9wbGVbNV0sICRzY29wZS5wZW9wbGVbNF1dO1xuICAgICRzY29wZS5tdWx0aXBsZURlbW8uc2VsZWN0ZWRQZW9wbGVXaXRoR3JvdXBCeSA9IFskc2NvcGUucGVvcGxlWzhdLCAkc2NvcGUucGVvcGxlWzZdXTtcbiAgICAkc2NvcGUubXVsdGlwbGVEZW1vLnNlbGVjdGVkUGVvcGxlU2ltcGxlID0gWydzYW1hbnRoYUBlbWFpbC5jb20nLCd3bGFkaW1pckBlbWFpbC5jb20nXTtcblxuXG4gICAgJHNjb3BlLmFkZHJlc3MgPSB7fTtcbiAgICAkc2NvcGUucmVmcmVzaEFkZHJlc3NlcyA9IGZ1bmN0aW9uKGFkZHJlc3MpIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHthZGRyZXNzOiBhZGRyZXNzLCBzZW5zb3I6IGZhbHNlfTtcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChcbiAgICAgICAgICAgICdodHRwOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9nZW9jb2RlL2pzb24nLFxuICAgICAgICAgICAge3BhcmFtczogcGFyYW1zfVxuICAgICAgICApLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5hZGRyZXNzZXMgPSByZXNwb25zZS5kYXRhLnJlc3VsdHM7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY291bnRyeSA9IHt9O1xuICAgICRzY29wZS5jb3VudHJpZXMgPSBbIC8vIFRha2VuIGZyb20gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vdW5jZXVzLzY1MDE5ODVcbiAgICAgICAge25hbWU6ICdBZmdoYW5pc3RhbicsIGNvZGU6ICdBRid9LFxuICAgICAgICB7bmFtZTogJ8OFbGFuZCBJc2xhbmRzJywgY29kZTogJ0FYJ30sXG4gICAgICAgIHtuYW1lOiAnQWxiYW5pYScsIGNvZGU6ICdBTCd9LFxuICAgICAgICB7bmFtZTogJ0FsZ2VyaWEnLCBjb2RlOiAnRFonfSxcbiAgICAgICAge25hbWU6ICdBbWVyaWNhbiBTYW1vYScsIGNvZGU6ICdBUyd9LFxuICAgICAgICB7bmFtZTogJ0FuZG9ycmEnLCBjb2RlOiAnQUQnfSxcbiAgICAgICAge25hbWU6ICdBbmdvbGEnLCBjb2RlOiAnQU8nfSxcbiAgICAgICAge25hbWU6ICdBbmd1aWxsYScsIGNvZGU6ICdBSSd9LFxuICAgICAgICB7bmFtZTogJ0FudGFyY3RpY2EnLCBjb2RlOiAnQVEnfSxcbiAgICAgICAge25hbWU6ICdBbnRpZ3VhIGFuZCBCYXJidWRhJywgY29kZTogJ0FHJ30sXG4gICAgICAgIHtuYW1lOiAnQXJnZW50aW5hJywgY29kZTogJ0FSJ30sXG4gICAgICAgIHtuYW1lOiAnQXJtZW5pYScsIGNvZGU6ICdBTSd9LFxuICAgICAgICB7bmFtZTogJ0FydWJhJywgY29kZTogJ0FXJ30sXG4gICAgICAgIHtuYW1lOiAnQXVzdHJhbGlhJywgY29kZTogJ0FVJ30sXG4gICAgICAgIHtuYW1lOiAnQXVzdHJpYScsIGNvZGU6ICdBVCd9LFxuICAgICAgICB7bmFtZTogJ0F6ZXJiYWlqYW4nLCBjb2RlOiAnQVonfSxcbiAgICAgICAge25hbWU6ICdCYWhhbWFzJywgY29kZTogJ0JTJ30sXG4gICAgICAgIHtuYW1lOiAnQmFocmFpbicsIGNvZGU6ICdCSCd9LFxuICAgICAgICB7bmFtZTogJ0JhbmdsYWRlc2gnLCBjb2RlOiAnQkQnfSxcbiAgICAgICAge25hbWU6ICdCYXJiYWRvcycsIGNvZGU6ICdCQid9LFxuICAgICAgICB7bmFtZTogJ0JlbGFydXMnLCBjb2RlOiAnQlknfSxcbiAgICAgICAge25hbWU6ICdCZWxnaXVtJywgY29kZTogJ0JFJ30sXG4gICAgICAgIHtuYW1lOiAnQmVsaXplJywgY29kZTogJ0JaJ30sXG4gICAgICAgIHtuYW1lOiAnQmVuaW4nLCBjb2RlOiAnQkonfSxcbiAgICAgICAge25hbWU6ICdCZXJtdWRhJywgY29kZTogJ0JNJ30sXG4gICAgICAgIHtuYW1lOiAnQmh1dGFuJywgY29kZTogJ0JUJ30sXG4gICAgICAgIHtuYW1lOiAnQm9saXZpYScsIGNvZGU6ICdCTyd9LFxuICAgICAgICB7bmFtZTogJ0Jvc25pYSBhbmQgSGVyemVnb3ZpbmEnLCBjb2RlOiAnQkEnfSxcbiAgICAgICAge25hbWU6ICdCb3Rzd2FuYScsIGNvZGU6ICdCVyd9LFxuICAgICAgICB7bmFtZTogJ0JvdXZldCBJc2xhbmQnLCBjb2RlOiAnQlYnfSxcbiAgICAgICAge25hbWU6ICdCcmF6aWwnLCBjb2RlOiAnQlInfSxcbiAgICAgICAge25hbWU6ICdCcml0aXNoIEluZGlhbiBPY2VhbiBUZXJyaXRvcnknLCBjb2RlOiAnSU8nfSxcbiAgICAgICAge25hbWU6ICdCcnVuZWkgRGFydXNzYWxhbScsIGNvZGU6ICdCTid9LFxuICAgICAgICB7bmFtZTogJ0J1bGdhcmlhJywgY29kZTogJ0JHJ30sXG4gICAgICAgIHtuYW1lOiAnQnVya2luYSBGYXNvJywgY29kZTogJ0JGJ30sXG4gICAgICAgIHtuYW1lOiAnQnVydW5kaScsIGNvZGU6ICdCSSd9LFxuICAgICAgICB7bmFtZTogJ0NhbWJvZGlhJywgY29kZTogJ0tIJ30sXG4gICAgICAgIHtuYW1lOiAnQ2FtZXJvb24nLCBjb2RlOiAnQ00nfSxcbiAgICAgICAge25hbWU6ICdDYW5hZGEnLCBjb2RlOiAnQ0EnfSxcbiAgICAgICAge25hbWU6ICdDYXBlIFZlcmRlJywgY29kZTogJ0NWJ30sXG4gICAgICAgIHtuYW1lOiAnQ2F5bWFuIElzbGFuZHMnLCBjb2RlOiAnS1knfSxcbiAgICAgICAge25hbWU6ICdDZW50cmFsIEFmcmljYW4gUmVwdWJsaWMnLCBjb2RlOiAnQ0YnfSxcbiAgICAgICAge25hbWU6ICdDaGFkJywgY29kZTogJ1REJ30sXG4gICAgICAgIHtuYW1lOiAnQ2hpbGUnLCBjb2RlOiAnQ0wnfSxcbiAgICAgICAge25hbWU6ICdDaGluYScsIGNvZGU6ICdDTid9LFxuICAgICAgICB7bmFtZTogJ0NocmlzdG1hcyBJc2xhbmQnLCBjb2RlOiAnQ1gnfSxcbiAgICAgICAge25hbWU6ICdDb2NvcyAoS2VlbGluZykgSXNsYW5kcycsIGNvZGU6ICdDQyd9LFxuICAgICAgICB7bmFtZTogJ0NvbG9tYmlhJywgY29kZTogJ0NPJ30sXG4gICAgICAgIHtuYW1lOiAnQ29tb3JvcycsIGNvZGU6ICdLTSd9LFxuICAgICAgICB7bmFtZTogJ0NvbmdvJywgY29kZTogJ0NHJ30sXG4gICAgICAgIHtuYW1lOiAnQ29uZ28sIFRoZSBEZW1vY3JhdGljIFJlcHVibGljIG9mIHRoZScsIGNvZGU6ICdDRCd9LFxuICAgICAgICB7bmFtZTogJ0Nvb2sgSXNsYW5kcycsIGNvZGU6ICdDSyd9LFxuICAgICAgICB7bmFtZTogJ0Nvc3RhIFJpY2EnLCBjb2RlOiAnQ1InfSxcbiAgICAgICAge25hbWU6ICdDb3RlIERcXCdJdm9pcmUnLCBjb2RlOiAnQ0knfSxcbiAgICAgICAge25hbWU6ICdDcm9hdGlhJywgY29kZTogJ0hSJ30sXG4gICAgICAgIHtuYW1lOiAnQ3ViYScsIGNvZGU6ICdDVSd9LFxuICAgICAgICB7bmFtZTogJ0N5cHJ1cycsIGNvZGU6ICdDWSd9LFxuICAgICAgICB7bmFtZTogJ0N6ZWNoIFJlcHVibGljJywgY29kZTogJ0NaJ30sXG4gICAgICAgIHtuYW1lOiAnRGVubWFyaycsIGNvZGU6ICdESyd9LFxuICAgICAgICB7bmFtZTogJ0RqaWJvdXRpJywgY29kZTogJ0RKJ30sXG4gICAgICAgIHtuYW1lOiAnRG9taW5pY2EnLCBjb2RlOiAnRE0nfSxcbiAgICAgICAge25hbWU6ICdEb21pbmljYW4gUmVwdWJsaWMnLCBjb2RlOiAnRE8nfSxcbiAgICAgICAge25hbWU6ICdFY3VhZG9yJywgY29kZTogJ0VDJ30sXG4gICAgICAgIHtuYW1lOiAnRWd5cHQnLCBjb2RlOiAnRUcnfSxcbiAgICAgICAge25hbWU6ICdFbCBTYWx2YWRvcicsIGNvZGU6ICdTVid9LFxuICAgICAgICB7bmFtZTogJ0VxdWF0b3JpYWwgR3VpbmVhJywgY29kZTogJ0dRJ30sXG4gICAgICAgIHtuYW1lOiAnRXJpdHJlYScsIGNvZGU6ICdFUid9LFxuICAgICAgICB7bmFtZTogJ0VzdG9uaWEnLCBjb2RlOiAnRUUnfSxcbiAgICAgICAge25hbWU6ICdFdGhpb3BpYScsIGNvZGU6ICdFVCd9LFxuICAgICAgICB7bmFtZTogJ0ZhbGtsYW5kIElzbGFuZHMgKE1hbHZpbmFzKScsIGNvZGU6ICdGSyd9LFxuICAgICAgICB7bmFtZTogJ0Zhcm9lIElzbGFuZHMnLCBjb2RlOiAnRk8nfSxcbiAgICAgICAge25hbWU6ICdGaWppJywgY29kZTogJ0ZKJ30sXG4gICAgICAgIHtuYW1lOiAnRmlubGFuZCcsIGNvZGU6ICdGSSd9LFxuICAgICAgICB7bmFtZTogJ0ZyYW5jZScsIGNvZGU6ICdGUid9LFxuICAgICAgICB7bmFtZTogJ0ZyZW5jaCBHdWlhbmEnLCBjb2RlOiAnR0YnfSxcbiAgICAgICAge25hbWU6ICdGcmVuY2ggUG9seW5lc2lhJywgY29kZTogJ1BGJ30sXG4gICAgICAgIHtuYW1lOiAnRnJlbmNoIFNvdXRoZXJuIFRlcnJpdG9yaWVzJywgY29kZTogJ1RGJ30sXG4gICAgICAgIHtuYW1lOiAnR2Fib24nLCBjb2RlOiAnR0EnfSxcbiAgICAgICAge25hbWU6ICdHYW1iaWEnLCBjb2RlOiAnR00nfSxcbiAgICAgICAge25hbWU6ICdHZW9yZ2lhJywgY29kZTogJ0dFJ30sXG4gICAgICAgIHtuYW1lOiAnR2VybWFueScsIGNvZGU6ICdERSd9LFxuICAgICAgICB7bmFtZTogJ0doYW5hJywgY29kZTogJ0dIJ30sXG4gICAgICAgIHtuYW1lOiAnR2licmFsdGFyJywgY29kZTogJ0dJJ30sXG4gICAgICAgIHtuYW1lOiAnR3JlZWNlJywgY29kZTogJ0dSJ30sXG4gICAgICAgIHtuYW1lOiAnR3JlZW5sYW5kJywgY29kZTogJ0dMJ30sXG4gICAgICAgIHtuYW1lOiAnR3JlbmFkYScsIGNvZGU6ICdHRCd9LFxuICAgICAgICB7bmFtZTogJ0d1YWRlbG91cGUnLCBjb2RlOiAnR1AnfSxcbiAgICAgICAge25hbWU6ICdHdWFtJywgY29kZTogJ0dVJ30sXG4gICAgICAgIHtuYW1lOiAnR3VhdGVtYWxhJywgY29kZTogJ0dUJ30sXG4gICAgICAgIHtuYW1lOiAnR3Vlcm5zZXknLCBjb2RlOiAnR0cnfSxcbiAgICAgICAge25hbWU6ICdHdWluZWEnLCBjb2RlOiAnR04nfSxcbiAgICAgICAge25hbWU6ICdHdWluZWEtQmlzc2F1JywgY29kZTogJ0dXJ30sXG4gICAgICAgIHtuYW1lOiAnR3V5YW5hJywgY29kZTogJ0dZJ30sXG4gICAgICAgIHtuYW1lOiAnSGFpdGknLCBjb2RlOiAnSFQnfSxcbiAgICAgICAge25hbWU6ICdIZWFyZCBJc2xhbmQgYW5kIE1jZG9uYWxkIElzbGFuZHMnLCBjb2RlOiAnSE0nfSxcbiAgICAgICAge25hbWU6ICdIb2x5IFNlZSAoVmF0aWNhbiBDaXR5IFN0YXRlKScsIGNvZGU6ICdWQSd9LFxuICAgICAgICB7bmFtZTogJ0hvbmR1cmFzJywgY29kZTogJ0hOJ30sXG4gICAgICAgIHtuYW1lOiAnSG9uZyBLb25nJywgY29kZTogJ0hLJ30sXG4gICAgICAgIHtuYW1lOiAnSHVuZ2FyeScsIGNvZGU6ICdIVSd9LFxuICAgICAgICB7bmFtZTogJ0ljZWxhbmQnLCBjb2RlOiAnSVMnfSxcbiAgICAgICAge25hbWU6ICdJbmRpYScsIGNvZGU6ICdJTid9LFxuICAgICAgICB7bmFtZTogJ0luZG9uZXNpYScsIGNvZGU6ICdJRCd9LFxuICAgICAgICB7bmFtZTogJ0lyYW4sIElzbGFtaWMgUmVwdWJsaWMgT2YnLCBjb2RlOiAnSVInfSxcbiAgICAgICAge25hbWU6ICdJcmFxJywgY29kZTogJ0lRJ30sXG4gICAgICAgIHtuYW1lOiAnSXJlbGFuZCcsIGNvZGU6ICdJRSd9LFxuICAgICAgICB7bmFtZTogJ0lzbGUgb2YgTWFuJywgY29kZTogJ0lNJ30sXG4gICAgICAgIHtuYW1lOiAnSXNyYWVsJywgY29kZTogJ0lMJ30sXG4gICAgICAgIHtuYW1lOiAnSXRhbHknLCBjb2RlOiAnSVQnfSxcbiAgICAgICAge25hbWU6ICdKYW1haWNhJywgY29kZTogJ0pNJ30sXG4gICAgICAgIHtuYW1lOiAnSmFwYW4nLCBjb2RlOiAnSlAnfSxcbiAgICAgICAge25hbWU6ICdKZXJzZXknLCBjb2RlOiAnSkUnfSxcbiAgICAgICAge25hbWU6ICdKb3JkYW4nLCBjb2RlOiAnSk8nfSxcbiAgICAgICAge25hbWU6ICdLYXpha2hzdGFuJywgY29kZTogJ0taJ30sXG4gICAgICAgIHtuYW1lOiAnS2VueWEnLCBjb2RlOiAnS0UnfSxcbiAgICAgICAge25hbWU6ICdLaXJpYmF0aScsIGNvZGU6ICdLSSd9LFxuICAgICAgICB7bmFtZTogJ0tvcmVhLCBEZW1vY3JhdGljIFBlb3BsZVxcJ3MgUmVwdWJsaWMgb2YnLCBjb2RlOiAnS1AnfSxcbiAgICAgICAge25hbWU6ICdLb3JlYSwgUmVwdWJsaWMgb2YnLCBjb2RlOiAnS1InfSxcbiAgICAgICAge25hbWU6ICdLdXdhaXQnLCBjb2RlOiAnS1cnfSxcbiAgICAgICAge25hbWU6ICdLeXJneXpzdGFuJywgY29kZTogJ0tHJ30sXG4gICAgICAgIHtuYW1lOiAnTGFvIFBlb3BsZVxcJ3MgRGVtb2NyYXRpYyBSZXB1YmxpYycsIGNvZGU6ICdMQSd9LFxuICAgICAgICB7bmFtZTogJ0xhdHZpYScsIGNvZGU6ICdMVid9LFxuICAgICAgICB7bmFtZTogJ0xlYmFub24nLCBjb2RlOiAnTEInfSxcbiAgICAgICAge25hbWU6ICdMZXNvdGhvJywgY29kZTogJ0xTJ30sXG4gICAgICAgIHtuYW1lOiAnTGliZXJpYScsIGNvZGU6ICdMUid9LFxuICAgICAgICB7bmFtZTogJ0xpYnlhbiBBcmFiIEphbWFoaXJpeWEnLCBjb2RlOiAnTFknfSxcbiAgICAgICAge25hbWU6ICdMaWVjaHRlbnN0ZWluJywgY29kZTogJ0xJJ30sXG4gICAgICAgIHtuYW1lOiAnTGl0aHVhbmlhJywgY29kZTogJ0xUJ30sXG4gICAgICAgIHtuYW1lOiAnTHV4ZW1ib3VyZycsIGNvZGU6ICdMVSd9LFxuICAgICAgICB7bmFtZTogJ01hY2FvJywgY29kZTogJ01PJ30sXG4gICAgICAgIHtuYW1lOiAnTWFjZWRvbmlhLCBUaGUgRm9ybWVyIFl1Z29zbGF2IFJlcHVibGljIG9mJywgY29kZTogJ01LJ30sXG4gICAgICAgIHtuYW1lOiAnTWFkYWdhc2NhcicsIGNvZGU6ICdNRyd9LFxuICAgICAgICB7bmFtZTogJ01hbGF3aScsIGNvZGU6ICdNVyd9LFxuICAgICAgICB7bmFtZTogJ01hbGF5c2lhJywgY29kZTogJ01ZJ30sXG4gICAgICAgIHtuYW1lOiAnTWFsZGl2ZXMnLCBjb2RlOiAnTVYnfSxcbiAgICAgICAge25hbWU6ICdNYWxpJywgY29kZTogJ01MJ30sXG4gICAgICAgIHtuYW1lOiAnTWFsdGEnLCBjb2RlOiAnTVQnfSxcbiAgICAgICAge25hbWU6ICdNYXJzaGFsbCBJc2xhbmRzJywgY29kZTogJ01IJ30sXG4gICAgICAgIHtuYW1lOiAnTWFydGluaXF1ZScsIGNvZGU6ICdNUSd9LFxuICAgICAgICB7bmFtZTogJ01hdXJpdGFuaWEnLCBjb2RlOiAnTVInfSxcbiAgICAgICAge25hbWU6ICdNYXVyaXRpdXMnLCBjb2RlOiAnTVUnfSxcbiAgICAgICAge25hbWU6ICdNYXlvdHRlJywgY29kZTogJ1lUJ30sXG4gICAgICAgIHtuYW1lOiAnTWV4aWNvJywgY29kZTogJ01YJ30sXG4gICAgICAgIHtuYW1lOiAnTWljcm9uZXNpYSwgRmVkZXJhdGVkIFN0YXRlcyBvZicsIGNvZGU6ICdGTSd9LFxuICAgICAgICB7bmFtZTogJ01vbGRvdmEsIFJlcHVibGljIG9mJywgY29kZTogJ01EJ30sXG4gICAgICAgIHtuYW1lOiAnTW9uYWNvJywgY29kZTogJ01DJ30sXG4gICAgICAgIHtuYW1lOiAnTW9uZ29saWEnLCBjb2RlOiAnTU4nfSxcbiAgICAgICAge25hbWU6ICdNb250c2VycmF0JywgY29kZTogJ01TJ30sXG4gICAgICAgIHtuYW1lOiAnTW9yb2NjbycsIGNvZGU6ICdNQSd9LFxuICAgICAgICB7bmFtZTogJ01vemFtYmlxdWUnLCBjb2RlOiAnTVonfSxcbiAgICAgICAge25hbWU6ICdNeWFubWFyJywgY29kZTogJ01NJ30sXG4gICAgICAgIHtuYW1lOiAnTmFtaWJpYScsIGNvZGU6ICdOQSd9LFxuICAgICAgICB7bmFtZTogJ05hdXJ1JywgY29kZTogJ05SJ30sXG4gICAgICAgIHtuYW1lOiAnTmVwYWwnLCBjb2RlOiAnTlAnfSxcbiAgICAgICAge25hbWU6ICdOZXRoZXJsYW5kcycsIGNvZGU6ICdOTCd9LFxuICAgICAgICB7bmFtZTogJ05ldGhlcmxhbmRzIEFudGlsbGVzJywgY29kZTogJ0FOJ30sXG4gICAgICAgIHtuYW1lOiAnTmV3IENhbGVkb25pYScsIGNvZGU6ICdOQyd9LFxuICAgICAgICB7bmFtZTogJ05ldyBaZWFsYW5kJywgY29kZTogJ05aJ30sXG4gICAgICAgIHtuYW1lOiAnTmljYXJhZ3VhJywgY29kZTogJ05JJ30sXG4gICAgICAgIHtuYW1lOiAnTmlnZXInLCBjb2RlOiAnTkUnfSxcbiAgICAgICAge25hbWU6ICdOaWdlcmlhJywgY29kZTogJ05HJ30sXG4gICAgICAgIHtuYW1lOiAnTml1ZScsIGNvZGU6ICdOVSd9LFxuICAgICAgICB7bmFtZTogJ05vcmZvbGsgSXNsYW5kJywgY29kZTogJ05GJ30sXG4gICAgICAgIHtuYW1lOiAnTm9ydGhlcm4gTWFyaWFuYSBJc2xhbmRzJywgY29kZTogJ01QJ30sXG4gICAgICAgIHtuYW1lOiAnTm9yd2F5JywgY29kZTogJ05PJ30sXG4gICAgICAgIHtuYW1lOiAnT21hbicsIGNvZGU6ICdPTSd9LFxuICAgICAgICB7bmFtZTogJ1Bha2lzdGFuJywgY29kZTogJ1BLJ30sXG4gICAgICAgIHtuYW1lOiAnUGFsYXUnLCBjb2RlOiAnUFcnfSxcbiAgICAgICAge25hbWU6ICdQYWxlc3RpbmlhbiBUZXJyaXRvcnksIE9jY3VwaWVkJywgY29kZTogJ1BTJ30sXG4gICAgICAgIHtuYW1lOiAnUGFuYW1hJywgY29kZTogJ1BBJ30sXG4gICAgICAgIHtuYW1lOiAnUGFwdWEgTmV3IEd1aW5lYScsIGNvZGU6ICdQRyd9LFxuICAgICAgICB7bmFtZTogJ1BhcmFndWF5JywgY29kZTogJ1BZJ30sXG4gICAgICAgIHtuYW1lOiAnUGVydScsIGNvZGU6ICdQRSd9LFxuICAgICAgICB7bmFtZTogJ1BoaWxpcHBpbmVzJywgY29kZTogJ1BIJ30sXG4gICAgICAgIHtuYW1lOiAnUGl0Y2Fpcm4nLCBjb2RlOiAnUE4nfSxcbiAgICAgICAge25hbWU6ICdQb2xhbmQnLCBjb2RlOiAnUEwnfSxcbiAgICAgICAge25hbWU6ICdQb3J0dWdhbCcsIGNvZGU6ICdQVCd9LFxuICAgICAgICB7bmFtZTogJ1B1ZXJ0byBSaWNvJywgY29kZTogJ1BSJ30sXG4gICAgICAgIHtuYW1lOiAnUWF0YXInLCBjb2RlOiAnUUEnfSxcbiAgICAgICAge25hbWU6ICdSZXVuaW9uJywgY29kZTogJ1JFJ30sXG4gICAgICAgIHtuYW1lOiAnUm9tYW5pYScsIGNvZGU6ICdSTyd9LFxuICAgICAgICB7bmFtZTogJ1J1c3NpYW4gRmVkZXJhdGlvbicsIGNvZGU6ICdSVSd9LFxuICAgICAgICB7bmFtZTogJ1J3YW5kYScsIGNvZGU6ICdSVyd9LFxuICAgICAgICB7bmFtZTogJ1NhaW50IEhlbGVuYScsIGNvZGU6ICdTSCd9LFxuICAgICAgICB7bmFtZTogJ1NhaW50IEtpdHRzIGFuZCBOZXZpcycsIGNvZGU6ICdLTid9LFxuICAgICAgICB7bmFtZTogJ1NhaW50IEx1Y2lhJywgY29kZTogJ0xDJ30sXG4gICAgICAgIHtuYW1lOiAnU2FpbnQgUGllcnJlIGFuZCBNaXF1ZWxvbicsIGNvZGU6ICdQTSd9LFxuICAgICAgICB7bmFtZTogJ1NhaW50IFZpbmNlbnQgYW5kIHRoZSBHcmVuYWRpbmVzJywgY29kZTogJ1ZDJ30sXG4gICAgICAgIHtuYW1lOiAnU2Ftb2EnLCBjb2RlOiAnV1MnfSxcbiAgICAgICAge25hbWU6ICdTYW4gTWFyaW5vJywgY29kZTogJ1NNJ30sXG4gICAgICAgIHtuYW1lOiAnU2FvIFRvbWUgYW5kIFByaW5jaXBlJywgY29kZTogJ1NUJ30sXG4gICAgICAgIHtuYW1lOiAnU2F1ZGkgQXJhYmlhJywgY29kZTogJ1NBJ30sXG4gICAgICAgIHtuYW1lOiAnU2VuZWdhbCcsIGNvZGU6ICdTTid9LFxuICAgICAgICB7bmFtZTogJ1NlcmJpYSBhbmQgTW9udGVuZWdybycsIGNvZGU6ICdDUyd9LFxuICAgICAgICB7bmFtZTogJ1NleWNoZWxsZXMnLCBjb2RlOiAnU0MnfSxcbiAgICAgICAge25hbWU6ICdTaWVycmEgTGVvbmUnLCBjb2RlOiAnU0wnfSxcbiAgICAgICAge25hbWU6ICdTaW5nYXBvcmUnLCBjb2RlOiAnU0cnfSxcbiAgICAgICAge25hbWU6ICdTbG92YWtpYScsIGNvZGU6ICdTSyd9LFxuICAgICAgICB7bmFtZTogJ1Nsb3ZlbmlhJywgY29kZTogJ1NJJ30sXG4gICAgICAgIHtuYW1lOiAnU29sb21vbiBJc2xhbmRzJywgY29kZTogJ1NCJ30sXG4gICAgICAgIHtuYW1lOiAnU29tYWxpYScsIGNvZGU6ICdTTyd9LFxuICAgICAgICB7bmFtZTogJ1NvdXRoIEFmcmljYScsIGNvZGU6ICdaQSd9LFxuICAgICAgICB7bmFtZTogJ1NvdXRoIEdlb3JnaWEgYW5kIHRoZSBTb3V0aCBTYW5kd2ljaCBJc2xhbmRzJywgY29kZTogJ0dTJ30sXG4gICAgICAgIHtuYW1lOiAnU3BhaW4nLCBjb2RlOiAnRVMnfSxcbiAgICAgICAge25hbWU6ICdTcmkgTGFua2EnLCBjb2RlOiAnTEsnfSxcbiAgICAgICAge25hbWU6ICdTdWRhbicsIGNvZGU6ICdTRCd9LFxuICAgICAgICB7bmFtZTogJ1N1cmluYW1lJywgY29kZTogJ1NSJ30sXG4gICAgICAgIHtuYW1lOiAnU3ZhbGJhcmQgYW5kIEphbiBNYXllbicsIGNvZGU6ICdTSid9LFxuICAgICAgICB7bmFtZTogJ1N3YXppbGFuZCcsIGNvZGU6ICdTWid9LFxuICAgICAgICB7bmFtZTogJ1N3ZWRlbicsIGNvZGU6ICdTRSd9LFxuICAgICAgICB7bmFtZTogJ1N3aXR6ZXJsYW5kJywgY29kZTogJ0NIJ30sXG4gICAgICAgIHtuYW1lOiAnU3lyaWFuIEFyYWIgUmVwdWJsaWMnLCBjb2RlOiAnU1knfSxcbiAgICAgICAge25hbWU6ICdUYWl3YW4sIFByb3ZpbmNlIG9mIENoaW5hJywgY29kZTogJ1RXJ30sXG4gICAgICAgIHtuYW1lOiAnVGFqaWtpc3RhbicsIGNvZGU6ICdUSid9LFxuICAgICAgICB7bmFtZTogJ1RhbnphbmlhLCBVbml0ZWQgUmVwdWJsaWMgb2YnLCBjb2RlOiAnVFonfSxcbiAgICAgICAge25hbWU6ICdUaGFpbGFuZCcsIGNvZGU6ICdUSCd9LFxuICAgICAgICB7bmFtZTogJ1RpbW9yLUxlc3RlJywgY29kZTogJ1RMJ30sXG4gICAgICAgIHtuYW1lOiAnVG9nbycsIGNvZGU6ICdURyd9LFxuICAgICAgICB7bmFtZTogJ1Rva2VsYXUnLCBjb2RlOiAnVEsnfSxcbiAgICAgICAge25hbWU6ICdUb25nYScsIGNvZGU6ICdUTyd9LFxuICAgICAgICB7bmFtZTogJ1RyaW5pZGFkIGFuZCBUb2JhZ28nLCBjb2RlOiAnVFQnfSxcbiAgICAgICAge25hbWU6ICdUdW5pc2lhJywgY29kZTogJ1ROJ30sXG4gICAgICAgIHtuYW1lOiAnVHVya2V5JywgY29kZTogJ1RSJ30sXG4gICAgICAgIHtuYW1lOiAnVHVya21lbmlzdGFuJywgY29kZTogJ1RNJ30sXG4gICAgICAgIHtuYW1lOiAnVHVya3MgYW5kIENhaWNvcyBJc2xhbmRzJywgY29kZTogJ1RDJ30sXG4gICAgICAgIHtuYW1lOiAnVHV2YWx1JywgY29kZTogJ1RWJ30sXG4gICAgICAgIHtuYW1lOiAnVWdhbmRhJywgY29kZTogJ1VHJ30sXG4gICAgICAgIHtuYW1lOiAnVWtyYWluZScsIGNvZGU6ICdVQSd9LFxuICAgICAgICB7bmFtZTogJ1VuaXRlZCBBcmFiIEVtaXJhdGVzJywgY29kZTogJ0FFJ30sXG4gICAgICAgIHtuYW1lOiAnVW5pdGVkIEtpbmdkb20nLCBjb2RlOiAnR0InfSxcbiAgICAgICAge25hbWU6ICdVbml0ZWQgU3RhdGVzJywgY29kZTogJ1VTJ30sXG4gICAgICAgIHtuYW1lOiAnVW5pdGVkIFN0YXRlcyBNaW5vciBPdXRseWluZyBJc2xhbmRzJywgY29kZTogJ1VNJ30sXG4gICAgICAgIHtuYW1lOiAnVXJ1Z3VheScsIGNvZGU6ICdVWSd9LFxuICAgICAgICB7bmFtZTogJ1V6YmVraXN0YW4nLCBjb2RlOiAnVVonfSxcbiAgICAgICAge25hbWU6ICdWYW51YXR1JywgY29kZTogJ1ZVJ30sXG4gICAgICAgIHtuYW1lOiAnVmVuZXp1ZWxhJywgY29kZTogJ1ZFJ30sXG4gICAgICAgIHtuYW1lOiAnVmlldG5hbScsIGNvZGU6ICdWTid9LFxuICAgICAgICB7bmFtZTogJ1ZpcmdpbiBJc2xhbmRzLCBCcml0aXNoJywgY29kZTogJ1ZHJ30sXG4gICAgICAgIHtuYW1lOiAnVmlyZ2luIElzbGFuZHMsIFUuUy4nLCBjb2RlOiAnVkknfSxcbiAgICAgICAge25hbWU6ICdXYWxsaXMgYW5kIEZ1dHVuYScsIGNvZGU6ICdXRid9LFxuICAgICAgICB7bmFtZTogJ1dlc3Rlcm4gU2FoYXJhJywgY29kZTogJ0VIJ30sXG4gICAgICAgIHtuYW1lOiAnWWVtZW4nLCBjb2RlOiAnWUUnfSxcbiAgICAgICAge25hbWU6ICdaYW1iaWEnLCBjb2RlOiAnWk0nfSxcbiAgICAgICAge25hbWU6ICdaaW1iYWJ3ZScsIGNvZGU6ICdaVyd9XG4gICAgXTtcbn1cblxuZnVuY3Rpb24gcHJvcHNGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGl0ZW1zLCBwcm9wcykge1xuICAgICAgICB2YXIgb3V0ID0gW107XG5cbiAgICAgICAgaWYgKGFuZ3VsYXIuaXNBcnJheShpdGVtcykpIHtcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtTWF0Y2hlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhwcm9wcyk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wID0ga2V5c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRleHQgPSBwcm9wc1twcm9wXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbVtwcm9wXS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZXh0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1NYXRjaGVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1NYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTGV0IHRoZSBvdXRwdXQgYmUgdGhlIGlucHV0IHVudG91Y2hlZFxuICAgICAgICAgICAgb3V0ID0gaXRlbXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG59XG5cbmRhdGVSYW5nZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBkYXRlUmFuZ2VDdHJsKCRzY29wZSkge1xuICAgICRzY29wZS5kYXRlID0ge1xuICAgICAgICBzdGFydERhdGU6IG1vbWVudCgpLnN1YnRyYWN0KDUsICdkYXlzJyksXG4gICAgICAgIGVuZERhdGU6IG1vbWVudCgpXG4gICAgfTtcbiAgICAkc2NvcGUub3B0cyA9IHtcbiAgICAgICAgZHJvcHM6ICd1cCcsXG4gICAgICAgIG9wZW5zOiAnbGVmdCcsXG4gICAgICAgIHJhbmdlczoge1xuICAgICAgICAgICAgJ1RvZGF5JzogW21vbWVudCgpLCBtb21lbnQoKV0sXG4gICAgICAgICAgICAnWWVzdGVyZGF5JzogW21vbWVudCgpLnN1YnRyYWN0KCdkYXlzJywgMSksIG1vbWVudCgpLnN1YnRyYWN0KCdkYXlzJywgMSldLFxuICAgICAgICAgICAgJ0xhc3QgNyBkYXlzJzogW21vbWVudCgpLnN1YnRyYWN0KCdkYXlzJywgNyksIG1vbWVudCgpXSxcbiAgICAgICAgICAgICdMYXN0IDMwIGRheXMnOiBbbW9tZW50KCkuc3VidHJhY3QoJ2RheXMnLCAzMCksIG1vbWVudCgpXSxcbiAgICAgICAgICAgICdUaGlzIG1vbnRoJzogW21vbWVudCgpLnN0YXJ0T2YoJ21vbnRoJyksIG1vbWVudCgpLmVuZE9mKCdtb250aCcpXVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vV2F0Y2ggZm9yIGRhdGUgY2hhbmdlc1xuICAgICRzY29wZS4kd2F0Y2goJ2RhdGUnLCBmdW5jdGlvbihuZXdEYXRlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ05ldyBkYXRlIHNldDogJywgbmV3RGF0ZSk7XG4gICAgfSwgZmFsc2UpO1xufVxuIiwiLy9tYWluLmpzXG4ndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcigndG9hc3RyV2VsY29tZScsIHRvYXN0cldlbGNvbWUpXG4gICAgLmNvbnRyb2xsZXIoJ3RyYWZmaWNEZW1vQ3RybCcsIHRyYWZmaWNEZW1vQ3RybClcbiAgICAuY29udHJvbGxlcignc29jaWFsQm94Q3RybCcsIHNvY2lhbEJveEN0cmwpXG4gICAgLmNvbnRyb2xsZXIoJ2RhdGVSYW5nZUN0cmwnLCBkYXRlUmFuZ2VDdHJsKVxuICAgIC5jb250cm9sbGVyKCdzcGFya2xpbmVDaGFydEN0cmwnLCBzcGFya2xpbmVDaGFydEN0cmwpXG4gICAgLmNvbnRyb2xsZXIoJ2dhdWdlQ3RybCcsIGdhdWdlQ3RybClcbiAgICAuY29udHJvbGxlcignYmFyQ2hhcnRDdHJsJywgYmFyQ2hhcnRDdHJsKVxuICAgIC5jb250cm9sbGVyKCdnYXVnZUpTRGVtb0N0cmwnLCBnYXVnZUpTRGVtb0N0cmwpXG4gICAgLmNvbnRyb2xsZXIoJ2hvcml6b250YWxCYXJzQ3RybCcsIGhvcml6b250YWxCYXJzQ3RybClcbiAgICAuY29udHJvbGxlcignaG9yaXpvbnRhbEJhcnNUeXBlMkN0cmwnLCBob3Jpem9udGFsQmFyc1R5cGUyQ3RybClcbiAgICAuY29udHJvbGxlcigndXNlcnNUYWJsZUN0cmwnLCB1c2Vyc1RhYmxlQ3RybClcbiAgICAuY29udHJvbGxlcignY2xpZW50c1RhYmxlQ3RybCcsIGNsaWVudHNUYWJsZUN0cmwpXG4gICAgLmNvbnRyb2xsZXIoJ2NhcmRDaGFydEN0cmwxJywgY2FyZENoYXJ0Q3RybDEpXG4gICAgLmNvbnRyb2xsZXIoJ2NhcmRDaGFydEN0cmwyJywgY2FyZENoYXJ0Q3RybDIpXG4gICAgLmNvbnRyb2xsZXIoJ2NhcmRDaGFydEN0cmwzJywgY2FyZENoYXJ0Q3RybDMpXG4gICAgLmNvbnRyb2xsZXIoJ2NhcmRDaGFydEN0cmw0JywgY2FyZENoYXJ0Q3RybDQpO1xuXG5cbnRvYXN0cldlbGNvbWUuJGluamVjdCA9IFsnJHNjb3BlJywgJ3RvYXN0ciddO1xuZnVuY3Rpb24gdG9hc3RyV2VsY29tZSgkc2NvcGUsIHRvYXN0cikge1xuICAgIHRvYXN0ci5pbmZvKCdCb290c3RyYXAgNCAmIEFuZ3VsYXJKUyBVSSBLaXQnLCAnV2VsY29tZSB0byBST09UIEFkbWluJywge1xuICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgcHJvZ3Jlc3NCYXI6IHRydWUsXG4gICAgfSk7XG59XG5cbi8vY29udmVydCBIZXggdG8gUkdCQVxuZnVuY3Rpb24gY29udmVydEhleChoZXgsb3BhY2l0eSl7XG4gICAgaGV4ID0gaGV4LnJlcGxhY2UoJyMnLCcnKTtcbiAgICByID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZygwLDIpLCAxNik7XG4gICAgZyA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMiw0KSwgMTYpO1xuICAgIGIgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDQsNiksIDE2KTtcblxuICAgIHJlc3VsdCA9ICdyZ2JhKCcrcisnLCcrZysnLCcrYisnLCcrb3BhY2l0eS8xMDArJyknO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbnRyYWZmaWNEZW1vQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIHRyYWZmaWNEZW1vQ3RybCgkc2NvcGUpe1xuXG4gICAgZnVuY3Rpb24gcmFuZG9tKG1pbixtYXgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoobWF4LW1pbisxKSttaW4pO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50cyA9IDI3O1xuICAgIHZhciBkYXRhMSA9IFtdO1xuICAgIHZhciBkYXRhMiA9IFtdO1xuICAgIHZhciBkYXRhMyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gZWxlbWVudHM7IGkrKykge1xuICAgICAgICBkYXRhMS5wdXNoKHJhbmRvbSg1MCwyMDApKTtcbiAgICAgICAgZGF0YTIucHVzaChyYW5kb20oODAsMTAwKSk7XG4gICAgICAgIGRhdGEzLnB1c2goNjUpO1xuICAgIH1cblxuICAgICRzY29wZS5sYWJlbHMgPSBbJ00nLCAnVCcsICdXJywgJ1QnLCAnRicsICdTJywgJ1MnLCAnTScsICdUJywgJ1cnLCAnVCcsICdGJywgJ1MnLCAnUycsICdNJywgJ1QnLCAnVycsICdUJywgJ0YnLCAnUycsICdTJywgJ00nLCAnVCcsICdXJywgJ1QnLCAnRicsICdTJywgJ1MnXTtcbiAgICAkc2NvcGUuc2VyaWVzID0gWydDdXJyZW50JywgJ1ByZXZpb3VzJywgJ0JFUCddO1xuICAgICRzY29wZS5kYXRhID0gWyBkYXRhMSwgZGF0YTIsIGRhdGEzXTtcbiAgICAkc2NvcGUuY29sb3VycyA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogY29udmVydEhleChicmFuZEluZm8sMTApLFxuICAgICAgICBzdHJva2VDb2xvcjogYnJhbmRJbmZvLFxuICAgICAgICBwb2ludENvbG9yOiBicmFuZEluZm8sXG4gICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICB9LCB7XG4gICAgICAgIGZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGJyYW5kU3VjY2VzcyxcbiAgICAgICAgcG9pbnRDb2xvcjogYnJhbmRTdWNjZXNzLFxuICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiAndHJhbnNwYXJlbnQnXG4gICAgfSx7XG4gICAgICAgIGZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGJyYW5kRGFuZ2VyLFxuICAgICAgICBwb2ludENvbG9yOiBicmFuZERhbmdlcixcbiAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogJ3RyYW5zcGFyZW50J1xuICAgIH1dO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICB0b29sdGlwRmlsbENvbG9yOiAnIzJhMmMzNicsXG4gICAgICAgIHRvb2x0aXBUaXRsZUZvbnRTaXplOiAxMixcbiAgICAgICAgdG9vbHRpcENvcm5lclJhZGl1czogMCxcbiAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcbiAgICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2UsXG4gICAgICAgIHNjYWxlU2hvd1ZlcnRpY2FsTGluZXM6IGZhbHNlLFxuICAgICAgICBzY2FsZU92ZXJyaWRlOiB0cnVlLFxuICAgICAgICBzY2FsZVN0ZXBzOiA1LFxuICAgICAgICBzY2FsZVN0ZXBXaWR0aDogTWF0aC5jZWlsKDI1MCAvIDUpLFxuICAgICAgICAvL2JlemllckN1cnZlIDogZmFsc2UsXG4gICAgICAgIHNjYWxlU3RhcnRWYWx1ZTogMCxcbiAgICAgICAgcG9pbnREb3QgOiBmYWxzZSxcbiAgICB9O1xufVxuXG5kYXRlUmFuZ2VDdHJsLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gZGF0ZVJhbmdlQ3RybCgkc2NvcGUpIHtcbiAgICAkc2NvcGUuZGF0ZSA9IHtcbiAgICAgICBzdGFydERhdGU6IG1vbWVudCgpLnN1YnRyYWN0KDUsICdkYXlzJyksXG4gICAgICAgZW5kRGF0ZTogbW9tZW50KClcbiAgIH07XG4gICAkc2NvcGUub3B0cyA9IHtcbiAgICAgICAgZHJvcHM6ICdkb3duJyxcbiAgICAgICAgb3BlbnM6ICdsZWZ0JyxcbiAgICAgICAgcmFuZ2VzOiB7XG4gICAgICAgICAgICAnVG9kYXknOiBbbW9tZW50KCksIG1vbWVudCgpXSxcbiAgICAgICAgICAgICdZZXN0ZXJkYXknOiBbbW9tZW50KCkuc3VidHJhY3QoMSwgJ2RheXMnKSwgbW9tZW50KCkuc3VidHJhY3QoMSwgJ2RheXMnKV0sXG4gICAgICAgICAgICAnTGFzdCA3IGRheXMnOiBbbW9tZW50KCkuc3VidHJhY3QoNywgJ2RheXMnKSwgbW9tZW50KCldLFxuICAgICAgICAgICAgJ0xhc3QgMzAgZGF5cyc6IFttb21lbnQoKS5zdWJ0cmFjdCgzMCwgJ2RheXMnKSwgbW9tZW50KCldLFxuICAgICAgICAgICAgJ1RoaXMgbW9udGgnOiBbbW9tZW50KCkuc3RhcnRPZignbW9udGgnKSwgbW9tZW50KCkuZW5kT2YoJ21vbnRoJyldXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy9XYXRjaCBmb3IgZGF0ZSBjaGFuZ2VzXG4gICAgJHNjb3BlLiR3YXRjaCgnZGF0ZScsIGZ1bmN0aW9uKG5ld0RhdGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnTmV3IGRhdGUgc2V0OiAnLCBuZXdEYXRlKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICBmdW5jdGlvbiBnZCh5ZWFyLCBtb250aCwgZGF5KSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSkuZ2V0VGltZSgpO1xuICAgIH1cbn1cblxuc29jaWFsQm94Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIHNvY2lhbEJveEN0cmwoJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUubGFiZWxzID0gWydKYW51YXJ5JywnRmVicnVhcnknLCdNYXJjaCcsJ0FwcmlsJywnTWF5JywnSnVuZScsJ0p1bHknXTtcbiAgICAkc2NvcGUuZGF0YTEgPSBbXG4gICAgICAgIFs2NSwgNTksIDg0LCA4NCwgNTEsIDU1LCA0MF1cbiAgICBdO1xuICAgICRzY29wZS5kYXRhMiA9IFtcbiAgICAgICAgWzEsIDEzLCA5LCAxNywgMzQsIDQxLCAzOF1cbiAgICBdO1xuICAgICRzY29wZS5kYXRhMyA9IFtcbiAgICAgICAgWzc4LCA4MSwgODAsIDQ1LCAzNCwgMTIsIDQwXVxuICAgIF07XG4gICAgJHNjb3BlLmRhdGE0ID0gW1xuICAgICAgICBbMzUsIDIzLCA1NiwgMjIsIDk3LCAyMywgNjRdXG4gICAgXTtcbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgcG9pbnRIaXREZXRlY3Rpb25SYWRpdXMgOiAwLFxuICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxuICAgICAgICBzY2FsZUxpbmVXaWR0aDogMC4wMDEsXG4gICAgICAgIHNjYWxlU2hvd0xhYmVscyA6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dHcmlkTGluZXMgOiBmYWxzZSxcbiAgICAgICAgcG9pbnREb3QgOiBmYWxzZSxcbiAgICAgICAgc2hvd1Rvb2x0aXBzOiBmYWxzZVxuICAgIH07XG4gICAgJHNjb3BlLmNvbG91cnMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LC4xKScsXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuNTUpJyxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJ1xuICAgIH1dO1xufVxuXG5zcGFya2xpbmVDaGFydEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBzcGFya2xpbmVDaGFydEN0cmwoJHNjb3BlKSB7XG4gICAgJHNjb3BlLmxhYmVscyA9IFsnTW9uZGF5JywnVHVlc2RheScsJ1dlZG5lc2RheScsJ1RodXJzZGF5JywnRnJpZGF5JywnU2F0dXJkYXknLCdTdW5kYXknXTtcbiAgICAkc2NvcGUuZGF0YTEgPSBbXG4gICAgICAgIFs2NSwgNTksIDg0LCA4NCwgNTEsIDU1LCA0MF1cbiAgICBdO1xuICAgICRzY29wZS5kYXRhMiA9IFtcbiAgICAgICAgWzEsIDEzLCA5LCAxNywgMzQsIDQxLCAzOF1cbiAgICBdO1xuICAgICRzY29wZS5kYXRhMyA9IFtcbiAgICAgICAgWzc4LCA4MSwgODAsIDQ1LCAzNCwgMTIsIDQwXVxuICAgIF07XG4gICAgJHNjb3BlLmRhdGE0ID0gW1xuICAgICAgICBbMzUsIDIzLCA1NiwgMjIsIDk3LCAyMywgNjRdXG4gICAgXTtcbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgcG9pbnRIaXREZXRlY3Rpb25SYWRpdXMgOiAwLFxuICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxuICAgICAgICBzY2FsZUxpbmVXaWR0aDogMC4wMDEsXG4gICAgICAgIHNjYWxlU2hvd0xhYmVscyA6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dHcmlkTGluZXMgOiBmYWxzZSxcbiAgICAgICAgcG9pbnREb3QgOiBmYWxzZSxcbiAgICAgICAgc2hvd1Rvb2x0aXBzOiBmYWxzZVxuICAgIH07XG4gICAgJHNjb3BlLmRlZmF1bHQgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHN0cm9rZUNvbG9yOiAnI2QxZDRkNycsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KSdcbiAgICB9XTtcbiAgICAkc2NvcGUucHJpbWFyeSA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGJyYW5kUHJpbWFyeSxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJ1xuICAgIH1dO1xuICAgICRzY29wZS5pbmZvID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiAndHJhbnNwYXJlbnQnLFxuICAgICAgICBzdHJva2VDb2xvcjogYnJhbmRJbmZvLFxuICAgICAgICBoaWdobGlnaHRGaWxsOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIGhpZ2hsaWdodFN0cm9rZTogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknXG4gICAgfV07XG4gICAgJHNjb3BlLmRhbmdlciA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGJyYW5kRGFuZ2VyLFxuICAgICAgICBoaWdobGlnaHRGaWxsOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIGhpZ2hsaWdodFN0cm9rZTogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknXG4gICAgfV07XG4gICAgJHNjb3BlLndhcm5pbmcgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHN0cm9rZUNvbG9yOiBicmFuZFdhcm5pbmcsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KSdcbiAgICB9XTtcbiAgICAkc2NvcGUuc3VjY2VzcyA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGJyYW5kU3VjY2VzcyxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJ1xuICAgIH1dO1xufVxuXG5ob3Jpem9udGFsQmFyc0N0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBob3Jpem9udGFsQmFyc0N0cmwoJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUuZGF0YSA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgZGF5OiAnTW9uZGF5JywgICAgbmV3OiAzNCwgcmVjdXJyaW5nOiA3OFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBkYXk6ICdUdWVzZGF5JywgICBuZXc6IDU2LCByZWN1cnJpbmc6IDk0XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRheTogJ1dlZG5lc2RheScsIG5ldzogMTIsIHJlY3VycmluZzogNjdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZGF5OiAnVGh1cnNkYXknLCAgbmV3OiA0MywgcmVjdXJyaW5nOiA5MVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBkYXk6ICdGcmlkYXknLCAgICBuZXc6IDIyLCByZWN1cnJpbmc6IDczXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRheTogJ1NhdHVyZGF5JywgIG5ldzogNTMsIHJlY3VycmluZzogODJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZGF5OiAnU3VuZGF5JywgICAgbmV3OiA5LCAgcmVjdXJyaW5nOiA2OVxuICAgICAgICB9XG4gICAgXTtcbn1cblxuaG9yaXpvbnRhbEJhcnNUeXBlMkN0cmwuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBob3Jpem9udGFsQmFyc1R5cGUyQ3RybCgkc2NvcGUpIHtcblxuICAgICRzY29wZS5nZW5kZXIgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnTWFsZScsXG4gICAgICAgICAgICBpY29uOiAnaWNvbi11c2VyJyxcbiAgICAgICAgICAgIHZhbHVlOiA0M1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ0ZlbWFsZScsXG4gICAgICAgICAgICBpY29uOiAnaWNvbi11c2VyLWZlbWFsZScsXG4gICAgICAgICAgICB2YWx1ZTogMzdcbiAgICAgICAgfSxcbiAgICBdO1xuXG4gICAgJHNjb3BlLnNvdXJjZSA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdPcmdhbmljIFNlYXJjaCcsXG4gICAgICAgICAgICBpY29uOiAnaWNvbi1nbG9iZScsXG4gICAgICAgICAgICB2YWx1ZTogMTkxMjM1LFxuICAgICAgICAgICAgcGVyY2VudDogNTZcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdGYWNlYm9vaycsXG4gICAgICAgICAgICBpY29uOiAnaWNvbi1zb2NpYWwtZmFjZWJvb2snLFxuICAgICAgICAgICAgdmFsdWU6IDUxMjIzLFxuICAgICAgICAgICAgcGVyY2VudDogMTVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdUd2l0dGVyJyxcbiAgICAgICAgICAgIGljb246ICdpY29uLXNvY2lhbC10d2l0dGVyJyxcbiAgICAgICAgICAgIHZhbHVlOiAzNzU2NCxcbiAgICAgICAgICAgIHBlcmNlbnQ6IDExXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnTGlua2VkSW4nLFxuICAgICAgICAgICAgaWNvbjogJ2ljb24tc29jaWFsLWxpbmtlZGluJyxcbiAgICAgICAgICAgIHZhbHVlOiAyNzMxOSxcbiAgICAgICAgICAgIHBlcmNlbnQ6IDhcbiAgICAgICAgfVxuICAgIF07XG59XG5cbnVzZXJzVGFibGVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckdGltZW91dCddO1xuZnVuY3Rpb24gdXNlcnNUYWJsZUN0cmwoJHNjb3BlLCAkdGltZW91dCkge1xuXG4gICAgJHNjb3BlLnVzZXJzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBhdmF0YXI6ICcxLmpwZycsXG4gICAgICAgICAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgICAgICAgICAgbmFtZTogJ1lpb3Jnb3MgQXZyYWFtdScsXG4gICAgICAgICAgICBuZXc6IHRydWUsXG4gICAgICAgICAgICByZWdpc3RlcmVkOiAnSmFuIDEsIDIwMTUnLFxuICAgICAgICAgICAgY291bnRyeTogJ1VTQScsXG4gICAgICAgICAgICBmbGFnOiAnVVNBLnBuZycsXG4gICAgICAgICAgICB1c2FnZTogJzUwJyxcbiAgICAgICAgICAgIHBlcmlvZDogJ0p1biAxMSwgMjAxNSAtIEp1bCAxMCwgMjAxNScsXG4gICAgICAgICAgICBwYXltZW50OiAnbWFzdGVyY2FyZCcsXG4gICAgICAgICAgICBhY3Rpdml0eTogJzEwIHNlYyBhZ28nLFxuICAgICAgICAgICAgc2F0aXNmYWN0aW9uOiAnNDgnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGF2YXRhcjogJzIuanBnJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2J1c3knLFxuICAgICAgICAgICAgbmFtZTogJ0F2cmFtIFRhcmFzaW9zJyxcbiAgICAgICAgICAgIG5ldzogZmFsc2UsXG4gICAgICAgICAgICByZWdpc3RlcmVkOiAnSmFuIDEsIDIwMTUnLFxuICAgICAgICAgICAgY291bnRyeTogJ0JyYXppbCcsXG4gICAgICAgICAgICBmbGFnOiAnQnJhemlsLnBuZycsXG4gICAgICAgICAgICB1c2FnZTogJzEwJyxcbiAgICAgICAgICAgIHBlcmlvZDogJ0p1biAxMSwgMjAxNSAtIEp1bCAxMCwgMjAxNScsXG4gICAgICAgICAgICBwYXltZW50OiAndmlzYScsXG4gICAgICAgICAgICBhY3Rpdml0eTogJzUgbWludXRlcyBhZ28nLFxuICAgICAgICAgICAgc2F0aXNmYWN0aW9uOiAnNjEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGF2YXRhcjogJzMuanBnJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2F3YXknLFxuICAgICAgICAgICAgbmFtZTogJ1F1aW50aW4gRWQnLFxuICAgICAgICAgICAgbmV3OiB0cnVlLFxuICAgICAgICAgICAgcmVnaXN0ZXJlZDogJ0phbiAxLCAyMDE1JyxcbiAgICAgICAgICAgIGNvdW50cnk6ICdJbmRpYScsXG4gICAgICAgICAgICBmbGFnOiAnSW5kaWEucG5nJyxcbiAgICAgICAgICAgIHVzYWdlOiAnNzQnLFxuICAgICAgICAgICAgcGVyaW9kOiAnSnVuIDExLCAyMDE1IC0gSnVsIDEwLCAyMDE1JyxcbiAgICAgICAgICAgIHBheW1lbnQ6ICdzdHJpcGUnLFxuICAgICAgICAgICAgYWN0aXZpdHk6ICcxIGhvdXIgYWdvJyxcbiAgICAgICAgICAgIHNhdGlzZmFjdGlvbjogJzMzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBhdmF0YXI6ICc0LmpwZycsXG4gICAgICAgICAgICBzdGF0dXM6ICdvZmZsaW5lJyxcbiAgICAgICAgICAgIG5hbWU6ICdFbsOpYXMgS3dhZHdvJyxcbiAgICAgICAgICAgIG5ldzogdHJ1ZSxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWQ6ICdKYW4gMSwgMjAxNScsXG4gICAgICAgICAgICBjb3VudHJ5OiAnRnJhbmNlJyxcbiAgICAgICAgICAgIGZsYWc6ICdGcmFuY2UucG5nJyxcbiAgICAgICAgICAgIHVzYWdlOiAnOTgnLFxuICAgICAgICAgICAgcGVyaW9kOiAnSnVuIDExLCAyMDE1IC0gSnVsIDEwLCAyMDE1JyxcbiAgICAgICAgICAgIHBheW1lbnQ6ICdwYXlwYWwnLFxuICAgICAgICAgICAgYWN0aXZpdHk6ICdMYXN0IG1vbnRoJyxcbiAgICAgICAgICAgIHNhdGlzZmFjdGlvbjogJzIzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBhdmF0YXI6ICc1LmpwZycsXG4gICAgICAgICAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgICAgICAgICAgbmFtZTogJ0FnYXBldHVzIFRhZGXDocWhJyxcbiAgICAgICAgICAgIG5ldzogdHJ1ZSxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWQ6ICdKYW4gMSwgMjAxNScsXG4gICAgICAgICAgICBjb3VudHJ5OiAnU3BhaW4nLFxuICAgICAgICAgICAgZmxhZzogJ1NwYWluLnBuZycsXG4gICAgICAgICAgICB1c2FnZTogJzIyJyxcbiAgICAgICAgICAgIHBlcmlvZDogJ0p1biAxMSwgMjAxNSAtIEp1bCAxMCwgMjAxNScsXG4gICAgICAgICAgICBwYXltZW50OiAnZ29vZ2xlJyxcbiAgICAgICAgICAgIGFjdGl2aXR5OiAnTGFzdCB3ZWVrJyxcbiAgICAgICAgICAgIHNhdGlzZmFjdGlvbjogJzc4J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBhdmF0YXI6ICc2LmpwZycsXG4gICAgICAgICAgICBzdGF0dXM6ICdidXN5JyxcbiAgICAgICAgICAgIG5hbWU6ICdGcmlkZXJpayBEw6F2aWQnLFxuICAgICAgICAgICAgbmV3OiB0cnVlLFxuICAgICAgICAgICAgcmVnaXN0ZXJlZDogJ0phbiAxLCAyMDE1JyxcbiAgICAgICAgICAgIGNvdW50cnk6ICdQb2xhbmQnLFxuICAgICAgICAgICAgZmxhZzogJ1BvbGFuZC5wbmcnLFxuICAgICAgICAgICAgdXNhZ2U6ICc0MycsXG4gICAgICAgICAgICBwZXJpb2Q6ICdKdW4gMTEsIDIwMTUgLSBKdWwgMTAsIDIwMTUnLFxuICAgICAgICAgICAgcGF5bWVudDogJ2FtZXgnLFxuICAgICAgICAgICAgYWN0aXZpdHk6ICdZZXN0ZXJkYXknLFxuICAgICAgICAgICAgc2F0aXNmYWN0aW9uOiAnMTEnXG4gICAgICAgIH1cbiAgICBdO1xuXG5cbiAgICBmdW5jdGlvbiByYW5kb20obWluLG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihtYXgtbWluKzEpK21pbik7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdhdWdlID0ge1xuICAgICAgICBhbmltYXRpb25UaW1lOiAxMCxcbiAgICAgICAgdmFsdWU6IHJhbmRvbSgwLDEwMCksXG4gICAgICAgIG1heFZhbHVlOiAxMDAsXG4gICAgICAgIGdhdWdlVHlwZTogJ2RvbnV0JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgbGluZXM6IDEyLFxuICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XG4gICAgICAgICAgICBhbmdsZTogMC41LFxuICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMC4wOCxcbiAgICAgICAgICAgIC8vIFRoZSBsaW5lIHRoaWNrbmVzc1xuICAgICAgICAgICAgcG9pbnRlcjoge1xuICAgICAgICAgICAgICAgIGxlbmd0aDogMC4wOSxcbiAgICAgICAgICAgICAgICAvLyBUaGUgcmFkaXVzIG9mIHRoZSBpbm5lciBjaXJjbGVcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMC4wMDM1LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByb3RhdGlvbiBvZmZzZXRcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnIC8vIEZpbGwgY29sb3JcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW1pdE1heDogJ2ZhbHNlJyxcbiAgICAgICAgICAgIC8vIElmIHRydWUsIHRoZSBwb2ludGVyIHdpbGwgbm90IGdvIHBhc3QgdGhlIGVuZCBvZiB0aGUgZ2F1Z2VcbiAgICAgICAgICAgIGNvbG9yU3RhcnQ6IGJyYW5kSW5mbyxcbiAgICAgICAgICAgIC8vIENvbG9yc1xuICAgICAgICAgICAgY29sb3JTdG9wOiBicmFuZEluZm8sXG4gICAgICAgICAgICAvLyBqdXN0IGV4cGVyaW1lbnQgd2l0aCB0aGVtXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogJyNkMWQ0ZDcnLFxuICAgICAgICAgICAgLy8gdG8gc2VlIHdoaWNoIG9uZXMgd29yayBiZXN0IGZvciB5b3VcbiAgICAgICAgICAgIGdlbmVyYXRlR3JhZGllbnQ6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5jbGllbnRzVGFibGVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckdGltZW91dCddO1xuZnVuY3Rpb24gY2xpZW50c1RhYmxlQ3RybCgkc2NvcGUsICR0aW1lb3V0KSB7XG5cbiAgICAkc2NvcGUudXNlcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGF2YXRhcjogJzEuanBnJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgICAgICBuYW1lOiAnWWlvcmdvcyBBdnJhYW11JyxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWQ6ICdKYW4gMSwgMjAxNScsXG4gICAgICAgICAgICBhY3Rpdml0eTogJzEwIHNlYyBhZ28nLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zOiAxODksXG4gICAgICAgICAgICBjb21tZW50czogNzJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYXZhdGFyOiAnMi5qcGcnLFxuICAgICAgICAgICAgc3RhdHVzOiAnYnVzeScsXG4gICAgICAgICAgICBuYW1lOiAnQXZyYW0gVGFyYXNpb3MnLFxuICAgICAgICAgICAgcmVnaXN0ZXJlZDogJ0phbiAxLCAyMDE1JyxcbiAgICAgICAgICAgIGFjdGl2aXR5OiAnNSBtaW51dGVzIGFnbycsXG4gICAgICAgICAgICB0cmFuc2FjdGlvbnM6IDE1NixcbiAgICAgICAgICAgIGNvbW1lbnRzOiA3NlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBhdmF0YXI6ICczLmpwZycsXG4gICAgICAgICAgICBzdGF0dXM6ICdhd2F5JyxcbiAgICAgICAgICAgIG5hbWU6ICdRdWludGluIEVkJyxcbiAgICAgICAgICAgIHJlZ2lzdGVyZWQ6ICdKYW4gMSwgMjAxNScsXG4gICAgICAgICAgICBhY3Rpdml0eTogJzEgaG91ciBhZ28nLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zOiAxODksXG4gICAgICAgICAgICBjb21tZW50czogNzJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgYXZhdGFyOiAnNC5qcGcnLFxuICAgICAgICAgICAgc3RhdHVzOiAnb2ZmbGluZScsXG4gICAgICAgICAgICBuYW1lOiAnRW7DqWFzIEt3YWR3bycsXG4gICAgICAgICAgICByZWdpc3RlcmVkOiAnSmFuIDEsIDIwMTUnLFxuICAgICAgICAgICAgYWN0aXZpdHk6ICdMYXN0IG1vbnRoJyxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczogMTg5LFxuICAgICAgICAgICAgY29tbWVudHM6IDcyXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGF2YXRhcjogJzUuanBnJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2FjdGl2ZScsXG4gICAgICAgICAgICBuYW1lOiAnQWdhcGV0dXMgVGFkZcOhxaEnLFxuICAgICAgICAgICAgcmVnaXN0ZXJlZDogJ0phbiAxLCAyMDE1JyxcbiAgICAgICAgICAgIGFjdGl2aXR5OiAnTGFzdCB3ZWVrJyxcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uczogMTg5LFxuICAgICAgICAgICAgY29tbWVudHM6IDcyXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGF2YXRhcjogJzYuanBnJyxcbiAgICAgICAgICAgIHN0YXR1czogJ2J1c3knLFxuICAgICAgICAgICAgbmFtZTogJ0ZyaWRlcmlrIETDoXZpZCcsXG4gICAgICAgICAgICByZWdpc3RlcmVkOiAnSmFuIDEsIDIwMTUnLFxuICAgICAgICAgICAgYWN0aXZpdHk6ICdZZXN0ZXJkYXknLFxuICAgICAgICAgICAgdHJhbnNhY3Rpb25zOiAxODksXG4gICAgICAgICAgICBjb21tZW50czogNzJcbiAgICAgICAgfVxuICAgIF07XG59XG5cblxuZ2F1Z2VDdHJsLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gZ2F1Z2VDdHJsKCRzY29wZSkge1xuICAgIGZ1bmN0aW9uIHJhbmRvbShtaW4sbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKG1heC1taW4rMSkrbWluKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ2F1Z2UxID0ge1xuICAgICAgICBhbmltYXRpb25UaW1lOiAxMCxcbiAgICAgICAgdmFsdWU6IHJhbmRvbSgwLDMwMDApLFxuICAgICAgICBtYXhWYWx1ZTogMzAwMCxcbiAgICAgICAgZ2F1Z2VUeXBlOiAnZG9udXQnLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBsaW5lczogMTIsXG4gICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgICAgICAgICAgIGFuZ2xlOiAwLjUsXG4gICAgICAgICAgICAvLyBUaGUgbGVuZ3RoIG9mIGVhY2ggbGluZVxuICAgICAgICAgICAgbGluZVdpZHRoOiAwLjA1LFxuICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgICAgICAgICBwb2ludGVyOiB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwLjA5LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAwMzUsXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJvdGF0aW9uIG9mZnNldFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcgLy8gRmlsbCBjb2xvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbWl0TWF4OiAnZmFsc2UnLFxuICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIHBvaW50ZXIgd2lsbCBub3QgZ28gcGFzdCB0aGUgZW5kIG9mIHRoZSBnYXVnZVxuICAgICAgICAgICAgY29sb3JTdGFydDogYnJhbmRJbmZvLFxuICAgICAgICAgICAgLy8gQ29sb3JzXG4gICAgICAgICAgICBjb2xvclN0b3A6IGJyYW5kSW5mbyxcbiAgICAgICAgICAgIC8vIGp1c3QgZXhwZXJpbWVudCB3aXRoIHRoZW1cbiAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnI2QxZDRkNycsXG4gICAgICAgICAgICAvLyB0byBzZWUgd2hpY2ggb25lcyB3b3JrIGJlc3QgZm9yIHlvdVxuICAgICAgICAgICAgZ2VuZXJhdGVHcmFkaWVudDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2F1Z2UyID0ge1xuICAgICAgICBhbmltYXRpb25UaW1lOiAxMCxcbiAgICAgICAgdmFsdWU6IHJhbmRvbSgwLDMwMDApLFxuICAgICAgICBtYXhWYWx1ZTogMzAwMCxcbiAgICAgICAgZ2F1Z2VUeXBlOiAnZG9udXQnLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBsaW5lczogMTIsXG4gICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgICAgICAgICAgIGFuZ2xlOiAwLjUsXG4gICAgICAgICAgICAvLyBUaGUgbGVuZ3RoIG9mIGVhY2ggbGluZVxuICAgICAgICAgICAgbGluZVdpZHRoOiAwLjA1LFxuICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgICAgICAgICBwb2ludGVyOiB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwLjA5LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAwMzUsXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJvdGF0aW9uIG9mZnNldFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcgLy8gRmlsbCBjb2xvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbWl0TWF4OiAnZmFsc2UnLFxuICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIHBvaW50ZXIgd2lsbCBub3QgZ28gcGFzdCB0aGUgZW5kIG9mIHRoZSBnYXVnZVxuICAgICAgICAgICAgY29sb3JTdGFydDogYnJhbmRTdWNjZXNzLFxuICAgICAgICAgICAgLy8gQ29sb3JzXG4gICAgICAgICAgICBjb2xvclN0b3A6IGJyYW5kU3VjY2VzcyxcbiAgICAgICAgICAgIC8vIGp1c3QgZXhwZXJpbWVudCB3aXRoIHRoZW1cbiAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnI2QxZDRkNycsXG4gICAgICAgICAgICAvLyB0byBzZWUgd2hpY2ggb25lcyB3b3JrIGJlc3QgZm9yIHlvdVxuICAgICAgICAgICAgZ2VuZXJhdGVHcmFkaWVudDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2F1Z2UzID0ge1xuICAgICAgICBhbmltYXRpb25UaW1lOiAxMCxcbiAgICAgICAgdmFsdWU6IHJhbmRvbSgwLDMwMDApLFxuICAgICAgICBtYXhWYWx1ZTogMzAwMCxcbiAgICAgICAgZ2F1Z2VUeXBlOiAnZG9udXQnLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBsaW5lczogMTIsXG4gICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgICAgICAgICAgIGFuZ2xlOiAwLjUsXG4gICAgICAgICAgICAvLyBUaGUgbGVuZ3RoIG9mIGVhY2ggbGluZVxuICAgICAgICAgICAgbGluZVdpZHRoOiAwLjA1LFxuICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgICAgICAgICBwb2ludGVyOiB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwLjA5LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAwMzUsXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJvdGF0aW9uIG9mZnNldFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcgLy8gRmlsbCBjb2xvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbWl0TWF4OiAnZmFsc2UnLFxuICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIHBvaW50ZXIgd2lsbCBub3QgZ28gcGFzdCB0aGUgZW5kIG9mIHRoZSBnYXVnZVxuICAgICAgICAgICAgY29sb3JTdGFydDogYnJhbmRXYXJuaW5nLFxuICAgICAgICAgICAgLy8gQ29sb3JzXG4gICAgICAgICAgICBjb2xvclN0b3A6IGJyYW5kV2FybmluZyxcbiAgICAgICAgICAgIC8vIGp1c3QgZXhwZXJpbWVudCB3aXRoIHRoZW1cbiAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnI2QxZDRkNycsXG4gICAgICAgICAgICAvLyB0byBzZWUgd2hpY2ggb25lcyB3b3JrIGJlc3QgZm9yIHlvdVxuICAgICAgICAgICAgZ2VuZXJhdGVHcmFkaWVudDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2F1Z2U0ID0ge1xuICAgICAgICBhbmltYXRpb25UaW1lOiAxMCxcbiAgICAgICAgdmFsdWU6IHJhbmRvbSgwLDMwMDApLFxuICAgICAgICBtYXhWYWx1ZTogMzAwMCxcbiAgICAgICAgZ2F1Z2VUeXBlOiAnZG9udXQnLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBsaW5lczogMTIsXG4gICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgICAgICAgICAgIGFuZ2xlOiAwLjUsXG4gICAgICAgICAgICAvLyBUaGUgbGVuZ3RoIG9mIGVhY2ggbGluZVxuICAgICAgICAgICAgbGluZVdpZHRoOiAwLjA1LFxuICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgICAgICAgICBwb2ludGVyOiB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwLjA5LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAwMzUsXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJvdGF0aW9uIG9mZnNldFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcgLy8gRmlsbCBjb2xvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbWl0TWF4OiAnZmFsc2UnLFxuICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIHBvaW50ZXIgd2lsbCBub3QgZ28gcGFzdCB0aGUgZW5kIG9mIHRoZSBnYXVnZVxuICAgICAgICAgICAgY29sb3JTdGFydDogYnJhbmREYW5nZXIsXG4gICAgICAgICAgICAvLyBDb2xvcnNcbiAgICAgICAgICAgIGNvbG9yU3RvcDogYnJhbmREYW5nZXIsXG4gICAgICAgICAgICAvLyBqdXN0IGV4cGVyaW1lbnQgd2l0aCB0aGVtXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogJyNkMWQ0ZDcnLFxuICAgICAgICAgICAgLy8gdG8gc2VlIHdoaWNoIG9uZXMgd29yayBiZXN0IGZvciB5b3VcbiAgICAgICAgICAgIGdlbmVyYXRlR3JhZGllbnQ6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5mdW5jdGlvbiByYW5kb20obWluLG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKG1heC1taW4rMSkrbWluKTtcbn1cblxuYmFyQ2hhcnRDdHJsLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gYmFyQ2hhcnRDdHJsKCRzY29wZSkge1xuXG4gICAgdmFyIGVsZW1lbnRzID0gMTY7XG4gICAgdmFyIGxhYmVscyA9IFtdO1xuICAgIHZhciBkYXRhID0gW107XG4gICAgdmFyIGRhdGExID0gW107XG4gICAgdmFyIGRhdGEyID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBlbGVtZW50czsgaSsrKSB7XG4gICAgICAgIGxhYmVscy5wdXNoKCcxJyk7XG4gICAgICAgIGRhdGEucHVzaChyYW5kb20oNDAsMTAwKSk7XG4gICAgICAgIGRhdGExLnB1c2gocmFuZG9tKDIwLDEwMCkpO1xuICAgICAgICBkYXRhMi5wdXNoKHJhbmRvbSg2MCwxMDApKTtcbiAgICB9XG5cbiAgICAkc2NvcGUubGFiZWxzID0gbGFiZWxzO1xuXG4gICAgJHNjb3BlLmRhdGEgPSBbZGF0YV07XG4gICAgJHNjb3BlLmRhdGExID0gW2RhdGExXTtcbiAgICAkc2NvcGUuZGF0YTIgPSBbZGF0YTJdO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMgPSB7XG4gICAgICAgIHNob3dTY2FsZTogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDAsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIGJhclN0cm9rZVdpZHRoIDogMCxcbiAgICAgICAgYmFyQmFja2dyb3VuZDogJ3JnYmEoMjIxLCAyMjQsIDIyOSwgMSknLFxuXG4gICAgICAgIC8vIHBvaW50RG90IDpmYWxzZSxcbiAgICAgICAgLy8gc2NhbGVMaW5lQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgfTtcblxuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yIDogYnJhbmRJbmZvLFxuXHRcdHN0cm9rZUNvbG9yIDogJ3JnYmEoMCwwLDAsMSknLFxuXHRcdGhpZ2hsaWdodEZpbGw6ICcjODE4YTkxJyxcbiAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogJyMwMDAnXG4gICAgfV07XG59XG5cbmdhdWdlSlNEZW1vQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHRpbWVvdXQnXTtcbmZ1bmN0aW9uIGdhdWdlSlNEZW1vQ3RybCgkc2NvcGUsICR0aW1lb3V0KSB7XG5cbiAgICBmdW5jdGlvbiByYW5kb20obWluLG1heCkge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKihtYXgtbWluKzEpK21pbik7XG4gICAgfVxuXG4gICAgJHNjb3BlLmdhdWdlMSA9IHtcbiAgICAgICAgYW5pbWF0aW9uVGltZTogMTAsXG4gICAgICAgIHZhbHVlOiByYW5kb20oMCwzMDAwKSxcbiAgICAgICAgbWF4VmFsdWU6IDMwMDAsXG4gICAgICAgIGdhdWdlVHlwZTogJ2RvbnV0JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgbGluZXM6IDEyLFxuICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XG4gICAgICAgICAgICBhbmdsZTogMC41LFxuICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMC4xLFxuICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgICAgICAgICBwb2ludGVyOiB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwLjA5LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAwMzUsXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJvdGF0aW9uIG9mZnNldFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcgLy8gRmlsbCBjb2xvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbWl0TWF4OiAnZmFsc2UnLFxuICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIHBvaW50ZXIgd2lsbCBub3QgZ28gcGFzdCB0aGUgZW5kIG9mIHRoZSBnYXVnZVxuICAgICAgICAgICAgY29sb3JTdGFydDogYnJhbmRJbmZvLFxuICAgICAgICAgICAgLy8gQ29sb3JzXG4gICAgICAgICAgICBjb2xvclN0b3A6IGJyYW5kSW5mbyxcbiAgICAgICAgICAgIC8vIGp1c3QgZXhwZXJpbWVudCB3aXRoIHRoZW1cbiAgICAgICAgICAgIHN0cm9rZUNvbG9yOiAnI0UwRTBFMCcsXG4gICAgICAgICAgICAvLyB0byBzZWUgd2hpY2ggb25lcyB3b3JrIGJlc3QgZm9yIHlvdVxuICAgICAgICAgICAgZ2VuZXJhdGVHcmFkaWVudDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2F1Z2UyID0ge1xuICAgICAgICBhbmltYXRpb25UaW1lOiAxMCxcbiAgICAgICAgdmFsdWU6IHJhbmRvbSgwLDMwMDApLFxuICAgICAgICBtYXhWYWx1ZTogMzAwMCxcbiAgICAgICAgZ2F1Z2VUeXBlOiAnZG9udXQnLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBsaW5lczogMTIsXG4gICAgICAgICAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzIHRvIGRyYXdcbiAgICAgICAgICAgIGFuZ2xlOiAwLjUsXG4gICAgICAgICAgICAvLyBUaGUgbGVuZ3RoIG9mIGVhY2ggbGluZVxuICAgICAgICAgICAgbGluZVdpZHRoOiAwLjEsXG4gICAgICAgICAgICAvLyBUaGUgbGluZSB0aGlja25lc3NcbiAgICAgICAgICAgIHBvaW50ZXI6IHtcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDAuMDksXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJhZGl1cyBvZiB0aGUgaW5uZXIgY2lyY2xlXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDAuMDAzNSxcbiAgICAgICAgICAgICAgICAvLyBUaGUgcm90YXRpb24gb2Zmc2V0XG4gICAgICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJyAvLyBGaWxsIGNvbG9yXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGltaXRNYXg6ICdmYWxzZScsXG4gICAgICAgICAgICAvLyBJZiB0cnVlLCB0aGUgcG9pbnRlciB3aWxsIG5vdCBnbyBwYXN0IHRoZSBlbmQgb2YgdGhlIGdhdWdlXG4gICAgICAgICAgICBjb2xvclN0YXJ0OiBicmFuZFN1Y2Nlc3MsXG4gICAgICAgICAgICAvLyBDb2xvcnNcbiAgICAgICAgICAgIGNvbG9yU3RvcDogYnJhbmRTdWNjZXNzLFxuICAgICAgICAgICAgLy8ganVzdCBleHBlcmltZW50IHdpdGggdGhlbVxuICAgICAgICAgICAgc3Ryb2tlQ29sb3I6ICcjRTBFMEUwJyxcbiAgICAgICAgICAgIC8vIHRvIHNlZSB3aGljaCBvbmVzIHdvcmsgYmVzdCBmb3IgeW91XG4gICAgICAgICAgICBnZW5lcmF0ZUdyYWRpZW50OiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nYXVnZTMgPSB7XG4gICAgICAgIGFuaW1hdGlvblRpbWU6IDEwLFxuICAgICAgICB2YWx1ZTogcmFuZG9tKDAsMzAwMCksXG4gICAgICAgIG1heFZhbHVlOiAzMDAwLFxuICAgICAgICBnYXVnZVR5cGU6ICdkb251dCcsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGxpbmVzOiAxMixcbiAgICAgICAgICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgdG8gZHJhd1xuICAgICAgICAgICAgYW5nbGU6IDAuNSxcbiAgICAgICAgICAgIC8vIFRoZSBsZW5ndGggb2YgZWFjaCBsaW5lXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDAuMSxcbiAgICAgICAgICAgIC8vIFRoZSBsaW5lIHRoaWNrbmVzc1xuICAgICAgICAgICAgcG9pbnRlcjoge1xuICAgICAgICAgICAgICAgIGxlbmd0aDogMC4wOSxcbiAgICAgICAgICAgICAgICAvLyBUaGUgcmFkaXVzIG9mIHRoZSBpbm5lciBjaXJjbGVcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMC4wMDM1LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByb3RhdGlvbiBvZmZzZXRcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnIC8vIEZpbGwgY29sb3JcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW1pdE1heDogJ2ZhbHNlJyxcbiAgICAgICAgICAgIC8vIElmIHRydWUsIHRoZSBwb2ludGVyIHdpbGwgbm90IGdvIHBhc3QgdGhlIGVuZCBvZiB0aGUgZ2F1Z2VcbiAgICAgICAgICAgIGNvbG9yU3RhcnQ6IGJyYW5kV2FybmluZyxcbiAgICAgICAgICAgIC8vIENvbG9yc1xuICAgICAgICAgICAgY29sb3JTdG9wOiBicmFuZFdhcm5pbmcsXG4gICAgICAgICAgICAvLyBqdXN0IGV4cGVyaW1lbnQgd2l0aCB0aGVtXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogJyNFMEUwRTAnLFxuICAgICAgICAgICAgLy8gdG8gc2VlIHdoaWNoIG9uZXMgd29yayBiZXN0IGZvciB5b3VcbiAgICAgICAgICAgIGdlbmVyYXRlR3JhZGllbnQ6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdhdWdlNCA9IHtcbiAgICAgICAgYW5pbWF0aW9uVGltZTogMTAsXG4gICAgICAgIHZhbHVlOiByYW5kb20oMCwzMDAwKSxcbiAgICAgICAgbWF4VmFsdWU6IDMwMDAsXG4gICAgICAgIGdhdWdlVHlwZTogJ2RvbnV0JyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgbGluZXM6IDEyLFxuICAgICAgICAgICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyB0byBkcmF3XG4gICAgICAgICAgICBhbmdsZTogMC41LFxuICAgICAgICAgICAgLy8gVGhlIGxlbmd0aCBvZiBlYWNoIGxpbmVcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMC4xLFxuICAgICAgICAgICAgLy8gVGhlIGxpbmUgdGhpY2tuZXNzXG4gICAgICAgICAgICBwb2ludGVyOiB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwLjA5LFxuICAgICAgICAgICAgICAgIC8vIFRoZSByYWRpdXMgb2YgdGhlIGlubmVyIGNpcmNsZVxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAwMzUsXG4gICAgICAgICAgICAgICAgLy8gVGhlIHJvdGF0aW9uIG9mZnNldFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCcgLy8gRmlsbCBjb2xvclxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbWl0TWF4OiAnZmFsc2UnLFxuICAgICAgICAgICAgLy8gSWYgdHJ1ZSwgdGhlIHBvaW50ZXIgd2lsbCBub3QgZ28gcGFzdCB0aGUgZW5kIG9mIHRoZSBnYXVnZVxuICAgICAgICAgICAgY29sb3JTdGFydDogYnJhbmREYW5nZXIsXG4gICAgICAgICAgICAvLyBDb2xvcnNcbiAgICAgICAgICAgIGNvbG9yU3RvcDogYnJhbmREYW5nZXIsXG4gICAgICAgICAgICAvLyBqdXN0IGV4cGVyaW1lbnQgd2l0aCB0aGVtXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogJyNFMEUwRTAnLFxuICAgICAgICAgICAgLy8gdG8gc2VlIHdoaWNoIG9uZXMgd29yayBiZXN0IGZvciB5b3VcbiAgICAgICAgICAgIGdlbmVyYXRlR3JhZGllbnQ6IHRydWUsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5jYXJkQ2hhcnRDdHJsMS4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmwxKCRzY29wZSkge1xuXG4gICAgJHNjb3BlLmxhYmVscyA9IFsnSmFudWFyeScsJ0ZlYnJ1YXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5J107XG4gICAgJHNjb3BlLmRhdGEgPSBbXG4gICAgICAgIFs2NSwgNTksIDg0LCA4NCwgNTEsIDU1LCA0MF1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICAgIHNjYWxlU2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDUsXG4gICAgICAgIHNjYWxlTGluZUNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgIHNjYWxlRm9udENvbG9yOiAncmdiYSgwLDAsMCwwKSdcbiAgICB9O1xuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiBicmFuZFByaW1hcnksXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuNTUpJyxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgdG9vbHRpcENvcm5lclJhZGl1czogMCxcbiAgICB9XTtcbn1cblxuY2FyZENoYXJ0Q3RybDIuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBjYXJkQ2hhcnRDdHJsMigkc2NvcGUpIHtcblxuICAgICRzY29wZS5sYWJlbHMgPSBbJ0phbnVhcnknLCdGZWJydWFyeScsJ01hcmNoJywnQXByaWwnLCdNYXknLCdKdW5lJywnSnVseSddO1xuICAgICRzY29wZS5kYXRhID0gW1xuICAgICAgICBbMSwgMTgsIDksIDE3LCAzNCwgMjIsIDExXVxuICAgIF07XG4gICAgJHNjb3BlLmRhdGEzID0gW1xuICAgICAgICBbNzgsIDgxLCA4MCwgNDUsIDM0LCAxMiwgNDBdXG4gICAgXTtcbiAgICAkc2NvcGUuZGF0YTQgPSBbXG4gICAgICAgIFszNSwgMjMsIDU2LCAyMiwgOTcsIDIzLCA2NF1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICAgIHNjYWxlU2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDUsXG4gICAgICAgIHNjYWxlTGluZUNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgIHNjYWxlRm9udENvbG9yOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgIGJlemllckN1cnZlIDogZmFsc2UsXG4gICAgfTtcbiAgICAkc2NvcGUuY29sb3VycyA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogYnJhbmRJbmZvLFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmNhcmRDaGFydEN0cmwzLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gY2FyZENoYXJ0Q3RybDMoJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUubGFiZWxzID0gWydKYW51YXJ5JywnRmVicnVhcnknLCdNYXJjaCcsJ0FwcmlsJywnTWF5JywnSnVuZScsJ0p1bHknXTtcbiAgICAkc2NvcGUuZGF0YSA9IFtcbiAgICAgICAgWzc4LCA4MSwgODAsIDQ1LCAzNCwgMTIsIDQwXVxuICAgIF07XG4gICAgJHNjb3BlLmRhdGE0ID0gW1xuICAgICAgICBbMzUsIDIzLCA1NiwgMjIsIDk3LCAyMywgNjRdXG4gICAgXTtcbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgc2hvd1NjYWxlOiBmYWxzZSxcbiAgICAgICAgc2NhbGVTaG93R3JpZExpbmVzOiBmYWxzZSxcbiAgICAgICAgcG9pbnREb3Q6IGZhbHNlLFxuICAgICAgICBwb2ludERvdFN0cm9rZVdpZHRoIDogMCxcbiAgICAgICAgcG9pbnREb3RSYWRpdXMgOiAwLFxuICAgICAgICBzY2FsZUdyaWRMaW5lV2lkdGggOiAwLFxuICAgICAgICAvL3BvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMCxcbiAgICB9O1xuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuMiknLFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmZ1bmN0aW9uIHJhbmRvbShtaW4sbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoobWF4LW1pbisxKSttaW4pO1xufVxuXG5jYXJkQ2hhcnRDdHJsNC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmw0KCRzY29wZSkge1xuXG4gICAgdmFyIGVsZW1lbnRzID0gMTY7XG4gICAgdmFyIGxhYmVscyA9IFtdO1xuICAgIHZhciBkYXRhID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBlbGVtZW50czsgaSsrKSB7XG4gICAgICAgIGxhYmVscy5wdXNoKCcxJyk7XG4gICAgICAgIGRhdGEucHVzaChyYW5kb20oNDAsMTAwKSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmxhYmVscyA9IGxhYmVscztcblxuICAgICRzY29wZS5kYXRhID0gW2RhdGFdO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMgPSB7XG4gICAgICAgIHNob3dTY2FsZTogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDAsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIGJhclNob3dTdHJva2UgOiBmYWxzZSxcbiAgICAgICAgYmFyU3Ryb2tlV2lkdGggOiAwLFxuICAgICAgICBzY2FsZUdyaWRMaW5lV2lkdGggOiAwLFxuICAgICAgICBiYXJWYWx1ZVNwYWNpbmcgOiAzLFxuICAgIH07XG4gICAgJHNjb3BlLmNvbG91cnMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LC4zKScsXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuNTUpJyxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIGhpZ2hsaWdodFN0cm9rZTogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG4iLCIvL25vdGlmaWNhdGlvbnMuanNcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5mYWN0b3J5KCdyYW5kb21RdW90ZXMnLCByYW5kb21RdW90ZXMpXG4gICAgLy90b2FzdHIgY29udHJvbGxlclxuICAgIC5jb250cm9sbGVyKCd0b2FzdHJEZW1vQ3RybCcsIHRvYXN0ckRlbW9DdHJsKTtcblxuZnVuY3Rpb24gcmFuZG9tUXVvdGVzKCkge1xuICAgIHZhciBxdW90ZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnQ29tZSB0byBGcmVlbm9kZScsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2Ugcm9jayBhdCA8ZW0+I2FuZ3VsYXJqczwvZW0+JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBhbGxvd0h0bWw6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdMb29raW5nIGZvciBib290c3RyYXA/JyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUcnkgdWktYm9vdHN0cmFwIG91dCEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnV2FudHMgYSBiZXR0ZXIgcm91dGVyPycsXG4gICAgICAgICAgICBtZXNzYWdlOiAnV2UgaGF2ZSB5b3UgY292ZXJlZCB3aXRoIHVpLXJvdXRlcidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgdGl0bGU6ICdBbmd1bGFyIDInLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0lzIGdvbm5hIHJvY2sgdGhlIHdvcmxkJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaXRsZXMgYXJlIG5vdCBhbHdheXMgbmVlZGVkJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUb2FzdHIgcm9jayEnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiAnV2hhdCBhYm91dCBuaWNlIGh0bWw/JyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICc8c3Ryb25nPlN1cmUgeW91IDxlbT5jYW4hPC9lbT48L3N0cm9uZz4nLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGFsbG93SHRtbDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogJ0lvbmljIGlzIDxlbT5jb29sPC9lbT4nLFxuICAgICAgICAgICAgbWVzc2FnZTogJ0Jlc3QgbW9iaWxlIGZyYW1ld29yayBldmVyJyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBhbGxvd0h0bWw6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICB2YXIgdHlwZXMgPSBbJ3N1Y2Nlc3MnLCAnZXJyb3InLCAnaW5mbycsICd3YXJuaW5nJ107XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBxdW90ZXM6IHF1b3RlcyxcbiAgICAgICAgdHlwZXM6IHR5cGVzXG4gICAgfTtcbn1cbnRvYXN0ckRlbW9DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckdGVtcGxhdGVDYWNoZScsICckdGVtcGxhdGVSZXF1ZXN0JywgJ3JhbmRvbVF1b3RlcycsICd0b2FzdHInLCAndG9hc3RyQ29uZmlnJ107XG5mdW5jdGlvbiB0b2FzdHJEZW1vQ3RybCgkc2NvcGUsICR0ZW1wbGF0ZUNhY2hlLCAkdGVtcGxhdGVSZXF1ZXN0LCByYW5kb21RdW90ZXMsIHRvYXN0ciwgdG9hc3RyQ29uZmlnKSB7XG4gICAgdmFyIG9wZW5lZFRvYXN0cyA9IFtdO1xuXG4gICAgJHNjb3BlLnRvYXN0ID0ge1xuICAgICAgICB0aXRsZTogJycsXG4gICAgICAgIG1lc3NhZ2U6ICcnXG4gICAgfTtcblxuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBhdXRvRGlzbWlzczogZmFsc2UsXG4gICAgICAgIHBvc2l0aW9uOiAndG9hc3QtdG9wLXJpZ2h0JyxcbiAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgICB0aW1lb3V0OiAnNTAwMCcsXG4gICAgICAgIGV4dGVuZGVkVGltZW91dDogJzEwMDAnLFxuICAgICAgICBodG1sOiBmYWxzZSxcbiAgICAgICAgY2xvc2VCdXR0b246IGZhbHNlLFxuICAgICAgICB0YXBUb0Rpc21pc3M6IHRydWUsXG4gICAgICAgIHByb2dyZXNzQmFyOiBmYWxzZSxcbiAgICAgICAgY2xvc2VIdG1sOiAnPGJ1dHRvbj4mdGltZXM7PC9idXR0b24+JyxcbiAgICAgICAgbmV3ZXN0T25Ub3A6IHRydWUsXG4gICAgICAgIG1heE9wZW5lZDogMCxcbiAgICAgICAgcHJldmVudER1cGxpY2F0ZXM6IGZhbHNlLFxuICAgICAgICBwcmV2ZW50T3BlbkR1cGxpY2F0ZXM6IGZhbHNlXG4gICAgfTtcblxuICAgICRzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKCdvcHRpb25zJywgZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAgICAgdG9hc3RyQ29uZmlnLmF1dG9EaXNtaXNzID0gbmV3VmFsdWUuYXV0b0Rpc21pc3M7XG4gICAgICAgIHRvYXN0ckNvbmZpZy5hbGxvd0h0bWwgPSBuZXdWYWx1ZS5odG1sO1xuICAgICAgICB0b2FzdHJDb25maWcuZXh0ZW5kZWRUaW1lT3V0ID0gcGFyc2VJbnQobmV3VmFsdWUuZXh0ZW5kZWRUaW1lb3V0LCAxMCk7XG4gICAgICAgIHRvYXN0ckNvbmZpZy5wb3NpdGlvbkNsYXNzID0gbmV3VmFsdWUucG9zaXRpb247XG4gICAgICAgIHRvYXN0ckNvbmZpZy50aW1lT3V0ID0gcGFyc2VJbnQobmV3VmFsdWUudGltZW91dCwgMTApO1xuICAgICAgICB0b2FzdHJDb25maWcuY2xvc2VCdXR0b24gPSBuZXdWYWx1ZS5jbG9zZUJ1dHRvbjtcbiAgICAgICAgdG9hc3RyQ29uZmlnLnRhcFRvRGlzbWlzcyA9IG5ld1ZhbHVlLnRhcFRvRGlzbWlzcztcbiAgICAgICAgdG9hc3RyQ29uZmlnLnByb2dyZXNzQmFyID0gbmV3VmFsdWUucHJvZ3Jlc3NCYXI7XG4gICAgICAgIHRvYXN0ckNvbmZpZy5jbG9zZUh0bWwgPSBuZXdWYWx1ZS5jbG9zZUh0bWw7XG4gICAgICAgIHRvYXN0ckNvbmZpZy5uZXdlc3RPblRvcCA9IG5ld1ZhbHVlLm5ld2VzdE9uVG9wO1xuICAgICAgICB0b2FzdHJDb25maWcubWF4T3BlbmVkID0gbmV3VmFsdWUubWF4T3BlbmVkO1xuICAgICAgICB0b2FzdHJDb25maWcucHJldmVudER1cGxpY2F0ZXMgPSBuZXdWYWx1ZS5wcmV2ZW50RHVwbGljYXRlcztcbiAgICAgICAgdG9hc3RyQ29uZmlnLnByZXZlbnRPcGVuRHVwbGljYXRlcyA9IG5ld1ZhbHVlLnByZXZlbnRPcGVuRHVwbGljYXRlcztcbiAgICAgICAgaWYgKG5ld1ZhbHVlLmN1c3RvbVRlbXBsYXRlKSB7XG4gICAgICAgICAgICB0b2FzdHJDb25maWcudGVtcGxhdGVzLnRvYXN0ID0gJ2N1c3RvbSc7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICRzY29wZS4kd2F0Y2goJ3RvYXN0LmN1c3RvbVRlbXBsYXRlJywgZnVuY3Rpb24obmV3VmFsKSB7XG4gICAgICAgIGlmICgkdGVtcGxhdGVDYWNoZS5nZXQoJ2N1c3RvbScpKSB7XG4gICAgICAgICAgICAkdGVtcGxhdGVDYWNoZS5yZW1vdmUoJ2N1c3RvbScpO1xuICAgICAgICB9XG4gICAgICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnY3VzdG9tJywgbmV3VmFsKTtcbiAgICB9KTtcblxuICAgICRzY29wZS5jbGVhckxhc3RUb2FzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdG9hc3QgPSBvcGVuZWRUb2FzdHMucG9wKCk7XG4gICAgICAgIHRvYXN0ci5jbGVhcih0b2FzdCk7XG4gICAgfTtcblxuICAgICRzY29wZS5jbGVhclRvYXN0cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0b2FzdHIuY2xlYXIoKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLm9wZW5QaW5rVG9hc3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgb3BlbmVkVG9hc3RzLnB1c2godG9hc3RyLmluZm8oJ0kgYW0gdG90YWxseSBjdXN0b20hJywgJ0hhcHB5IHRvYXN0Jywge1xuICAgICAgICAgICAgaWNvbkNsYXNzOiAndG9hc3QtcGluaydcbiAgICAgICAgfSkpO1xuICAgIH07XG5cbiAgICAkc2NvcGUub3BlblJhbmRvbVRvYXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0eXBlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgICAgIHZhciBxdW90ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDcpO1xuICAgICAgICB2YXIgdG9hc3RUeXBlID0gcmFuZG9tUXVvdGVzLnR5cGVzW3R5cGVdO1xuICAgICAgICB2YXIgdG9hc3RRdW90ZSA9IHJhbmRvbVF1b3Rlcy5xdW90ZXNbcXVvdGVdO1xuICAgICAgICBvcGVuZWRUb2FzdHMucHVzaCh0b2FzdHJbdG9hc3RUeXBlXSh0b2FzdFF1b3RlLm1lc3NhZ2UsIHRvYXN0UXVvdGUudGl0bGUsIHRvYXN0UXVvdGUub3B0aW9ucykpO1xuICAgIH07XG5cbiAgICAkc2NvcGUub3BlblRvYXN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIG9wZW5lZFRvYXN0cy5wdXNoKHRvYXN0clskc2NvcGUub3B0aW9ucy50eXBlXSgkc2NvcGUudG9hc3QubWVzc2FnZSwgJHNjb3BlLnRvYXN0LnRpdGxlKSk7XG4gICAgfTtcbn1cbiIsIi8vc2hhcmVkLmpzXG4ndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignY2hhcnRzQ3RybCcsIGNoYXJ0c0N0cmwpO1xuXG5mdW5jdGlvbiByYW5kb20obWluLG1heCkge1xuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKG1heC1taW4rMSkrbWluKTtcbn1cblxuY2hhcnRzQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNoYXJ0c0N0cmwoJHNjb3BlKSB7XG5cbiAgICB2YXIgZWxlbWVudHMgPSAxNjtcbiAgICB2YXIgbGFiZWxzID0gW107XG4gICAgdmFyIGRhdGEgPSBbXTtcbiAgICB2YXIgZGF0YTEgPSBbXTtcbiAgICB2YXIgZGF0YTIgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGVsZW1lbnRzOyBpKyspIHtcbiAgICAgICAgbGFiZWxzLnB1c2goJzEnKTtcbiAgICAgICAgZGF0YS5wdXNoKHJhbmRvbSg0MCwxMDApKTtcbiAgICAgICAgZGF0YTEucHVzaChyYW5kb20oMjAsMTAwKSk7XG4gICAgICAgIGRhdGEyLnB1c2gocmFuZG9tKDYwLDEwMCkpO1xuICAgIH1cblxuICAgICRzY29wZS5sYWJlbHMgPSBsYWJlbHM7XG5cbiAgICAkc2NvcGUuZGF0YSA9IFtkYXRhXTtcbiAgICAkc2NvcGUuZGF0YTEgPSBbZGF0YTFdO1xuICAgICRzY29wZS5kYXRhMiA9IFtkYXRhMl07XG5cbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgcG9pbnRIaXREZXRlY3Rpb25SYWRpdXMgOiAwLFxuXHRcdHNob3dTY2FsZTogZmFsc2UsXG5cdFx0c2NhbGVMaW5lV2lkdGg6IDAuMDAxLFxuXHRcdHNjYWxlU2hvd0xhYmVscyA6IGZhbHNlLFxuXHRcdHNjYWxlU2hvd0dyaWRMaW5lcyA6IGZhbHNlLFxuXHRcdHBvaW50RG90IDogZmFsc2UsXG5cdFx0c2hvd1Rvb2x0aXBzOiBmYWxzZSxcblx0XHRyZXNwb25zaXZlOiB0cnVlLFxuICAgIH07XG5cbiAgICAkc2NvcGUuY29sb3VycyA9IFt7XG4gICAgICAgIGZpbGxDb2xvciA6IFwicmdiYSgwLDAsMCwwKVwiLFxuXHRcdHN0cm9rZUNvbG9yIDogYnJhbmRJbmZvLFxuXHRcdGhpZ2hsaWdodEZpbGw6ICcjODE4YTkxJyxcbiAgICAgICAgcG9pbnRTdHJva2VDb2xvcjogJyNmZmYnXG4gICAgfV07XG5cbiAgICAkc2NvcGUuY29sb3VyczIgPSBbe1xuICAgICAgICBmaWxsQ29sb3IgOiBcInJnYmEoMCwwLDAsMClcIixcblx0XHRzdHJva2VDb2xvciA6IGJyYW5kV2FybmluZyxcblx0XHRoaWdobGlnaHRGaWxsOiAnIzgxOGE5MScsXG4gICAgICAgIHBvaW50U3Ryb2tlQ29sb3I6ICcjZmZmJ1xuICAgIH1dO1xuXG4gICAgJHNjb3BlLmNvbG91cnMzID0gW3tcbiAgICAgICAgZmlsbENvbG9yIDogXCJyZ2JhKDAsMCwwLDApXCIsXG5cdFx0c3Ryb2tlQ29sb3IgOiBicmFuZFN1Y2Nlc3MsXG5cdFx0aGlnaGxpZ2h0RmlsbDogJyM4MThhOTEnLFxuICAgICAgICBwb2ludFN0cm9rZUNvbG9yOiAnI2ZmZidcbiAgICB9XTtcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vc2xpZGVycy5qc1xuYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ3NsaWRlcnNEZW1vQ3RybCcsIHNsaWRlcnNEZW1vQ3RybCk7XG5cbnNsaWRlcnNEZW1vQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIHNsaWRlcnNEZW1vQ3RybCgkc2NvcGUpIHtcbiAgICAkc2NvcGUucmFuZ2UxID0ge307XG4gICAgJHNjb3BlLnJhbmdlMiA9IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgbWluOiAxMDAsXG4gICAgICAgICAgICBtYXg6IDEwMDAsXG4gICAgICAgICAgICBmcm9tOiA1NTBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2UzID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIGdyaWQ6IHRydWUsXG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDEwMDAsXG4gICAgICAgICAgICBmcm9tOiAyMDAsXG4gICAgICAgICAgICB0bzogODAwLFxuICAgICAgICAgICAgcHJlZml4OiAnJCdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2U0ID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIGdyaWQ6IHRydWUsXG4gICAgICAgICAgICBtaW46IC0xMDAwLFxuICAgICAgICAgICAgbWF4OiAxMDAwLFxuICAgICAgICAgICAgZnJvbTogLTUwMCxcbiAgICAgICAgICAgIHRvOiA1MDBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2U1ID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIGdyaWQ6IHRydWUsXG4gICAgICAgICAgICBtaW46IC0xMDAwLFxuICAgICAgICAgICAgbWF4OiAxMDAwLFxuICAgICAgICAgICAgZnJvbTogLTUwMCxcbiAgICAgICAgICAgIHRvOiA1MDAsXG4gICAgICAgICAgICBzdGVwOiAyNTBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2U2ID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIGdyaWQ6IHRydWUsXG4gICAgICAgICAgICBtaW46IC0xMi44LFxuICAgICAgICAgICAgbWF4OiAxMi44LFxuICAgICAgICAgICAgZnJvbTogLTMuMixcbiAgICAgICAgICAgIHRvOiAzLjIsXG4gICAgICAgICAgICBzdGVwOiAwLjFcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2U3ID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIGdyaWQ6IHRydWUsXG4gICAgICAgICAgICBmcm9tOiAxLFxuICAgICAgICAgICAgdG86IDUsXG4gICAgICAgICAgICB2YWx1ZXM6IFswLCAxMCwgMTAwLCAxMDAwLCAxMDAwMCwgMTAwMDAwLCAxMDAwMDAwXVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZTggPSB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGdyaWQ6IHRydWUsXG4gICAgICAgICAgICBmcm9tOiA1LFxuICAgICAgICAgICAgdmFsdWVzOiBbXG4gICAgICAgICAgICAgICAgJ3plcm8nLCAnb25lJyxcbiAgICAgICAgICAgICAgICAndHdvJywgJ3RocmVlJyxcbiAgICAgICAgICAgICAgICAnZm91cicsICdmaXZlJyxcbiAgICAgICAgICAgICAgICAnc2l4JywgJ3NldmVuJyxcbiAgICAgICAgICAgICAgICAnZWlnaHQnLCAnbmluZScsXG4gICAgICAgICAgICAgICAgJ3RlbidcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2U5ID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBncmlkOiB0cnVlLFxuICAgICAgICAgICAgZnJvbTogMyxcbiAgICAgICAgICAgIHZhbHVlczogW1xuICAgICAgICAgICAgICAgICdKYW51YXJ5JywgJ0ZlYnJ1YXJ5JywgJ01hcmNoJyxcbiAgICAgICAgICAgICAgICAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLFxuICAgICAgICAgICAgICAgICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLFxuICAgICAgICAgICAgICAgICdPY3RvYmVyJywgJ05vdmVtYmVyJywgJ0RlY2VtYmVyJ1xuICAgICAgICAgICAgXVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZTEwID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBncmlkOiB0cnVlLFxuICAgICAgICAgICAgbWluOiAxMDAwLFxuICAgICAgICAgICAgbWF4OiAxMDAwMDAwLFxuICAgICAgICAgICAgZnJvbTogMTAwMDAwLFxuICAgICAgICAgICAgc3RlcDogMTAwMCxcbiAgICAgICAgICAgIHByZXR0aWZ5X2VuYWJsZWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnJhbmdlMTEgPSB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGdyaWQ6IHRydWUsXG4gICAgICAgICAgICBtaW46IDEwMDAsXG4gICAgICAgICAgICBtYXg6IDEwMDAwMDAsXG4gICAgICAgICAgICBmcm9tOiAyMDAwMDAsXG4gICAgICAgICAgICBzdGVwOiAxMDAwLFxuICAgICAgICAgICAgcHJldHRpZnlfZW5hYmxlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZTEyID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBncmlkOiB0cnVlLFxuICAgICAgICAgICAgbWluOiAxMDAwLFxuICAgICAgICAgICAgbWF4OiAxMDAwMDAwLFxuICAgICAgICAgICAgZnJvbTogMzAwMDAwLFxuICAgICAgICAgICAgc3RlcDogMTAwMCxcbiAgICAgICAgICAgIHByZXR0aWZ5X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBwcmV0dGlmeV9zZXBhcmF0b3I6ICcuJ1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZTEzID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBncmlkOiB0cnVlLFxuICAgICAgICAgICAgbWluOiAxMDAwLFxuICAgICAgICAgICAgbWF4OiAxMDAwMDAwLFxuICAgICAgICAgICAgZnJvbTogNDAwMDAwLFxuICAgICAgICAgICAgc3RlcDogMTAwMCxcbiAgICAgICAgICAgIHByZXR0aWZ5X2VuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBwcmV0dGlmeTogZnVuY3Rpb24gKG51bSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIG51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2UxNCA9IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogJ2RvdWJsZScsXG4gICAgICAgICAgICBncmlkOiB0cnVlLFxuICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgbWF4OiAxMDAwMCxcbiAgICAgICAgICAgIGZyb206IDEwMDAsXG4gICAgICAgICAgICBzdGVwOiA5MDAwLFxuICAgICAgICAgICAgcHJlZml4OiAnJCdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2UxNSA9IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogJ3NpbmdsZScsXG4gICAgICAgICAgICBncmlkOiB0cnVlLFxuICAgICAgICAgICAgbWluOiAtOTAsXG4gICAgICAgICAgICBtYXg6IDkwLFxuICAgICAgICAgICAgZnJvbTogMCxcbiAgICAgICAgICAgIHBvc3RmaXg6ICfCsCdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2UxNiA9IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgZ3JpZDogdHJ1ZSxcbiAgICAgICAgICAgIG1pbjogMTgsXG4gICAgICAgICAgICBtYXg6IDcwLFxuICAgICAgICAgICAgZnJvbTogMzAsXG4gICAgICAgICAgICBwcmVmaXg6ICdBZ2UgJyxcbiAgICAgICAgICAgIG1heF9wb3N0Zml4OiAnKydcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2UxNyA9IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogJ2RvdWJsZScsXG4gICAgICAgICAgICBtaW46IDEwMCxcbiAgICAgICAgICAgIG1heDogMjAwLFxuICAgICAgICAgICAgZnJvbTogMTQ1LFxuICAgICAgICAgICAgdG86IDE1NSxcbiAgICAgICAgICAgIHByZWZpeDogJ1dlaWdodDogJyxcbiAgICAgICAgICAgIHBvc3RmaXg6ICcgbWlsbGlvbiBwb3VuZHMnLFxuICAgICAgICAgICAgZGVjb3JhdGVfYm90aDogdHJ1ZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZTE4ID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIG1pbjogMTAwLFxuICAgICAgICAgICAgbWF4OiAyMDAsXG4gICAgICAgICAgICBmcm9tOiAxNDUsXG4gICAgICAgICAgICB0bzogMTU1LFxuICAgICAgICAgICAgcHJlZml4OiAnV2VpZ2h0OiAnLFxuICAgICAgICAgICAgcG9zdGZpeDogJyBtaWxsaW9uIHBvdW5kcycsXG4gICAgICAgICAgICBkZWNvcmF0ZV9ib3RoOiBmYWxzZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZTE5ID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIG1pbjogMTAwLFxuICAgICAgICAgICAgbWF4OiAyMDAsXG4gICAgICAgICAgICBmcm9tOiAxNDgsXG4gICAgICAgICAgICB0bzogMTUyLFxuICAgICAgICAgICAgcHJlZml4OiAnV2VpZ2h0OiAnLFxuICAgICAgICAgICAgcG9zdGZpeDogJyBtaWxsaW9uIHBvdW5kcycsXG4gICAgICAgICAgICB2YWx1ZXNfc2VwYXJhdG9yOiAnIOKGkiAnXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnJhbmdlMjAgPSB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdkb3VibGUnLFxuICAgICAgICAgICAgbWluOiAxMDAsXG4gICAgICAgICAgICBtYXg6IDIwMCxcbiAgICAgICAgICAgIGZyb206IDE0OCxcbiAgICAgICAgICAgIHRvOiAxNTIsXG4gICAgICAgICAgICBwcmVmaXg6ICdSYW5nZTogJyxcbiAgICAgICAgICAgIHBvc3RmaXg6ICcgbGlnaHQgeWVhcnMnLFxuICAgICAgICAgICAgZGVjb3JhdGVfYm90aDogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZXNfc2VwYXJhdG9yOiAnIHRvICdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUucmFuZ2UyMSA9IHtcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgdHlwZTogJ2RvdWJsZScsXG4gICAgICAgICAgICBtaW46IDEwMDAsXG4gICAgICAgICAgICBtYXg6IDIwMDAsXG4gICAgICAgICAgICBmcm9tOiAxMjAwLFxuICAgICAgICAgICAgdG86IDE4MDAsXG4gICAgICAgICAgICBoaWRlX21pbl9tYXg6IHRydWUsXG4gICAgICAgICAgICBoaWRlX2Zyb21fdG86IHRydWUsXG4gICAgICAgICAgICBncmlkOiBmYWxzZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5yYW5nZTIyID0ge1xuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICB0eXBlOiAnZG91YmxlJyxcbiAgICAgICAgICAgIG1pbjogMTAwMCxcbiAgICAgICAgICAgIG1heDogMjAwMCxcbiAgICAgICAgICAgIGZyb206IDEyMDAsXG4gICAgICAgICAgICB0bzogMTgwMCxcbiAgICAgICAgICAgIGhpZGVfbWluX21heDogdHJ1ZSxcbiAgICAgICAgICAgIGhpZGVfZnJvbV90bzogdHJ1ZSxcbiAgICAgICAgICAgIGdyaWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnJhbmdlMjMgPSB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdkb3VibGUnLFxuICAgICAgICAgICAgbWluOiAxMDAwLFxuICAgICAgICAgICAgbWF4OiAyMDAwLFxuICAgICAgICAgICAgZnJvbTogMTIwMCxcbiAgICAgICAgICAgIHRvOiAxODAwLFxuICAgICAgICAgICAgaGlkZV9taW5fbWF4OiBmYWxzZSxcbiAgICAgICAgICAgIGhpZGVfZnJvbV90bzogdHJ1ZSxcbiAgICAgICAgICAgIGdyaWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnJhbmdlMjQgPSB7XG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdkb3VibGUnLFxuICAgICAgICAgICAgbWluOiAxMDAwLFxuICAgICAgICAgICAgbWF4OiAyMDAwLFxuICAgICAgICAgICAgZnJvbTogMTIwMCxcbiAgICAgICAgICAgIHRvOiAxODAwLFxuICAgICAgICAgICAgaGlkZV9taW5fbWF4OiB0cnVlLFxuICAgICAgICAgICAgaGlkZV9mcm9tX3RvOiBmYWxzZSxcbiAgICAgICAgICAgIGdyaWQ6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9O1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLy90YWJsZXMuanNcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdCb290c3RyYXBJbnRlZ3JhdGlvbkN0cmwnLCBCb290c3RyYXBJbnRlZ3JhdGlvbkN0cmwpO1xuXG5Cb290c3RyYXBJbnRlZ3JhdGlvbkN0cmwuJGluamVjdCA9IFsnRFRPcHRpb25zQnVpbGRlcicsICdEVENvbHVtbkJ1aWxkZXInXTtcbmZ1bmN0aW9uIEJvb3RzdHJhcEludGVncmF0aW9uQ3RybChEVE9wdGlvbnNCdWlsZGVyLCBEVENvbHVtbkJ1aWxkZXIpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmR0T3B0aW9ucyA9IERUT3B0aW9uc0J1aWxkZXJcbiAgICAgICAgLmZyb21Tb3VyY2UoJ2RhdGEuanNvbicpXG4gICAgICAgIC8vIEFkZCBCb290c3RyYXAgY29tcGF0aWJpbGl0eVxuICAgICAgICAud2l0aEJvb3RzdHJhcCgpXG4gICAgICAgIC53aXRoQm9vdHN0cmFwT3B0aW9ucyh7XG4gICAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgICAgICB1bDogJ3BhZ2luYXRpb24gcGFnaW5hdGlvbi1kYXRhdGFibGVzJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgdm0uZHRDb2x1bW5zID0gW1xuICAgICAgICBEVENvbHVtbkJ1aWxkZXIubmV3Q29sdW1uKCdpZCcpLndpdGhUaXRsZSgnSUQnKS53aXRoQ2xhc3MoJ3RleHQtZGFuZ2VyJyksXG4gICAgICAgIERUQ29sdW1uQnVpbGRlci5uZXdDb2x1bW4oJ2ZpcnN0TmFtZScpLndpdGhUaXRsZSgnRmlyc3QgbmFtZScpLFxuICAgICAgICBEVENvbHVtbkJ1aWxkZXIubmV3Q29sdW1uKCdsYXN0TmFtZScpLndpdGhUaXRsZSgnTGFzdCBuYW1lJylcbiAgICBdO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLy93aWRnZXRzLmpzXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDEnLCBjYXJkQ2hhcnRDdHJsMSlcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDInLCBjYXJkQ2hhcnRDdHJsMilcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDMnLCBjYXJkQ2hhcnRDdHJsMylcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDQnLCBjYXJkQ2hhcnRDdHJsNClcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDUnLCBjYXJkQ2hhcnRDdHJsNSlcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDYnLCBjYXJkQ2hhcnRDdHJsNilcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDcnLCBjYXJkQ2hhcnRDdHJsNylcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDgnLCBjYXJkQ2hhcnRDdHJsOClcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDknLCBjYXJkQ2hhcnRDdHJsOSlcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDEwJywgY2FyZENoYXJ0Q3RybDEwKVxuICAgIC5jb250cm9sbGVyKCdjYXJkQ2hhcnRDdHJsMTEnLCBjYXJkQ2hhcnRDdHJsMTEpXG4gICAgLmNvbnRyb2xsZXIoJ2NhcmRDaGFydEN0cmwxMicsIGNhcmRDaGFydEN0cmwxMilcbiAgICAuY29udHJvbGxlcignY2FyZENoYXJ0Q3RybDEzJywgY2FyZENoYXJ0Q3RybDEzKVxuICAgIC5jb250cm9sbGVyKCdnYXVnZUN0cmwnLCBnYXVnZUN0cmwpO1xuXG4vL2NvbnZlcnQgSGV4IHRvIFJHQkFcbmZ1bmN0aW9uIGNvbnZlcnRIZXgoaGV4LG9wYWNpdHkpe1xuICAgIGhleCA9IGhleC5yZXBsYWNlKCcjJywnJyk7XG4gICAgciA9IHBhcnNlSW50KGhleC5zdWJzdHJpbmcoMCwyKSwgMTYpO1xuICAgIGcgPSBwYXJzZUludChoZXguc3Vic3RyaW5nKDIsNCksIDE2KTtcbiAgICBiID0gcGFyc2VJbnQoaGV4LnN1YnN0cmluZyg0LDYpLCAxNik7XG5cbiAgICByZXN1bHQgPSAncmdiYSgnK3IrJywnK2crJywnK2IrJywnK29wYWNpdHkvMTAwKycpJztcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG5jYXJkQ2hhcnRDdHJsMS4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmwxKCRzY29wZSkge1xuXG4gICAgJHNjb3BlLmxhYmVscyA9IFsnSmFudWFyeScsJ0ZlYnJ1YXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5J107XG4gICAgJHNjb3BlLmRhdGEgPSBbXG4gICAgICAgIFs2NSwgNTksIDg0LCA4NCwgNTEsIDU1LCA0MF1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICAgIHNjYWxlU2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDUsXG4gICAgICAgIHNjYWxlTGluZUNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgIHNjYWxlRm9udENvbG9yOiAncmdiYSgwLDAsMCwwKSdcbiAgICB9O1xuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiBicmFuZFByaW1hcnksXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuNTUpJyxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgdG9vbHRpcENvcm5lclJhZGl1czogMCxcbiAgICB9XTtcbn1cblxuY2FyZENoYXJ0Q3RybDIuJGluamVjdCA9IFsnJHNjb3BlJ107XG5mdW5jdGlvbiBjYXJkQ2hhcnRDdHJsMigkc2NvcGUpIHtcblxuICAgICRzY29wZS5sYWJlbHMgPSBbJ0phbnVhcnknLCdGZWJydWFyeScsJ01hcmNoJywnQXByaWwnLCdNYXknLCdKdW5lJywnSnVseSddO1xuICAgICRzY29wZS5kYXRhID0gW1xuICAgICAgICBbMSwgMTgsIDksIDE3LCAzNCwgMjIsIDExXVxuICAgIF07XG4gICAgJHNjb3BlLmRhdGEzID0gW1xuICAgICAgICBbNzgsIDgxLCA4MCwgNDUsIDM0LCAxMiwgNDBdXG4gICAgXTtcbiAgICAkc2NvcGUuZGF0YTQgPSBbXG4gICAgICAgIFszNSwgMjMsIDU2LCAyMiwgOTcsIDIzLCA2NF1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICAgIHNjYWxlU2hvd0xhYmVsczogZmFsc2UsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDUsXG4gICAgICAgIHNjYWxlTGluZUNvbG9yOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgIHNjYWxlRm9udENvbG9yOiAncmdiYSgwLDAsMCwwKScsXG4gICAgICAgIGJlemllckN1cnZlIDogZmFsc2UsXG4gICAgfTtcbiAgICAkc2NvcGUuY29sb3VycyA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogYnJhbmRJbmZvLFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmNhcmRDaGFydEN0cmwzLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gY2FyZENoYXJ0Q3RybDMoJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUubGFiZWxzID0gWydKYW51YXJ5JywnRmVicnVhcnknLCdNYXJjaCcsJ0FwcmlsJywnTWF5JywnSnVuZScsJ0p1bHknXTtcbiAgICAkc2NvcGUuZGF0YSA9IFtcbiAgICAgICAgWzc4LCA4MSwgODAsIDQ1LCAzNCwgMTIsIDQwXVxuICAgIF07XG4gICAgJHNjb3BlLmRhdGE0ID0gW1xuICAgICAgICBbMzUsIDIzLCA1NiwgMjIsIDk3LCAyMywgNjRdXG4gICAgXTtcbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgc2hvd1NjYWxlOiBmYWxzZSxcbiAgICAgICAgc2NhbGVTaG93R3JpZExpbmVzOiBmYWxzZSxcbiAgICAgICAgcG9pbnREb3Q6IGZhbHNlLFxuICAgICAgICBwb2ludERvdFN0cm9rZVdpZHRoIDogMCxcbiAgICAgICAgcG9pbnREb3RSYWRpdXMgOiAwLFxuICAgICAgICBzY2FsZUdyaWRMaW5lV2lkdGggOiAwLFxuICAgICAgICAvL3BvaW50SGl0RGV0ZWN0aW9uUmFkaXVzIDogMCxcbiAgICB9O1xuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuMiknLFxuICAgICAgICBzdHJva2VDb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmZ1bmN0aW9uIHJhbmRvbShtaW4sbWF4KSB7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoobWF4LW1pbisxKSttaW4pO1xufVxuXG5jYXJkQ2hhcnRDdHJsNC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmw0KCRzY29wZSkge1xuXG4gICAgdmFyIGVsZW1lbnRzID0gMTY7XG4gICAgdmFyIGxhYmVscyA9IFtdO1xuICAgIHZhciBkYXRhID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBlbGVtZW50czsgaSsrKSB7XG4gICAgICAgIGxhYmVscy5wdXNoKCcxJyk7XG4gICAgICAgIGRhdGEucHVzaChyYW5kb20oNDAsMTAwKSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmxhYmVscyA9IGxhYmVscztcblxuICAgICRzY29wZS5kYXRhID0gW2RhdGFdO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMgPSB7XG4gICAgICAgIHNob3dTY2FsZTogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDAsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIGJhclNob3dTdHJva2UgOiBmYWxzZSxcbiAgICAgICAgYmFyU3Ryb2tlV2lkdGggOiAwLFxuICAgICAgICBzY2FsZUdyaWRMaW5lV2lkdGggOiAwLFxuICAgICAgICBiYXJWYWx1ZVNwYWNpbmcgOiAzLFxuICAgIH07XG4gICAgJHNjb3BlLmNvbG91cnMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LC4zKScsXG4gICAgICAgIHN0cm9rZUNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuNTUpJyxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIGhpZ2hsaWdodFN0cm9rZTogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmNhcmRDaGFydEN0cmw1LiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gY2FyZENoYXJ0Q3RybDUoJHNjb3BlKSB7XG5cbiAgICB2YXIgZWxlbWVudHMgPSAxNTtcbiAgICB2YXIgbGFiZWxzID0gW107XG4gICAgdmFyIGRhdGEgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGVsZW1lbnRzOyBpKyspIHtcbiAgICAgICAgbGFiZWxzLnB1c2goJzEnKTtcbiAgICAgICAgZGF0YS5wdXNoKHJhbmRvbSg0MCwxMDApKTtcbiAgICB9XG5cbiAgICAkc2NvcGUubGFiZWxzID0gbGFiZWxzO1xuXG4gICAgJHNjb3BlLmRhdGEgPSBbZGF0YV07XG5cbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgc2hvd1NjYWxlOiBmYWxzZSxcbiAgICAgICAgc2NhbGVGb250U2l6ZTogMCxcbiAgICAgICAgc2NhbGVTaG93R3JpZExpbmVzOiBmYWxzZSxcbiAgICAgICAgYmFyU2hvd1N0cm9rZSA6IGZhbHNlLFxuICAgICAgICBiYXJTdHJva2VXaWR0aCA6IDAsXG4gICAgICAgIHNjYWxlR3JpZExpbmVXaWR0aCA6IDAsXG4gICAgICAgIGJhclZhbHVlU3BhY2luZyA6IDEsXG4gICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSxcblxuICAgIH07XG4gICAgJHNjb3BlLmNvbG91cnMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6IGJyYW5kUHJpbWFyeSxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGJyYW5kUHJpbWFyeSxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIGhpZ2hsaWdodFN0cm9rZTogJ3JnYmEoMjU1LDI1NSwyNTUsLjU1KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmNhcmRDaGFydEN0cmw2LiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gY2FyZENoYXJ0Q3RybDYoJHNjb3BlKSB7XG5cbiAgICB2YXIgZWxlbWVudHMgPSAxNTtcbiAgICB2YXIgbGFiZWxzID0gW107XG4gICAgdmFyIGRhdGEgPSBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGVsZW1lbnRzOyBpKyspIHtcbiAgICAgICAgbGFiZWxzLnB1c2goJzEnKTtcbiAgICAgICAgZGF0YS5wdXNoKHJhbmRvbSg0MCwxMDApKTtcbiAgICB9XG5cbiAgICAkc2NvcGUubGFiZWxzID0gbGFiZWxzO1xuXG4gICAgJHNjb3BlLmRhdGEgPSBbZGF0YV07XG5cbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgc2hvd1NjYWxlOiBmYWxzZSxcbiAgICAgICAgc2NhbGVGb250U2l6ZTogMCxcbiAgICAgICAgc2NhbGVTaG93R3JpZExpbmVzOiBmYWxzZSxcbiAgICAgICAgYmFyU2hvd1N0cm9rZSA6IGZhbHNlLFxuICAgICAgICBiYXJTdHJva2VXaWR0aCA6IDAsXG4gICAgICAgIHNjYWxlR3JpZExpbmVXaWR0aCA6IDAsXG4gICAgICAgIGJhclZhbHVlU3BhY2luZyA6IDEsXG4gICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSxcblxuICAgIH07XG4gICAgJHNjb3BlLmNvbG91cnMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6IGJyYW5kRGFuZ2VyLFxuICAgICAgICBzdHJva2VDb2xvcjogYnJhbmREYW5nZXIsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDI1NSwyNTUsMjU1LC41NSknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDI1NSwyNTUsMjU1LC41NSknLFxuICAgICAgICB0b29sdGlwQ29ybmVyUmFkaXVzOiAwLFxuICAgIH1dO1xufVxuXG5jYXJkQ2hhcnRDdHJsNy4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmw3KCRzY29wZSkge1xuXG4gICAgdmFyIGVsZW1lbnRzID0gMTU7XG4gICAgdmFyIGxhYmVscyA9IFtdO1xuICAgIHZhciBkYXRhID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBlbGVtZW50czsgaSsrKSB7XG4gICAgICAgIGxhYmVscy5wdXNoKCcxJyk7XG4gICAgICAgIGRhdGEucHVzaChyYW5kb20oNDAsMTAwKSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmxhYmVscyA9IGxhYmVscztcblxuICAgICRzY29wZS5kYXRhID0gW2RhdGFdO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMgPSB7XG4gICAgICAgIHNob3dTY2FsZTogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDAsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIGJhclNob3dTdHJva2UgOiBmYWxzZSxcbiAgICAgICAgYmFyU3Ryb2tlV2lkdGggOiAwLFxuICAgICAgICBzY2FsZUdyaWRMaW5lV2lkdGggOiAwLFxuICAgICAgICBiYXJWYWx1ZVNwYWNpbmcgOiAxLFxuICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcbiAgICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2UsXG5cbiAgICB9O1xuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiBicmFuZFN1Y2Nlc3MsXG4gICAgICAgIHN0cm9rZUNvbG9yOiBicmFuZFN1Y2Nlc3MsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDI1NSwyNTUsMjU1LC41NSknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDI1NSwyNTUsMjU1LC41NSknLFxuICAgICAgICB0b29sdGlwQ29ybmVyUmFkaXVzOiAwLFxuICAgIH1dO1xufVxuXG5jYXJkQ2hhcnRDdHJsOC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmw4KCRzY29wZSkge1xuXG4gICAgJHNjb3BlLmxhYmVscyA9IFsnSmFudWFyeScsJ0ZlYnJ1YXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5J107XG4gICAgJHNjb3BlLmRhdGEgPSBbXG4gICAgICAgIFs2NSwgNTksIDg0LCA4NCwgNTEsIDU1LCA0MF1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dHcmlkTGluZXM6IGZhbHNlLFxuICAgICAgICBwb2ludERvdDogZmFsc2UsXG4gICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSxcbiAgICB9O1xuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgICAgIHN0cm9rZUNvbG9yOiBicmFuZEluZm8sXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmNhcmRDaGFydEN0cmw5LiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gY2FyZENoYXJ0Q3RybDkoJHNjb3BlKSB7XG5cbiAgICAkc2NvcGUubGFiZWxzID0gWydKYW51YXJ5JywnRmVicnVhcnknLCdNYXJjaCcsJ0FwcmlsJywnTWF5JywnSnVuZScsJ0p1bHknXTtcbiAgICAkc2NvcGUuZGF0YSA9IFtcbiAgICAgICAgWzY1LCA1OSwgODQsIDg0LCA1MSwgNTUsIDQwXVxuICAgIF07XG4gICAgJHNjb3BlLm9wdGlvbnMgPSB7XG4gICAgICAgIHNob3dTY2FsZTogZmFsc2UsXG4gICAgICAgIHNjYWxlU2hvd0dyaWRMaW5lczogZmFsc2UsXG4gICAgICAgIHBvaW50RG90OiBmYWxzZSxcbiAgICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXG4gICAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlLFxuICAgIH07XG4gICAgJHNjb3BlLmNvbG91cnMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDApJyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGJyYW5kU3VjY2VzcyxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgdG9vbHRpcENvcm5lclJhZGl1czogMCxcbiAgICB9XTtcbn1cblxuY2FyZENoYXJ0Q3RybDEwLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gY2FyZENoYXJ0Q3RybDEwKCRzY29wZSkge1xuXG4gICAgJHNjb3BlLmxhYmVscyA9IFsnSmFudWFyeScsJ0ZlYnJ1YXJ5JywnTWFyY2gnLCdBcHJpbCcsJ01heScsJ0p1bmUnLCdKdWx5J107XG4gICAgJHNjb3BlLmRhdGEgPSBbXG4gICAgICAgIFs2NSwgNTksIDg0LCA4NCwgNTEsIDU1LCA0MF1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dHcmlkTGluZXM6IGZhbHNlLFxuICAgICAgICBwb2ludERvdDogZmFsc2UsXG4gICAgICAgIHJlc3BvbnNpdmU6IGZhbHNlLFxuICAgICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSxcbiAgICB9O1xuICAgICRzY29wZS5jb2xvdXJzID0gW3tcbiAgICAgICAgZmlsbENvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwKScsXG4gICAgICAgIHN0cm9rZUNvbG9yOiBicmFuZFdhcm5pbmcsXG4gICAgICAgIGhpZ2hsaWdodEZpbGw6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICAgICAgaGlnaGxpZ2h0U3Ryb2tlOiAncmdiYSg0NywgMTMyLCA3MSwgMC44KScsXG4gICAgICAgIHRvb2x0aXBDb3JuZXJSYWRpdXM6IDAsXG4gICAgfV07XG59XG5cbmNhcmRDaGFydEN0cmwxMS4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmwxMSgkc2NvcGUpIHtcblxuICAgICRzY29wZS5sYWJlbHMgPSBbJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYycsJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heSddO1xuICAgICRzY29wZS5kYXRhID0gW1xuICAgICAgICBbNCwgMTgsIDksIDE3LCAzNCwgMjIsIDExLCAzLCAxNSwgMTIsIDE4LCA5LCA5LCAxNywgMzQsIDIyLCAxMV1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dHcmlkTGluZXM6IGZhbHNlLFxuICAgICAgICBwb2ludERvdDogZmFsc2UsXG4gICAgICAgIGRhdGFzZXRTdHJva2VXaWR0aCA6IDIsXG4gICAgfTtcbiAgICAkc2NvcGUuY29sb3VycyA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LC41NSknLFxuICAgIH1dO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMyID0ge1xuICAgICAgICBzaG93U2NhbGU6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dHcmlkTGluZXM6IGZhbHNlLFxuICAgICAgICBiYXJTaG93U3Ryb2tlIDogZmFsc2UsXG4gICAgICAgIHNjYWxlR3JpZExpbmVXaWR0aCA6IDAsXG4gICAgICAgIGJhclZhbHVlU3BhY2luZyA6IDUsXG4gICAgfTtcblxuICAgICRzY29wZS5jb2xvdXJzMiA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogJ3JnYmEoMCwwLDAsLjIpJyxcbiAgICB9XTtcblxuICAgICRzY29wZS5sYWJlbHMzID0gWydNJywnVCcsJ1cnLCdUJywnRicsJ1MnLCdTJ107XG4gICAgJHNjb3BlLmRhdGEzID0gW1xuICAgICAgICBbMTcsIDM0LCAyMiwgMTEsIDMsIDE1LCAxMl1cbiAgICBdO1xuXG4gICAgJHNjb3BlLm9wdGlvbnMzID0ge1xuICAgICAgICBzY2FsZUxpbmVXaWR0aDogMC4wMDAwMSxcbiAgICAgICAgcmVzcG9uc2l2ZTogZmFsc2UsXG4gICAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dHcmlkTGluZXM6IGZhbHNlLFxuICAgICAgICBzY2FsZVNob3dMYWJlbHM6IGZhbHNlLFxuICAgICAgICBiYXJTaG93U3Ryb2tlIDogZmFsc2UsXG4gICAgICAgIGJhclZhbHVlU3BhY2luZyA6IDQsXG4gICAgICAgIHNjYWxlRm9udFNpemU6IDEwLFxuICAgICAgICBzY2FsZUZvbnRDb2xvcjogZ3JheUxpZ2h0LFxuICAgIH07XG5cbiAgICAkc2NvcGUuY29sb3VyczMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6IGdyYXlMaWdodCxcbiAgICB9XTtcbn1cblxuY2FyZENoYXJ0Q3RybDEyLiRpbmplY3QgPSBbJyRzY29wZSddO1xuZnVuY3Rpb24gY2FyZENoYXJ0Q3RybDEyKCRzY29wZSkge1xuXG4gICAgJHNjb3BlLmxhYmVscyA9IFsnTW9uJywnVHVlJywnV2VkJywnVGh1JywnRnJpJywnU2F0JywnU3VuJ107XG4gICAgJHNjb3BlLmRhdGEgPSBbXG4gICAgICAgIFs3NSwgNTksIDk0LCAxMDQsIDE1MSwgMTU1LCAyNDBdXG4gICAgXTtcbiAgICAkc2NvcGUub3B0aW9ucyA9IHtcbiAgICAgICAgc2NhbGVMaW5lV2lkdGg6IDAuMDAwMDEsXG4gICAgICAgIHNob3dTY2FsZTogdHJ1ZSxcbiAgICAgICAgc2NhbGVTaG93TGFiZWxzOiBmYWxzZSxcbiAgICAgICAgc2NhbGVTaG93R3JpZExpbmVzOiBmYWxzZSxcbiAgICAgICAgZGF0YXNldFN0cm9rZVdpZHRoIDogMyxcbiAgICAgICAgcG9pbnREb3RTdHJva2VXaWR0aDogMyxcbiAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcbiAgICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2UsXG4gICAgfTtcbiAgICAkc2NvcGUuY29sb3VycyA9IFt7XG4gICAgICAgIGZpbGxDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgc3Ryb2tlQ29sb3I6IGdyYXlMaWdodGVyLFxuICAgICAgICBwb2ludENvbG9yOiAnI2ZmZicsXG4gICAgfV07XG59XG5cbmNhcmRDaGFydEN0cmwxMy4kaW5qZWN0ID0gWyckc2NvcGUnXTtcbmZ1bmN0aW9uIGNhcmRDaGFydEN0cmwxMygkc2NvcGUpIHtcblxuICAgICRzY29wZS5sYWJlbHMgPSBbJ0phbicsJ0ZlYicsJ01hcicsJ0FwcicsJ01heScsJ0p1bicsJ0p1bCcsJ0F1ZycsJ1NlcCcsJ09jdCcsJ05vdicsJ0RlYyddO1xuICAgICRzY29wZS5kYXRhID0gW1xuICAgICAgICBbMzEwMDAsIDM0MDAwLCAyNzAwMCwgMjQwMDAsIDI4MDAwLCA0MjUwMCwgNDIwMDAsIDMwMDAwLCAzNTUwMCwgMzU1MDAsIDQxNTAwLCA0MTYwMF1cbiAgICBdO1xuICAgICRzY29wZS5vcHRpb25zID0ge1xuICAgICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICAgIHNjYWxlR3JpZExpbmVDb2xvciA6ICdyZ2JhKDI1NSwyNTUsMjU1LC4yKScsXG4gICAgICAgIHNjYWxlU2hvd1ZlcnRpY2FsTGluZXM6IGZhbHNlLFxuICAgICAgICBzY2FsZUxpbmVDb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsLjApJyxcbiAgICAgICAgc2NhbGVPdmVycmlkZTogdHJ1ZSxcbiAgICAgICAgc2NhbGVTdGVwczogNSxcbiAgICAgICAgc2NhbGVTdGVwV2lkdGg6IDUwMDAsXG4gICAgICAgIHNjYWxlU3RhcnRWYWx1ZTogMjAwMDAsXG4gICAgICAgIHNjYWxlTGFiZWw6IFwiPCU9ICckJyArIHZhbHVlICU+XCIsXG4gICAgICAgIGJlemllckN1cnZlIDogZmFsc2UsXG4gICAgICAgIHNjYWxlRm9udENvbG9yOiAnI2ZmZicsXG4gICAgICAgIGRhdGFzZXRTdHJva2VXaWR0aCA6IDQsXG4gICAgICAgIHBvaW50RG90U3Ryb2tlV2lkdGg6IDQsXG4gICAgICAgIHJlc3BvbnNpdmU6IHRydWUsXG4gICAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlLFxuICAgIH07XG4gICAgJHNjb3BlLmNvbG91cnMgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgIHN0cm9rZUNvbG9yOiAnI2ZmZicsXG4gICAgICAgIHBvaW50Q29sb3I6IGJyYW5kUHJpbWFyeSxcbiAgICAgICAgaGlnaGxpZ2h0RmlsbDogJ3JnYmEoNDcsIDEzMiwgNzEsIDAuOCknLFxuICAgICAgICBoaWdobGlnaHRTdHJva2U6ICdyZ2JhKDQ3LCAxMzIsIDcxLCAwLjgpJyxcbiAgICB9XTtcblxuICAgICRzY29wZS5sYWJlbHMyID0gWydVUycsJ1BMJywnR0InLCdERScsJ05MJywnQ0EnLCdGSScsICdSVScsICdBVScsICdOL0EnXTtcbiAgICAkc2NvcGUuZGF0YTIgPSBbXG4gICAgICAgIFszNSwgMTQsIDEwLCA4LCA2LCA2LCA1LCA0LCAzLCA5XVxuICAgIF07XG5cbiAgICAkc2NvcGUub3B0aW9uczIgPSB7XG4gICAgICAgIHNjYWxlTGluZUNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwuMCknLFxuICAgICAgICByZXNwb25zaXZlOiB0cnVlLFxuICAgICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSxcbiAgICAgICAgc2NhbGVTaG93R3JpZExpbmVzOiBmYWxzZSxcbiAgICAgICAgc2NhbGVTaG93TGFiZWxzOiBmYWxzZSxcbiAgICAgICAgYmFyU2hvd1N0cm9rZSA6IGZhbHNlLFxuICAgICAgICBiYXJWYWx1ZVNwYWNpbmcgOiAxMCxcbiAgICAgICAgc2NhbGVGb250Q29sb3I6IGdyYXksXG4gICAgICAgIHNjYWxlSW50ZWdlcnNPbmx5OiB0cnVlLFxuICAgICAgICBzY2FsZUJlZ2luQXRaZXJvOiB0cnVlLFxuICAgIH07XG5cbiAgICAkc2NvcGUuY29sb3VyczIgPSBbe1xuICAgICAgICBmaWxsQ29sb3I6IGJyYW5kU3VjY2VzcyxcbiAgICB9XTtcbn1cblxuZ2F1Z2VDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckdGltZW91dCddO1xuZnVuY3Rpb24gZ2F1Z2VDdHJsKCRzY29wZSwgJHRpbWVvdXQpIHtcblxuICAgIGZ1bmN0aW9uIHJhbmRvbShtaW4sbWF4KSB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqKG1heC1taW4rMSkrbWluKTtcbiAgICB9XG5cbiAgICAkc2NvcGUuZ2F1Z2UxID0ge1xuICAgICAgICBhbmltYXRpb25TcGVlZDogMzIsXG4gICAgICAgIHZhbHVlOiByYW5kb20oMCwzMDAwKSxcbiAgICAgICAgbWF4VmFsdWU6IDMwMDAsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGxpbmVzOiAxMixcbiAgICAgICAgICAgIGFuZ2xlOiAwLjE1LFxuICAgICAgICAgICAgbGluZVdpZHRoOiAwLjQ0LFxuICAgICAgICAgICAgcG9pbnRlcjoge1xuICAgICAgICAgICAgICAgIGxlbmd0aDogMC44LFxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAzNSxcbiAgICAgICAgICAgICAgICBjb2xvcjogZ3JheURhcmtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW1pdE1heDogJ2ZhbHNlJyxcbiAgICAgICAgICAgIGNvbG9yU3RhcnQ6IGJyYW5kSW5mbyxcbiAgICAgICAgICAgIGNvbG9yU3RvcDogYnJhbmRJbmZvLFxuICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IGdyYXlMaWdodGVyLFxuICAgICAgICAgICAgZ2VuZXJhdGVHcmFkaWVudDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWUsXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLmdhdWdlMiA9IHtcbiAgICAgICAgYW5pbWF0aW9uU3BlZWQ6IDMyLFxuICAgICAgICB2YWx1ZTogcmFuZG9tKDAsMzAwMCksXG4gICAgICAgIG1heFZhbHVlOiAzMDAwLFxuICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICBsaW5lczogMTIsXG4gICAgICAgICAgICBhbmdsZTogMC4xNSxcbiAgICAgICAgICAgIGxpbmVXaWR0aDogMC40NCxcbiAgICAgICAgICAgIHBvaW50ZXI6IHtcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDAuOCxcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMC4wMzUsXG4gICAgICAgICAgICAgICAgY29sb3I6IGdyYXlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW1pdE1heDogJ2ZhbHNlJyxcbiAgICAgICAgICAgIGNvbG9yU3RhcnQ6IGJyYW5kU3VjY2VzcyxcbiAgICAgICAgICAgIGNvbG9yU3RvcDogYnJhbmRTdWNjZXNzLFxuICAgICAgICAgICAgc3Ryb2tlQ29sb3I6IGdyYXlMaWdodGVyLFxuICAgICAgICAgICAgZ2VuZXJhdGVHcmFkaWVudDogdHJ1ZSxcbiAgICAgICAgICAgIHJlc3BvbnNpdmU6IHRydWVcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkc2NvcGUuZ2F1Z2UzID0ge1xuICAgICAgICBhbmltYXRpb25TcGVlZDogMzIsXG4gICAgICAgIHZhbHVlOiByYW5kb20oMCwzMDAwKSxcbiAgICAgICAgbWF4VmFsdWU6IDMwMDAsXG4gICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgIGxpbmVzOiAxMixcbiAgICAgICAgICAgIGFuZ2xlOiAwLjE1LFxuICAgICAgICAgICAgbGluZVdpZHRoOiAwLjQ0LFxuICAgICAgICAgICAgcG9pbnRlcjoge1xuICAgICAgICAgICAgICAgIGxlbmd0aDogMC44LFxuICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAwLjAzNSxcbiAgICAgICAgICAgICAgICBjb2xvcjogZ3JheVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbWl0TWF4OiAnZmFsc2UnLFxuICAgICAgICAgICAgY29sb3JTdGFydDogYnJhbmRXYXJuaW5nLFxuICAgICAgICAgICAgY29sb3JTdG9wOiBicmFuZFdhcm5pbmcsXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogZ3JheUxpZ2h0ZXIsXG4gICAgICAgICAgICBnZW5lcmF0ZUdyYWRpZW50OiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5nYXVnZTQgPSB7XG4gICAgICAgIGFuaW1hdGlvblNwZWVkOiAzMixcbiAgICAgICAgdmFsdWU6IHJhbmRvbSgwLDMwMDApLFxuICAgICAgICBtYXhWYWx1ZTogMzAwMCxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgbGluZXM6IDEyLFxuICAgICAgICAgICAgYW5nbGU6IDAuMTUsXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDAuNDQsXG4gICAgICAgICAgICBwb2ludGVyOiB7XG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAwLjgsXG4gICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDAuMDM1LFxuICAgICAgICAgICAgICAgIGNvbG9yOiBncmF5XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGltaXRNYXg6ICdmYWxzZScsXG4gICAgICAgICAgICBjb2xvclN0YXJ0OiBicmFuZERhbmdlcixcbiAgICAgICAgICAgIGNvbG9yU3RvcDogYnJhbmREYW5nZXIsXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogZ3JheUxpZ2h0ZXIsXG4gICAgICAgICAgICBnZW5lcmF0ZUdyYWRpZW50OiB0cnVlLFxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuXG4gICAgLy8gTGlzdCBvZiBuYXZpZ2F0aW9ucyBlbGVtZW50c1xuICAgIC5jb250cm9sbGVyKCdib290c3RyYXBFbGVtZW50cycsIGJvb3RzdHJhcEVsZW1lbnRzKTtcblxuYm9vdHN0cmFwRWxlbWVudHMuJGluamVjdCA9IFsnJHNjb3BlJ107XG5cbmZ1bmN0aW9uIGJvb3RzdHJhcEVsZW1lbnRzKCRzY29wZSkge1xuICAgICRzY29wZS5sYXlvdXQgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdvdmVydmlldycsXG4gICAgICAgICAgICBkZXNjOiAnT3ZlcnZpZXcnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdncmlkJyxcbiAgICAgICAgICAgIGRlc2M6ICdHcmlkJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnbWVkaWEtb2JqZWN0JyxcbiAgICAgICAgICAgIGRlc2M6ICdNZWRpYSBvYmplY3QnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdyZXNwb25zaXZlLXV0aWxpdGllcycsXG4gICAgICAgICAgICBkZXNjOiAnUmVzcG9uc2l2ZSB1dGlsaXRpZXMnXG4gICAgICAgIH1cbiAgICBdO1xuICAgICRzY29wZS5jb250ZW50ID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncmVib290JyxcbiAgICAgICAgICAgIGRlc2M6ICdSZWJvb3QnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd0eXBvZ3JhcGh5JyxcbiAgICAgICAgICAgIGRlc2M6ICdUeXBvZ3JhcGh5J1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnY29kZScsXG4gICAgICAgICAgICBkZXNjOiAnQ29kZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2ltYWdlcycsXG4gICAgICAgICAgICBkZXNjOiAnSW1hZ2VzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAndGFibGVzJyxcbiAgICAgICAgICAgIGRlc2M6ICdUYWJsZXMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdmaWd1cmVzJyxcbiAgICAgICAgICAgIGRlc2M6ICdGaWd1cmVzJ1xuICAgICAgICB9XG4gICAgXTtcbiAgICAkc2NvcGUuY29tcG9uZW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2FsZXJ0cycsXG4gICAgICAgICAgICBkZXNjOiAnQWxlcnRzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnYnJlYWRjcnVtYicsXG4gICAgICAgICAgICBkZXNjOiAnQnJlYWRjcnVtYidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2J1dHRvbmRyb3Bkb3duJyxcbiAgICAgICAgICAgIGRlc2M6ICdCdXR0b24gRHJvcGRvd24nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdidXR0b25ncm91cCcsXG4gICAgICAgICAgICBkZXNjOiAnQnV0dG9uIEdyb3VwJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnYnV0dG9ucycsXG4gICAgICAgICAgICBkZXNjOiAnQnV0dG9ucydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2NhcmQnLFxuICAgICAgICAgICAgZGVzYzogJ0NhcmQnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdjYXJvdXNlbCcsXG4gICAgICAgICAgICBkZXNjOiAnQ2Fyb3VzZWwnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdjb2xsYXBzZScsXG4gICAgICAgICAgICBkZXNjOiAnQ29sbGFwc2UnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdkcm9wZG93bnMnLFxuICAgICAgICAgICAgZGVzYzogJ0Ryb3Bkb3ducydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2Zvcm1zJyxcbiAgICAgICAgICAgIGRlc2M6ICdGb3JtcydcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ2lucHV0Z3JvdXAnLFxuICAgICAgICAgICAgZGVzYzogJ0lucHV0IEdyb3VwJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnanVtYm90cm9uJyxcbiAgICAgICAgICAgIGRlc2M6ICdKdW1ib3Ryb24nXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsYWJlbCcsXG4gICAgICAgICAgICBkZXNjOiAnTGFiZWwnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsaXN0Z3JvdXAnLFxuICAgICAgICAgICAgZGVzYzogJ0xpc3QgR3JvdXAnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdtb2RhbCcsXG4gICAgICAgICAgICBkZXNjOiAnTW9kYWwnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICduYXZiYXInLFxuICAgICAgICAgICAgZGVzYzogJ05hdmJhcidcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ25hdnMnLFxuICAgICAgICAgICAgZGVzYzogJ05hdnMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwYWdpbmF0aW9uJyxcbiAgICAgICAgICAgIGRlc2M6ICdQYWdpbmF0aW9uJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncG9wb3ZlcnMnLFxuICAgICAgICAgICAgZGVzYzogJ1BvcG92ZXJzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHJvZ3Jlc3MnLFxuICAgICAgICAgICAgZGVzYzogJ1Byb2dyZXNzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnc2Nyb2xsc3B5JyxcbiAgICAgICAgICAgIGRlc2M6ICdTY3JvbGxzcHknXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd0b29sdGlwcycsXG4gICAgICAgICAgICBkZXNjOiAnVG9vbHRpcHMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICd1dGlsaXRpZXMnLFxuICAgICAgICAgICAgZGVzYzogJ1V0aWxpdGllcydcbiAgICAgICAgfVxuICAgIF07XG59XG4iLCIndXNlIHN0cmljdCc7XG5hbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCdnZXRkb2NzY29udGVudCcsIGdldERvY3NDb250ZW50RGlyZWN0aXZlKVxuICAgIC5kaXJlY3RpdmUoJ2ltZycsIGhvbGRlckpzRGlyZWN0aXZlKTtcblxuZ2V0RG9jc0NvbnRlbnREaXJlY3RpdmUuJGluamVjdCA9IFsnJGh0dHAnLCAnJGNvbXBpbGUnXTtcblxuZnVuY3Rpb24gZ2V0RG9jc0NvbnRlbnREaXJlY3RpdmUoJGh0dHAsICRjb21waWxlKSB7XG4gICAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcbiAgICAgICAgcmVwbGFjZTogdHJ1ZSxcbiAgICAgICAgc2NvcGU6e1xuICAgICAgICAgICAgc3JjOiAnQHNyYydcbiAgICAgICAgfSxcbiAgICAgICAgbGluazogbGlua1xuICAgIH07XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICRodHRwLmdldChzY29wZS5zcmMpLnN1Y2Nlc3MoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgY29udGVudHMgPSBhbmd1bGFyLmVsZW1lbnQoXCI8ZGl2PlwiKS5odG1sKHJlc3BvbnNlKS5maW5kKFwiLmJkLWNvbnRlbnQgPlwiKTtcbiAgICAgICAgICAgIGVsZW1lbnQuZW1wdHkoKS5hcHBlbmQoJGNvbXBpbGUoY29udGVudHMpKHNjb3BlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy9Ib2xkZXIuanMgZml4XG5mdW5jdGlvbiBob2xkZXJKc0RpcmVjdGl2ZSgpIHtcbiAgICB2YXIgZGlyZWN0aXZlID0ge1xuICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICBsaW5rOiBsaW5rXG4gICAgfTtcbiAgICByZXR1cm4gZGlyZWN0aXZlO1xuXG4gICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYgKGF0dHJzLnNyYyl7XG4gICAgICAgICAgICBIb2xkZXIucnVuKHsgaW1hZ2VzOiBlbGVtZW50WzBdLCBub2NzczogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInLCAnJG9jTGF6eUxvYWRQcm92aWRlcicsICckYnJlYWRjcnVtYlByb3ZpZGVyJywgZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJG9jTGF6eUxvYWRQcm92aWRlciwgJGJyZWFkY3J1bWJQcm92aWRlcikge1xuICAgICAgICAkc3RhdGVQcm92aWRlclxuXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcCcsIHtcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW1vbi9sYXlvdXRzL2Z1bGwuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0Jvb3RzdHJhcCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFBsdWdpbjogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uICgkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2hhcnQuanMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL0NoYXJ0Lm1pbi5qcycsICdhc3NldHMvanMvbGlicy9hbmd1bGFyLWNoYXJ0Lm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICBsb2FkTXlDdHJsOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24oJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gbGF6eSBsb2FkIGZpbGVzIGZvciBhbiBleGlzdGluZyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvY29udHJvbGxlcnMvc2hhcmVkLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5sYXlvdXQnLCB7XG4gICAgICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21tb24vYm9vdHN0cmFwLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdDb250ZW50J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5sYXlvdXQub3ZlcnZpZXcnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9sYXlvdXQvb3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvbGF5b3V0L292ZXJ2aWV3L2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICBzdWJ0aXRsZTogJ0Jvb3RzdHJhcCBpbmNsdWRlcyBzZXZlcmFsIGNvbXBvbmVudHMgYW5kIG9wdGlvbnMgZm9yIGxheWluZyBvdXQgeW91ciBwcm9qZWN0LCBpbmNsdWRpbmcgd3JhcHBpbmcgY29udGFpbmVycywgYSBwb3dlcmZ1bCBncmlkIHN5c3RlbSwgYSBmbGV4aWJsZSBtZWRpYSBvYmplY3QsIGFuZCByZXNwb25zaXZlIHV0aWxpdHkgY2xhc3Nlcy4nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnT3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5sYXlvdXQuZ3JpZCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2xheW91dC9ncmlkJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2xheW91dC9ncmlkL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdHcmlkJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAubGF5b3V0Lm1lZGlhLW9iamVjdCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2xheW91dC9tZWRpYS1vYmplY3QnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvbGF5b3V0L21lZGlhLW9iamVjdC9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTWVkaWEgT2JqZWN0JyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAubGF5b3V0LnJlc3BvbnNpdmUtdXRpbGl0aWVzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvbGF5b3V0L3Jlc3BvbnNpdmUtdXRpbGl0aWVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2xheW91dC9yZXNwb25zaXZlLXV0aWxpdGllcy9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnUmVzcG9uc2l2ZSBVdGlsaXRpZXMnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb250ZW50Jywge1xuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tbW9uL2Jvb3RzdHJhcC5odG1sJyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ29udGVudCdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29udGVudC5yZWJvb3QnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb250ZW50L3JlYm9vdCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb250ZW50L3JlYm9vdC9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnUmVib290JyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29udGVudC5jb2RlJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29udGVudC9jb2RlJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbnRlbnQvY29kZS9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ29kZScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbnRlbnQudHlwb2dyYXBoeScsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbnRlbnQvdHlwb2dyYXBoeScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb250ZW50L3R5cG9ncmFwaHkvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1R5cG9ncmFwaHknLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb250ZW50LmltYWdlcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbnRlbnQvaW1hZ2VzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbnRlbnQvaW1hZ2VzL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdJbWFnZXMnLFxuICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb250ZW50LnRhYmxlcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbnRlbnQvdGFibGVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbnRlbnQvdGFibGVzL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdUYWJsZXMnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb250ZW50LmZpZ3VyZXMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb250ZW50L2ZpZ3VyZXMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29udGVudC9maWd1cmVzL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdGaWd1cmVzJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cycsIHtcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbW1vbi9ib290c3RyYXAuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0NvbXBvbmVudHMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMuYWxlcnRzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy9hbGVydHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy9hbGVydHMvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0FsZXJ0cycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMuYnJlYWRjcnVtYicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvYnJlYWRjcnVtYicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL2JyZWFkY3J1bWIvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0JyZWFkY3J1bWInLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb21wb25lbnRzLmJ1dHRvbmRyb3Bkb3duJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy9idXR0b25kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL2J1dHRvbi1kcm9wZG93bi9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQnV0dG9uIERyb3Bkb3duJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5idXR0b25ncm91cCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvYnV0dG9uZ3JvdXAnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy9idXR0b24tZ3JvdXAvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0J1dHRvbiBHcm91cCcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMuYnV0dG9ucycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvYnV0dG9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL2J1dHRvbnMvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0J1dHRvbnMnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb21wb25lbnRzLmNhcmQnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL2NhcmQnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy9jYXJkL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdDYXJkJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5jYXJvdXNlbCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvY2Fyb3VzZWwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy9jYXJvdXNlbC9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ2Fyb3VzZWwnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb21wb25lbnRzLmNvbGxhcHNlJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy9jb2xsYXBzZScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL2NvbGxhcHNlL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdDb2xsYXBzZScsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMuZHJvcGRvd25zJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy9kcm9wZG93bnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy9kcm9wZG93bnMvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0Ryb3Bkb3ducycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMuZm9ybXMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL2Zvcm1zJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbXBvbmVudHMvZm9ybXMvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0Zvcm1zJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5pbnB1dGdyb3VwJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy9pbnB1dGdyb3VwJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbXBvbmVudHMvaW5wdXQtZ3JvdXAvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0lucHV0IEdyb3VwJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5qdW1ib3Ryb24nLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL2p1bWJvdHJvbicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL2p1bWJvdHJvbi9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnSnVtYm90cm9uJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5sYWJlbCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvbGFiZWwnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy9sYWJlbC9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTGFiZWwnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb21wb25lbnRzLmxpc3Rncm91cCcsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvbGlzdGdyb3VwJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbXBvbmVudHMvbGlzdC1ncm91cC9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTGlzdCBHcm91cCcsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMubW9kYWwnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL21vZGFsJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbXBvbmVudHMvbW9kYWwvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ01vZGFsJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5uYXYnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL25hdicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL25hdi9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTmF2JyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5uYXZiYXInLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL25hdmJhcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL25hdmJhci9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTmF2YmFyJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5uYXZzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy9uYXZzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbXBvbmVudHMvbmF2cy9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnbmF2cycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMucGFnaW5hdGlvbicsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvcGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL3BhZ2luYXRpb24vaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1BhZ2luYXRpb24nLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb21wb25lbnRzLnBvcG92ZXJzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy9wb3BvdmVycycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL3BvcG92ZXJzL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdQb3BvdmVycycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMucHJvZ3Jlc3MnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL3Byb2dyZXNzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzxkaXYgZ2V0RG9jc0NvbnRlbnQgc3JjPVwidmlld3MvYm9vdHN0cmFwL2NvbXBvbmVudHMvcHJvZ3Jlc3MvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1Byb2dyZXNzJyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5yZWJvb3QnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL3JlYm9vdCcsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL3JlYm9vdC9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnUmVib290JyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy5zY3JvbGxzcHknLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Jvb3RzdHJhcC9jb21wb25lbnRzL3Njcm9sbHNweScsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL3Njcm9sbHNweS9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnU2Nyb2xsc3B5JyxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdib290c3RyYXAuY29tcG9uZW50cy50b29sdGlwcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYm9vdHN0cmFwL2NvbXBvbmVudHMvdG9vbHRpcHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy90b29sdGlwcy9pbmRleC5odG1sXCI+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnTGFiZWwnLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2Jvb3RzdHJhcC5jb21wb25lbnRzLnRyYW5zaXRpb25zJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy90cmFuc2l0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICc8ZGl2IGdldERvY3NDb250ZW50IHNyYz1cInZpZXdzL2Jvb3RzdHJhcC9jb21wb25lbnRzL3RyYW5zaXRpb25zL2luZGV4Lmh0bWxcIj48L2Rpdj4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdUcmFuc2l0aW9ucycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYm9vdHN0cmFwLmNvbXBvbmVudHMudXRpbGl0aWVzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9ib290c3RyYXAvY29tcG9uZW50cy91dGlsaXRpZXMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiBnZXREb2NzQ29udGVudCBzcmM9XCJ2aWV3cy9ib290c3RyYXAvY29tcG9uZW50cy91dGlsaXRpZXMvaW5kZXguaHRtbFwiPjwvZGl2PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1V0aWxpdGllcycsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmljb25zJywge1xuICAgICAgICAgICAgICAgIHVybDogXCIvaWNvbnNcIixcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzx1aS12aWV3PjwvdWktdmlldz4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICd7eyBcIklDT05TXCIgfCB0cmFuc2xhdGUgfX0nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmljb25zLmZvbnRhd2Vzb21lJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9mb250LWF3ZXNvbWUnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvaWNvbnMvZm9udC1hd2Vzb21lLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdGb250IEF3ZXNvbWUnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmljb25zLnNpbXBsZWxpbmVpY29ucycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvc2ltcGxlLWxpbmUtaWNvbnMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvaWNvbnMvc2ltcGxlLWxpbmUtaWNvbnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1NpbXBsZSBMaW5lIEljb25zJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jb21wb25lbnRzJywge1xuICAgICAgICAgICAgICAgIHVybDogXCIvY29tcG9uZW50c1wiLFxuICAgICAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnPHVpLXZpZXc+PC91aS12aWV3PicsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0NvbXBvbmVudHMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNvbXBvbmVudHMuYnV0dG9ucycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYnV0dG9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL2J1dHRvbnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ3t7IFwiQlVUVE9OU1wiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jb21wb25lbnRzLnNvY2lhbC1idXR0b25zJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9zb2NpYWwtYnV0dG9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3NvY2lhbC1idXR0b25zLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdTb2NpYWwgQnV0dG9ucydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY29tcG9uZW50cy5jYXJkcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvY2FyZHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY29tcG9uZW50cy9jYXJkcy5odG1sJyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAnQ2FyZHMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLmNvbXBvbmVudHMuZm9ybXMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2Zvcm1zJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2NvbXBvbmVudHMvZm9ybXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ0Zvcm1zJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5jb21wb25lbnRzLnN3aXRjaGVzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9zd2l0Y2hlcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3N3aXRjaGVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdTd2l0Y2hlcydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY29tcG9uZW50cy50YWJsZXMnLCB7XG4gICAgICAgICAgICAgICAgdXJsOiAnL3RhYmxlcycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9jb21wb25lbnRzL3RhYmxlcy5odG1sJyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAne3sgXCJUQUJMRVNcIiB8IHRyYW5zbGF0ZSB9fSdcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGx1Z2lucycsIHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3BsdWdpbnNcIixcbiAgICAgICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJzx1aS12aWV3PjwvdWktdmlldz4nLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICdQbHVnaW5zJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wbHVnaW5zLmNhbGVuZGFyJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9jYWxlbmRhcicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9wbHVnaW5zL2NhbGVuZGFyLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICd7eyBcIkNBTEVOREFSXCIgfCB0cmFuc2xhdGUgfX0nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRQbHVnaW46IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbiAoJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmlhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2xpYnMvbW9tZW50Lm1pbi5qcycsJ2Fzc2V0cy9qcy9saWJzL2Z1bGxjYWxlbmRhci5taW4uanMnLCdhc3NldHMvanMvbGlicy9nY2FsLm1pbi5qcycsJ2Fzc2V0cy9qcy9saWJzL2NhbGVuZGFyLm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICBsb2FkTXlDdHJsOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24oJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gbGF6eSBsb2FkIGZpbGVzIGZvciBhbiBleGlzdGluZyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvY29udHJvbGxlcnMvY2FsZW5kYXIuanMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdGF0ZSgnYXBwLnBsdWdpbnMubm90aWZpY2F0aW9ucycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvbm90aWZpY2F0aW9ucycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9wbHVnaW5zL25vdGlmaWNhdGlvbnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ3t7IFwiTk9USUZJQ0FUSU9OU1wiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsb2FkUGx1Z2luOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24gKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9hbmd1bGFyLXRvYXN0ci50cGxzLm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICBsb2FkTXlDdHJsOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24oJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gbGF6eSBsb2FkIGZpbGVzIGZvciBhbiBleGlzdGluZyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvY29udHJvbGxlcnMvbm90aWZpY2F0aW9ucy5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAucGx1Z2lucy5zbGlkZXJzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9zbGlkZXJzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3BsdWdpbnMvc2xpZGVycy5odG1sJyxcbiAgICAgICAgICAgICAgICBuY3lCcmVhZGNydW1iOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAne3sgXCJTTElERVJTXCIgfCB0cmFuc2xhdGUgfX0nXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgICAgICAgICAgIGxvYWRQbHVnaW46IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbiAoJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL2lvbi5yYW5nZVNsaWRlci5taW4uanMnLCAnYXNzZXRzL2pzL2xpYnMvcnpzbGlkZXIubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRNeUN0cmw6IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbigkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geW91IGNhbiBsYXp5IGxvYWQgZmlsZXMgZm9yIGFuIGV4aXN0aW5nIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9jb250cm9sbGVycy9zbGlkZXJzLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5wbHVnaW5zLnRhYmxlcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvdGFibGVzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3BsdWdpbnMvdGFibGVzLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICd7eyBcIlRBQkxFU1wiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsb2FkUGx1Z2luOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24gKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9qcXVlcnkuZGF0YVRhYmxlcy5taW4uanMnLCAnYXNzZXRzL2pzL2xpYnMvYW5ndWxhci1kYXRhdGFibGVzLm1pbi5qcycsICdhc3NldHMvanMvbGlicy9hbmd1bGFyLWRhdGF0YWJsZXMuYm9vdHN0cmFwLm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgICAgICBsb2FkTXlDdHJsOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24oJG9jTGF6eUxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHlvdSBjYW4gbGF6eSBsb2FkIGZpbGVzIGZvciBhbiBleGlzdGluZyBtb2R1bGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvY29udHJvbGxlcnMvdGFibGVzLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5mb3JtcycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvZm9ybXMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvZm9ybXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ3t7IFwiRk9STVNcIiB8IHRyYW5zbGF0ZSB9fSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbG9hZFBsdWdpbjogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uICgkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VyaWU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL21vbWVudC5taW4uanMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2xpYnMvZGF0ZXJhbmdlcGlja2VyLm1pbi5qcycsICdhc3NldHMvanMvbGlicy9hbmd1bGFyLWRhdGVyYW5nZXBpY2tlci5taW4uanMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9tYXNrLm1pbi5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL3NlbGVjdC5taW4uanMnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZE15Q3RybDogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB5b3UgY2FuIGxhenkgbG9hZCBmaWxlcyBmb3IgYW4gZXhpc3RpbmcgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2NvbnRyb2xsZXJzL2Zvcm1zLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC53aWRnZXRzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy93aWRnZXRzJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL3dpZGdldHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ3t7IFwiV0lER0VUU1wiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsb2FkUGx1Z2luOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24gKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2xpYnMvZ2F1Z2UubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRNeUN0cmw6IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbigkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geW91IGNhbiBsYXp5IGxvYWQgY29udHJvbGxlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkb2NMYXp5TG9hZC5sb2FkKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvY29udHJvbGxlcnMvd2lkZ2V0cy5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuY2hhcnRzJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9jaGFydHMnLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvY2hhcnRzLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICd7eyBcIkNIQVJUU1wiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICAvLyBQbHVnaW5zIGxvYWRlZCBiZWZvcmVcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9hZFBsdWdpbjogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uICgkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoW1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgc2VyaWFsOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBmaWxlczogWydhc3NldHMvanMvbGlicy9DaGFydC5taW4uanMnLCAnYXNzZXRzL2pzL2xpYnMvYW5ndWxhci1jaGFydC5taW4uanMnXVxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIF0pO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XSxcbiAgICAgICAgICAgICAgICAgICAgbG9hZE15Q3RybDogWyckb2NMYXp5TG9hZCcsIGZ1bmN0aW9uKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB5b3UgY2FuIGxhenkgbG9hZCBmaWxlcyBmb3IgYW4gZXhpc3RpbmcgbW9kdWxlXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6IFsnYXNzZXRzL2pzL2NvbnRyb2xsZXJzL2NoYXJ0cy5qcyddXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnN0YXRlKCdhcHAuZWNoYXJ0cycsIHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvZWNoYXJ0cycsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9lY2hhcnRzLmh0bWwnLFxuICAgICAgICAgICAgICAgIG5jeUJyZWFkY3J1bWI6IHtcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICd7eyBcIkNIQVJUU1wiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgICAgICAgICAgICBsb2FkUGx1Z2luOiBbJyRvY0xhenlMb2FkJywgZnVuY3Rpb24gKCRvY0xhenlMb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJG9jTGF6eUxvYWQubG9hZChbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpYWw6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9saWJzL2VjaGFydHMtYWxsLm1pbi5qcycsICdhc3NldHMvanMvbGlicy9hbmd1bGFyLWVjaGFydHMubWluLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdKTtcbiAgICAgICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgICAgICAgIGxvYWRNeUN0cmw6IFsnJG9jTGF6eUxvYWQnLCBmdW5jdGlvbigkb2NMYXp5TG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8geW91IGNhbiBsYXp5IGxvYWQgZmlsZXMgZm9yIGFuIGV4aXN0aW5nIG1vZHVsZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRvY0xhenlMb2FkLmxvYWQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiBbJ2Fzc2V0cy9qcy9jb250cm9sbGVycy9lY2hhcnRzLmpzJ11cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuc3RhdGUoJ2FwcC5hbmltYXRpb25zJywge1xuICAgICAgICAgICAgICAgIHVybDogJy9hbmltYXRpb25zJyxcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXdzL2FuaW1hdGlvbnMuaHRtbCcsXG4gICAgICAgICAgICAgICAgbmN5QnJlYWRjcnVtYjoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ3t7IFwiQU5JTUFUSU9OU1wiIHwgdHJhbnNsYXRlIH19J1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH1dKTtcbiIsIiIsIi8vZW1haWwuanNcbid1c2Ugc3RyaWN0JztcbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCduZXdNYWlsQ3RybCcsIG5ld01haWxDdHJsKVxuICAgIC5maWx0ZXIoJ3Byb3BzRmlsdGVyJywgcHJvcHNGaWx0ZXIpO1xuXG5uZXdNYWlsQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGh0dHAnLCAnJHRpbWVvdXQnXTtcbmZ1bmN0aW9uIG5ld01haWxDdHJsKCRzY29wZSwgJGh0dHAsICR0aW1lb3V0KSB7XG5cbiAgICAkc2NvcGUucGVyc29uID0ge307XG4gICAgJHNjb3BlLnBlb3BsZSA9IFtcbiAgICAgICAgeyBuYW1lOiAnQWRhbScsICAgICAgZW1haWw6ICdhZGFtQGVtYWlsLmNvbScsICAgICAgYWdlOiAxMiwgY291bnRyeTogJ1VuaXRlZCBTdGF0ZXMnIH0sXG4gICAgICAgIHsgbmFtZTogJ0FtYWxpZScsICAgIGVtYWlsOiAnYW1hbGllQGVtYWlsLmNvbScsICAgIGFnZTogMTIsIGNvdW50cnk6ICdBcmdlbnRpbmEnIH0sXG4gICAgICAgIHsgbmFtZTogJ0VzdGVmYW7DrWEnLCBlbWFpbDogJ2VzdGVmYW5pYUBlbWFpbC5jb20nLCBhZ2U6IDIxLCBjb3VudHJ5OiAnQXJnZW50aW5hJyB9LFxuICAgICAgICB7IG5hbWU6ICdBZHJpYW4nLCAgICBlbWFpbDogJ2FkcmlhbkBlbWFpbC5jb20nLCAgICBhZ2U6IDIxLCBjb3VudHJ5OiAnRWN1YWRvcicgfSxcbiAgICAgICAgeyBuYW1lOiAnV2xhZGltaXInLCAgZW1haWw6ICd3bGFkaW1pckBlbWFpbC5jb20nLCAgYWdlOiAzMCwgY291bnRyeTogJ0VjdWFkb3InIH0sXG4gICAgICAgIHsgbmFtZTogJ1NhbWFudGhhJywgIGVtYWlsOiAnc2FtYW50aGFAZW1haWwuY29tJywgIGFnZTogMzAsIGNvdW50cnk6ICdVbml0ZWQgU3RhdGVzJyB9LFxuICAgICAgICB7IG5hbWU6ICdOaWNvbGUnLCAgICBlbWFpbDogJ25pY29sZUBlbWFpbC5jb20nLCAgICBhZ2U6IDQzLCBjb3VudHJ5OiAnQ29sb21iaWEnIH0sXG4gICAgICAgIHsgbmFtZTogJ05hdGFzaGEnLCAgIGVtYWlsOiAnbmF0YXNoYUBlbWFpbC5jb20nLCAgIGFnZTogNTQsIGNvdW50cnk6ICdFY3VhZG9yJyB9LFxuICAgICAgICB7IG5hbWU6ICdNaWNoYWVsJywgICBlbWFpbDogJ21pY2hhZWxAZW1haWwuY29tJywgICBhZ2U6IDE1LCBjb3VudHJ5OiAnQ29sb21iaWEnIH0sXG4gICAgICAgIHsgbmFtZTogJ05pY29sw6FzJywgICBlbWFpbDogJ25pY29sYXNAZW1haWwuY29tJywgICBhZ2U6IDQzLCBjb3VudHJ5OiAnQ29sb21iaWEnIH1cbiAgICBdO1xuXG4gICAgJHNjb3BlLm11bHRpcGxlRGVtbyA9IHt9O1xuICAgICRzY29wZS5tdWx0aXBsZURlbW8uc2VsZWN0ZWRQZW9wbGUgPSBbXTtcblxufVxuXG5mdW5jdGlvbiBwcm9wc0ZpbHRlcigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oaXRlbXMsIHByb3BzKSB7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcblxuICAgICAgICBpZiAoYW5ndWxhci5pc0FycmF5KGl0ZW1zKSkge1xuICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1NYXRjaGVzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHByb3BzKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3AgPSBrZXlzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IHByb3BzW3Byb3BdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtW3Byb3BdLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRleHQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbU1hdGNoZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbU1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMZXQgdGhlIG91dHB1dCBiZSB0aGUgaW5wdXQgdW50b3VjaGVkXG4gICAgICAgICAgICBvdXQgPSBpdGVtcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=