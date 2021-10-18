////// function support

function check_if_cookie_check_amin_exist(lists_cookie) {
    for (var i = 0; i < lists_cookie.length; i++) {
        if (lists_cookie[i][0] === "key_api_check_admin")
            return false;
    }
    return true;
}

function display_user_connected() {
    var cookie = document.cookie;
    var lists_cookie = [];
    cookie = cookie.split("; ");
    for (var i = 0; i < cookie.length; i++)
        lists_cookie[i] = cookie[i].split("=");
    if (lists_cookie.length == 1 && lists_cookie[0].length === 2) {
        if (lists_cookie[0][0] == "api_key") {
            $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[0][1]}'`, function(data) {
                if (data.length > 0) {
                    if (data[0][5] === "admin") {
                        window.location.replace(`/check_cookie?key_api_check_admin=true`);
                    }
                    $("#button-connextion").html(`<a class="nav-link colorFont fs-5" href="/profile">${data[0][2]} ${data[0][3]}</a>`);
                    $("#button-connextionn").html(`<a class="nav-link colorFont fs-5" href="/profile">${data[0][2]} ${data[0][3]}</a>`);
                    var popup_user = '<div class="popup-content">'
                    popup_user += '<span class="close-button">&times;</span>'
                    popup_user += '<div class="popup-form container">'
                    popup_user += '<h1 style="text-align: center;"> Contact the company</h1>'
                    popup_user += '<h6 style="text-align: center; color: red; "> Fill out the following form so that the company can contact you </h6><br>'
                    popup_user += '<form id="candidateForm" action="" method="get" class="row" style="text-align: center;">'
                    popup_user += '<div class="form-group marginform">'
                    popup_user += '<label for="motivation" > Motivation </label>'
                    popup_user += '<textarea id="motivation" name="motivation" class="form-control"></textarea></div>'
                    popup_user += '<div class="id-post"></div>'
                    popup_user += '<br><div class="form-check">'
                    popup_user += '<input class="btn btn-danger" id="form_popup" type="submit" value="Send!" />'
                    popup_user += '</div></form></div></div>'
                    $("#popup").html(popup_user)
                    const candidateForm = document.getElementById("candidateForm");
                    if (candidateForm) {
                        //var xhr = new XMLHttpRequest();
                        candidate_for_user(candidateForm, lists_cookie[0][1])
                    }
                }
            });
        }
    } else {
        for (var i = 0; i < lists_cookie.length; i++) {
            if (lists_cookie[i][0] === "api_key") {
                key_api = lists_cookie[i][1];
                $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[i][1]}'`, function(data) {
                    if (data.length > 0) {
                        if (data[0][5] === "admin") {
                            if (check_if_cookie_check_amin_exist(lists_cookie))
                                window.location.replace(`/check_cookie?key_api_check_admin=true`);
                            var username = "";
                            username = `<h2 class="text-dark" style="text-align: center;">${data[0][2]} ${data[0][3]}</h2>`
                            $("#user-name").html(username);
                        }
                        $("#button-connextion").html(`<a class="nav-link colorFont fs-5" href="/profile">${data[0][2]} ${data[0][3]}</a>`);
                        $("#button-connextionn").html(`<a class="nav-link colorFont fs-5" href="/profile">${data[0][2]} ${data[0][3]}</a>`);
                        var popup_user = '<div class="popup-content">'
                        popup_user += '<span class="close-button">&times;</span>'
                        popup_user += '<div class="popup-form container">'
                        popup_user += '<h1 style="text-align: center;"> Contact the company</h1>'
                        popup_user += '<h6 style="text-align: center; color: red; "> Fill out the following form so that the company can contact you </h6><br>'
                        popup_user += '<form id="candidateForm" action="" method="get" class="row" style="text-align: center;">'
                        popup_user += '<div class="form-group marginform">'
                        popup_user += '<label for="motivation" > Motivation </label>'
                        popup_user += '<textarea id="motivation" name="motivation" class="form-control"></textarea></div>'
                        popup_user += '<div class="id-post"></div>'
                        popup_user += '<br><div class="form-check">'
                        popup_user += '<input class="btn btn-danger" id="form_popup" type="submit" value="Send!" />'
                        popup_user += '</div></form></div></div>'
                        $("#popup").html(popup_user)
                        const candidateForm = document.getElementById("candidateForm");
                        if (candidateForm) {
                            candidate_for_user(candidateForm, key_api)
                        }
                        return;
                    }
                });
            }
        }
    }
}
display_user_connected();

