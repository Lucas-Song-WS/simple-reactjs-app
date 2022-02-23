from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route("/get", methods=["GET"])
def getData():
    conn = sqlite3.connect("test.db")

    cursor = conn.execute("SELECT name, phone_number FROM phonebook")
    data = cursor.fetchall()
    c_list = [{"name": row[0], "phoneno": row[1]} for row in data]
    response = jsonify({"contacts": c_list})
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    conn.close()
    
    return response
    
@app.route("/add", methods=["POST"])
@cross_origin()
def addData():
    conn = sqlite3.connect("test.db")

    dataReceived = request.get_json( )
    name = dataReceived["name"]
    phoneno = dataReceived["phoneno"]
    print(dataReceived)
    print(name, phoneno)
    conn.execute("INSERT INTO phonebook (name, phone_number) VALUES ('" + name + "', " + phoneno + ");")
    
    conn.commit()
    conn.close()
    
    return "Contact added"
    
#@app.route("/setup")
#def resetDB():
#    conn = sqlite3.connect("test.db")
#    
#    conn.execute("DROP TABLE phonebook;")
#    print ("Table dropped")
#    conn.execute("CREATE TABLE phonebook (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone_number INTEGER NOT NULL);")
#    print ("Table created")
#    conn.execute("INSERT INTO phonebook (name, phone_number) VALUES ('Test Person1', 123123123);")
#    conn.execute("INSERT INTO phonebook (name, phone_number) VALUES ('Test Person2', 456456456);")
#    conn.execute("INSERT INTO phonebook (name, phone_number) VALUES ('Test Person3', 789789789);")
#    cursor = conn.execute("SELECT COUNT(*) FROM phonebook")
#    print (cursor.fetchone(), " test rows inserted")
#
#    conn.commit()
#    conn.close()
#    
#    return "Setup complete"

if __name__ == "__main__":
   app.run(debug = True)