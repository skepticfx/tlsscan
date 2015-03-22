var fs = require('fs');
var debug = require('debug')('scans');


exports.load_all = function(){
  // Load all scans from ./scans
  var scans = {};
  var scanFiles = fs.readdirSync(__dirname);
  debug('loaded all scan files');

  scanFiles.forEach(function(x){
    if(x === 'index.js') return;
    scans[x.replace('.js', '')] = require('./'+x);
  })

return scans;
}

exports.load = function(scan_type){
  if(fs.existsSync(__dirname + '' + scan_type+'.js')){
    return require('./'+scan_type+'.js');
  }else{
    console.log('The specified scan: ' + scan_type + ' is not found in the scan list.');
    process.exit(1);
    return -1;
  }
}