function candidate_for_user(candidateForm, key_api) {
    var close = document.getElementsByClassName("close-button")[0];
    if (close) {
        close.onclick = function() {
            popup.style.display = "none";
        };
    }
    candidateForm.addEventListener("submit", function(e) {
        e.preventDefault();

        var popup = document.getElementById("popup");
        var alert_success = document.getElementById("alert_success")
        var alert_error = document.getElementById("alert_error")
        var alert_warning = document.getElementById("alert_warning")
        const formData = new FormData(this);
        motivation = formData.get("motivation");
        id_post = formData.get("id_post");

        var xhr = new XMLHttpRequest();
        var url = "http://127.0.0.1:5000/apply/user";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 201) {
                popup.style.display = "none";
                alert_error.style.display = "none"
                alert_success.style.display = "block"
                alert_warning.style.display = "none"
                setTimeout(() => {
                    alert_success.style.display = "none"
                }, 6000);
            } else if (xhr.status === 403) {
                popup.style.display = "none";
                alert_error.style.display = "none"
                alert_warning.style.display = "block"
                setTimeout(() => {
                    alert_warning.style.display = "none"
                }, 6000);
            } else {
                alert_success.style.display = "none"
                alert_error.style.display = "block"
                alert_warning.style.display = "none"
                setTimeout(() => {
                    alert_error.style.display = "none"
                }, 6000);
            }
        }
        var data = JSON.stringify({ motivation, id_post: id_post, key_api: key_api });
        xhr.send(data);
    });
}

function logout() {
    document.cookie = "api_key= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "to_login= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "key_api_check_admin= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.replace('/');
}

/////////////////////////////INFO USER PROFILE//////////////////////////////
function display_info_user() {
    var cookie = document.cookie;
    var lists_cookie = [];
    cookie = cookie.split("; ");
    for (var i = 0; i < cookie.length; i++)
        lists_cookie[i] = cookie[i].split("=");
    if (lists_cookie.length == 1 && lists_cookie[0].length === 2) {
        if (lists_cookie[0][0] == "api_key") {
            $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[0][1]}'`, function(data) {
                if (data.length > 0) {
                    info_user = `<p><label>First name : </label> <strong>${data[0][3]}</strong></p>`;
                    info_user += `<p><label>Last name : </label> <strong>${data[0][2]}</strong></p>`;
                    info_user += `<p><label>Email : </label> <strong>${data[0][1]}</strong></p>`;
                    info_user += `<p><label>Phone : </label> <strong>${data[0][7]}</strong></p>`;
                    document.getElementById("profile").classList.add('active');
                    document.getElementById("modify_informations").classList.remove('active');
                    document.getElementById("modify_password").classList.remove('active');
                    $(".info-user").html(info_user);
                }
            });
        }
    } else {
        for (var i = 0; i < lists_cookie.length; i++) {
            if (lists_cookie[i][0] === "api_key") {
                $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[i][1]}'`, function(data) {
                    if (data.length > 0) {
                        if (data.length > 0) {
                            info_user = `<p><label>First name : </label> <strong>${data[0][3]}</strong></p>`;
                            info_user += `<p><label>Last name : </label> <strong>${data[0][2]}</strong></p>`;
                            info_user += `<p><label>Email : </label> <strong>${data[0][1]}</strong></p>`;
                            info_user += `<p><label>Phone : </label> <strong>${data[0][7]}</strong></p>`;
                            document.getElementById("profile").classList.add('active');
                            document.getElementById("modify_informations").classList.remove('active');
                            document.getElementById("modify_password").classList.remove('active');
                            $(".info-user").html(info_user);
                        }
                    }
                });
            }
        }
    }

}

