
const { MongoClient } = require('mongodb');

let dbConnection;
const PASSWORD = "password"
let uri = `mongodb+srv://winterProject:${PASSWORD}@cluster0.efpugpj.mongodb.net/test`

module.exports = {
    connectToDb: (cb) => {

        console.log('trying to connect to uri')
        
        MongoClient.connect(uri)
        .then((client) => {


                console.log('succesfully connected to uri')
                dbConnection = client.db()


                return cb()
            })
            .catch(err => {
                console.log(`this is connectToDb err ${err}`)
                return cb(err)
            })
    },

    getDb: () => dbConnection
}

//cb: call back function
