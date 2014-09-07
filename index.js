var fs = require('fs');
var debug = require('debug');
var scans = require('./scans');
// Load all scans from ./scans
scans = scans.load_all();

var Tlsscan = function(opts){
  this.options = {};
  this.options.host = opts.host || '127.0.0.1';
  this.options.port = opts.port || 443;
}

Tlsscan.prototype.run = function(scan_type){
  if(Object.keys(scans).indexOf(scan_type) === -1){
    debug('Scan type not found.');
    return -1;
  }

  var EE = scans[scan_type].run(this.options);

return EE;
}


module.exports = Tlsscan;
