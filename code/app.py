from flask import Flask, request, redirect, make_response
from flask_mysqldb import MySQL
from flask import jsonify
import json, secrets
import sys
from smtplib import SMTP_SSL as SMTP
from email.mime.text import MIMEText
app = Flask(__name__, template_folder='.')

# Configuration of the database connection

app.config['MYSQL_HOST'] = '127.0.0.1'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'job_advertisements'

# KEY for hash password
KEY = "Axbd22wf3whcCLEO9uoaCpok_JArmPw_guS_FGBb4sI="

# create connection to database
mysql = MySQL(app)

###############################functions support################################




################################### API ###################################

############################ INDEX ########################################

@app.route('/secret')
def secret():
    if request.cookies.get("user_id") == "59":
        return jsonify("Hello world"), 200
    return "", 404


############################ READ ######################################

@app.route('/read', methods=['GET'])
def index_read():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM advertisements;")
    record = cur.fetchall()
    cur.execute("SELECT * FROM companies;")
    record2 = cur.fetchall()
    mysql.connection.commit()
    cur.close()
    res = []
    res.append(record)
    res.append(record2)
    return jsonify(res)

@app.route('/read/<string:table>', methods=['GET'])
def index_read_with_table(table):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM {};".format(table))
    record = cur.fetchall()
    return jsonify(record)

