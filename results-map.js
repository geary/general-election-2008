// results-map.js
// Copyright (c) 2008 Michael Geary
// http://mg.to/
// Free Beer and Free Speech License (use any OSI approved license)
// http://freebeerfreespeech.org/
// http://www.opensource.org/licenses/

// Keep this in sync with ALL_ALL.xml
var strings = {
	returnToUSA: 'Return to USA',
	chooseLabel: 'Choose a state and select a race:',
	stateLabel: 'State:',
	raceLabel: 'Race:',
	entireUSA: 'Entire USA',
	president: 'President',
	house: 'U.S. House',
	senate: 'U.S. Senate',
	others: 'Others - {{count}}',
	stateDistrict: '{{state}} District {{number}}',
	undecided: '{{undecided}} undecided',
	undecided270: '{{undecided}} undecided - 270 votes needed',
	percentReporting: '{{percent}}% of {{total}} precincts reporting',
	noSenate: 'No Senate race this year',
	EVs: '({{votes}} EVs)',
	countdownHeading: 'Live results in:',
	countdownHours: '{{hours}} hours',
	countdownHour: '1 hour',
	countdownMinutes: '{{minutes}} minutes',
	countdownMinute: '1 minute',
	noVotes: 'No votes reported',
	unopposed: 'Unopposed'
};

var $window = $(window), ww = $window.width(), wh = $window.height();
var prefs = new _IG_Prefs();

var opt = window.GoogleElectionMapOptions || {};
opt.static1 = ( ww == 573  &&  wh == 463 );
opt.static = opt.static1  ||  ( ww == 620  &&  wh == 480 );
opt.fontsize = '15px';
var sw = opt.panelWidth = 200;

opt.codeUrl = opt.codeUrl || 'http://general-election-2008.googlecode.com/svn/trunk/';
opt.imgUrl = opt.imgUrl || opt.codeUrl + 'images/';
opt.shapeUrl = opt.shapeUrl || 'http://general-election-2008-data.googlecode.com/svn/trunk/json/shapes/';

opt.voteUrl = 'http://general-election-2008-data.googlecode.com/svn/trunk/json/votes/2008/';

opt.state = opt.state || 'us';

if( ! Array.prototype.forEach ) {
	Array.prototype.forEach = function( fun /*, thisp*/ ) {
		if( typeof fun != 'function' )
			throw new TypeError();
		
		var thisp = arguments[1];
		for( var i = 0, n = this.length;  i < n;  ++i ) {
			if( i in this )
				fun.call( thisp, this[i], i, this );
		}
	};
}

if( ! Array.prototype.map ) {
	Array.prototype.map = function( fun /*, thisp*/ ) {
		var len = this.length;
		if( typeof fun != 'function' )
			throw new TypeError();
		
		var res = new Array( len );
		var thisp = arguments[1];
		for( var i = 0;  i < len;  ++i ) {
			if( i in this )
				res[i] = fun.call( thisp, this[i], i, this );
		}
		
		return res;
	};
}

Array.prototype.mapjoin = function( fun, delim ) {
	return this.map( fun ).join( delim || '' );
};

if( ! Array.prototype.index ) {
	Array.prototype.index = function( field ) {
		this.by = {};
		if( field ) {
			var by = this.by[field] = {};
			for( var i = 0, n = this.length;  i < n;  ++i ) {
				var obj = this[i];
				by[obj[field]] = obj;
				obj.index = i;
			}
		}
		else {
			var by = this.by;
			for( var i = 0, n = this.length;  i < n;  ++i ) {
				var str = this[i];
				by[str] = str;
				str.index = i;
			}
		}
		return this;
	};
}

Array.prototype.random = function() {
	return this[ randomInt(this.length) ];
};

String.prototype.trim = function() {
	return this.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' );
};

String.prototype.words = function( fun ) {
	this.split(' ').forEach( fun );
};

String.prototype.T = function( args ) {
	return ( prefs.getMsg(this) || strings[this] || '' ).replace( /\{\{(\w+)\}\}/g,
		function( match, name ) {
			var value = args[name];
			return value != null ? value : match;
		});
}

function S() {
	return Array.prototype.join.call( arguments, '' );
}

function join( array, delim ) {
	return Array.prototype.join.call( array, delim || '' );
}

jQuery.extend( jQuery.fn, {
	html: function( a ) {
		if( a == null ) return this[0] && this[0].innerHTML;
		return this.empty().append( join( a.charAt ? arguments : a ) );
	},
	setClass: function( cls, yes ) {
		return this[ yes ? 'addClass' : 'removeClass' ]( cls );
	}
});

function randomInt( n ) {
	return Math.floor( Math.random() * n );
}

// hoverize.js
// Based on hoverintent plugin for jQuery

(function( $ ) {
	
	var opt = {
		slop: 7,
		interval: 200
	};
	
	function start() {
		if( ! timer ) {
			timer = setInterval( check, opt.interval );
			$(document.body).bind( 'mousemove', move );
		}
	}
	
	function clear() {
		if( timer ) {
			clearInterval( timer );
			timer = null;
			$(document.body).unbind( 'mousemove', move );
		}
	}
	
	function check() {
		if ( ( Math.abs( cur.x - last.x ) + Math.abs( cur.y - last.y ) ) < opt.slop ) {
			clear();
			for( var i  = 0,  n = functions.length;  i < n;  ++i )
				functions[i]();
		}
		else {
			last = cur;
		}
	}
	
	function move( e ) {
		cur = { x:e.screenX, y:e.screenY };
	}
	
	var timer, last = { x:0, y:0 }, cur = { x:0, y:0 }, functions = [];
	
	hoverize = function( fn, fast ) {
		
		function now() {
			fast && fast.apply( null, args );
		}
		
		function fire() {
			clear();
			return fn.apply( null, args );
		}
		functions.push( fire );
		
		var args;
		
		return {
			clear: clear,
			
			now: function() {
				args = arguments;
				now();
				fire();
			},
			
			hover: function() {
				args = arguments;
				now();
				start();
			}
		};
	}
})( jQuery );

document.body.scroll = 'no';

