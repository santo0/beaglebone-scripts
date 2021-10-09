//Loading modules
const execFile = require('child_process').execFile;
const exec = require('child_process').execSync;
var http = require('http');
var fs = require('fs');
const spawn = require('child_process').spawn;
var path = require('path');

// Initialize the server on port 8888
var server = http.createServer(function (req, res) {
    // requesting files
    var file = '.'+((req.url=='/')?'/time.html':req.url);
    var fileExtension = path.extname(file);
    var contentType = 'text/html';
    // Uncoment if you want to add css to your web page
    /*
    if(fileExtension == '.css'){
        contentType = 'text/css';
    }*/
    fs.exists(file, function(exists){
        if(exists){
            fs.readFile(file, function(error, content){
                if(!error){
                    // Page found, write content
                    res.writeHead(200,{'content-type':contentType});
                    res.end(content);
                }
            });
        }
        else{
            // Page not found
            res.writeHead(404);
            res.end('Page not found');
        }
    });
}).listen(8888, console.log("Server Running ..."));

// Loading socket io module.
var io = require('socket.io')(server);

// When communication is established
io.on('connection', function (socket) {
	
	// On call from Browser
    socket.on('fetchTime', function handleSensor() {
        var trigger_data="";
        /*
        const child = spawn('cat', ['/sys/class/leds/beaglebone\:green\:usr0/trigger']);
        child.stdout.on('data', (data) => {
            trigger_data=data;
            console.log(`stdout: ${trigger_data}`)
        });
        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`)
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`)
        });
*/
        var result = exec("cat /sys/class/leds/beaglebone\:green\:usr0/trigger");

// convert and show the output.
        trigger_data=result.toString("utf8");
        console.log(trigger_data);
        var re = /\[\w+\]/g;
        var match_data = trigger_data.match(re);
        console.log(`match: ${match_data}`);
        // const cmd = 'cat /sys/class/leds/beaglebone\:green\:usr0/trigger | grep "\b \[\w+\]"'
		

		// Create and send JSON object to browser
		var data = {"led_status": match_data};
		var dataJSON = JSON.stringify(data);
		io.emit('sensorData', dataJSON);
		
	});
});