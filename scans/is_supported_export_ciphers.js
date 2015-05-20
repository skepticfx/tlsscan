/*
Name: is_supported_export_ciphers
Description: Checks whether the server supports any export ciphers

*/

var tlsjs = require('tls.js');
var events = require('events');
var net = require('net');
var tls = require('tls');

var provider = tlsjs.provider.node.create();
var state = tlsjs.state.createDummy({provider: provider});

// Taken from https://www.openssl.org/docs/apps/ciphers.html#Additional-Export-1024-and-other-cipher-suites
var ciphers = [
  'SSL_RSA_EXPORT_WITH_RC4_40_MD5',
  'SSL_RSA_EXPORT_WITH_RC2_CBC_40_MD5',
  'SSL_RSA_EXPORT_WITH_DES40_CBC_SHA',
  'SSL_DH_DSS_EXPORT_WITH_DES40_CBC_SHA',
  'SSL_DH_RSA_EXPORT_WITH_DES40_CBC_SHA',
  'SSL_DHE_DSS_EXPORT_WITH_DES40_CBC_SHA',
  'SSL_DHE_RSA_EXPORT_WITH_DES40_CBC_SHA',
  'SSL_DH_anon_EXPORT_WITH_RC4_40_MD5',
  'SSL_DH_anon_EXPORT_WITH_DES40_CBC_SHA',
  
  // TLS 1.0 ciphers
  'TLS_RSA_EXPORT_WITH_RC4_40_MD5',
  'TLS_RSA_EXPORT_WITH_RC2_CBC_40_MD5',
  'TLS_RSA_EXPORT_WITH_DES40_CBC_SHA',
  'TLS_DH_DSS_EXPORT_WITH_DES40_CBC_SHA',
  'TLS_DH_RSA_EXPORT_WITH_DES40_CBC_SHA',
  'TLS_DHE_DSS_EXPORT_WITH_DES40_CBC_SHA',
  'TLS_DHE_RSA_EXPORT_WITH_DES40_CBC_SHA',
  'TLS_DH_anon_EXPORT_WITH_RC4_40_MD5',
  'TLS_DH_anon_EXPORT_WITH_DES40_CBC_SHA',

  // Additional export Ciphers
  'TLS_RSA_EXPORT1024_WITH_DES_CBC_SHA',
  'TLS_RSA_EXPORT1024_WITH_RC4_56_SHA',
  'TLS_DHE_DSS_EXPORT1024_WITH_DES_CBC_SHA',
  'TLS_DHE_DSS_EXPORT1024_WITH_RC4_56_SHA'
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
