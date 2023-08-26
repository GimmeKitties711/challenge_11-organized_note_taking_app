const express = require('express');
const fs = require('fs');

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'))
});

app.get('/api/notes', (req, res) => {
    // how to read db.json file and return all saved notes as json?
});

app.post('/api/notes', (req, res) => {
    // receive a new note to save on req body (req.body?)
    // add the note to the db.json file
    // return new note to client
    // give each note a unique id when it is saved
})

app.delete('/api/notes/:id', (req, res) => {
    // receive query parameter containing id of a note to delete
    // read all notes from db.json
    // remove note with the given id property
    // rewrite notes to the db.json file
})
