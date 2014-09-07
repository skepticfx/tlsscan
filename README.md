tlsscan
=======

Testing TLS servers for weakness

````
var Tlsscan = require('tlsscan');
var scanner = new Tlsscan({host: '127.0.0.1'});

var scan = scanner.run('is_supported_tls_1.0');

scan.on('end', function(data){
  if(data.result === true){
    console.log('The server supports TLS 1.0');
  } else {
    console.log('The server does not support TLS 1.0');
  }
})

````

#### List of scans
* is_supported_tls_1.0
* is_supported_tls_1.1
* is_supported_tls_1.2
* is_supported_ssl_3.0


* list_tls_versions


#### Return types
* {error: false, result: Boolean}
* {error: false, result: []}
Whatever is appropriate.