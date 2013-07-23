// enquire2.js v0.1.0 - Awesome Media Query-like Support in JS, with polyfill
// Copyright (c) 2013 James Tomasino - http://github.com/jamestomasino/enquire2
// License: MIT (http://www.opensource.org/licenses/mit-license.php)

window.enquire2 = window.enquire2 || ( function( window, document, matchMedia, undefined ) {

	"use strict";

	var bool;
	var queryList = [];

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

		var query = '';

		// Handle Various Option Types by converting to media query syntax
		if ( options['device'] !== undefined ) {
			query += options['device'];
		}

		if ( options['min-width'] !== undefined ) {
			if (typeof options['min-width'] == 'number' ) options['min-width'] = options['min-width'] + 'px';
			query += ' and (min-width: ' + options['min-width'] + ')';
		}

		if ( options['max-width'] !== undefined ) {
			if (typeof options['max-width'] == 'number' ) options['max-width'] = options['max-width'] + 'px';
			query += ' and (max-width: ' + options['max-width'] + ')';
		}

		var mediaquery = new MediaQuery(query, handlers);
		queryList.push ( mediaquery );
		return mediaquery;
	}

	// Mimic enquire.js class internally
	function MediaQuery ( query, handlers ) {
		this.query = query;
		this.handlers = handlers;
		this.mql = matchMedia(query);

		// defer setup
		this.deferSetup = this.handlers.hasOwnProperty('deferSetup') ? this.handlers.deferSetup : false;
		if ( this.handlers.hasOwnProperty('setup') ) {
			if ( this.deferSetup !== true ) this.handlers.setup();
		} else {
			this.deferSetup = false;
		}

		var self = this;
		this.listener = function (mql) {
			self.mql = mql;
			self.assess();
		}

		this.mql.addListener( delegate( this, self.listener ) );
		this.assess();

		return this.mql;
	}

	MediaQuery.prototype = {

		assess : function () {
			var matches = this.mql.matches;
			if (matches) {
				if (this.deferSetup === true) {
					this.deferSetup = false;
					this.handlers.setup();
				}
				if ( this.handlers.hasOwnProperty('match') ) {
					this.handlers.match();
				}
			} else {
				if ( this.handlers.hasOwnProperty('unmatch') ) {
					this.handlers.unmatch();
				}
			}
		}
	}

	return {
		register: register
	}

})( window, document, matchMedia );