@app.route('/read/<string:table>/<int:id>', methods=['GET'])
def index_read_with_table_id(table, id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM {} WHERE id={};".format(table, id))
    record = cur.fetchall()
    return jsonify(record)

@app.route('/read/<string:table>/<string:condition>', methods=['GET'])
def index_read_with_table_condition(table, condition):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM {} WHERE {};".format(table, condition))
    record = cur.fetchall()
    return jsonify(record)

@app.route('/read/show_tables', methods=['GET'])
def show_tables():
    cur = mysql.connection.cursor()
    cur.execute("SHOW TABLES;")
    record = cur.fetchall()
    return jsonify(record)

############################ CREATE ######################################

def make_query_exc_insert(datas, columns, table):
    res = "INSERT INTO {}(".format(table)
    for i in  range (1,len(columns)):
        if (columns[i][0] == "key_api"):
            continue
        res += "{}".format(columns[i][0])
        res += ","
    res = res[0:len(res) - 1]
    res += ') VALUES('
    for x in datas:
        res += "'{}'".format(x)
        res += ","
    res = res[0:len(res) - 1]
    res += ');'
    return res

@app.route('/create/<string:table>', methods=['GET', 'POST'])
def creat(table):
    cur = mysql.connection.cursor()
    cur.execute("SHOW COLUMNS FROM {};".format(table))
    record = cur.fetchall()
    mysql.connection.commit()
    cur.close()
    return jsonify(record)

@app.route('/create/<string:table>/insert', methods=['GET', 'POST'])
def creat_insert(table):
    datas = []
    cur = mysql.connection.cursor()
    cur.execute("SHOW COLUMNS FROM {};".format(table))
    columns = cur.fetchall()
    for i in  range (1,len(columns)):
        if (columns[i[0]] == "key_api"):
            continue
        datas.append(request.json.get('{}'.format(columns[i][0])))
    query = make_query_exc_insert(datas, columns, table)
    try:
        cur.execute(query)
        mysql.connection.commit()
        cur.close()
        return jsonify("SUCCESS"), 201
    except Exception:
        return jsonify("ERROR"), 403
    
############################DELETE######################################

def make_query_exc_delete(table, id):
    res = "DELETE FROM {} WHERE id={}".format(table, id)
    return res

def make_query_exc_delete_condition(table, condition):
    res = "DELETE FROM {} WHERE {}".format(table, condition)
    return res

@app.route('/delete/<string:table>/<int:id>', methods=['GET', 'POST'])
def delete_with_id(table, id):
    cur = mysql.connection.cursor()
    query = make_query_exc_delete(table, id)
    try:
        cur.execute(query)
        mysql.connection.commit()
        cur.close()
        return jsonify("SUCCESS"), 201
    except Exception:
        return jsonify("ERROR"), 403

@app.route('/delete/<string:table>/<string:condition>', methods=['GET', 'POST'])
def delete_with_condition(table, condition):
    cur = mysql.connection.cursor()
    query = make_query_exc_delete_condition(table, condition)
    try:
        cur.execute(query)
        mysql.connection.commit()
        cur.close()
        return jsonify("SUCCESS"), 201
    except Exception:
        return jsonify("ERROR"), 403
    

############################UPDATE######################################

def make_query_exc_update(datas, columns, table, id):
    res = "UPDATE {} SET ".format(table)
    for i in  range (1,len(columns)):
        res += "{} = '{}'".format(columns[i][0], datas[i - 1])
        res += ","
    res = res[0:len(res) - 1]
    res += ' WHERE id={};'.format(id)
    return res

def make_query_exc_update_condition(datas, columns, table, condition):
    res = "UPDATE {} SET ".format(table)
    for i in  range (1,len(columns)):
        res += "{} = '{}'".format(columns[i][0], datas[i - 1])
        res += ","
    res = res[0:len(res) - 1]
    res += ' WHERE {};'.format(condition)
    return res

@app.route('/update/<string:table>', methods=['GET', 'POST'])
def update(table):
    cur = mysql.connection.cursor()
    cur.execute("SHOW COLUMNS FROM {};".format(table))
    record = cur.fetchall()
    mysql.connection.commit()
    cur.close()
    return jsonify(record)

@app.route('/update/<string:table>/<int:id>', methods=['GET', 'POST'])
def update_insert(table, id):
    datas = []
    cur = mysql.connection.cursor()
    cur.execute("SHOW COLUMNS FROM {};".format(table))
    columns = cur.fetchall()
    for i in  range (1,len(columns)):
        datas.append(request.json.get('{}'.format(columns[i][0])))
    query = make_query_exc_update(datas, columns, table, id)
    try:
        cur.execute(query)
        mysql.connection.commit()
        cur.close()
        return jsonify("SUCCESS"), 201
    except Exception:
        return jsonify("ERROR"), 403

@app.route('/update/<string:table>/<string:condition>', methods=['GET', 'POST'])
def update_insert_condition(table, condition):
    fernet = Fernet(KEY.encode())
    datas = []
    cur = mysql.connection.cursor()
    cur.execute("SHOW COLUMNS FROM {};".format(table))
    columns = cur.fetchall()
    for i in  range (1,len(columns)):
        if (columns[i][0] == "password"):
            password = request.json.get("password")
            cur.execute("SELECT password FROM {} WHERE {};".format(table, condition))
            record = cur.fetchall()
            if (record):
                if (request.json.get("new_password")):
                    if (fernet.decrypt(record[0][0].encode()).decode() == password):
                        new_password = request.json.get("new_password")
                        datas.append(fernet.encrypt(new_password.encode()).decode())
                        continue
                    else:
                        return jsonify("ERROR"), 401
                else:
                    enter_password = request.json.get("enter_password")
                    if (enter_password != fernet.decrypt(record[0][0].encode()).decode()):
                        return jsonify("ERROR"), 401
        datas.append(request.json.get('{}'.format(columns[i][0])))
    query = make_query_exc_update_condition(datas, columns, table, condition)
    try:
        cur.execute(query)
        mysql.connection.commit()
        cur.close()
        return jsonify("SUCCESS"), 201
    except Exception:
        return jsonify("ERROR"), 403
    

#########################################################################
#################################### FORM API ##################################################
 
@app.route('/apply', methods=['POST'])
def get_form():
    email = request.json.get('email')
    name = request.json.get('name')
    lastname = request.json.get('first_name')
    phone = request.json.get('phone')
    motivation = request.json.get('motivation')
    id_post = request.json.get('id_post')
    
    send_mail(name, lastname, email, phone, motivation)
    cur = mysql.connection.cursor()
    try:
        cur.execute("SELECT id FROM candidats WHERE email='{}'".format(email))
        cur.connection.commit()
        record = cur.fetchall()
        if (len(record) == 0):
            cur.execute("INSERT INTO candidats( name, first_name, email, tel) VALUES ('{}', '{}', '{}', '{}');".format(name, lastname, email, phone))
            cur.connection.commit()
            cur.close()
        else:
            try:
                cur.execute("SELECT * FROM candidats_jobs WHERE candidats_id={} AND advertisements_id={}".format(record[0][0], id_post))
                record_job = cur.fetchall()
                if (len(record_job) > 0):
                    return jsonify(error = "apllyed already"), 403
                cur.execute("INSERT INTO candidats_jobs (candidats_id, advertisements_id, motivation) VALUES ({}, {}, '{}');".format(int(record[0][0]), int(id_post), motivation))
                cur.connection.commit()
                cur.close()
            except:
                    return jsonify(error = "apllyed already"), 403
        return jsonify("The candidat has been added"), 201
    except:
        return jsonify(error = "Error has occured"), 400

@app.route('/apply/user', methods=['POST', 'GET'])
def apply_user():
    key_api = request.json.get('key_api')
    motivation = request.json.get('motivation')
    id_post = request.json.get('id_post')
    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM peoples WHERE key_api='{}'".format(key_api))
    record = cur.fetchall()
    if (len(record) != 0):
        cur.execute("SELECT advertisements_id FROM people_jobs WHERE peoples_id={}".format(int(record[0][0])))
        record_peoples_jobs = cur.fetchall()
        if (len(record_peoples_jobs) != 0):
            for x in record_peoples_jobs:
                if (int(x[0]) == int(id_post)):
                    return jsonify(error = "apllyed already"), 403
            try:
                cur.execute("INSERT INTO people_jobs (peoples_id, advertisements_id, motivation) VALUES ({}, {}, '{}');".format(int(record[0][0]), int(id_post), motivation))
                cur.connection.commit()
                cur.close()
                return jsonify("The candidat has been added"), 201
            except:
                return jsonify(error = "Error has occured"), 400
        else:
            try:
                cur.execute("INSERT INTO people_jobs (peoples_id, advertisements_id, motivation) VALUES ({}, {}, '{}');".format(int(record[0][0]), int(id_post), motivation))
                cur.connection.commit()
                cur.close()
                return jsonify("The candidat has been added"), 201
            except:
                return jsonify(error = "Error has occured"), 400
    return jsonify(error = "Error has occured"), 400


@app.route('/test', methods=['POST', 'GET'])
def test():
    cur = mysql.connection.cursor()

    cur.execute("SELECT id FROM peoples WHERE id>10;")
    record = cur.fetchall()
    return jsonify(record)

        

#################################### END FORM API ################################################
#################################### LOGIN #######################################################

@app.route('/login', methods=['POST', 'GET'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    cur = mysql.connection.cursor()
    fernet = Fernet(KEY.encode())
    key_api = secrets.token_urlsafe(26)
    cur.execute("UPDATE peoples SET key_api = '{}' where email = '{}';".format(key_api, email))
    mysql.connection.commit()
    cur.execute("SELECT id, password, role, key_api from peoples where email = '{}'".format(email))
    record = cur.fetchall()
    cur.close()
    if record and fernet.decrypt(record[0][1].encode()).decode() == password:
        return jsonify(record), 201
    return jsonify(""), 403

    
#################################### END LOGIN ###################################################

#################################### SIGNUP #######################################################

from cryptography.fernet import Fernet
 
# we will be encryting the below string.
#decMessage = fernet.decrypt(encMessage).decode()
@app.route('/signup', methods=['POST', 'GET'])
def signup():
    email = request.json.get('email')
    password = request.json.get('password')
    password_confirm = request.json.get('password_confirm')
    name = request.json.get('name')
    first_name = request.json.get('first_name')
    phone = request.json.get('phone')
    
    
    if password == password_confirm:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * from peoples where email = '{}'".format(email))
        record = cur.fetchall()
        if record:
            return jsonify("The email is already used"),401
        #try:   
        fernet = Fernet(KEY.encode())
        encrypted_password = fernet.encrypt(password.encode())
        cur.execute("INSERT INTO peoples( name, first_name, email, password, role, phone, key_api) VALUES ('{}', '{}', '{}', '{}', 'client', '{}', '');".format(name, first_name, email, encrypted_password.decode(), phone))
        cur.connection.commit()
        cur.close()
        return "",201
    else:
        return "",400

#################################### END SIGNUP ###################################################
def send_mail(name, lastname, email, phone, motivation):
    smtp_server = "smtp.ionos.fr"
    sender = "python@enari.fr"
    destination = ["python@enari.fr", "zozowbij@gmail.com"]

    content = """\
    name : %s
    lastname : %s
    email : %s
    phone : %s
    motivation : %s
    """ % (name, lastname, email, phone, motivation)

    subject = "Hello from Python"

    try:
        msg = MIMEText(content, "plain")  # plain, xml, html
        msg["Subject"] = subject
        msg["From"] = sender
        conn = SMTP(smtp_server)
        conn.set_debuglevel(False)
        conn.login("python@enari.fr", "Zozo1205%")
        try:
            conn.sendmail(sender, destination, msg.as_string())
        finally:
            conn.quit()
    except:
        sys.exit("mail failed; %s" % "ERROR")

if __name__ == '__main__':
    app.debug = True
    app.run()