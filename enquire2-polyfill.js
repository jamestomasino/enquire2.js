// enquire2.js v0.1.0 - Awesome Media Query-like Support in JS, with polyfill
// Copyright (c) 2013 James Tomasino - http://github.com/jamestomasino/enquire2
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

window.enquire2 = ( function( window, document, undefined ) {

	"use strict";

	var bool;
	var queryList = [];
	var resizeTimeoutId;

	// Add more options to increase library features
	var globalOptions = {
		'device': 'only screen',
		'min-width': undefined,
		'max-width': undefined
	}

	// Keep scope on callbacks
	var delegate = function (object, method) {
		var shim = function() {
			return method.apply(object, arguments);
		}
		return shim;
	}

	// Event listener wrapper for different browsers
	var addEvent = function(elem, type, eventHandle) {
		if (elem == null || elem == undefined) return;
		if ( elem.addEventListener ) {
			elem.addEventListener( type, eventHandle, false );
		} else if ( elem.attachEvent ) {
			elem.attachEvent( "on" + type, eventHandle );
		} else {
			elem["on"+type]=eventHandle;
		}
	};

	// Run the query tests
	var resizeTest = function () {
		var i = queryList.length; while (i--) {
			queryList[i].assess();
		}
	}

	// Only check the resize handler at reasonable intervals
	var resizeHandler = function (e) {
		if (resizeTimeoutId) window.clearTimeout(resizeTimeoutId);
		resizeTimeoutId = window.setTimeout(delegate(this,resizeTest), 300);
	}

	// Deep clone for objects - copying globalOptions
	var clone = function (obj) {
		// Handle the 3 simple types, and null or undefined
		if (null == obj || "object" != typeof obj) return obj;
		// Handle Object
		if (obj instanceof Object) {
			var copy = {};
			for (var attr in obj) {
				if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
			}
			return copy;
		}
	}

	// Register Callback
	var register = function (opt, handlers) {
		// override defaults
		var options = clone(globalOptions);

		for (var s in options) {
			if ( opt.hasOwnProperty(s) ) options[s] = opt[s];
		}

		var query = new MediaQuery(options, handlers);
		queryList.push ( query );
		return query;
	}

	// Mimic enquire.js class internally
	function MediaQuery ( options, handlers ) {
		this.matched = false;
		this.options = options;
		this.handlers = handlers;

		// defer setup
		this.deferSetup = this.handlers.hasOwnProperty('deferSetup') ? this.handlers.deferSetup : false;
		if ( this.handlers.hasOwnProperty('setup') ) {
			if ( this.deferSetup !== true ) this.handlers.setup();
		} else {
			this.deferSetup = false;
		}

		this.assess();
	}

	MediaQuery.prototype = {

		assess : function () {
			// Get window dimensions
			var e = document.documentElement,
			g = document.getElementsByTagName('body')[0],
			x = window.innerWidth || e.clientWidth || g.clientWidth,
			y = window.innerHeight|| e.clientHeight|| g.clientHeight;

			// Check each query part on its own via javascript
			var bool = true;

			if ( this.options['device'] !== undefined ) {
				if ( this.options['device'] !== 'only screen' ) bool = false;
			}

			if ( this.options['min-width'] !== undefined ) {
				if (typeof this.options['min-width'] !== 'number' ) this.options['min-width'] = parseInt(this.options['min-width'], 10);
				if (x < this.options['min-width']) bool = false;
			}

			if ( this.options['max-width'] !== undefined ) {
				if (typeof this.options['max-width'] !== 'number' ) this.options['max-width'] = parseInt(this.options['min-width'], 10);
				if (x > this.options['max-width']) bool = false;
			}

			if (bool) {
				if (this.matched === false) {
					if (this.deferSetup === true) {
						this.deferSetup = false;
						this.handlers.setup();
					}

					if ( this.handlers.hasOwnProperty('match') ) {
						this.handlers.match();
					}
					this.matched = true;
				}
			} else {
				if (this.matched === true) {
					if ( this.handlers.hasOwnProperty('unmatch') ) {
						this.handlers.unmatch();
					}
					this.matched = false;
				}
			}
		}
	}

	addEvent ( window, 'resize', resizeHandler );
	addEvent ( window, 'load', resizeTest );


	return {
		register: register
	}

})( window, document );
