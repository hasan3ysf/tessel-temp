// Taken from Tessel.io wifi and climate examples
var http = require('http');
var tessel = require('tessel');
var climatelib = require('climate-si7005');

var climate = climatelib.use(tessel.port['A']);

climate.on('ready', function () {
  console.log('Connected to si7005');

  // Loop forever
  setImmediate(function loop () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        http.get("http://tesseltemp.azurewebsites.net/io/gettemp/" + temp.toFixed(4) + "/" + humid.toFixed(4), function (res) {
		    console.log('# statusCode', res.statusCode)

		    var bufs = [];
		    res.on('data', function (data) {
		      bufs.push(new Buffer(data));
		      console.log('# received', new Buffer(data).toString());
		    })
		    res.on('close', function () {
		      console.log('done.');
		      setImmediate(loop);
		    })
		  }).on('error', function (e) {
		    console.log('not ok -', e.message, 'error event')
		    setImmediate(loop);
		  });
		console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
        setTimeout(loop, 1000);
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});