function modify_info_user() {
    var cookie = document.cookie;
    var lists_cookie = [];
    cookie = cookie.split("; ");
    for (var i = 0; i < cookie.length; i++)
        lists_cookie[i] = cookie[i].split("=");
    if (lists_cookie.length == 1 && lists_cookie[0].length === 2) {
        if (lists_cookie[0][0] == "api_key") {
            api_key = lists_cookie[0][1]
            $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[0][1]}'`, function(data) {
                if (data.length > 0) {
                    form_modify_user = '<form action="" method="post" id="modify_info_user">'
                    form_modify_user += `<div class="form-group marginform"><label>First name : </label><input class="form-control" type="text" name="name" value="${data[0][3]}"></div>`
                    form_modify_user += `<div class="form-group marginform"><label>Last name : </label><input class="form-control" type="text" name="lastname" value="${data[0][2]}"></div>`
                    form_modify_user += `<div class="form-group marginform"><label>Phone : </label><input class="form-control" type="text" name="phone" value="${data[0][7]}"></div>`
                    form_modify_user += `<div class="form-group marginform"><label>Email : </label><input class="form-control" type="text" name="email" value="${data[0][1]}"></div>`
                    form_modify_user += `<div class="form-group marginform"><label>Enter password : </label><input class="form-control" type="password" name="enter_password"></div>`
                    form_modify_user += `<div class="form-group marginform"><input class="form-control" type="hidden" name="key_api" value="${api_key}"></div>`
                    form_modify_user += `<div class="form-group marginform"><input class="form-control" type="hidden" name="password" value="${data[0][4]}"></div>`
                    form_modify_user += `<div class="form-group marginform"><input class="form-control" type="hidden" name="role" value="${data[0][5]}"></div>`
                    form_modify_user += `<div class="form-check"><input class="btn btn-danger form-control" type="submit" name="modify" value="Modify"></div>`
                    form_modify_user += "</form>"
                    document.getElementById("profile").classList.remove('active');
                    document.getElementById("modify_informations").classList.add('active');
                    document.getElementById("modify_password").classList.remove('active');
                    $(".info-user").html(form_modify_user);
                    const modify_info_user = document.getElementById("modify_info_user");
                    update_info_user(modify_info_user)
                }
            });
        }
    } else {
        for (var i = 0; i < lists_cookie.length; i++) {
            if (lists_cookie[i][0] === "api_key") {
                api_key = lists_cookie[i][1]
                $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[i][1]}'`, function(data) {
                    if (data.length > 0) {
                        form_modify_user = '<form action="" method="post" id="modify_info_user">'
                        form_modify_user += `<div class="form-group marginform"><label>First name : </label><input class="form-control" type="text" name="name" value="${data[0][3]}"></div>`
                        form_modify_user += `<div class="form-group marginform"><label>Last name : </label><input class="form-control" type="text" name="lastname" value="${data[0][2]}"></div>`
                        form_modify_user += `<div class="form-group marginform"><label>Phone : </label><input class="form-control" type="text" name="phone" value="${data[0][7]}"></div>`
                        form_modify_user += `<div class="form-group marginform"><label>Email : </label><input class="form-control" type="text" name="email" value="${data[0][1]}"></div>`
                        form_modify_user += `<div class="form-group marginform"><label>Enter password : </label><input class="form-control" type="password" name="enter_password"></div>`
                        form_modify_user += `<div class="form-group marginform"><input class="form-control" type="hidden" name="key_api" value="${api_key}"></div>`
                        form_modify_user += `<div class="form-group marginform"><input class="form-control" type="hidden" name="password" value="${data[0][4]}"></div>`
                        form_modify_user += `<div class="form-group marginform"><input class="form-control" type="hidden" name="role" value="${data[0][5]}"></div>`
                        form_modify_user += `<div class="form-check"><input class="btn btn-danger form-control" type="submit" name="modify" value="Modify"></div>`
                        form_modify_user += "</form>"
                        document.getElementById("profile").classList.remove('active');
                        document.getElementById("modify_informations").classList.add('active');
                        document.getElementById("modify_password").classList.remove('active');
                        $(".info-user").html(form_modify_user);
                        const modify_info_user = document.getElementById("modify_info_user");
                        update_info_user(modify_info_user)
                    }
                });
            }
        }
    }
}

function update_info_user(modify_info_user) {
    if (modify_info_user) {
        modify_info_user.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            email = formData.get("email");
            name = formData.get("name");
            first_name = formData.get("lastname");
            phone = formData.get("phone");
            password = formData.get("password");
            enter_password = formData.get("enter_password");
            role = formData.get("role");
            key_api = formData.get("key_api");
            var xhr = new XMLHttpRequest();
            var url = `http://127.0.0.1:5000/update/peoples/key_api='${key_api}'`;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 201) {
                    success = '<div id="alert_error" class="alert alert-success" role="alert"> Successfully save your new information </div>';
                    $(".modify-message").html(success);
                } else if (xhr.status === 403) {
                    error = '<div id="alert_error" class="alert alert-danger" role="alert"> An error has occurred, please try again </div>';
                    $(".modify-message").html(error);
                } else if (xhr.status === 401) {
                    error = '<div id="alert_error" class="alert alert-danger" role="alert"> The current password is incorect! please try again! </div>';
                    $(".modify-message").html(error);
                }
            };
            var data = JSON.stringify({ email: email, name: name, first_name: first_name, phone: phone, password: password, role: role, key_api: key_api, enter_password: enter_password });
            xhr.send(data);
        });
    }
}