var states = [
	{ "abbr":"AL", "name":"Alabama", "bounds":[[-88.4711,30.2198],[-84.8892,35.0012]] },
	{ "abbr":"AK", "name":"Alaska", "bounds":[[172.4613,51.3718],[-129.9863,71.3516]] },
	{ "abbr":"AZ", "name":"Arizona", "bounds":[[-114.8152,31.3316],[-109.0425,37.0003]] },
	{ "abbr":"AR", "name":"Arkansas", "bounds":[[-94.6162,33.0021],[-89.7034,36.5019]] },
	{ "abbr":"CA", "name":"California", "bounds":[[-124.4108,32.5366],[-114.1361,42.0062]] },
	{ "abbr":"CO", "name":"Colorado", "bounds":[[-109.0480,36.9948],[-102.0430,41.0039]] },
	{ "abbr":"CT", "name":"Connecticut", "bounds":[[-73.7272,40.9875],[-71.7993,42.0500]], "votesby":"town" },
	{ "abbr":"DE", "name":"Delaware", "bounds":[[-75.7865,38.4517],[-75.0471,39.8045]] },
	{ "abbr":"DC", "name":"District of Columbia", "bounds":[[-77.1174,38.7912],[-76.9093,38.9939]] },
	{ "abbr":"FL", "name":"Florida", "bounds":[[-87.6003,24.5457],[-80.0312,31.0030]] },
	{ "abbr":"GA", "name":"Georgia", "bounds":[[-85.6067,30.3567],[-80.8856,35.0012]] },
	{ "abbr":"HI", "name":"Hawaii", "bounds":[[-159.7644,18.9483],[-154.8078,22.2290]] },
	{ "abbr":"ID", "name":"Idaho", "bounds":[[-117.2415,41.9952],[-111.0471,49.0002]] },
	{ "abbr":"IL", "name":"Illinois", "bounds":[[-91.5108,36.9838],[-87.4962,42.5101]] },
	{ "abbr":"IN", "name":"Indiana", "bounds":[[-88.0275,37.7835],[-84.8070,41.7597]] },
	{ "abbr":"IA", "name":"Iowa", "bounds":[[-96.6372,40.3795],[-90.1635,43.5014]] },
	{ "abbr":"KS", "name":"Kansas", "bounds":[[-102.0539,36.9948],[-94.5943,40.0016]] },
	{ "abbr":"KY", "name":"Kentucky", "bounds":[[-89.4186,36.4964],[-81.9700,39.1198]] },
	{ "abbr":"LA", "name":"Louisiana", "bounds":[[-94.0412,28.9273],[-88.8162,33.0185]] },
	{ "abbr":"ME", "name":"Maine", "bounds":[[-71.0818,43.0578],[-66.9522,47.4612]], "votesby":"town" },
	{ "abbr":"MD", "name":"Maryland", "bounds":[[-79.4889,37.9149],[-75.0471,39.7223]] },
	{ "abbr":"MA", "name":"Massachusetts", "bounds":[[-73.4862,41.2668],[-69.9262,42.8880]], "votesby":"town" },
	{ "abbr":"MI", "name":"Michigan", "bounds":[[-90.4154,41.6940],[-82.4136,48.1897]] },
	{ "abbr":"MN", "name":"Minnesota", "bounds":[[-97.2287,43.5014],[-89.4898,49.3836]] },
	{ "abbr":"MS", "name":"Mississippi", "bounds":[[-91.6532,30.1815],[-88.0987,34.9957]] },
	{ "abbr":"MO", "name":"Missouri", "bounds":[[-95.7664,35.9980],[-89.1338,40.6096]] },
	{ "abbr":"MT", "name":"Montana", "bounds":[[-116.0475,44.3613],[-104.0475,49.0002]] },
	{ "abbr":"NE", "name":"Nebraska", "bounds":[[-104.0530,40.0016],[-95.3063,43.0030]] },
	{ "abbr":"NV", "name":"Nevada", "bounds":[[-120.0019,35.0012],[-114.0429,42.0007]] },
	{ "abbr":"NH", "name":"New Hampshire", "bounds":[[-72.5551,42.6963],[-70.7039,45.3033]], "votesby":"town" },
	{ "abbr":"NJ", "name":"New Jersey", "bounds":[[-75.5620,38.9336],[-73.8915,41.3599]] },
	{ "abbr":"NM", "name":"New Mexico", "bounds":[[-109.0480,31.3316],[-103.0014,37.0003]] },
	{ "abbr":"NY", "name":"New York", "bounds":[[-79.7628,40.5438],[-71.8541,45.0185]] },
	{ "abbr":"NC", "name":"North Carolina", "bounds":[[-84.3196,33.8455],[-75.5182,36.5895]] },
	{ "abbr":"ND", "name":"North Dakota", "bounds":[[-104.0475,45.9332],[-96.5606,49.0002]] },
	{ "abbr":"OH", "name":"Ohio", "bounds":[[-84.8180,38.4243],[-80.5186,41.9788]] },
	{ "abbr":"OK", "name":"Oklahoma", "bounds":[[-103.0014,33.6374],[-94.4300,37.0003]] },
	{ "abbr":"OR", "name":"Oregon", "bounds":[[-124.5532,41.9952],[-116.4638,46.2618]] },
	{ "abbr":"PA", "name":"Pennsylvania", "bounds":[[-80.5186,39.7223],[-74.6966,42.2691]] },
	//{ "abbr":"PR", "name":"Puerto Rico", "bounds":[[-67.2699,17.9350],[-65.2763,18.5156]] },
	{ "abbr":"RI", "name":"Rhode Island", "bounds":[[-71.8596,41.3216],[-71.1202,42.0171]] },
	{ "abbr":"SC", "name":"South Carolina", "bounds":[[-83.3392,32.0327],[-78.5414,35.2148]] },
	{ "abbr":"SD", "name":"South Dakota", "bounds":[[-104.0585,42.4882],[-96.4346,45.9441]] },
	{ "abbr":"TN", "name":"Tennessee", "bounds":[[-90.3114,34.9847],[-81.6797,36.6771]] },
	{ "abbr":"TX", "name":"Texas", "bounds":[[-106.6162,25.8383],[-93.5154,36.5019]] },
	{ "abbr":"UT", "name":"Utah", "bounds":[[-114.0484,37.0003],[-109.0425,42.0007]] },
	{ "abbr":"VT", "name":"Vermont", "bounds":[[-73.4314,42.7291],[-71.5036,45.0130]], "votesby":"town" },
	{ "abbr":"VA", "name":"Virginia", "bounds":[[-83.6733,36.5512],[-75.2443,39.4649]] },
	{ "abbr":"WA", "name":"Washington", "bounds":[[-124.7285,45.5443],[-116.9183,49.0002]] },
	{ "abbr":"WV", "name":"West Virginia", "bounds":[[-82.6437,37.2029],[-77.7199,40.6370]] },
	{ "abbr":"WI", "name":"Wisconsin", "bounds":[[-92.8855,42.4936],[-86.9704,46.9628]] },
	{ "abbr":"WY", "name":"Wyoming", "bounds":[[-111.0525,40.9984],[-104.0530,45.0021]] }
];

