var TwitterPackage = require("twitter");
var secret = require("./.secrets.json");
var client = new TwitterPackage(secret);

var targetsFriends = [];
var myFriends = [];

var targetUser = process.argv[2];

Array.prototype.contains = function(element) {
    return this.indexOf(element) > -1;
};

var params = {
    cursor: '-1',
    count: '100',
    skip_status: 'true',
    include_user_entities: 'true'
};

params.screen_name = targetUser;

client.get(
    'https://api.twitter.com/1.1/friends/list.json',
    params,
    function(error, data, response) {
        if (error) {
            console.log(error);
        }
        data.users.forEach(function(entry) {
            targetsFriends.push(entry.screen_name);
        });

        params.screen_name = 'mind_donald';

        client.get(
            'https://api.twitter.com/1.1/friends/list.json',
            params,
            function(error, data, response) {
                data.users.forEach(function(entry) {
                    myFriends.push(entry.screen_name);
                });

                var follow = []
                var count = 0;
                targetsFriends.forEach(function(entry) {
                    if (!myFriends.contains(entry)) {
                        follow.push(entry);
                        count++;
                    }
                });

                count = 0;
                var unfollow = [];
                myFriends.forEach(function(entry) {
                    if (!targetsFriends.contains(entry)) {
                        unfollow.push(entry);
                        count++;
                    }
                });

                follow.forEach(function(entry) {
                    var params = {
                        follow: 'true'
                    };
                    params.screen_name = entry;

                    client.post(
                        'https://api.twitter.com/1.1/friendships/create.json', params, function(error, response) {
                            console.log(response);
                        });

                });

                unfollow.forEach(function(entry) {
                    var params = {
                        follow: 'false'
                    };
                    params.screen_name = entry;

                    client.post(
                        'https://api.twitter.com/1.1/friendships/create.json', params, function(error, response) {
                            console.log(response);
                        });

                });
            }
        );

    }
);