function modify_password() {
    var cookie = document.cookie;
    var lists_cookie = [];
    cookie = cookie.split("; ");
    for (var i = 0; i < cookie.length; i++)
        lists_cookie[i] = cookie[i].split("=");
    if (lists_cookie.length == 1 && lists_cookie[0].length === 2) {
        if (lists_cookie[0][0] == "api_key") {
            api_key = lists_cookie[0][1]
            $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[0][1]}'`, function(data) {
                if (data.length > 0) {
                    form_password = '<form action="" method="post" id="change_password">'
                    form_password += `<div class="form-group marginform"><lable>Current password : </label><input class="form-control" name="password" type="password"><br></div>`
                    form_password += `<div class="form-group marginform"><lable>New password : </label><input class="form-control" name="new_password" type="password"><br></div>`
                    form_password += `<div class="form-group marginform"><input class="form-control" type="hidden" name="key_api" value="${api_key}"></div>`
                    form_password += `<div class="form-group marginform"><input class="form-control" type="hidden" name="name" value="${data[0][3]}"></div>`
                    form_password += `<div class="form-group marginform"><input class="form-control" type="hidden" name="lastname" value="${data[0][2]}"></div>`
                    form_password += `<div class="form-group marginform"><input class="form-control" type="hidden" name="email" value="${data[0][1]}"></div>`
                    form_password += `<div class="form-group marginform"><input class="form-control" type="hidden" name="phone" value="${data[0][7]}"></div>`
                    form_password += `<div class="form-group marginform"><input class="form-control" type="hidden" name="role" value="${data[0][5]}"></div>`
                    form_password += `<div class="form-group marginform"><lable>Confirm now password : </label><input class="form-control" name="confirm_new_password" type="password"></div>`
                    form_password += `<div class="form-group marginform"><input class="form-control btn btn-danger" type="submit" name="modify" value="Modify"></div>`
                    form_password += "</form>"
                    document.getElementById("profile").classList.remove('active');
                    document.getElementById("modify_informations").classList.remove('active');
                    document.getElementById("modify_password").classList.add('active');
                    $(".info-user").html(form_password);
                    const change_password = document.getElementById("change_password");
                    update_password_user(change_password)
                }
            });
        }
    } else {
        for (var i = 0; i < lists_cookie.length; i++) {
            if (lists_cookie[i][0] == "api_key") {
                api_key = lists_cookie[i][1]
                $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[i][1]}'`, function(data) {
                    if (data.length > 0) {
                        if (data.length > 0) {
                            form_password = '<form action="" method="post" id="change_password">'
                            form_password += `<lable>Current password : </label><input class="form-control" name="password" type="password">`
                            form_password += `<lable>New password : </label><input class="form-control" name="new_password" type="password">`
                            form_password += `<input type="hidden" name="key_api" value="${api_key}">`
                            form_password += `<input type="hidden" name="name" value="${data[0][3]}">`
                            form_password += `<input type="hidden" name="lastname" value="${data[0][2]}">`
                            form_password += `<input type="hidden" name="email" value="${data[0][1]}">`
                            form_password += `<input type="hidden" name="phone" value="${data[0][7]}">`
                            form_password += `<input type="hidden" name="role" value="${data[0][5]}">`
                            form_password += `<lable>Confirm now password : </label><input class="form-control" name="confirm_new_password" type="password">`
                            form_password += `<input class="btn btn-danger" type="submit" name="modify" value="Modify">`
                            form_password += "</form>"
                            document.getElementById("profile").classList.remove('active');
                            document.getElementById("modify_informations").classList.remove('active');
                            document.getElementById("modify_password").classList.add('active');
                            $(".info-user").html(form_password);
                            const change_password = document.getElementById("change_password");
                            update_password_user(change_password)
                        }
                    }
                });
            }
        }
    }
    //event
}

