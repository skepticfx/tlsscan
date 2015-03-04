var should = require('should')
var Tlsscan = require('../')

var host = 'google.com';
var port = '443';

describe('check for vulnerabilites', function(){
  this.timeout(5000)
  var options = {}
  options.host = host
  options.port = port
  var scanner = new Tlsscan(options)

  it('CRIME - compression support', function(done){
    var scan = scanner.run('is_supported_compression')
    scan.once('end', function(data){
      data.result.should.be.false
      done()
    })
  })

  it('Secure Renegotiation support', function(done){
    var scan = scanner.run('is_supported_secure_renegotiation')
    scan.once('end', function(data){
      data.result.should.be.true
      done()
    })
  })

  it('Export Ciphers Supported', function(done){
    var scan = scanner.run('is_supported_export_ciphers')
    scan.once('end', function(data){
      data.result.should.be.false
      done()
    })
  })


})
