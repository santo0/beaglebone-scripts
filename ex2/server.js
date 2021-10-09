//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var b = require('bonescript');
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;


// Create a variable called led, which refers to P9_14
var led = "USR0";
// Initialize the led as an OUTPUT
b.pinMode(led, b.OUTPUT);

// Initialize the server on port 8888
var server = http.createServer(function (req, res) {
    // requesting files
    var file = '.'+((req.url=='/')?'/index.html':req.url);
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
}).listen(8888);

// Loading socket io module
var io = require('socket.io')(server);

// When communication is established
io.on('connection', function (socket) {
    socket.on('changeMode', handleChangeMode);
});

const userLeds = {"USR0":"led0","USR1":"led1","USR2":"led2","USR3":"led3",}
// Change led state when a button is pressed
function handleChangeMode(data) {
    var newData = JSON.parse(data);
    console.log(newData.led + " = " + newData.mode + " >>>" + newData.freq);
    // turns the LED ON or OFF
//    b.digitalWrite(newData.led, newData.state);
    let cmd = "./setleds.sh "+userLeds[newData.led] + " " + newData.mode;
    if (newData.mode == "blink"){
        cmd+= " " + newData.freq;
    }
    console.log(">"+cmd+"<");
    const child_ls = execFile("ls", (error, stdout, stderr) => {
		if(error) {
			console.error('stderr', stderr);
			throw error;
		}
		console.log(stdout);
		});
		   const child_pwd = execFile("pwd", (error, stdout, stderr) => {
		if(error) {
			console.error('stderr', stderr);
			throw error;
		}
		console.log(stdout);
		});
	    const child_whoami = execFile("whoami", (error, stdout, stderr) => {
		if(error) {
			console.error('stderr', stderr);
			throw error;
		}
		console.log(stdout);
		});
/*
    const child = execFile(cmd, (error, stdout, stderr) => {
		if(error) {
			console.error('stderr', stderr);
			throw error;
		}
		console.log(stdout);
		});*/
        const child = spawn('sudo', ['./setleds.sh', userLeds[newData.led], newData.mode, newData.freq]);
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`)
        });
        child.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`)
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`)
        });
}

// Displaying a console message for user feedback
//server.listen(console.log("Server Running ..."));
console.log("Server Running ...");