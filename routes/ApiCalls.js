var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./config.json');
var devicefarm = new AWS.DeviceFarm();


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.get('/projects', function(req, res, next) {
    devicefarm.listProjects({}, function(err, data) {
        console.log('\n\n\n');
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            res.send(data);
        } // successful response
    });
});

router.get('/runs', function(req, res, next) {
    var params = {
        arn: req.query.arn + req.query.project
    };

    devicefarm.listRuns(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            res.send(data);
        } // successful response
    });
});



router.get('/jobs', function(req, res, next) {
    var params = {
        arn: req.query.arn + req.query.project + '/' + req.query.run
    };

    devicefarm.listJobs(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            res.send(data);
        } // successful response
    });
});


router.get('/suites', function(req, res, next) {
    var params = {
        arn: req.query.arn + req.query.project + '/' + req.query.run + '/' + req.query.job
    };

    devicefarm.listSuites(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            res.send(data);
        } // successful response
    });
});


router.get('/test', function(req, res, next) {
    var params = {
        arn: req.query.arn + req.query.project + '/' + req.query.run + '/' + req.query.job + '/' + req.query.suite
    };

    devicefarm.listTests(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            res.send(data);
        } // successful response
    });
});


router.get('/artifacts', function(req, res, next) {
    var arn = "";
    
    if (req.query.job) arn += "/" + req.query.job;
    if (req.query.suite) arn += "/" + req.query.suite;
    if (req.query.test) arn += "/" + req.query.test;
    var params = {
        arn: req.query.arn + req.query.project + '/' + req.query.run + arn,
        type: req.query.type || 'SCREENSHOT'
    };
    
    devicefarm.listArtifacts(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data);
            res.send(data);
        } // successful response
    });
});

module.exports = router;