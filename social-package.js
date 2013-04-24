function Social ( name ) {

    var social = this,
    init = function () {
        social[ name ].init()
    }

    social.checkAuth = function ( callback ) {
        social[ name ].checkAuth( callback )
    }

    social.login = function ( callback ) {
        social[ name ].login( callback )
    }

    social.getFullProfile = function ( callback ) {
        social[ name ].getFullProfile( callback )
    }

    social.logout = function ( callback ) {
        social[ name ].logout( callback )
    }

    init()

}


Social.prototype.linkedin = new function () {
    var li = this;
    li.init = function () {
        $.getScript("https://platform.linkedin.com/in.js?async=true", function(){
            IN.init({
                api_key      : 've5y3udnlro9',
                authorize    : true
            }, function () {
                li.status = IN.User.isAuthorized();
            })
        })
    }

    li.checkAuth = function ( callback ) {
        wait(
            function(){ return ! li.status },
            function(){
                li.status = false;
                wait (
                    function(){ return !! li.status },
                    function(){
                        li.parseStatus( callback )
                    }
                )
                li.status = IN.User.isAuthorized();
            }
        )
    }

    li.login = function ( callback ) {
        wait(
            function(){ return ! li.status },
            function(){
                IN.UI.Authorize(function (response) {
                    li.status = response;
                    li.parseStatus(callback)
                }).params({"scope":["r_fullprofile", "r_contactinfo"]}).place();
            }
        )
    }

    li.getFullProfile = function ( callback ) {
        wait(
            function(){ return ! li.status },
            function(){
                IN.API.Profile("me").fields(["summary", "educations", "skills", "positions"]).result(callback);
            }
        )
    }

    li.logout = function ( callback ) {
        wait(
            function(){ return ! li.status },
            function(){
                IN.User.logout(function (response) {
                    li.status = response
                    li.parseStatus( callback )
                });
            }
        )
    }

    li.parseStatus = function ( callback ) {
        var status = IN.User.isAuthorized();
        return callback( status )
    }

}

// auxiliary functions

function async ( callback ) {
    setTimeout( callback, 0 )
}

function wait ( condition, callback ) {
    var interval = setInterval( function () {
        if ( condition() ) {
            callback()
            clearInterval( interval )
        }
    }, 100 )
}
