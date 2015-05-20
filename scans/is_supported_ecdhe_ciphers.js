/*
 Name: is_supported_ecdhe_ciphers
 Description: Checks whether the server supports any ECDHE ciphers

 */

var tlsjs = require('tls.js');
var events = require('events');
var net = require('net');
var tls = require('tls');

var provider = tlsjs.provider.node.create();
var state = tlsjs.state.createDummy({provider: provider});


// Taken from http://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml, excluding weak modes like NULL, RC4, DES. Also, excluded PSK.
var ciphers = [
'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA',
'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA',
'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256',
'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384',
'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'
];


exports.run = function(opts){
  var EE = new events.EventEmitter();
  var framer = tlsjs.framer.create(state);
  var parser = tlsjs.parser.create(state);

  framer.hello('client', {
    cipherSuites: ciphers,
    maxVersion: opts.version
  });

  var sock = net.connect(opts);
  sock.setTimeout(4000);
  sock.on('timeout', function(){
    EE.emit('end', {result: 'error', reason: 'timeout'});
  });
  sock.on('error', function(err){
    EE.emit('end', {result: 'error', reason: err});
  })

  framer.pipe(sock);
  sock.pipe(parser);

  // Server can send a FIN as well, if it doesn't support the ciphers
  sock.on('end', function(){
    EE.emit('end', {result: false});
  })

  // Server can send an ALERT message and(or) can reset the connection.
  parser.on('readable', function(){
    var res = parser.read();
    if(res.type === 'alert' && res.level === 'fatal' && res.description === 'handshake_failure'){
      EE.emit('end', {result: false});
    }
    if(res.type === 'handshake' && res.handshakeType === 'server_hello'){
      EE.emit('end', {result: true}); // Definitely supports Export ciphers
    }
    EE.emit('end', {result: true}); // I think it still supports export ciphers since there was no handshake_failure.
  })
  return EE;
}
