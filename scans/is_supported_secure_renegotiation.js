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
    extensions: [
      {
        type: 'renegotiation_info',
        body: new Buffer([0x00])
      }
    ]
  });

  var sock = net.connect(opts);
  framer.pipe(sock);
  sock.pipe(parser);

  parser.on('readable', function(){
    var res = parser.read();
    if(res.type === 'handshake' && res.handshakeType === 'server_hello'){
      sock.end();
      if(res.extensions.renegotiation_info && res.extensions.renegotiation_info.size === 1 )
        EE.emit('end', {result: true});
      else
        EE.emit('end', {result: false});
    }

  })

return EE;
}

/*
Reference: http://tools.ietf.org/html/rfc5746#section-3.4
3.4.  Client Behavior: Initial Handshake

   Note that this section and Section 3.5 apply to both full handshakes
   and session resumption handshakes.

   o  The client MUST include either an empty "renegotiation_info"
      extension, or the TLS_EMPTY_RENEGOTIATION_INFO_SCSV signaling
      cipher suite value in the ClientHello.  Including both is NOT
      RECOMMENDED.

   o  When a ServerHello is received, the client MUST check if it
      includes the "renegotiation_info" extension:

      *  If the extension is not present, the server does not support
         secure renegotiation; set secure_renegotiation flag to FALSE.
         In this case, some clients may want to terminate the handshake
         instead of continuing; see Section 4.1 for discussion.

      *  If the extension is present, set the secure_renegotiation flag
         to TRUE.  The client MUST then verify that the length of the
         "renegotiated_connection" field is zero, and if it is not, MUST
         abort the handshake (by sending a fatal handshake_failure
         alert).

         Note: later in Section 3, "abort the handshake" is used as
         shorthand for "send a fatal handshake_failure alert and
         terminate the connection".

   o  When the handshake has completed, the client needs to save the
      client_verify_data and server_verify_data values for future use.



*/
