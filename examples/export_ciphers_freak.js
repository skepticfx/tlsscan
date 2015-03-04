// Check support for Export Ciphers.
//https://freakattack.com/

var Tlsscan = require('../');

var tlsscan = new Tlsscan({host: 'businessinsider.com'});
var scanner = tlsscan.run('is_supported_export_ciphers');

scanner.once('end', function(scan){
  if(scan.result == true)
    console.log('Vulnerable to Freak! The website supports export ciphers');
  else
    console.log('Not vulenrable. Does not seem to support export ciphers');
});
