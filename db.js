
const { MongoClient } = require('mongodb');

let dbConnection;
let uri = 'mongodb+srv://winterProject:SanjeevIsACutie@cluster0.efpugpj.mongodb.net/test'
//let uri2 = 'mongodb+srv://winterProject:sanjeevIsACutie@cluster0.efpugpj.mongodb.net/?retryWrites=true&w=majority'

module.exports = {
    connectToDb: (cb) => {
//console.log('aoeu12')
        console.log('trying to connect to uri')
        
        MongoClient.connect(uri)
        .then((client) => {
//console.log('aoeu12')

                console.log('succesfully connected to uri')
                dbConnection = client.db()
//console.log('aoeu12')

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
