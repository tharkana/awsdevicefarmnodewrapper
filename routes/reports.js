var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');


AWS.config.loadFromPath('./config.json');
var devicefarm = new AWS.DeviceFarm();


router.get('/screenshotsPerRun', function(req, res, next) {
	

    var params = {
        arn:  req.query.project + '/' + req.query.run
    };

      devicefarm..listJobs( params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
               
                var deviceArn = [];
                for (var i = 0; i < data.jobs.length; i++) {
                    var device = data.jobs[i].arn.split("/");
                    
                    deviceArn[device[2]] = data.jobs[i].device.name + " " + data.jobs[i].device.os;
                }
                params.type =   req.query.type || 'SCREENSHOT';
                awsService.getAWSClient().listArtifacts(params, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else {
                        
                        var sendarray = {};
                        for (var i = 0; i < data.artifacts.length; i++) {
                            
                            var arn = data.artifacts[i].arn.split("/");
                            if (!sendarray[data.artifacts[i].name]) sendarray[data.artifacts[i].name] = {};
                            sendarray[data.artifacts[i].name][arn[2]] = data.artifacts[i].url;
                        }
                        var screenshots = [];
                        var screenNames = [];
                        var imagesCount = 0;
                        
                        for (var key in sendarray) {
                            
                            screenNames.push(key);
                            screenshots[key] = [];
                            for (var key2 in sendarray[key]) {
                                screenshots[key].push({
                                    name: deviceArn[key2],
                                    url: sendarray[key][key2]
                                });
                                imagesCount++;
                                
                            }
                            
                                    
                        }
                        res.send(
                            {
                                screenNames : screenNames,
                                screenshots : screenshots,
                                imagesCount: imagesCount
                            }
                        );
                        
                    }
                });
            } // successful response
        }); 

});

module.exports = router;