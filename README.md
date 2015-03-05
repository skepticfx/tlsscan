tlsscan
=======

Testing TLS servers for weakness

[![Build Status](https://travis-ci.org/skepticfx/tlsscan.svg?branch=master)](https://travis-ci.org/skepticfx/tlsscan)


#### Usage

```
npm install -S tlsscan
```

````
var tlsscan = require('tlsscan');
var scanner = new tlsscan({host: 'google.com'});

scanner
	.run('is_supported_compression'); // Run your preferred scan. Refer the 'scans' directory.
	.once('end', function(scan){
	  if(scan.result == true)
	    console.log('Supports TLS compression');
	  else
	    console.log('Does not support TLS compression');
	});

`````


#### Scans
This is the list of scans - completed and in progress

https://github.com/skepticfx/tlsscan/issues/1


#### Libraries
* [tls.js](https://github.com/indutny/tls.js)


#### License

The MIT License (MIT)

Copyright (c) 2014 Ahamed Nafeez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
