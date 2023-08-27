const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/api/notes', (req, res) => {
    // read db.json file and return all saved notes as json
    res.sendFile(path.join(__dirname, '/db/db.json'))
});

function addUniqueId(jsonData) {
    let index = 1;
    for (let item in jsonData) {
        jsonData[item].id = index;
        index++;
    }
    return jsonData;
}

app.post('/api/notes', (req, res) => {
    // receive a new note to save on req body (req.body?)
    // add the note to the db.json file
    // return new note to client
    // give each note a unique id when it is saved
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            // turn the JSON from the db.json file into an object
        
            req.body.id = parsedData.length + 1;
            parsedData.push(req.body);

            fs.writeFile('./db/db.json', JSON.stringify(addUniqueId(parsedData), null, 4), (err) => err ? console.error(err) : res.json(parsedData));
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {
    // receive query parameter containing id of a note to delete
    // read all notes from db.json
    // remove note with the given id property
    // rewrite notes to the db.json file
    // hint: rewrite without the one you don't want (instead of extracting it)
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let parsedData = JSON.parse(data);
            
            parsedData.splice(req.params.id-1, 1);
            parsedData = addUniqueId(parsedData);

            fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) => err ? console.error(err) : res.json(parsedData));
        }
    });
})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
