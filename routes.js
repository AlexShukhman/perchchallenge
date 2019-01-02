var router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/a', (req, res) => {
    res.render('a');
});

router.get('/b', (req, res) => {
    res.render('b');
});

router.get('*', (req, res) => {
    res.render('404');
});

module.exports = router;