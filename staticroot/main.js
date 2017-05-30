$(document).ready(function () {
    function deltoken() {
        window.localStorage.removeItem('token');
    }

    function gettoken() {
        return window.localStorage.getItem('token');
    }

    function addtoken(token) {
        console.log('Adding user login token' + token);
        window.localStorage.setItem('token', token)
    }

    function postit(url, data, success) {
        console.log(url);
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: success,
            contentType: "application/json",
            dataType: 'json'
        });
    }

    function check_login() {
        if (gettoken() != undefined) {
            $('.login').addClass('hide')
            $('.sign-up').addClass('hide')
            $('.solution').addClass('show')
            $('.questions').addClass('show')
            $('.menu-logged-in').addClass('show')
            $('.menu-not-logged-in').addClass('hide')
        } else {
            return 'lol'
        }
    }

    function logged_in_details() {
        if (gettoken() != undefined) {
            var newdata = JSON.stringify({"token": gettoken()});
            postit('/user/details', newdata, function (data) {
                console.log(data);
                if (data.user != null) {
                    $("#user_name_display").text(data.user);
                    $("#score_display").text(data.score);
                }
            });//user details postit
        } else {
            $("#user_name_display").text('User');
            $("#score_display").text('0');
        }
    }

    function check_attempt_status() {
        $("#attempt_status").addClass('checking_attempt');
        $("#attempt_message").text('');
        console.log('Checking attempt status');
        console.log($("#attempt-id").text());
        if ($("#attempt-id").text()) {
            var data = JSON.stringify({'attempt': $("#attempt_status").text()});
            postit('/attempt/status', data, function (data) {
                console.log(data);
                if (data.status == true) {
                    $("#attempt_status").removeClass('checking_attempt');
                    $("#attempt_status").removeClass('wrong_attempt');
                    $("#attempt_status").addClass('correct_attempt');
                    $("#attempt_message").text(data.message);
                    logged_in_details();
                    return;
                }
                if (data.status == false) {
                    $("#attempt_status").removeClass('checking_attempt');
                    $("#attempt_status").removeClass('correct_attempt');
                    $("#attempt_status").addClass('wrong_attempt');
                    $("#attempt_message").text(data.message);
                    return;
                }
                if (data.status == null) {
                    $("#attempt_status").removeClass('wrong_attempt');
                    $("#attempt_status").removeClass('correct_attempt');
                    $("#attempt_status").addClass('checking_attempt');
                    $("#attempt_message").text(data.message);
                    return;
                }
            });
        } else {
            return null;
        }
    }

    $('#show-sign-up').click(function () {
        $('.sign-up').removeClass('hide');
        $('.login').addClass('hide');
    });

    $('#show-login').click(function () {
        $('.sign-up').addClass('hide');
        $('.login').removeClass('hide');
    });

    $('#show-leader-bord').click(function () {
        $('.solution').toggle('show')
        $('.questions').toggle('show')
        $('.leader-bord').toggle('hide')
        refresh_leader()
    });


    // --------------------------------------------------------- Actual stuff
    $("#login").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        if (username == '') {
            $("#username").addClass('missingform');
        } else {
            $("#username").removeClass('missingform');
        }
        if (password == '') {
            $("#password").addClass('missingform');
        } else {
            $("#password").removeClass('missingform');
        }
        if (password != '' && username != '') {
            // All data available
            var data = JSON.stringify({'username': username, 'password': password});
            postit('/login', data, function (data) {
                if (data.status == true) {
                    console.log('Login successful');
                    addtoken(data.token);
                    logged_in_details();
                    $('.login').toggle('hide')
                    $('.solution').toggle('show')
                    $('.questions').toggle('show')
                    $('.menu-logged-in').toggle('hide')
                    $('.menu-not-logged-in').toggle('hide')
                } else {
                    $('.login-error').html("User name or password isn't correct")
                    console.log('Login failed');
                }
            });  // end of postit handler
        }
    });  // login action

    $("#logout").click(function () {
        var token = gettoken();
        var data = JSON.stringify({'token': token});
        postit('/logout', data, function (data) {
            if (data.status == true) {
                console.log('Logout successful');
                deltoken();
                logged_in_details();
                location.reload();
                /* $('.login').toggle('show')
                 $('.sign-up').addClass('hide')
                 $('.solution').toggle('hide')
                 $('.questions').toggle('hide')
                 $('.menu-logged-in').toggle('hide')
                 $('.menu-not-logged-in').toggle('hide')*/
            } else {
                console.log('Logout failed');
            }
        });
    });  // logout action
    $("#signup").click(function () {
        var username = $("#sign-up-username").val();
        var password = $("#sign-up-password").val();
        if (username == '') {
            $("#username").addClass('missingform');
        } else {
            $("#username").removeClass('missingform');
        }
        if (password == '') {
            $("#password").addClass('missingform');
        } else {
            $("#password").removeClass('missingform');
        }
        if (password != '' && username != '') {
            // All data available
            var self = this;
            self.data = JSON.stringify({'username': username, 'password': password});
            postit('/register', self.data, function (data) {
                if (data.status == true) {
                    console.log('Signup successful');
                    postit('/login', self.data, function (data) {
                        if (data.status == true) {
                            console.log('Login successful');
                            addtoken(data.token);
                            logged_in_details();
                            $('.login').addClass('hide')
                            $('.sign-up').addClass('hide')
                            $('.menu-logged-in').toggle('hide')
                            $('.menu-not-logged-in').toggle('hide')
                            $('.solution').addClass('show')
                            $('.questions').addClass('show')
                        } else {
                            console.log('Login failed');
                        }
                    })
                } else {
                    $('.sign-up-error').html("Something went wrong, try again")
                    console.log('Signup failed');
                }
            });  // end of postit handler
        }
    });  // signup action
    $("#submit_attempt").click(function () {
        var url = '/attempt';
        var token = gettoken();
        if (token == null) {
            alert('You need to login to attempt');
            return;
        }
        var qpk = $("#question_number").text();
        if (qpk == '') {
            alert('Please select a question to answer');
            return;
        }
        var lang = $("#language").val();
        var code = $("#code").val();
        console.log(code == '');
        if (code == '') {
            alert('Copy/Write some code in the box provided');
            return;
        }
        var data = JSON.stringify({
            'question': qpk,
            'language': lang,
            'code': code,
            'token': token
        });
        postit(url, data, function (data) {
            console.log(data);
            if (data.attempt != null) {
                $("#attempt-id").text(data.attempt);
                setTimeout(check_attempt_status, 2000);
                $(".attempt").removeClass('wrong_attempt');
                $(".attempt").removeClass('correct_attempt');
                $(".attempt").addClass('checking_attempt');
            }
        });
    });  // submit action
    $(".question_button").click(function () {
        $(".question_button").removeClass('button-primary');
        $(this).addClass('button-primary');
        // ----- get relevant question data
        var qpk = $(this).attr('id').substring(2);
        var data = JSON.stringify({'question_pk': qpk});
        $("#question_number").text(qpk);
        postit('/question', data, function (data) {
            console.log(data.statement);
            $("#question_pre").text(data.statement);
        });
    });
    $("#attempt_status").click(check_attempt_status);
    $("#score_display").click(logged_in_details);
    $('#refresh_lb').click(refresh_leader)
    // --------------------------------Execute on page load
    check_login();
    logged_in_details();
    function refresh_leader() {
        // get userlist
        postit('/user/leader', '', function (data) {
            console.log(data);
            $("#leader_table").html('');  // clear the table
            var table = $("#leader_table");
            for (d of data.leader) {
                var person = $("<tr><td>" + d[1] + "</td><td>" + d[0] + "</td></tr>");
                table.append(person);
            }
        });

    }
});   // Document ready
