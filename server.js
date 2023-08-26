const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3001;
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    //res.send('notes')
    //res.render('notes')
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    //res.send('index')
    //res.render('index')
});

app.get('/api/notes', (req, res) => {
    // how to read db.json file and return all saved notes as json?
    res.sendFile(path.join(__dirname, '/db/db.json'))
});

app.post('/api/notes', (req, res) => {
    console.log('req.body: ', req.body)
    // receive a new note to save on req body (req.body?)
    // add the note to the db.json file
    // return new note to client
    // give each note a unique id when it is saved
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Here are the contents of db.json: ', data);
            const parsedData = JSON.parse(data);
          
            parsedData.push(req.body);
            console.log('parsedData: ', parsedData);

            fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
            err ? console.error(err) : console.info(`\nData written to './db/db.json'`)
            );
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {
    // receive query parameter containing id of a note to delete
    // read all notes from db.json
    // remove note with the given id property
    // rewrite notes to the db.json file
    // hint: rewrite without the one you don't want (instead of extracting it)
})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
