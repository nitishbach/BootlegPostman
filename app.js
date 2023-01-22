const express = require('express');
const { connectToDb, getDb } = require('./db')
const { ObjectId, ConnectionClosedEvent } = require('mongodb')

//init app & middle ware 
const app = express();
app.use(express.json())

//db connection 
let db;
connectToDb((err) => {
    if(!err){
        console.log('port creation babes')
        //port creation 
        app.listen(3000, () => {
            console.log("app.js listening on port 3000");
        })

        db = getDb();
    }
    if(err){
        console.log(err)
    }
})
//console.log('aoeu')


//routes and route handlers 
app.get('/books', (request, response) => {
    //console.log('5aoeu')
    console.log('getting request to see all books')

    let books = []

    db.collection('books')
        .find() 
        .sort({author: 1})
        .forEach(book => books.push(book))
        .then(() => {
            response.status(200).json(books) //200 meaning all okay 

        })
        .catch(() => {
            console.log('could not fetch docments error ')
            response.status(500).json({error: 'could not fetch the documents'}) //500 means server erro 
        })


    // response.json({msg: "welcome to the api"});
});

app.get('/books/fetching', (request, response) => {
    console.log('currently in app.get(\'/books/fetching\')')
    send.request
})

app.get('/books/:id', (request, response) => {
    console.log(`entered books/id with ${request.params.id}`)


    if(ObjectId.isValid(request.params.id)){
        db.collection('books')
            .findOne({_id: ObjectId(request.params.id)})
            .then(doc => {
                response.status(200).json(doc)
            })
            .catch(err => {
                console.log('could not fetch docments error')
                response.status(500).json({error: 'could not fetch the document'})
            })
    }
    else{
        console.log('not a valid book id')
        response.status(500).json({error: 'not a valid book id '})
    }
})


app.post('/books/:id', (request, response) => {
    const book = request.body

    db.collection('books')
        .insertOne(book)
        .then(responseFromMongo => {
            response.status(201).json(responseFromMongo)
        })
        .catch(err => {
            console.log('could not create new document')
            response.status(500).json({err: 'could not create new document'})
        })
        
    console.log(`posted ${book} into the database`)
})

app.delete('/books/:id', (request, response) => {
    console.log(`deleting book with id: ${request.params.id}`)

    if(ObjectId.isValid(request.params.id)){
        db.collection('books')
            .deleteOne({_id: ObjectId(request.params.id)})
            .then(resultOfDelete => {
                response.status(200).json(resultOfDelete)
            })
            .catch(err => {
                console.log('could not delete the document')
                response.status(500).json({err: 'could not delete the document'})
            })
    }
    else{
        console.log('not a valid docmuent id ')
        response.status(500).json({error: 'not a valid document id '})
    }
})

app.patch('/books/:id', (request, response) => {
    console.log(`patching book with id: ${request.params.id}`)
    const updates = request.body
    console.log(request.body)

    if(ObjectId.isValid(request.params.id)){
        db.collection('books')
            .updateOne({_id: ObjectId(request.params.id)}, {$set: updates})
            .then(responseFromUpdate => {
                response.status(200).json({responseFromUpdate})
            })
            .catch(err => {
                response.status(500).json({err: 'could not update the document'})
            })

    }
    else{
        console.log('id entered is not valid')
        response.status(500).json({error: 'not a valid document id'})
    }
})

console.log('Lastaoeu')


//.find(): returns a cursor object(pointer) that points to the whole set of documents 
//toArray: puts all the objects into an array 
// forEach: iterates the documents one at a time and allowed to process each one individually 
//.find() methods returns objects in batches, not all at once 