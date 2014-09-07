/*
Name: is_supported_compression
Description: Checks whether the server supports TLS compression. CRIME vulnerability.

*/

var tlsjs = require('tls.js');
var events = require('events');
var net = require('net');
var tls = require('tls');

var provider = tlsjs.provider.node.create();
var state = tlsjs.state.createDummy({provider: provider});

var ciphers = [
  'TLS_RSA_WITH_AES_256_CBC_SHA',
  'TLS_RSA_WITH_AES_128_CBC_SHA',
  'TLS_RSA_WITH_AES_256_CBC_SHA256',
  'TLS_RSA_WITH_AES_128_CBC_SHA256',
  'TLS_RSA_WITH_DES_CBC_SHA',
  'TLS_RSA_WITH_3DES_EDE_CBC_SHA',
  'TLS_RSA_WITH_RC4_128_MD5',
  'TLS_RSA_WITH_RC4_128_SHA',
  'TLS_RSA_WITH_NULL_SHA',
  'TLS_RSA_WITH_IDEA_CBC_SHA',
  'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
  'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
  'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384'
];

exports.run = function(opts){
  var EE = new events.EventEmitter();
  var framer = tlsjs.framer.create(state);
  var parser = tlsjs.parser.create(state);

  framer.hello('client', {
    cipherSuites: ciphers,
    version: opts.version,
    compressionMethods: ['deflate']
  });

  var sock = net.connect(opts);
  framer.pipe(sock);
  sock.pipe(parser);

  parser.on('readable', function(){
    var res = parser.read();
    if(res.type === 'handshake' && res.handshakeType === 'server_hello'){
      sock.end();
      if(res.compressionMethod.toLowerCase() == 'deflate' )
        EE.emit('end', {result: true});
      else
        EE.emit('end', {result: false});
    } else {
      sock.end();
      if(res.type === 'alert' && res.level === 'fatal' && res.description === 'decode_error')
        EE.emit('end', {result: false});
    }

  })

return EE;
}