var stateUS = {
	'abbr': 'US',
	'name': 'United States',
	bounds: [
		[ -124.72846051, 24.54570037 ],
		[ -66.95221658, 49.38362494 ]
	]
};

var stateCD = {
	'abbr': 'congressional',
	'name': 'Congressional Districts',
	bounds: [
		[ -124.72846051, 24.54570037 ],
		[ -66.95221658, 49.38362494 ]
	]
};

var statesByAbbr = {};
var statesByName = {};
states.forEach( function( state ) {
	statesByAbbr[state.abbr] = state;
	statesByName[state.name] = state;
});

function stateByAbbr( abbr ) {
	if( typeof abbr != 'string' ) return abbr;
	return statesByAbbr[abbr.toUpperCase()] || stateUS;
}

document.write(
	'<style type="text/css">',
		'.selects tr { vertical-align:middle; }',
		'.selects label { font-weight:bold; margin:0; }',
		'.selects .selectdiv { margin:0 0 4px 6px; }',
		'html, body { margin:0; padding:0; border:0 none; overflow:hidden; width:', ww, 'px; height:', wh, 'px; }',
		'* { font-family: Arial,sans-serif; font-size: ', opt.fontsize, '; }',
		'#outer {}',
		opt.tpm ? '.fullpanel { background-color:#CCC7AA; }' : '.fullpanel { background-color:#EEE; }',
		'#stateSelector, #stateInfoSelector { width:', sw - 12, 'px; }',
		'.barvote { font-weight:bold; color:white; }',
		'h2 { font-size:11pt; margin:0; padding:0; }',
		'.content table { xwidth:100%; }',
		'.content .contentboxtd { width:7%; }',
		'.content .contentnametd { xfont-size:24px; xwidth:18%; }',
		'.content .contentbox { height:24px; width:24px; xfloat:left; margin-right:4px; }',
		'.content .contentname { xfont-size:12pt; white-space:pre; }',
		'.content .contentvotestd { text-align:right; width:5em; }',
		'.content .contentpercenttd { text-align:right; width:2em; }',
		'.content .contentvotes, .content .contentpercent { xfont-size:', opt.fontsize, '; margin-right:4px; }',
		'.content .contentclear { clear:left; }',
		'.content .contentreporting { margin-bottom:8px; }',
		'.content .contentreporting * { xfont-size:20px; }',
		'.content {}',
		'#content-scroll { overflow:scroll; overflow-x:hidden; }',
		'#maptip { position:absolute; z-index:10; border:1px solid #333; background:#f7f5d1; color:#333; white-space: nowrap; display:none; }',
		'.tiptitlebar { padding:4px 8px; border-bottom:1px solid #AAA; }',
		'.tiptitletext { font-weight:bold; font-size:120%; }',
		'.tipcontent { padding:4px 8px 8px 8px; }',
		'.tipreporting { font-size:80%; padding:4px 8px; border-top:1px solid #AAA; }',
		'#selectorpanel { height:85px; }',
		'#selectorpanel, #selectorpanel * { font-size:14px; }',
		'.candidate, .candidate * { font-size:18px; font-weight:bold; }',
		'.candidate-small, .candidate-small * { font-size:14px; font-weight:bold; }',
		'#centerlabel, #centerlabel * { font-size:12px; xfont-weight:bold; }',
		'#spinner { z-index:999999; filter:alpha(opacity=70); opacity:0.70; -moz-opacity:0.70; position:absolute; left:', Math.floor( ww/2 - 64 ), 'px; top:', Math.floor( wh/2 - 20 ), 'px; }',
		'#attrib { z-index:999999; position:absolute; right:4px; bottom:16px; }',
		'#error { z-index:999999; position:absolute; left:4px; bottom:4px; border:1px solid #888; background-color:#FFCCCC; font-weight:bold; padding:6px; }',
	'</style>'
);

if( opt.tpm ) document.write(
	'<style type="text/css">',
		'.candidate, .candidate * { font-size:20px; font-weight:bold; }',
	'</style>',
	
	'<div style="margin-bottom:4px;">',
		'<img style="border:none; width:573px; height:36px;" src="', imgUrl('tpm/tpm-scoreboard.png'), '" />',
	'</div>'
);

var index = 0;
function option( value, name, selected, disabled ) {
	var html = optionHTML( value, name, selected, disabled );
	++index;
	return html;
}

function optionHTML( value, name, selected, disabled ) {
	var id = value ? 'id="option-' + value + '" ' : '';
	var style = disabled ? 'color:#AAA; font-style:italic; font-weight:bold;' : '';
	selected = selected ? 'selected="selected" ' : '';
	disabled = disabled ? 'disabled="disabled" ' : '';
	return S(
		'<option ', id, 'value="', value, '" style="', style, '" ', selected, disabled, '>',
			name,
		'</option>'
	);
}

function stateOption( state, selected, dated ) {
	state.selectorIndex = index;
	return option( state.abbr, state.name, selected );
}

function raceOption( value, name ) {
	return option( value, name, value == opt.infoType );
}

function imgUrl( name ) {
	return cacheUrl( opt.imgUrl + name );
}

function cacheUrl( url, cache ) {
	if( opt.nocache ) return url + '?q=' + new Date().getTime();
	url = _IG_GetCachedUrl( url, typeof cache == 'number' ? { refreshInterval:cache } : {} );
	if( ! url.match(/^http:/) ) url = 'http://' + location.host + url;
	return url;
}

document.write(
	'<div id="outer">',
		'<table cellpadding="0" cellspacing="0">',
			'<tr valign="top" class="fullpanel">',
				'<td style="width:', sw, 'px;" class="leftpanel">',
					'<div id="selectorpanel" style="width:100%; height:100%;">',
						'<div style="margin:0; padding:4px;">',
							'<div style="font-weight:bold; white-space:nowrap; margin:2px 0;">',
								'chooseLabel'.T(),
							'</div>',
							'<table class="selects" cellspacing="0" cellpadding="0" style="margin-right:6px;">',
								'<tr>',
									'<td class="labelcell">',
										'<label for="stateSelector">',
											'stateLabel'.T(),
										'</label>',
									'</td>',
									'<td class="selectcell">',
										'<div class="selectdiv">',
											'<select id="stateSelector">',
												option( 'us', 'entireUSA'.T() ),
												states.mapjoin( function( state ) {
													return stateOption( state, state.abbr.toLowerCase() == opt.state, true );
												}),
											'</select>',
										'</div>',
									'</td>',
								'</tr>',
								'<tr>',
									'<td class="labelcell">',
										'<label for="stateInfoSelector">',
											'raceLabel'.T(),
										'</label>',
									'</td>',
									'<td class="selectcell">',
										'<div class="selectdiv">',
											'<select id="stateInfoSelector">',
												raceOption( 'President', 'president'.T() ),
												raceOption( 'U.S. House', 'house'.T() ),
												raceOption( 'U.S. Senate', 'senate'.T() ),
											'</select>',
										'</div>',
									'</td>',
								'</tr>',
							'</table>',
						'</div>',
					'</div>',
				'</td>',
				'<td style="width:', ww - sw, 'px;" class="rightpanel">',
					'<div id="content-two" class="content">',
					'</div>',
				'</td>',
			'</tr>',
			'<tr class="mappanel">',
				'<td colspan="2" style="width:100%; border-top:1px solid #DDD;" id="mapcol">',
					'<div id="map" style="width:100%; height:100%;">',
					'</div>',
					'<div id="staticmap" style="display:none; position:relative; width:100%; height:100%;">',
					'</div>',
				'</td>',
			'</tr>',
		'</table>',
	'</div>',
	'<div id="maptip">',
	'</div>',
	'<div id="attrib">',
		'Source: AP',
	'</div>',
	'<div id="error" style="display:none;">',
	'</div>',
	'<div id="spinner">',
		'<img border="0" style="width:128px; height:128px;" src="', imgUrl('spinner.gif'), '" />',
	'</div>'
);