function update_password_user(modify_info_user) {
    if (modify_info_user) {
        modify_info_user.addEventListener("submit", function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            email = formData.get("email");
            name = formData.get("name");
            first_name = formData.get("lastname");
            phone = formData.get("phone");
            password = formData.get("password");
            new_password = formData.get("new_password");
            confirm_new_password = formData.get("confirm_new_password");
            role = formData.get("role");
            key_api = formData.get("key_api");
            if (new_password !== confirm_new_password) {
                error = '<div id="alert_error" class="alert alert-danger" role="alert"> New password and its comfirm are not the same! please try again!</div>';
                $(".modify-message").html(error);
                return
            }
            var xhr = new XMLHttpRequest();
            var url = `http://127.0.0.1:5000/update/peoples/key_api='${key_api}'`;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 201) {
                    success = '<div id="alert_error" class="alert alert-success" role="alert"> Successfully save your new information </div>';
                    $(".modify-message").html(success);
                } else if (xhr.status === 403) {
                    error = '<div id="alert_error" class="alert alert-danger" role="alert"> The current password is incorect! please try again! </div>';
                    $(".modify-message").html(error);
                } else if (xhr.status === 401) {
                    error = '<div id="alert_error" class="alert alert-danger" role="alert"> The current password is incorect! please try again! </div>';
                    $(".modify-message").html(error);
                }
            };
            var data = JSON.stringify({ email: email, name: name, first_name: first_name, phone: phone, password: password, role: role, key_api: key_api, new_password: new_password });
            xhr.send(data);
        });
    }
}
////////////////////////////////////////////////////////////////////////////
function find_comapnie_photo(companies, id) {
    for (var i = 0; i < companies.length; i++)
        if (id == companies[i][0])
            return companies[i][4]
}

function create_operation(table, formData) {
    $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(data) {
        var obj_send = {};
        var list_datas = [];
        for (var i = 1; i < data[0].length; i++) {
            list_datas.push(formData.get(data[i][0]));
        }
        var xhr = new XMLHttpRequest();
        var url = `http://127.0.0.1:5000/create/${table}/insert`;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 201) {}
        };
        for (var i = 1; i < data[0].length; i++) {
            obj_send[`${data[i][0]}`] = list_datas[i - 1];
        }
        var data_send = JSON.stringify(obj_send);
        xhr.send(data_send);
    });
}

function update_operation(table, id, formData) {
    $.getJSON(`http://127.0.0.1:5000/update/${table}`, function(data) {
        var obj_send = {};
        var list_datas = [];
        for (var i = 1; i < data[0].length; i++) {
            list_datas.push(formData.get(data[i][0]));
        }
        var xhr = new XMLHttpRequest();
        var url = `http://127.0.0.1:5000/update/${table}/${id}`;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {}
        };
        for (var i = 1; i < data[0].length; i++) {
            obj_send[`${data[i][0]}`] = list_datas[i - 1];
        }
        var data_send = JSON.stringify(obj_send);
        xhr.send(data_send);
    });
}

function delete_operation(table, id, FormData) {
    var obj_send = {};
    var xhr = new XMLHttpRequest();
    var url = `http://127.0.0.1:5000/delete/${table}/${id}`;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {}
    };
    var data_send = JSON.stringify(obj_send);
    xhr.send(data_send);
}
///// read more button

function show_more(id) {
    if (document.getElementById(`button${id}`).value == "read more") {
        document.getElementById(`dots${id}`).style.display = 'none';
        document.getElementById(`more${id}`).style.display = 'contents';
        document.getElementById(`button${id}`).value = "read less"
        document.getElementById(`apply_button${id}`).style.display = 'contents';
    } else {
        document.getElementById(`dots${id}`).style.display = 'contents';
        document.getElementById(`more${id}`).style.display = 'none';
        document.getElementById(`button${id}`).value = "read more"
        document.getElementById(`apply_button${id}`).style.display = 'none';
    }
}

//API


/////display advertisements

$.getJSON('http://127.0.0.1:5000/read', function(data) {
    var announcement = "";
    for (var i = 0; i < data[0].length; i++) {
        announcement += '<div class="flexx" style="padding: 0%;">'
        announcement += '<img src="' + find_comapnie_photo(data[1], data[0][i][5]) + '" style=" width: 70%; margin-left: 15%; "></img>'
        announcement += '<div style="padding: 15px !important;">'
        announcement += '<h1 class="font-title" >' + data[0][i][1] + '</h1>'
        announcement += '<p>' + data[0][i][2].substring(0, 90) + '<span class="dots" id="dots' + i + '">...</span><span class="more" id="more' + i + '">'
        announcement += data[0][i][2].substring(90, data[0][i][2].length) + '</span><br>'
        announcement += `<input type="submit" class="btn btn-outline-danger read" value="read more" id="button${i}" onclick="show_more('${i}')"><span class="apply" id="apply_button${i}"><button class="btn btn-outline-danger apply-button" id="open-popup-button" onclick="display_popup(${data[0][i][0]})">Apply</button></span></p></div></div>`
    }
    $(".borderline").html(announcement);
});


