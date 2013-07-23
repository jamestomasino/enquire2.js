# [enquire2.js](http://github.com/jamestomasino/enquire2.js) #

- - - - -

`enquire2.js` is a lightweight, pure javascript library with no dependencies for programatically responding to media query styled statements.

This project is an unofficial fork of [enquire.js](https://github.com/WickyNilliams/enquire.js/). I have blatently stolen its signature and a lot of the methodology contained in that project. Where enquire2.js differs is in support for older browsers. By using the supplied polyfill, enquire2 will function back to IE6.

## Using ##

### Quick Start ###

The main method you will be dealing with is register. It's basic signature is as follows:

    enquire.register(query /* object */, handler /* object */);
    
`query` is an object of key/value pairs representing the CSS media query you wish to respond to, and `handler` is an object containing any logic to handle the query. An example of usage is as follows:

    enquire.register({ "max-width": 887, "min-width": 598 }, {

        match : function() {},      // OPTIONAL
                                    // If supplied, triggered when the media query transitions 
                                    // *from an unmatched to a matched state*

        unmatch : function() {},    // OPTIONAL
                                    // If supplied, triggered when the media query transitions 
                                    // *from a matched state to an unmatched state*.
    
        setup : function() {},      // OPTIONAL
                                    // If supplied, triggered once immediately upon registration of the handler

        deferSetup : true           // OPTIONAL, defaults to false
                                    // If set to true, defers execution the setup function 
                                    // until the media query is first matched. still triggered just once
    });
    
### Configuration Options ###

The `query` object has a limited number of options available at this release. You can use any of the following:

* device - the device type (e.g., "only screen")
* max-width - the maximum display width as a Number, or as a string suffixed with 'px'
* min-width - the minimum display width as a Number, or as a string suffixed with 'px'

### Polyfill ###

If you are using an older browser and you want the full functionality of enquire2.js, you should also utilize the polyfill. This library makes use of the browser's matchMedia methods in order to test CSS Media Queries. If your browser does not support matchMedia, the enquire2.js polyfill will use a javascript only solution instead.

You can use [Modernizr](http://modernizr.com/) to include the polyfill by the following method:

    Modernizr.load([
	    { test: window.matchMedia, nope: ['enquire2-polyfill.js'] }
    ]);


## Contributing ##

If you have any suggestions for cleaning up and refactoring the code, or you have a new feature you'd like to support, then please make a pull request. I've built this initial version with extremely limited functionality to get it out the door. It would be nice to add support for more advanced media query options as time goes on.


## License ##

License: MIT (http://www.opensource.org/licenses/mit-license.php)