(function( $ ) {

function getFactors() {
	var state = stateByAbbr(opt.state);
	return state.factors;
}

//opt.twitter = prefs.getBool('twitter');
opt.state = prefs.getString('state');
opt.infoType = prefs.getString('race') || 'President';

opt.twitter = false;
opt.youtube = false;

opt.zoom = opt.zoom || 3;

opt.tileUrl = opt.tileUrl || 'http://gmodules.com/ig/proxy?max_age=3600&url=http://election-map-tiles-1.s3.amazonaws.com/boundaries/';


var parties = {
	AIP: {},
	AKI: { letter:'C' },
	AmC: {},
	BEP: {},
	BoT: {},
	CST: { letter:'C' },
	Con: {},
	Dem: { color:'#0000FF', barColor:'#7777FF', letter:'D', shortName:'Democratic', fullName:'Democratic Party' },
	GOP: { color:'#FF0000', barColor:'#FF7777', letter:'R', shortName:'Republican', fullName:'Republican Party' },
	Grn: { letter:'G' },
	HQ8: {},
	IAP: {},
	IGr: {},
	Ind: { letter:'I' },
	Inp: {},
	LTP: {},
	LUn: {},
	Lib: { letter:'L' },
	Mnt: {},
	NLP: {},
	NPA: {},
	NPD: {},
	Neb: {},
	New: { letter:'N' },
	Obj: {},
	Oth: {},
	PAG: {},
	PCF: {},
	PEC: {},
	PFP: {},
	PSL: {},
	Prg: {},
	Pro: {},
	RP: {},
	SPU: { letter:'S' },
	SWP: {},
	TLm: {},
	UST: {},
	Una: {},
	Uty: {},
	WF: {},
	x: { color:'#AAAAAA', barColor:'#AAAAAA' }
};

var fillOpacity = .5;

if( opt.tpm ) {
	parties.Dem.color = '#006699';
	parties.Dem.barColor = '#006699';
	parties.GOP.color = '#990000';
	parties.GOP.barColor = '#990000';
	parties.x.color = '#E0DDCC';
	parties.x.barColor = '#E0DDCC';
	fillOpacity = .7;
}

function getJSON( type, path, file, cache, callback, retries ) {
	var stamp = +new Date;
	if( ! opt.nocache ) stamp = Math.floor( stamp / cache / 1000 );
	if( retries ) stamp += '-' + retries;
	if( retries == 3 ) showError( type, file );
	_IG_FetchContent( path + file + '?' + stamp, function( json ) {
		// Q&D test for bad JSON
		if( json && json.charAt(0) == '{' ) {
			$('#error').hide();
			callback( eval( '(' + json + ')' ) );
		}
		else {
			reportError( type, file );
			retries = ( retries || 0 );
			var delay = Math.min( Math.pow( 2, retries ), 128 ) * 1000;
			setTimeout( function() {
				getJSON( type, path, file, cache, callback, retries + 1 );
			}, delay );
		}
	}, {
		refreshInterval: opt.nocache ? 1 : cache
	});
}

function showError( type, file ) {
	file = file.replace( '.json', '' ).replace( '-all', '' ).toUpperCase();
	$('#error').html( S( '<div>Error loading ', type, ' for ', file, '</div>' ) ).show();
	$('#spinner').hide();
}

function reportError( type, file ) {
	_IG_Analytics( 'UA-6203275-1', '/' + type + '/' + file );
}

function htmlEscape( str ) {
	var div = document.createElement( 'div' );
	div.appendChild( document.createTextNode( str ) );
	return div.innerHTML;
}

function percent( n ) {
	var p = Math.round( n * 100 );
	if( p == 100  &&  n < 1 ) p = 99;
	if( p == 0  && n > 0 ) p = '&lt;1';
	return p + '%';
}

NationwideControl = function( show ) {
	return $.extend( new GControl, {
		initialize: function( map ) {
			var $control = $(S(
				'<div style="color:black; font-family:Arial,sans-serif;">',
					'<div style="background-color:white; border:1px solid black; cursor:pointer; text-align:center; width:6em;">',
						'<div style="border-color:white #B0B0B0 #B0B0B0 white; border-style:solid; border-width:1px; font-size:12px;">',
							'returnToUSA'.T(),
						'</div>',
					'</div>',
				'</div>'
			)).click( function() { setState(stateUS); } ).appendTo( map.getContainer() );
			return $control[0];
		},
		
		getDefaultPosition: function() {
			return new GControlPosition( G_ANCHOR_TOP_LEFT, new GSize( 50, 9 ) );
		}
	});
};

var map, staticmap, gonzo, overlay;

var state = states[opt.state];

var icons = {};

function pointLatLng( point ) {
	return new GLatLng( point[1], point[0] );
}

function randomColor() {
	return '#' + hh() + hh() + hh();
}

function randomGray() {
	var h = hh();
	return '#' + h + h + h;
}

function hh() {
	var xx = Math.floor( Math.random() *128 + 96 ).toString(16);
	return xx.length == 2 ? xx : '0'+xx;
}

function loadChart() {
	var barWidth = $('#content-two').width() - 8;
	if( opt.infoType == 'U.S. House'  ||  opt.infoType == 'U.S. Senate' && curState == stateUS ) {
		var total = opt.infoType == 'U.S. House' ? 435 : 100;
		var trends = stateUS.results.trends[opt.infoType];
		var dem = trends.Dem.Won + trends.Dem.Holdovers;
		var gop = trends.GOP.Won + trends.GOP.Holdovers;
		var others = trends.Others.Won + trends.Others.Holdovers;
		var undecided = total - dem - gop - others;
		var chart = voteBar({
			width: barWidth,
			total: total
		}, {
			name: 'Democratic',
			votes: dem,
			color: parties.Dem.barColor
		}, {
			label: 'undecided'.T({ undecided: undecided }),
			votes: undecided,
			color: parties.x.barColor
		}, {
			name: 'Republican',
			votes: gop,
			color: parties.GOP.barColor
		});
	}
	//else if( curState == stateUS ) {
	//	var chart = voteBar({
	//		width: barWidth,
	//		total: 538
	//	}, {
	//		name: 'Obama (D)',
	//		votes: 203,
	//		color: parties.Dem.barColor
	//	}, {
	//		label: 'undecided270'.T({ undecided: 61 }),
	//		votes: 61,
	//		color: parties.x.barColor
	//	}, {
	//		name: 'McCain (R)',
	//		votes: 274,
	//		color: parties.GOP.barColor
	//	});
	//}
	else if( curState == stateUS ) {
		var pres = stateUS.results.trends.President;
		if( pres ) {
			var obama = pres.Obama.electoral;
			var mccain = pres.McCain.electoral;
			var others = pres.Others.electoral;
		}
		else {
			obama = 0;
			mccain = 0;
			others = 0;
		}
		var undecided = 538 - obama - mccain - others;
		var chart = voteBar({
			width: barWidth,
			total: 538
		}, {
			name: 'Obama (D)',
			votes: obama,
			color: parties.Dem.barColor
		}, {
			label: 'undecided270'.T({ undecided: undecided }),
			votes: undecided,
			color: parties.x.barColor
		}, {
			name: 'McCain (R)',
			votes: mccain,
			color: parties.GOP.barColor
		});
	}
	else {
		var type = opt.infoType;
		var seat = '';  // President
		var results = curState.results, candidates = results.candidates;
		var race = results.totals.races[type];
		var raceseats = getSeats( race, seat );
		var tallies = raceseats && raceseats[0] && raceseats[0].votes;
		var total = 0;
		var chart = '';
		var top = {};
		if( tallies  &&  tallies.length >= 2 ) {
			for( var i = tallies.length, tally;  tally = tallies[--i]; ) {
				total += tally.votes;
				var cand = candidates[tally.id].split('|');
				top[ cand[0] ] = { cand:cand, votes:tally.votes };
			}
			var dem = top.Dem, gop = top.GOP;
			if( dem && gop ) {
				var other = total - dem.votes - gop.votes;
				var who = function( p ) {
					var party = parties[ p.cand[0] ];
					return {
						name: p.cand[1] + ' (' + party.letter + ')',
						votes: p.votes,
						color: party.barColor
					};
				}
				var chart = voteBar({
					width: barWidth,
					total: total || 1,
					small: type != 'President'
				}, who(dem), {
					label:  'others'.T({ count: formatNumber(other) }),
					votes: total ? other : 1,
					color: parties.x.barColor
				}, who(gop) );
			}
		}
		else if( opt.infoType == 'U.S. Senate' ) {
			chart = S(
				'<div style="width:', barWidth, 'px; margin-top:24px; text-align:center; font-size:20px;">',
					'noSenate'.T(),
				'</div>'
			);
		}
	}
	$('#content-two').html( S(
		'<div id="chart" style="margin:4px;">',
			'<div style="width:', barWidth, 'px;">',
				chart,
			'</div>',
		'</div>'
	) );
}

var sm = opt.static1 ? {
	mapWidth: 573,
	mapHeight: 337,
	insetHeight: 67,
	insetWidth: 67,
	insetPad: 4,
	usZoom: 3.7,
	usLat: 50.7139,
	usLng: -126.45,
	akZoom: 0.7,
	akLat: 73.8,
	akLng: -182.3,
	hiZoom: 3.7,
	hiLat: 23.8,
	hiLng: -161.1
} : {
	mapWidth: 620,
	mapHeight: 395,
	insetHeight: 80,
	insetWidth: 80,
	insetPad: 4,
	usZoom: 3.812,
	usLat: 51.65,
	usLng: -126.62,
	akZoom: 0.721,
	akLat: 75.5,
	akLng: -188.5,
	hiZoom: 3.79,
	hiLat: 24.4,
	hiLng: -161.0
};
sm.insetY = sm.mapHeight - sm.insetHeight;

var reloadTimer;

function stateReady( state, reload ) {
	loadChart();
	if( ! reload ) moveToState( state );
	polys();
	$('#spinner').hide();
	reloadTimer = setTimeout( function() { loadState( true ); }, 300000 );
}

function moveToState( state ) {
	staticmap = opt.static  &&  state == stateUS;
	if( staticmap ) {
		$('#map').hide();
		var $staticmap = $('#staticmap');
		$staticmap.show();
		sm.top = $staticmap.offset().top;
		if( ! $('#staticmapimg').length )
			$staticmap.html( S(
				'<img id="staticmapimg" border="0" style="width:', sm.mapWidth, 'px; height:', sm.mapHeight, 'px;" src="', imgUrl('static-usa-'+sm.mapWidth+'.png'), '" />'
			) );
	}
	else {
		$('#staticmap').hide();
		$('#map').show();
		initMap();
		map.checkResize();
		//map.clearOverlays();
		//$('script[title=jsonresult]').remove();
		//if( json.status == 'later' ) return;
		var bounds = state.bounds;
		if( bounds ) {
			//var latpad = ( bounds[1][1] - bounds[0][1] ) / 20;
			//var lngpad = ( bounds[1][0] - bounds[0][0] ) / 20;
			//var latlngbounds = new GLatLngBounds(
			//	new GLatLng( bounds[0][1] - latpad, bounds[0][0] - lngpad ),
			//	new GLatLng( bounds[1][1] + latpad, bounds[1][0] + lngpad )
			//);
			var latlngbounds = new GLatLngBounds(
				new GLatLng( bounds[0][1], bounds[0][0] ),
				new GLatLng( bounds[1][1], bounds[1][0] )
			);
			var zoom = map.getBoundsZoomLevel( latlngbounds );
			map.setCenter( latlngbounds.getCenter(), zoom );
		}
	}
}

var  mousePlace;

function getStateDistricts( places, state ) {
	var districts = [];
	for( var iPlace = -1, place;  place = places[++iPlace]; ) {
		if( place.state.toUpperCase() == curState.abbr )
			districts.push( place );
	}
	return districts;
}

function polys() {
	var congress, stateCongress;
	if( opt.infoType == 'U.S. House' ) {
		var p = stateCD.shapes.places.district;
		congress = true;
		if( curState != stateUS ) {
			stateCongress = true;
			p = getStateDistricts( p, curState );
		}
	}
	else if( curState.abbr == 'AK'  ||  curState != stateUS && opt.infoType == 'U.S. Senate' ) {
		var place = $.extend( {}, stateUS.shapes.places.state.by.state[curState.abbr.toLowerCase()] );
		delete place.zoom;
		delete place.offset;
		var p = [ place ];
	}
	else {
		var p = curState.shapes.places;
		p = p.town || p.county || p.state;
	}
	colorize( congress, p, stateCongress ? stateUS.results : curState.results, opt.infoType );
	var $container = staticmap ? $('#staticmap') : $('#map');
	function getPlace( event, where ) {
		if( staticmap  &&  /*event.clientX > 8  &&  event.clientY < sm.mapHeight - 8  &&*/  event.clientY >= sm.top + sm.insetY  &&  event.clientX <= sm.insetWidth * 2 + sm.insetPad )
			return event.clientX < sm.insetWidth + sm.insetPad ? ak : hi1;
		return where && where.place;
	}
	var events = {
		mousemove: function( event, where ) {
			var place = getPlace( event, where );
			if( place == mousePlace ) return;
			mousePlace = place;
			$container[0].style.cursor = place ? 'pointer' : staticmap ? 'default' : 'hand';
			showTip( place );
		},
		click: function( event, where ) {
			var place = getPlace( event, where );
			if( ! place ) return;
			if( place.type == 'state'  || place.type == 'cd' )
				setState( place.state );
		}
	};
	if( staticmap ) {
		gonzo && gonzo.remove();
		gonzo = new PolyGonzo.Frame({
			container: $container[0],
			places: p,
			events: events
		});
		var coord = gonzo.latLngToPixel( sm.usLat, sm.usLng, sm.usZoom );
		var usOffset = { x: -coord.x, y: -coord.y };
		if( opt.infoType == 'U.S. House' ) {
			var ak = p[7];
			var hi1 = p[124];
			var hi2 = p[125];
		}
		else if( curState == stateUS ) {
			ak = p[1];
			hi1 = hi2 = p[11];
		}
		var coord = gonzo.latLngToPixel( sm.akLat, sm.akLng, sm.akZoom );
		ak.zoom = sm.akZoom;
		ak.offset = { x: -coord.x, y: -coord.y + sm.insetY };
		var coord = gonzo.latLngToPixel( sm.hiLat, sm.hiLng, sm.hiZoom );
		hi1.offset = hi2.offset = { x: -coord.x + sm.insetWidth + sm.insetPad, y: -coord.y + sm.insetY };
		hi1.zoom = hi2.zoom = sm.hiZoom;
		gonzo.draw({
			places: p,
			offset: usOffset,
			zoom: sm.usZoom
		});
		ak.zoom = ak.offset = hi1.zoom = hi1.offset = hi2.zoom = hi2.offset = null;
	}
	else {
		map.clearOverlays();
		// Let map display before drawing polys
		setTimeout( function() {
			overlay = new PolyGonzo.GOverlay({
				places: p,
				events: events
			});
			map.addOverlay( overlay );
			//overlay.redraw( null, true );
		}, 250 );
	}
}

function colorize( congress, places, results, race ) {
	var locals = results.locals;
	// Use wider borders in IE to cover up gaps between borders, except in House view
	strokeWidth = $.browser.msie && opt.infoType != 'U.S. House' ? 2 : 1;
	for( var iPlace = -1, place;  place = places[++iPlace]; ) {
		var local = null;
		place.precincts = place.electoral = null;
		var seat = congress ? place.name : '';
		place.strokeColor = '#000000';
		place.strokeOpacity = .4;
		place.strokeWidth = strokeWidth;
		if( congress ) {
			var state = statesByAbbr[ place.state.toUpperCase() ];
			local = state && locals[state.name];
		}
		else if( curState != stateUS  &&  opt.infoType == 'U.S. Senate' ) {
			local = results.totals;
		}
		else {
			local = locals[place.name];
		}
		if( ! local ) {
			//place.fillColor = '#000000';
			//place.fillOpacity = 1;
			place.fillColor = '#FFFFFF';
			place.fillOpacity = 0;
			//window.console && console.log( 'Missing place', place.name );
			continue;
		}
		var localrace = local.races[race];
		var localseats = getSeats( localrace, seat );
		if( localseats ) {
			place.races = localseats;
			var tally = localseats[0].votes;
			place.precincts = local.precincts;
			place.electoral = local.electoral;
		}
		place.candidates = results.candidates;
		var id = null;
		if( place.type == 'state'  ||  place.type == 'cd' ) {
			id = localseats && localseats[0].final;
		}
		else if( tally  &&  tally[0]  &&  tally[0].votes  &&  place.precincts && place.precincts.reporting == place.precincts.total )  {
			id = tally[0].id;
		}
		var winner = id && results.candidates[id];
		if( winner ) {
			var party = parties[ winner.split('|')[0] ];
			place.fillColor = party.color;
			place.fillOpacity = winner ? fillOpacity : 0;
		}
		else {
			place.fillColor = '#FFFFFF';
			place.fillOpacity = 0;
		}
	}
}

function getSeats( race, seat ) {
	if( ! race ) return null;
	if( seat == 'One' ) seat = '1';
	if( race[seat] ) return [ race[seat] ];
	if( race['NV'] ) return [ race['NV'] ];
	if( race['2006'] && race['2008'] ) return [ race['2006'], race['2008'] ];
	return null;
}

var tipOffset = { x:10, y:20 };
var $maptip, tipHtml;
$('body').bind( 'mousemove', moveTip );

function showTip( place ) {
	if( ! $maptip ) $maptip = $('#maptip');
	tipHtml = formatTip( place );
	if( tipHtml ) {
		$maptip.html( tipHtml ).show();
	}
	else {
		$maptip.hide();
	}
}

function formatRace( place, race, count, index ) {
	var tally = race.votes
	var precincts = place.precincts;
	if( ! precincts )
		return opt.infoType == 'U.S. Senate' ? 'noSenate'.T() : '';
	var total = 0;
	for( var i = -1, vote;  vote = tally[++i]; ) total += vote.votes;
	var unopposed = ! total  &&  tally.length == 1;
	if( ! total  &&  ! unopposed ) {
		var tally1 = [];
		for( var i = -1, vote;  vote = tally[++i]; ) {
			var candidate = place.candidates[vote.id].split('|');
			var p = candidate[0];
			if( p == 'Dem'  ||  p == 'GOP' )
				tally1.push( vote );
		}
		tally1.sort( function( a, b ) {
			return Math.random() < .5;
		});
		tally = tally1;
	}
	return S(
		'<div>',
			'<table cellpadding="0" cellspacing="0">',
				tally.mapjoin( function( vote, i ) {
					if( i > 3 ) return '';
					if( total && ! vote.votes ) return '';
					var candidate = place.candidates[vote.id].split('|');
					var party = parties[ candidate[0] ];
					var common = 'padding-top:6px; white-space:nowrap;' + ( total && i == 0 ? 'font-weight:bold;' : '' ) + ( count > 1 ? 'font-size:80%;' : '' );
					return S(
						'<tr>',
							'<td style="', common, 'padding-right:12px;">',
								candidate[2], ' (', party && party.letter || candidate[0], ')',
							'</td>',
							unopposed ? S(
								'<td style="', common, '">',
									'unopposed'.T(),
								'</td>'
							) : S(
								'<td style="', common, 'text-align:right; padding-right:12px;">',
									total ? percent( vote.votes / total ) : '0',
								'</td>',
								'<td style="', common, 'text-align:right;">',
									formatNumber( vote.votes ),
								'</td>'
							),
						'</tr>'
					);
				}),
			'</table>',
		'</div>'
	);
}

function formatRaces( place, races ) {
	if( ! races )
		return 'noVotes'.T();
	return S(
		races.map( function( race, index ) {
			return formatRace( place, race, races.length, index );
		}).join( S(
			'<div style="margin-top:4px; padding-top:4px; border-top:1px solid #999;">',
			'</div>'
		) )
	);
}

function formatTip( place ) {
	if( ! place ) return null;
	var precincts = place.precincts;
	var races = place.races;
	var content = S(
		'<div class="tipcontent">',
			formatRaces( place, races ),
		'</div>'
	);
	var footer = precincts ? S(
		'<div class="tipreporting">',
			'percentReporting'.T({ percent:Math.floor( precincts.reporting / precincts.total * 100 ), total:precincts.total }),
		'</div>'
	) : '';
	return S(
		'<div class="tiptitlebar">',
			//box,
			'<div style="float:left;">',
				'<span class="tiptitletext">',
					place.type != 'cd' ? place.name :
					place.name == 'One' ? stateByAbbr(place.state).name :
					'stateDistrict'.T({ state:stateByAbbr(place.state).name, number:place.name }),
					' ',
				'</span>',
				opt.infoType == 'President' && place.type == 'state' ? 'EVs'.T({ votes:place.electoral || place.state == 'ak' && 3 }) : '',
			'</div>',
			'<div style="clear:left;">',
			'</div>',
		'</div>',
		content,
		footer
	);
}

//function formatTip( place ) {
//	if( ! place ) return null;
//	var races = place.races;
//	var race = races && races[0];
//	if( race ) {
//		var tally = race.votes
//		var precincts = place.precincts;
//		if( ! precincts ) return null;
//		var total = 0;
//		for( var i = -1, vote;  vote = tally[++i]; ) total += vote.votes;
//		if( ! total ) {
//			var race1 = [];
//			for( var i = -1, vote;  vote = tally[++i]; ) {
//				var candidate = place.candidates[vote.id].split('|');
//				var p = candidate[0];
//				if( p == 'Dem'  ||  p == 'GOP' )
//					race1.push( vote );
//			}
//			race1.sort( function( a, b ) {
//				return Math.random() < .5;
//			});
//			race = race1;
//		}
//		var box = '';
//		if( total ) {
//			var candidate = place.candidates[race[0].id].split('|');
//			var party = parties[ candidate[0] ];
//			var color = party && party.barColor;
//			if( color ) {
//				box = S(
//					'<div style="float:left; background:', color, '; width:16px; height:16px; margin:2px 6px 0 0; border:1px solid #AAA;">',
//					'</div>'
//				);
//			}
//		}
//		var content = S(
//			'<div class="tipcontent">',
//				'<table cellpadding="0" cellspacing="0">',
//					tally.mapjoin( function( vote, i ) {
//						if( i > 3 ) return '';
//						if( total && ! vote.votes ) return '';
//						var candidate = place.candidates[vote.id].split('|');
//						var party = parties[ candidate[0] ];
//						var common = 'padding-top:4px; white-space:nowrap;' + ( total && i > 0 ? 'font-weight:bold;' : '' );
//						return S(
//							'<tr>',
//								'<td style="', common, 'padding-right:12px;">',
//									candidate[2], ' (', party.letter || candidate[0], ')',
//								'</td>',
//								'<td style="', common, 'text-align:right; padding-right:12px;">',
//									total ? Math.round( vote.votes / total * 100 ) : '0', '%',
//								'</td>',
//								'<td style="', common, 'text-align:right;">',
//									formatNumber( vote.votes ),
//								'</td>',
//							'</tr>'
//						);
//					}),
//				'</table>',
//			'</div>',
//			'<div class="tipreporting">',
//				'percentReporting'.T({ percent:Math.floor( precincts.reporting / precincts.total * 100 ), total:precincts.total }),
//			'</div>'
//		);
//	}
//	else if( opt.infoType == 'U.S. Senate' ) {
//		var content = S(
//			'<div class="tipcontent">',
//				'noSenate'.T(),
//			'</div>'
//		);
//	}
//	else {
//		return null;
//	}
//	return S(
//		'<div class="tiptitlebar">',
//			box,
//			'<div style="float:left;">',
//				'<span class="tiptitletext">',
//					place.type == 'cd' ? 'stateDistrict'.T({ state:stateByAbbr(place.state).name, number:place.name }) : place.name, ' ',
//				'</span>',
//				opt.infoType == 'President' && place.type == 'state' ? 'EVs'.T({ votes:place.electoral || place.state == 'ak' && 3 }) : '',
//			'</div>',
//			'<div style="clear:left;">',
//			'</div>',
//		'</div>',
//		content
//	);
//}

var tipLeft, tipTop;

function moveTip( event ) {
	if( ! tipHtml ) return;
	var x = event.pageX, y = event.pageY;
	x += tipOffset.x;
	y += tipOffset.y;
	var pad = 2;
	var width = $maptip.width(), height = $maptip.height();
	var offsetLeft = width + tipOffset.x * 1.5;
	var offsetTop = height + tipOffset.y * 1.5;
	if( tipLeft ) {
		if( x - offsetLeft < pad )
			tipLeft = false;
		else
			x -= offsetLeft;
	}
	else {
		if( x + width > ww - pad )
			tipLeft = true,  x -= offsetLeft;
	}
	if( tipTop ) {
		if( y - offsetTop < pad )
			tipTop = false;
		else
			y -= offsetTop;
	}
	else {
		if( y + height > wh - pad )
			tipTop = true,  y -= offsetTop;
	}
	$maptip.css({ left:x, top:y });
}

function formatNumber( nStr ) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function getLeaders( locals ) {
	var leaders = {};
	for( var localname in locals ) {
		var votes = locals[localname].votes[0];
		if( votes ) leaders[votes.name] = true;
	}
	return leaders;
}

// Separate for speed
function getLeadersN( locals, n ) {
	var leaders = {};
	for( var localname in locals ) {
		for( var i = 0;  i < n;  ++i ) {
			var votes = locals[localname].votes[i];
			if( votes ) leaders[votes.name] = true;
		}
	}
	return leaders;
}

function makeIcons() {
	'red white blue'.words( function( color ) {
		icons[color] = makeColorIcon( color );
	});
	//loadCandidateIcons();
}

function makeColorIcon( color ) {
	var icon = new GIcon;
	icon.image = 'http://www.google.com/intl/en_us/mapfiles/ms/icons/' + color + '-dot.png';
	//icon.shadow = '';
	icon.iconSize = new GSize( 32, 32 );
	//icon.shadowSize = new GSize( 0, 0 );
	icon.iconAnchor = new GPoint( 16, 32 );
	icon.infoWindowAnchor = new GPoint( 16, 0 );
	return icon;
}

function setStateByAbbr( abbr ) {
	setState( stateByAbbr(abbr) );
}

function setStateByName( name ) {
	setState( statesByName[name] );
}

function setState( state ) {
	if( ! state ) return;
	if( typeof state == 'string' ) state = stateByAbbr( state );
	var select = $('#stateSelector')[0];
	select && ( select.selectedIndex = state.selectorIndex );
	opt.state = state.abbr.toLowerCase();
	loadState();
}

function initMap() {
	if( map ) return;
	
	if( ! GBrowserIsCompatible() ) return;
	map = new GMap2( $('#map')[0] );
	//zoomRegion();
	map.enableContinuousZoom();
	map.enableDoubleClickZoom();
	//map.enableGoogleBar();
	map.enableScrollWheelZoom();
	//map.addControl( new GLargeMapControl() );
	map.addControl( new GSmallMapControl() );
	map.addControl( new NationwideControl() );
}

function load() {
	
	makeIcons();
	
	setStateByAbbr( opt.state );
	
	$('#stateSelector')
		.change( stateSelectorChange )
		.keyup( stateSelectorChange );
		
	function stateSelectorChange() {
		var value = this.value.replace('!','').toLowerCase();
		if( opt.state == value ) return;
		opt.state = value;
		loadState();
	}
	
	$('#stateInfoSelector')
		.change( infoSelectorChange )
		.keyup( infoSelectorChange );
	
	function infoSelectorChange() {
		var value = this.value;
		if( opt.infoType == value ) return;
		opt.infoType = value;
		loadState( true );
	}
}

function oneshot() {
	var timer;
	return function( fun, time ) {
		clearTimeout( timer );
		timer = setTimeout( fun, time );
	};
}

function hittest( latlng ) {
}

function loadState( reload ) {
	clearTimeout( reloadTimer );
	reloadTimer = null;
	showTip( false );
	map && map.clearOverlays();
	var abbr = opt.state;
	var $select = $('#stateInfoSelector');
	opt.infoType = $select.val();
	
	var state = curState = stateByAbbr( abbr );
	$('#spinner').show();
	getShapes( state, function() {
		getResults( state, function() {
			stateReady( state, reload );
		});
	});
}

function getShapes( state, callback ) {
	if( opt.infoType == 'U.S. House' ) state = stateCD;
	if( state.shapes ) callback();
	else getJSON( 'shapes', opt.shapeUrl, state.abbr.toLowerCase() + '.json', 3600, function( shapes ) {
		state.shapes = shapes;
		if( state == stateUS ) shapes.places.state.index('state');
		callback();
	});
}

function getResults( state, callback ) {
	getJSON( 'votes', opt.voteUrl, state.abbr.toLowerCase() + '-all.json', 300, function( results ) {
		state.results = results;
		callback();
	});
}

function objToSortedKeys( obj ) {
	var result = [];
	for( var key in obj ) result.push( key );
	return result.sort();
}

var blank = imgUrl( 'blank.gif' );

function voteBar( a, left, center, right ) {
	
	function topLabel( who, side ) {
		return S(
			'<td width="48%" align="', side, '">',
				'<div id="candidate-', side, '" class="candidate', a.small ? '-small' : '', '" style="width:100%; white-space:nowrap;', side == 'right' ? 'padding-right:5px;' : '', '">',
					who.name,
				'</div>',
			'</td>'
		);
	}
	
	function bar( who, side ) {
		var w = who.votes / a.total * ( a.width - 3 );
		return S(
			'<div class="barnum" style="float:left; background:', who.color, '; width:', w, 'px; height:20px; padding-top:1px; text-align:', side || 'center', '">',
				'<img src="', blank, '" />',
			'</div>',
			side ? S(
			'<div class="barvote" style="z-index:1; position:absolute; top:1px; ', side == 'left' ? 'left:6px;' : 'right:10px;', '">',
				formatNumber(who.votes),
			'</div>'
			) : ''
		);
	}
	
	return S(
		'<table width="100%" cellspacing="0" cellpadding="0">',
			'<tr>',
				topLabel( left, 'left' ),
				'<td width="4%" align="center">|</td>',
				topLabel( right, 'right' ),
			'</tr>',
			'<tr>',
				'<td colspan="3" align="center">',
					'<div style="margin: 4px 0;" align="center">',
						'<div style="width:100%; position:relative;" align="center">',
							bar( left, 'left' ), bar( center), bar( right, 'right' ),
							'<div style="clear:both;">',
							'</div>',
						'</div>',
					'</div>',
				'</td>',
			'</tr>',
			'<tr>',
				'<td colspan="3">',
					'<div>',
						'<div style="float:left; background:', center.color, '; width:16px; height:16px;">',
						'</div>',
						'<div style="float:left; padding-left:3px;">',
							'&#160;',
						'</div>',
						'<div id="centerlabel" style="float:left; white-space:nowrap; padding-top:3px;">',
							' ', center.label,
						'</div>',
						'<div style="clear:both;">',
						'</div>',
					'</div>',
				'</td>',
			'</tr>',
		'</table>'
	);
}

$window
	.bind( 'load', function() {
		var $map = $('#map');
		$map.height( wh - $map.offset().top );
		getShapes( stateUS, load );
		_IG_Analytics( 'UA-5730550-1', '/results' );
	})
	.bind( 'unload', GUnload );

})( jQuery );
