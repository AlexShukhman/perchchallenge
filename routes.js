var router = require('express').Router();
var fs = require('fs');
var parse = require('csv-parse');

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/a', (req, res) => {
    res.render('a');
});

router.get('/b', (req, res) => {
    res.render('b');
});

router.get('/getOut', (req, res) => {
    var file = fs.readFileSync('public/output/out.csv');
    parse(file, (err, csv) => { // results in obj in arr: [{}]
        var o = {
            x: [],
            y: [],
            t: []
        };
        for (var i = 0; i < csv.length; i++) {
            var line = csv[i];
            o.x.push((line[0].length != 0)? parseInt(line[0], 10): Number.NEGATIVE_INFINITY);
            o.y.push((line[1].length != 0)? parseInt(line[1], 10): Number.NEGATIVE_INFINITY);
            o.t.push(new Date(line[2]));
        }
        res.send(JSON.stringify(o));
    });
});

router.get('*', (req, res) => {
    res.render('404');
});

module.exports = router;