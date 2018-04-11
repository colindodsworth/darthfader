// Define Angular App & Controller:
var app = angular.module("YouTubeApp", []);

app.initPlayer = function(playerID, firstVid) {
    console.log(firstVid);
    return new YT.Player(playerID, {
        width: "100%",
        height: 300,
        videoId: firstVid
    });
};


//Initialize YouTube Search API:
var init = function() {
    console.log('init');
    // this function loads as soon as Google's Youtube library loads:
    gapi.client.setApiKey("AIzaSyCS5oH5AEofRw6A4UvLCfAKdlhChqUJDdE");
    gapi.client.load("youtube", "v3");

    // don't initialize the players until the "init" callback function
    // gets called:
    app.player1 = app.initPlayer('ytplayer1', "2Oiik9qAbQQ");
    app.player2 = app.initPlayer('ytplayer2', "72UUR3KTzlc");
};
$.getScript("https://apis.google.com/js/client.js?onload=init");



app.controller("YouTubeController", function($scope, $http) {
    $scope.term1 = "dae dae woke up";
    $scope.term2 = "lil uzi vert you was right";
    $scope.leftVideos = [];
    $scope.rightResults = null;

    $scope.loadVideoLeft = function(e, videoID) {
        app.player1.loadVideoById(videoID);
        e.preventDefault();
    };

    $scope.loadVideoRight = function(e, videoID) {
        //https://developers.google.com/youtube/iframe_api_reference
        app.player2.loadVideoById(videoID);
        e.preventDefault();
    };


    // CROSSFADER:
    $(function() {
        $("#crossfade").slider({
            value: 100,
            orientation: "horizontal",
            max: 200,
            range: "min",
            animate: true,
            slide: function(event, ui) {
                app.player1.setVolume(Math.max(Math.min(200 - ui.value, 100), 0));
                app.player2.setVolume(Math.max(Math.min(ui.value, 100), 0));
            }
        });
    });


// SEARCH:
    $scope.processData1 = function(response) {
        $scope.$apply(function() {
            $scope.leftVideos = response.items;
        });
    };
    $scope.fetchData1 = function(e) {
        // Here is the search documentation:
        // https://developers.google.com/youtube/v3/docs/search/list
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: $scope.term1,
            maxResults: 20, //you can search for as few or as many as you want
            order: "relevance", // viewCount
        });
        request.execute($scope.processData1);
    };

    $scope.processData2 = function(response) {
        $scope.$apply(function() {
            $scope.rightVideos = response.items;
        });
    };
    $scope.fetchData2 = function(e) {
        // Here is the search documentation:
        // https://developers.google.com/youtube/v3/docs/search/list
        var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: $scope.term2,
            maxResults: 20, //you can search for as few or as many as you want
            order: "relevance", // viewCount
        });
        request.execute($scope.processData2);
    };
});


