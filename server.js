const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3001;

app.use(express.json());
app.use(express.static('public')); // use the contents of the public folder

// express routing documentation: https://expressjs.com/en/guide/routing.html

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html')) // retrieve the notes page
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html')) // retrieve the home page
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/db/db.json')) // read db.json file and return all saved notes as json
});

function addUniqueId(objData) {
    let index = 1; // ids start at 1
    for (let item in objData) {
        objData[item].id = index;
        index++;
        // for every item in the array of objects, set its id parameter to index then increment index by 1
    }
    return objData;
}
// source for adding an id to each object in an array of objects: https://www.tutorialspoint.com/adding-a-unique-id-for-each-entry-in-json-object-in-javascript

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            let parsedNotes = JSON.parse(data);
            // turn the JSON from the db.json file into an array of objects

            req.body.id = parsedNotes.length + 1;
            // add the id parameter to req.body (an object) and set its value to the length of the object array + 1. for example, if there are already 5 saved notes, the new note will have an id of 6.
            // source for adding a new property to an object: https://stackoverflow.com/questions/1168807/how-can-i-add-a-key-value-pair-to-a-javascript-object
            parsedNotes.push(req.body);
            // add the newest note to the end of parsedNotes

            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => err ? console.error(err) : res.json(parsedNotes));
            // send the response of parsedNotes as JSON so it gets written back to the page when the save button is clicked
            /*
            the question mark is called a ternary operator, and it condenses an if-else statement into one line. it works like this:

            (condition) ? value if condition is true : value if condition is false

            err ? console.error(err) : res.json(parsedNotes)

            means

            if(err) {
                console.error(err)
            } else {
                res.json(parsedNotes)
            }

            source: https://builtin.com/software-engineering-perspectives/javascript-question-mark-operator
            */
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
    // parameters: filename, encoding, callback function. source: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_readfile_file_options_callback
        if (err) {
            console.error(err);
        } else {
            let parsedNotes = JSON.parse(data);

            parsedNotes.splice(req.params.id-1, 1);
            // the ids range from 1 to length but the indexes range from 0 to (length-1). the first parameter of splice is the index to start removing items from the array, and the second parameter is the number of items to be removed. since only one delete button can be clicked at a time, the delete route removes the entry corresponding to the id of the note whose delete button was clicked.
            // source for splice method: https://www.w3schools.com/jsref/jsref_splice.asp
            parsedNotes = addUniqueId(parsedNotes);
            // rewrite the ids of all notes because if any note except the last one was deleted, the ids are no longer going to range from 1 to length, and they need to be kept that way

            // write the new set of notes after deletion back to the JSON file
            fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4), (err) => err ? console.error(err) : res.json(parsedNotes));
            // parameters: filename, data, callback. 'options' has been left blank because the default value of 'encoding' is already 'utf8'. source: https://nodejs.org/dist/latest-v6.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback
            /*
            parameters: JSON.stringify(value, replacer, space)

            value: the value to convert to a JSON string, in this case parsedNotes
            replacer: a function or array that changes the behavior of stringification, in this case null (no changes)
            space: white space used to indent the entries of the output JSON string to make it more readable. in this case, 4 spaces indent each object in the db.json file.

            source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
            */
        }
    });
})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
  // listen on PORT 3001
);
