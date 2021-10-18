/////////////////////IDENTIFIANT///////////////////

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
                    if (data[0][5] !== 'admin') {
                        document.cookie = "key_api_check_admin=true"
                    }
                    $("#user-name").html(`<strong class="text-white">${data[0][2]} ${data[0][3]}</strong>`);
                    $("#user-names").html(`<strong class="text-white">${data[0][2]} ${data[0][3]}</strong>`);
                }
            });
        }
    } else {
        for (var i = 1; i < lists_cookie.length; i++) {
            if (lists_cookie[i][0] === "api_key") {
                $.getJSON(`http://127.0.0.1:5000/read/peoples/key_api='${lists_cookie[i][1]}'`, function(data) {
                    if (data.length > 0) {
                        if (data[0][5] !== 'admin') {
                            document.cookie = "key_api_check_admin=true"
                        }
                        $("#user-name").html(`<strong>${data[0][2]} ${data[0][3]}</strong>`);
                        $("#user-names").html(`<strong class="text-white">${data[0][2]} ${data[0][3]}</strong>`);
                    }
                });
            }
        }
    }
}
display_user_connected()
    /////////////FUNCTION SUPPORT//////////////////

function get_number_in_str(str) {
    var res = "0"
    for (var i = 0; i < str.length; i++) {
        if (str[i] >= "0" && str[i] <= "9")
            res += str[i];
    }
    return (parseInt(res));
}


//////////////////////////READ///////////////////////////
function read_table(table) {
    $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(columns) {
        board = '<table class="table table_admin_border"><thead class="bg-dark text-light table_head_admin"><tr>';
        for (var i = 0; i < columns.length; i++) {
            board += `<th scope="col">${columns[i][0]}</th>`;
        }
        board += "</tr></thead>"
        $.getJSON(`http://127.0.0.1:5000/read/${table}`, function(data) {
            for (var i = 0; i < data.length; i++) {
                board += "<tr>"
                for (var j = 0; j < data[i].length; j++) {
                    board += `<td>${data[i][j]}</td>`;
                }
                board += "</tr>"
            }
            $(".table-to-work").html(board);
        });
    });
}

///////////////////////////////////////CREATE/////////////////////////////////////////

function make_selection(table_name) {
    table = table_name.substring(0, table_name.length - 3);
    test = $.getJSON(`http://127.0.0.1:5000/read/${table}`, function(columns) {
        select = `<select name="${table_name}">`;
        select += '<option value="">--Please choose an option--</option>';
        for (var i = 0; i < columns.length; i++) {
            if (table == "candidats") {
                select += `<option value="${columns[i][0]}">${columns[i][3]}</option>`;
            } else {
                select += `<option value="${columns[i][0]}">${columns[i][1]}</option>`;
            }
        }
        select += '</select>';

    });
}

function create_operation(table, formData) {
    if (table === "peoples") {
        $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(data) {
            var obj_send = {};
            var list_datas = [];

            for (var i = 1; i < data.length; i++) {
                list_datas.push(formData.get(data[i][0]));
            }

            var xhr = new XMLHttpRequest();
            var url = "http://127.0.0.1:5000/signup";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 201) {
                    create_in_table(table);
                }
            };
            for (var i = 1; i < data.length; i++) {
                obj_send[`${data[i][0]}`] = list_datas[i - 1];
            }
            obj_send[`password_confirm`] = formData.get("password_confirm");
            var data_send = JSON.stringify(obj_send);
            xhr.send(data_send);
        });
    } else {
        $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(data) {
            var obj_send = {};
            var list_datas = [];
            for (var i = 1; i < data.length; i++) {
                list_datas.push(formData.get(data[i][0]));
            }
            var xhr = new XMLHttpRequest();
            var url = `http://127.0.0.1:5000/create/${table}/insert`;
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 201) {
                    create_in_table(table);
                }
            };
            for (var i = 1; i < data.length; i++) {
                obj_send[`${data[i][0]}`] = list_datas[i - 1];
            }
            var data_send = JSON.stringify(obj_send);
            xhr.send(data_send);
        });
    }
}

