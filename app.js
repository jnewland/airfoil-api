var util = require('util');
var express = require('express');
var morgan = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var applescript = require('applescript');
var fs = require('fs');

var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'";
app.use(morgan(logFormat));
app.use(bodyParser.text({type: '*/*'}));


app.get('/speakers', function(req, res){
  fs.readFile("speakers.scpt", "utf8", function(err, data) {
    if (err) throw err;
    applescript.execString(data, function(error, result) {
      if (error) {
        res.json({error: error});
      } else {
        var speakers = [];
        var speakerText = result.split("|");
        speakerText.map(function(s) {
          var t = s.split(",");
          speakers.push({ connected: t[0], volume: parseFloat(t[1]), name: t[2], id: t[3] });
        });
        res.json(speakers);
      }
    });
  });
});

app.post('/speakers/:id/connect', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set myspeaker to first speaker whose id is \"" + req.params.id + "\"\n";
  script += "connect to myspeaker\n";
  script += "delay 0.5\n";
  script += "connect to myspeaker\n";
  script += "delay 0.5\n";
  script += "connect to myspeaker\n";
  script += "delay 0.5\n";
  script += "connected of myspeaker\n";
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id, connected: result})
    }
  });
});

app.post('/speakers/:id/disconnect', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set myspeaker to first speaker whose id is \"" + req.params.id + "\"\n";
  script += "disconnect from myspeaker\n";
  script += "connected of myspeaker\n";
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id, connected: result})
    }
  });
});

app.post('/speakers/:id/volume', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set myspeaker to first speaker whose id is \"" + req.params.id + "\"\n";
  script += "set (volume of myspeaker) to " + parseFloat(req.body) + "\n";
  script += "volume of myspeaker\n";
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error, body: req.body});
    } else {
      res.json({id: req.params.id, volume: parseFloat(result)})
    }
  });
});

app.get('/audio_source', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "get name of current audio source\n"
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({audio_source: result})
    }
  });
});

app.post('/device_source', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set current audio source to first device source whose name is \"" + req.body + "\"\n";
  script += "get name of current audio source\n"
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({audio_source: result})
    }
  });
});

app.get('/now_playing', function(req, res){
  fs.readFile("now_playing.scpt", "utf8", function(err, data) {
    if (err) throw err;
    applescript.execString(data, function(error, result) {
      if (error) {
        res.json({error: error});
      } else {
        if (result == "") {
          res.json({playing: false});
        } else {
          var info = result.split("|");
          res.json({
            playing: true,
            artist: info[0],
            album: info[1],
            track: info[2]
          });
        }
      }
    });
  });
});

app.post('/next', function (req, res) {
  var script = "tell application \"Airfoil Satellite\" to next";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({success: true});
    }
  });
});

app.post('/previous', function (req, res) {
  var script = "tell application \"Airfoil Satellite\" to previous";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({success: true});
    }
  });
});

app.post('/playpause', function (req, res) {
  var script = "tell application \"Airfoil Satellite\" to playpause";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({success: true});
    }
  });
});

app.listen(process.env.PORT || 8080);
