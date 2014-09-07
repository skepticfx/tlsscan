/*
Name: is_supported_tls_1.0
Description: Checks whether the server supports TLS version 1.0

*/

var tlsjs = require('tls.js');
var events = require('events');
var net = require('net');

//var provider = tlsjs.provider.node.create();
//var state = tlsjs.state.createDummy();

exports.run = function(opts){
  var EE = new events.EventEmitter();
  var framer = tlsjs.framer.create();
  var parser = tlsjs.parser;

  framer.hello('client', {
    cipherSuites: [
      'TLS_ECDH_anon_WITH_AES_256_CBC_SHA'
    ],
    compressionMethods: ['null', 'deflate']
  });
  console.log(framer)

  var sock = net.connect(opts);
  sock.write("123");

return EE;
}