function create_cas_table_peoples(table) {
    $.getJSON(`http://127.0.0.1:5000/create/peoples`, function(columns) {
        board = '<form class="row" style="margin-top: 20px;" action="" method="post" id="myForm">';
        for (var i = 1; i < columns.length; i++) {
            board += `<div class="form-group col">`
            board += `<label>${columns[i][0]}:</label>`;
            if (columns[i][0] == "password") {
                board += `<input class="form-control" type="password" name="${columns[i][0]}">`;
                board += `<label>password_confirm:</label>`;
                board += `<input class="form-control" type="password" name="password_confirm">`;
            } else {
                if (parseInt(columns[i][1].substring(7, columns[i][1].length - 1), 10) > 250)
                    board += `<input class="form-control" type="text" name="${columns[i][0]}">`;
                else
                    board += `<textarea class="form-control" name="${columns[i][0]}"></textarea>`;
            }
            board += "</div>";
        }
        board += `<input class="btn btn-danger" style="margin-top: 20px;" type="submit" name="send" value="create">`;
        board += "</form>";
        $(".table-to-work").html(board);
        const myForm = document.getElementById("myForm");
        myForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const formData = new FormData(myForm);
            create_operation(table, formData);
        });
    });
}

function create_in_table(table) {
    if (table === "peoples") {
        create_cas_table_peoples(table);
    } else {
        $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(columns) {
            board = '<form class="row" style="margin-top: 20px;" action="" method="post" id="myForm">';
            if (table.includes("_jobs")) {
                var a = 0;
            } else {
                var a = 1;
            }
            for (i = a; i < columns.length; i++) {
                board += `<div class="form-group col"><label>${columns[i][0]}:</label>`;
                if (columns[i][1] === "datetime") {
                    board += `<input class="form-control" type="date" name="${columns[i][0]}">`;
                } else if (columns[i][1] === "int") {
                    board += `<input class="form-control" type="number" name="${columns[i][0]}">`;
                } else {
                    if (parseInt(columns[i][1].substring(7, columns[i][1].length - 1), 10) > 250)
                        board += `<input class="form-control" type="text" name="${columns[i][0]}">`;
                    else
                        board += `<textarea class="form-control" name="${columns[i][0]}"></textarea>`;
                }
                board += "</div>";
            }
            board += `<input class="btn btn-danger" style="margin-top: 20px;" type="submit" name="send" value="create">`;
            board += "</form>";
            $(".table-to-work").html(board);
            const myForm = document.getElementById("myForm");
            myForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const formData = new FormData(myForm);
                create_operation(table, formData);
            });
        });
    }
}

/////////////////////////DELETE///////////////////////////////////////////////

function delete_operation(table, id) {
    var obj_send = {};
    var xhr = new XMLHttpRequest();
    var url = `http://127.0.0.1:5000/delete/${table}/${id}`;

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 201) {
            delete_in_table(table);
        }
    };
    var data_send = JSON.stringify(obj_send);
    xhr.send(data_send);
}

function delete_in_table(table) {
    $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(columns) {
        board = '<table class="table table_admin_border"><thead class="bg-dark text-light table_head_admin"><tr>';
        for (var i = 0; i < columns.length; i++) {
            board += `<th>${columns[i][0]}</th>`;
        }
        board += `<th>action</th>`;
        board += "</tr></thead>"
        $.getJSON(`http://127.0.0.1:5000/read/${table}`, function(data) {
            for (var i = 0; i < data.length; i++) {
                board += "<tr>"
                for (var j = 0; j < data[i].length; j++) {
                    board += `<td>${data[i][j]}</td>`;
                }
                board += `<td><button class="btn btn-dark" name="id"  value="${data[i][0]}" onclick="delete_operation('${table}', ${data[i][0]})">delete</button>`;
                board += "</td></tr>";
            }
            board += "</table>";
            $(".table-to-work").html(board);
        });
    });
}

////////////////////////////////UPDATE//////////////////////////////////////

function update_operation(table, id, formData) {
    $.getJSON(`http://127.0.0.1:5000/update/${table}`, function(data) {
        var obj_send = {};
        var list_datas = [];
        for (var i = 1; i < data.length; i++) {
            list_datas.push(formData.get(data[i][0]));
        }
        var xhr = new XMLHttpRequest();
        var url = `http://127.0.0.1:5000/update/${table}/${id}`;
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 201) {
                update_in_table(table);
            }
        };
        for (var i = 1; i < data.length; i++) {
            obj_send[`${data[i][0]}`] = list_datas[i - 1];
        }
        var data_send = JSON.stringify(obj_send);
        xhr.send(data_send);
    });
}

