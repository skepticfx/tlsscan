var should = require('should')
var Tlsscan = require('../')

var host = '74.125.236.34'

describe('run basic tests', function(){
  var options = {}
  options.host = host
  var scanner = new Tlsscan(options)

  describe('check support for TLS versions', function(){

    it('TLS 1.0', function(done){
      var scan = scanner.run('is_supported_tls_1.0')
      scan.on('end', function(data){
        data.result.should.be.true
        done()
      })
    })

  it('TLS 1.1', function(done){
    var scan = scanner.run('is_supported_tls_1.1')
    scan.on('end', function(data){
      data.result.should.be.true
      done()
    })
  })

  it('TLS 1.2', function(done){
    var scan = scanner.run('is_supported_tls_1.2')
    scan.on('end', function(data){
      data.result.should.be.true
      done()
    })
  })

  })

})
