"use strict";

/**
 * @ngdoc function
 * @name drideApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the drideApp
 */
angular
    .module("drideApp")
    .controller("MainCtrl", function($scope, $http, devMenu, $mixpanel) {
        $scope.toLeft = false;
        $scope.toRight = false;
        $scope.showPreOrder = false;
        $scope.preSubmit = true;
        $scope.displayCard = 1;

        $scope.sideNav = devMenu.getMenu();

        $mixpanel.track("HP visit");

        var md = new MobileDetect(window.navigator.userAgent);
        $scope.video = {
            id: "F-GzkYJyKpI"
        };

        $scope.email = "";

        $scope.isMobile = md.mobile() || window.innerWidth <= 768 || ifGBot();

        $scope.views = [
            "product",
            "cloud",
            "mic",
            "camera",
            "wifi",
            "app",
            "docs"
        ];
        //when press prev, card slide to right
        $scope.goToView = function(view, strict, addOrSub) {

            view = addOrSub ? parseInt(view) + addOrSub : view;

            //dont run if popup is there
            if ($scope.showPreOrder) return;

            //validate a gap of at least 1 sec to prevent super fast scroll
            var dateNow = new Date().getTime();
            if (
                $scope.transitionFired &&
                dateNow - $scope.transitionFired < 1000
            )
                return;

            if (view > 7) view = 7;

            if (view < 1) view = 1;

            $scope.toLeft = true;
            $scope.toRight = false;

            if (view != $scope.displayCard) {
                $mixpanel.track("HP view " + view);
            }

            $scope.displayCard = view;

            //save the time of the transition to prevent super fast scroll
            $scope.transitionFired = dateNow;

        };

        $scope.openPreOrder = function() {
            if ($scope.isMobile) $scope.hideNav = true;
            $scope.showPreOrder = true;
        };
        $scope.closePreOrder = function() {
            delete $scope.hideNav;
            $scope.showPreOrder = false;
        };
        $scope.sendDetails = function(email) {
            console.log(email);
            $http({
                method: "GET",
                url: "https://api.dride.io/validator/subscribe.php?email=" +
                    email
            });

            $scope.preSubmit = false;
        };

        function ifGBot(){
            var botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";
            var re = new RegExp(botPattern, 'i');
            var userAgent = navigator.userAgent;
            console.log(userAgent)
            if (re.test(userAgent)) {
               return true;
            }
            return false;
        }


    });
