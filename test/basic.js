var should = require('should')
var Tlsscan = require('../')

var host = 'facebook.com'

describe('run basic tests', function(){
  var options = {}
  options.host = host
  var scanner = new Tlsscan(options)

  it('check support for TLS1.0', function(done){

    var scan = scanner.run('is_supported_tls_1.0')
    console.log(scan);
    scan.on('end', function(data){
      data.result.should.be(true)
      done()
    })
  })

})
