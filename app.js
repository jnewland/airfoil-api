var util = require('util');
var express = require('express');
var morgan = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var applescript = require('applescript');

var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'";
app.use(morgan(logFormat));
app.use(bodyParser.text({type: '*/*'}));

app.get('/speakers', function(req, res){
  var script = "" +
  "tell application \"Airfoil\"\n" +
  "set myspeakers to get every speaker\n" +
  "set allSpeakers to {}\n" +
  "repeat with currentSpeaker in myspeakers\n" +
  "  set thisSpeaker to {}\n" +
  "  set conn to connected of currentSpeaker\n" +
  "  copy conn to the end of thisSpeaker\n" +
  "  set volum to volume of currentSpeaker\n" +
  "  copy volum to the end of thisSpeaker\n" +
  "  set nm to name of currentSpeaker\n" +
  "  copy nm to the end of thisSpeaker\n" +
  "  set spkId to id of currentSpeaker\n" +
  "  copy spkId to the end of thisSpeaker\n" +
  "  set AppleScript's text item delimiters to \",\"\n" +
  "  set speakerText to thisSpeaker as text\n" +
  "  set AppleScript's text item delimiters to \"\"\n" +
  "  copy speakerText to the end of allSpeakers\n" +
  "end repeat\n" +
  "set AppleScript's text item delimiters to \"|\"\n" +
  "set speakerText to allSpeakers as text\n" +
  "set AppleScript's text item delimiters to \"\"\n" +
  "get speakerText\n" +
  "end tell";

  applescript.execString(script, function(error, result) {
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

app.listen(process.env.PORT || 8080);
