'use strict';

const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const csurf = require('csurf');

const options = {};
const flag = fs.readFileSync('./flag', 'utf-8').trim();
const docHtml = fs.readFileSync('./src/index.html', 'utf-8');
app.disable('x-powered-by');
app.use(csurf());
app.use(function (req, res, next) {
    res.locals.csrftoken = req.session._csrf;
    next();
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(docHtml);
});

app.post('/echo', (req, res) => {
    const out = {
        userID: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        time: Date.now()
    };

    _.merge(out, req.body);

    if (options.flag) {
        out.flag = flag;
    } else {
        out.flag = 'disabled';
    }

    res.json(out);
    process.exit(0);
});

app.listen(8000);
