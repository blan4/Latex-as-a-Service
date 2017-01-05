'use strict';

const request = require('request');
const fs = require('fs');

fs.readFile('./test/example.tex', (err, data) => {
    if (err) throw err;
    request.post('http://localhost:3000/api/pdf', {
        json: {
            main: data.toString()
        }
    }, (err, res, body) => {
        if (err) throw err;
        console.log(body);
    });
});
