/*
Name: list_tls_versions
Description: Lists all the supported TLS versions

*/

var scans = require('./index.js');
var watch = require('watchjs').watch;
var events = require('events');


exports.run = function(opts){
  var EE = new events.EventEmitter();

  var tls10 = scans.load('is_supported_tls_1.0').run(opts);
  var tls11 = scans.load('is_supported_tls_1.1').run(opts);
  var tls12 = scans.load('is_supported_tls_1.2').run(opts);
  var result = [];

  // We are asynchronously scanning three things and want to return when the scan count is 3.
  var scan = {};
  scan.count = 0;
  watch(scan, 'count', function(){
    if(scan.count === 3){
      EE.emit('end', {result: result, error: false});
    }
  })



  tls10.on('end', function(data){
    if(data.result === true){
      result.push('tls1.0');
    }
    scan.count++;
  })

  tls11.on('end', function(data){
    if(data.result === true){
      result.push('tls1.1');
    }
    scan.count++;
  })


  tls12.on('end', function(data){
    if(data.result === true){
      result.push('tls1.2');
    }
    scan.count++;
  })


return EE;
}
