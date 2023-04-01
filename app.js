const express = require('express');
const { connectToDb, getDb } = require('./db')
const { ObjectId, ConnectionClosedEvent } = require('mongodb')
const cors=require("cors");
const corsOptions = {
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}



//init app & middle ware 
const app = express();
app.use(express.json())
app.use(cors(corsOptions)) // Use this after the variable declaration

//db connection 
let db;
connectToDb((err) => {
    if(!err){
        console.log('port creation')
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


//fetch requests 
function fetchGet(id){
    console.log('currently in fetch \'/books/fetching\'')
    //https://www.youtube.com/watch?v=cuEtnrL9-H0

    console.log('before fetch')
    let uri = 'http:localhost:3000/books/'.concat(id)
    fetch(uri, {
        method: 'GET',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //     '_id':'63c0f92549d61143c7d2090f'
        // })
    
    })
    .then(res => {
        if(res.ok){
            console.log('successful response')
        }
        else{
            console.log('response was unsuccessful')
        }
        return res.json()
    })
    .then(data => 
        {
            console.log(data)
            response.status(200).json(data)
        })
    .catch(err => console.log(`ERROR ${err}`))

}

app.get('/books/get', (request, response) => {
    console.log('currently in fetch \'/books/fetching\'')
    //https://www.youtube.com/watch?v=cuEtnrL9-H0

    console.log('before fetch')
    let uri = 'http:localhost:3000/books'
    fetch(uri, {
        method: 'GET',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //     '_id':'63c0f92549d61143c7d2090f'
        // })
    
    })
      .then(res => {
        if(res.ok){
            console.log('successful response')
        }
        else{
            console.log('response was unsuccessful')
        }
        return res.json()
    })
      .then(data => 
        {
            console.log(data)
            response.status(200).json(data)
        })
      .catch(err => console.log(`ERROR ${err}`))


})

app.get('/books/post', (request, response) => {
    console.log('currently in fetch \'books/post\'')

    let uri = 'http://localhost:3000/books'
    fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                'title': 'Harry Potter: and the Sorcerer\'s Stone',
                'author': 'J. K. Rowling',
                'pages': 223,
                'genres': ['Novel', 'Children\'s literature', 'Fantasy Fiction', 'High fantasy', 'Adventure fiction', 'Contemporary fantasy']
            })
    })
      .then(res => {
        if(res.ok){
            console.log('successful response to fetch')
        }
        else{
            console.log('unsuccessful fetch')
        }
        return res.json()
      })
      .then(data => {
        console.log(data)
        response.status(200).json(data)
      })
      .catch(err => console.log(`ERROR ${err}`))
})

app.get('books/delete', (request, response) => {
    console.log('currently in fetch books/delete')

    let id = '63ddfa56652a14160a5a4d5e'
    let uri = 'http://localhost:3000/books/63ddfa56652a14160a5a4d5e'

    fetch (uri, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then(res => {
        if(res.ok){
            console.log(`successful fetch deleting book ${id}`)
        }
        else{
            console.log('unsuccesful fetch for book '.concat(id))
        }
        return res.json()
      })
      .then(data => {
        console.log(data)
        response.status(200).json(data)
      })
      .catch(err => console.log(`ERROR for book id: ${id} \n with error ${err}`))
})



// api requests 
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


app.post('/books', (request, response) => {
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

    if(ObjectId(request.params.id) != ""){
        db.collection('books')
            .updateOne({_id: request.params.id}, {$set: updates})
            .then(responseFromUpdate => {
                console.log('completed');
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

console.log('Last line in app.js')


//.find(): returns a cursor object(pointer) that points to the whole set of documents 
//toArray: puts all the objects into an array 
// forEach: iterates the documents one at a time and allowed to process each one individually 
//.find() methods returns objects in batches, not all at once 