function display_update_table(table, id) {
    $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(columns) {
        list_columns = [];
        type_columns = [];
        board = '<table class="table table_admin_border"><thead class="bg-dark text-light table_head_admin"><tr>';
        for (var i = 0; i < columns.length; i++) {
            board += `<th scope="col">${columns[i][0]}</th>`;
            list_columns.push(columns[i][0]);
            type_columns.push(columns[i][1]);
        }
        board += `<th scope="col">action</th>`;
        board += "</tr></thead>"
        $.getJSON(`http://127.0.0.1:5000/read/${table}`, function(data) {
            board += "<tbody>";
            for (var i = 0; i < data.length; i++) {
                board += "<tr>"
                if (data[i][0] === id) {
                    id = data[i][0];
                    board += `<form data-role='save-label' method='post' id='form_update' action=''></form>`;
                    for (var j = 0; j < data[i].length; j++) {
                        if (type_columns[j] === "datetime") {
                            board += `<td><input  class="form-control" form="form_update" type="date" name="${list_columns[j]}" value="${data[i][j]}"></td>`;
                        } else if (type_columns[j] === "int") {
                            board += `<td><input  class="form-control" form="form_update" type="number" name="${list_columns[j]}" value="${data[i][j]}"></td>`;
                        } else {
                            if (get_number_in_str(type_columns[j]) > 250)
                                board += `<td><div class="form-group"><textarea  class="form-control" form="form_update" name="${list_columns[j]}">${data[i][j]}</textarea></div></td>`;
                            else
                                board += `<td><input class="form-control" form="form_update" type="text" name="${list_columns[j]}" value="${data[i][j]}"></td>`;
                        }
                    }
                    board += `<input class="form-control" form="form_update" type="hidden" name="id_to_update" value="${data[i][0]}">`;
                    board += `<td><input class="form-control btn btn-dark" form="form_update" type="submit" name="update" value="done"></td>`;
                    board += '</tr>';
                } else {
                    for (var j = 0; j < data[i].length; j++) {
                        board += `<td>${data[i][j]}</td>`;
                    }
                    board += `<td><button class="btn btn-info" name="id" value="${data[i][0]}" onclick="display_update_table('${table}', ${data[i][0]})">update</button>`;
                    board += "</td></tr>";
                }
            }
            board += "</form></tbody></table>";
            $(".table-to-work").html(board);
            const form_update = document.getElementById("form_update");
            form_update.addEventListener("submit", function(e) {
                e.preventDefault();
                const formData = new FormData(form_update);
                update_operation(table, id, formData);
            });
        });
    });
}

function update_in_table(table) {
    $.getJSON(`http://127.0.0.1:5000/create/${table}`, function(columns) {
        board = '<table class="table table_admin_border"><thead class="bg-dark text-light table_head_admin"><tr>';
        for (var i = 0; i < columns.length; i++) {
            board += `<th>${columns[i][0]}</th>`;
        }
        board += `<th>action</th>`;
        board += "</tr></thead>"
        $.getJSON(`http://127.0.0.1:5000/read/${table}`, function(data) {
            for (var i = 0; i < data.length; i++) {
                board += "<tr>"
                for (var j = 0; j < data[i].length; j++) {
                    board += `<td>${data[i][j]}</td>`;
                }
                board += `<td><button class="btn btn-info" name="id" value="${data[i][0]}" onclick="display_update_table('${table}', ${data[i][0]})">update</button>`;
                board += "</td></tr>";
            }
            board += "</table>";
            $(".table-to-work").html(board);
        });
    });
}

/////////////////////////////////////////////////
function call_function_action(table, action) {
    if (action === "read") {
        read_table(table);
    } else if (action === "create") {
        create_in_table(table);
    } else if (action === "update") {
        update_in_table(table);
    } else if (action === "delete") {
        delete_in_table(table);
    }
}

function show_list_tables(action) {
    $(".table-to-work").html("");
    $.getJSON(`http://127.0.0.1:5000/read/show_tables`, function(tables) {
        list_tables = "";
        for (var i = 0; i < tables.length; i++) {
            list_tables += ` <button type="button" onclick="call_function_action('${tables[i][0]}','${action}')" class="btn btn-danger" >${tables[i][0]}</button>`
        }
        document.getElementById("admin_panel_title").style.display = 'none';
        $("#create_function").html(`<h1 class="display-1">${action}</h1>`);
        $(".list-table").html(list_tables);

    });
}

/////////////////////////////////////////////////////////
/********************** NAV *****************************/
function openNav() {
    document.getElementById("sidenav").style.display = "block";
}

function closeNav() {
    document.getElementById("sidenav").style.display = "none";
}
/********************** END NAV ************************/