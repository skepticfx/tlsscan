var should = require('should')
var Tlsscan = require('../')

var host = 'google.com'

describe('check support for TLS versions', function(){
  this.timeout(5000)
  var options = {}
  options.host = host
  var scanner = new Tlsscan(options)

  it('TLS 1.0', function(done){
    var scan = scanner.run('is_supported_tls_1.0')
    scan.once('end', function(data){
      data.result.should.be.true
      done()
    })
  })

  it('TLS 1.1', function(done){
    var scan = scanner.run('is_supported_tls_1.1')
    scan.once('end', function(data){
      data.result.should.be.true
      done()
    })
  })

  it('TLS 1.2', function(done){
    var scan = scanner.run('is_supported_tls_1.2')
    scan.once('end', function(data){
      data.result.should.be.true
      done()
    })
  })

  it('List of supported TLS versions', function(done){
    var scan = scanner.run('list_tls_versions')
    scan.once('end', function(data){
      data.result.should.be.an.Array
      data.result.should.containEql('tls1.0')
      data.result.should.containEql('tls1.1')
      data.result.should.containEql('tls1.2')
      done()
    })
  })

})