/********************* FORM *****************************/

const candidateForm = document.getElementById("candidateForm");
if (candidateForm) {
    candidateForm.addEventListener("submit", function(e) {
        e.preventDefault();

        var popup = document.getElementById("popup");
        var alert_success = document.getElementById("alert_success")
        var alert_error = document.getElementById("alert_error")
        var alert_warning = document.getElementById("alert_warning")
        const formData = new FormData(this);
        motivation = formData.get("motivation");
        id_post = formData.get("id_post");

        name = formData.get("name");
        lastname = formData.get("lastname");
        email = formData.get("email");
        phone = formData.get("phone");

        var xhr = new XMLHttpRequest();
        var url = "http://127.0.0.1:5000/apply";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 201) {
                popup.style.display = "none";
                alert_error.style.display = "none"
                alert_success.style.display = "block"
                alert_warning.style.display = "none"
                setTimeout(() => {
                    alert_success.style.display = "none"
                }, 6000);
            } else if (xhr.status === 403) {
                popup.style.display = "none";
                alert_error.style.display = "none"
                alert_warning.style.display = "block"
                setTimeout(() => {
                    alert_warning.style.display = "none"
                }, 6000);
            } else {
                alert_success.style.display = "none"
                alert_error.style.display = "block"
                alert_warning.style.display = "none"
                setTimeout(() => {
                    alert_error.style.display = "none"
                }, 6000);
            }
        }
        var data = JSON.stringify({ email: email, name: name, first_name: lastname, phone: phone, motivation: motivation, id_post: id_post });
        xhr.send(data);
    });
}


/********************* END FORM *************************/

/********************* POPUP ****************************/
// Get the popup
var popup = document.getElementById("popup");
// Get the button that opens the popup
var button = document.getElementById("open-popup-button");
// Get the <span> element that closes the popup
var close = document.getElementsByClassName("close-button")[0];
// When the user clicks the button, open the popup

function display_popup(id_post) {
    popup.style.display = "block";
    $(".id-post").html(`<input type="hidden" name="id_post" value="${id_post}">`);
    // When the user clicks on X, close the popup
}

if (popup) {
    close.onclick = function() {
        popup.style.display = "none";
    };
    // click anywhere else the popup close it
    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    };
}

/********************* END POPUP ****************************/

/********************* LOGIN ****************************/
const connection = document.getElementById("connection");

if (connection) {
    connection.addEventListener("submit", function(e) {
        e.preventDefault();

        const formData = new FormData(this);

        email = formData.get("email");
        password = formData.get("password");

        var xhr = new XMLHttpRequest();
        var url = "http://127.0.0.1:5000/login";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 201) {
                var response = JSON.parse(this.responseText);
                user_id_connection = response[0][3];
                window.location.replace(`/set_cookie/?key_api=${user_id_connection}`);
                document.cookie = "to_login= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                return response[0][0];
            } else if (xhr.status === 403) {
                error = '<div id="alert_error" class="alert alert-danger" role="alert"> Wrong login or password </div>';
                $(".error_connection").html(error);
            }
        };
        var data = JSON.stringify({ email: email, password: password });
        xhr.send(data);
    });
}


/********************* END LOGIN ****************************/
/********************* SIGNUP ****************************/

const signup = document.getElementById("signup");

if (signup) {
    signup.addEventListener("submit", function(e) {
        e.preventDefault();

        const formData = new FormData(this);

        email = formData.get("email");
        password = formData.get("password");
        password_confirm = formData.get("password_confirm");
        name = formData.get("name");
        lastname = formData.get("lastname");
        phone = formData.get("phone");

        var xhr = new XMLHttpRequest();
        var url = "http://127.0.0.1:5000/signup";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 201) {
                window.location.replace(`/login`);
            } else if (xhr.status === 401) {
                error = '<div id="alert_error" class="alert alert-danger" role="alert"> This email already exist. Choose another one. </div>';
                document.getElementById("same_email").innerHTML = error;
            } else if (xhr.status === 400) {
                error_password = '<div id="alert_error" class="alert alert-danger" role="alert"> Passwords are differents </div>';
                document.getElementById("same_email").innerHTML = error_password;
            }

        };
        var data = JSON.stringify({ email: email, name: name, first_name: lastname, password: password, password_confirm: password_confirm, phone: phone });
        xhr.send(data);
    });
}



/********************* END S ****************************/

