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
            $('.wrapper').toggle('hide')
        } else {
            return 'lol'
        }
    }

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
                    $('.wrapper').toggle('hide');
                    $('.login').toggle('hide')
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
                location.reload();
            } else {
                console.log('Logout failed');
            }
        });
    });  // logout action

    $("#update").click(function (event) {
        event.preventDefault();
        var text = $("#intro-text").val();
        var token = gettoken();
        var data = JSON.stringify({
            'text': text,
            'token': token
        });
        postit('/add_intro', data, function (data) {
            console.log(data)
        })
    });


    $("#add").click(function (event) {
        event.preventDefault();
        var number = $("#add-number").val();
        var text = $("#text").val();
        var inputs = $("#inputs").val();
        var out = $("#out").val();
        var token = gettoken();
        var data = JSON.stringify({
            'number': number,
            'text': text,
            'inputs': inputs,
            'out': out,
            'token': token
        });
        postit('/add_question', data, function (data) {
            console.log(data)
        })
    });

    $("#delete").click(function (event) {
        event.preventDefault();
        var number = $("#delete-number").val()
        var token = gettoken();
        var data = JSON.stringify({
            'number': number,
            'token': token
        });
        postit('/delete_question', data, function (data) {
            console.log(data)
        })
    });

    $("#delete-history").click(function (event) {
        event.preventDefault();
        var token = gettoken();
        var data = JSON.stringify({
            'token': token
        });
        console.log(data)
        postit('/clear_history', data, function (data) {
            console.log(data)
        })
    });

    check_login();
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}