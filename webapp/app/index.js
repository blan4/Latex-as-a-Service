'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const logger = require('winston');
const fs = require('fs');
const os = require('os');
const path = require('path');
const uuid = require('uuid/v4');
const exec = require('child_process').exec;

const app = express();
app.set('port', config.port);
app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

app.use('/static', express.static(__dirname + '/static'));
app.use('/files', express.static('/tmp'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.render('index'));

app.post('/api/pdf', (req, res) => {
    const file = createTempFile('.tex');
    file.createWriteStream().end(req.body.main);
    const proc = exec(`latexmk -interaction=nonstopmode -pdf -pdflatex=\"pdflatex %O %S\" ${file.name}`, {cwd: file.parentPath}, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            res.send({error: stdout, data: null});
        } else {
            res.send({error: null, data:`/files/${file.name.replace('.tex', '.pdf')}`});
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
});

app.listen(app.get('port'), () => {
    logger.info(`Node app is running port ${app.get('port')}`);
});

function createTempFile(suffix = '') {
  const file = {};
  // file.parentPath = os.tmpdir();
  file.parentPath = '/tmp';
  file.name = uuid() + suffix;
  file.path = path.join(file.parentPath, file.name);
  file.createWriteStream = () => fs.createWriteStream(file.path);
  file.unlink = () => fs.unlink(file.path, (err) => {
    if (err) {
      console.log(`Failed to unlink ${file.path}: ${err}`);
    }
  });
  return file;
}
