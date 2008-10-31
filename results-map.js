// results-map.js
// Copyright (c) 2008 Michael Geary
// http://mg.to/
// Free Beer and Free Speech License (use any OSI approved license)
// http://freebeerfreespeech.org/
// http://www.opensource.org/licenses/

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

(function( $ ) {

var opt = window.GoogleElectionMapOptions || {};
opt.static = opt.tpm;
opt.fontsize = '15px';
opt.panelWidth = 200;

function getFactors() {
	var state = stateByAbbr(opt.state);
	return state.factors;
}

var p = new _IG_Prefs();
function str( key, def ) { return p.getString(key) || ''+def || ''; }
function nopx( key, def ) { return str(key,def).replace( /px$/, '' ); }
var win = { height:$(window).height(), width:$(window).width() };
//opt.twitter = p.getBool('twitter');
opt.state = p.getString('state');

opt.twitter = false;
opt.youtube = false;

opt.zoom = opt.zoom || 3;

opt.tileUrl = opt.tileUrl || 'http://gmodules.com/ig/proxy?max_age=3600&url=http://election-map-tiles-1.s3.amazonaws.com/boundaries/';

opt.infoType = 'President';

var parties = {
	AIP: {},
	AKI: {},
	AmC: {},
	BEP: {},
	BoT: {},
	CST: {},
	Con: {},
	Dem: { color:'#0000FF', barColor:'#7777FF', letter:'D', shortName:'Democratic', fullName:'Democratic Party' },
	GOP: { color:'#FF0000', barColor:'#FF7777', letter:'R', shortName:'Republican', fullName:'Republican Party' },
	Grn: {},
	HQ8: {},
	IAP: {},
	IGr: {},
	Ind: {},
	Inp: {},
	LTP: {},
	LUn: {},
	Lib: {},
	Mnt: {},
	NLP: {},
	NPA: {},
	NPD: {},
	Neb: {},
	New: {},
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
	SPU: {},
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
	{ "abbr":"ME", "name":"Maine", "bounds":[[-71.0818,43.0578],[-66.9522,47.4612]] },
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

function infoTip( state, type ) {
	state = state || opt.state;
	type = type || opt.infoType;
	var tips = stateByAbbr(state).infoTips;
	return tips && tips[type];
}

function cacheUrl( url, cache ) {
	if( opt.nocache ) return url + '?q=' + new Date().getTime();
	url = _IG_GetCachedUrl( url, typeof cache == 'number' ? { refreshInterval:cache } : {} );
	if( ! url.match(/^http:/) ) url = 'http://' + location.host + url;
	return url;
}

function getJSON( url, cache, callback ) {
	if( typeof cache != 'number' ) { callback = cache;  cache = 120; }
	_IG_FetchContent( url, function( json ) {
		callback( eval( '(' + json + ')' ) );
	}, {
		refreshInterval: opt.nocache ? 1 : cache
	});
}

function htmlEscape( str ) {
	var div = document.createElement( 'div' );
	div.appendChild( document.createTextNode( str ) );
	return div.innerHTML;
}

function percent( n ) {
	n = Math.round( n * 100 );
	return n ? n + '%' : '';
}

function showCredits() {
	showInfoTip( true, {
		width: 290,
		top: 40,
		title: 'Credits',
		text: S(
			'<div class="credits">',
				'<div class="credit">',
					'Designed and developed by:',
					'<div class="source">',
						'<a target="_blank" href="http://mg.to/">Michael Geary</a>',
					'</div>',
				'</div>',
				'<div class="credit">',
					'With contributions by:',
					'<div class="source">',
						'<a target="_blank" href="http://www.ernestdelgado.com/">Ernest Delgado</a>',
					'</div>',
					'<div class="source">',
						'<a target="_blank" href="http://www.imagine-it.org/">Pamela Fox</a>',
					'</div>',
				'</div>',
				'<div class="credit">',
					'Data provided by:',
					'<div class="source">',
						'<a target="_blank" href="http://www.ap.org/">Associated&nbsp;Press</a>',
					'</div>',
					'<div class="source">',
		'<a target="_blank" href="http://factfinder.census.gov/">US Census Bureau</a>',
					'</div>',
				'</div>',
				'<div class="credit">',
					'Special thanks to:',
					'<div class="source">',
						'<a target="_blank" href="http://www.brittanybohnet.com/">Brittany Bohnet</a>',
					'</div>',
					'<div class="source">',
						'<a target="_blank" href="http://code.google.com/apis/maps/">Google Maps API Team</a>',
					'</div>',
				'</div>',
			'</div>'
		)
	});
}

// TODO: generalize this
CreditsControl = function( show ) {
	return $.extend( new GControl, {
		initialize: function( map ) {
			var $control = $(S(
				'<div style="color:black; font-family:Arial,sans-serif;">',
					'<div style="background-color:white; border:1px solid black; cursor:pointer; text-align:center; width:3.5em;">',
						'<div style="border-color:white #B0B0B0 #B0B0B0 white; border-style:solid; border-width:1px; font-size:12px;">',
							'Credits',
						'</div>',
					'</div>',
				'</div>'
			)).click( showCredits ).appendTo( map.getContainer() );
			return $control[0];
		},
		
		getDefaultPosition: function() {
			return new GControlPosition( G_ANCHOR_BOTTOM_LEFT, new GSize( 4, 40 ) );
		}
	});
};

var shortMonths = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

function fmtDate( date ) {
	var d = date.split('-');
	if( d.length != 2 ) return date;
	return shortMonths[ d[0] - 1 ] + ' ' + (+d[1]);
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

//var hotStates = [ 'MT!', 'NM!', 'SD!' ]/*.index()*/;
var hotStates = [];

(function() {
	var index = 0;
	function option( value, name, selected, disabled ) {
		var html = optionHTML( value, name, selected, disabled );
		++index;
		return html;
	}
	function stateOption( state, selected, dated ) {
		state.selectorIndex = index;
		var dates = '';
		//if( dated ) {
		//	var dem = state.parties.dem.date, gop = state.parties.gop.date;
		//	dates = ' (' + ( dem == gop ? fmtDate(dem) : S( 'D:', fmtDate(dem), ', R:', fmtDate(gop) ) ) + ')';
		//}
		return option( state.abbr, state.name + dates, selected );
	}
	
	var hot;
	stateSelector = S(
		'<div id="selectorpanel" style="width:100%; height:100%;">',
			'<div style="margin:0; padding:4px;">',
				'<div class="sifr" style="white-space:nowrap; margin:2px 0;">',
					'Choose a state and select a race:',
				'</div>',
				'<table class="selects" cellspacing="0" cellpadding="0" style="margin-right:6px;">',
					'<tr>',
						'<td class="labelcell">',
							'<label class="sifr" for="stateSelector">',
								'State:',
							'</label>',
						'</td>',
						'<td class="selectcell">',
							'<div class="selectdiv">',
								'<select id="stateSelector">',
									option( 'us', 'Entire USA' ),
									//option( '', 'June 3 Primary', false, true ),
									//hotStates.mapjoin( function( abbr ) {
									//	abbr = abbr.replace( '!', '' ).toLowerCase();
									//	var select;
									//	if( abbr == opt.state ) hot = select = true;
									//	return stateOption( stateByAbbr(abbr), select, false );
									//}),
									//option( '', 'All States and Voting Dates', false, true ),
									states.mapjoin( function( state ) {
										return /*hotStates.by[state.abbr] ? '' :*/ stateOption( state, ! hot && state.abbr.toLowerCase() == opt.state, true );
									}),
								'</select>',
							'</div>',
						'</td>',
					'</tr>',
					//$(window).width() < 500 ? '' : S(
					//	'</table>',
					//	'<table class="selects" cellspacing="0" cellpadding="0" style="xmargin-right:6px;">'
					//),
					'<tr>',
						'<td class="labelcell">',
							'<label class="sifr" for="stateInfoSelector">',
								'Race:',
							'</label>',
						'</td>',
						'<td class="selectcell">',
							'<div class="selectdiv">',
								'<select id="stateInfoSelector">',
									option( 'President', 'President', true ),
									option( 'U.S. House', 'U.S. House' ),
									option( 'U.S. Senate', 'U.S. Senate' ),
								'</select>',
							'</div>',
						'</td>',
					'</tr>',
				'</table>',
			'</div>',
		'</div>'
	);
	
	$(function() {
		var common = htmlCommon();
		var unique = htmlApiMap();
		var tpm = htmlTPM();
		$('head').append( common.head + unique.head );
		if( opt.tpm ) {
			$('head').append( tpm.head );
			$('body').append( tpm.body );
		}
		$('body').append( common.body + unique.body );
	});
	
	// TODO: migrate other CSS here
	function htmlCommon() {
		return {
			head: S(
				'<style type="text/css">',
					'.selects tr { vertical-align:middle; }',
					'.selects label { font-weight:bold; margin:0; }',
					'.selects .selectdiv { margin:0 0 4px 6px; }',
					'.attribution { border-bottom:1px solid #DDD; padding-bottom:4px; margin-bottom:4px; }',
					'.attribution * { font-size:85%; }',
					'.legend {}',
					'.legend table { width:320px; }',
					'.legend td, .legend * { font-size:12px; white-space:pre; }',
					'.legend div { float:left; }',
					'#infoicon { cursor:pointer; }',
					'.placerow { padding:2px; margin:1px; border:2px solid white; cursor:pointer; }',
					'.placerow-hilite { border-color:#444; }',
					'a.delbox { background-position:-60px 0px; float:right; height:12px; overflow:hidden; position:relative; width:12px; background-image:url(http://img0.gmodules.com/ig/images/sprite_arrow_enlarge_max_min_shrink_x_blue.gif); }',
					'a.delbox:hover { background-position:-60px -12px; }',
					'.credits {}',
					'.credits .credit { margin-top:8px; }',
					'.credits .source { margin-left:16px; }',
				'</style>'
			),
			body: ''
		}
	}
	
	function htmlTPM() {
		return {
			head: S(
				'<style type="text/css">',
					'#selectorpanel { height:85px; }',
					'#selectorpanel .sifr, #selectorpanel .sifr * { font-size:14px; }',
					'.candidate, .candidate * { font-size:18px; }',
					'.candidate-small, .candidate-small * { font-size:14px; }',
					'#centerlabel, #centerlabel * { font-size:12px; }',
					'.barnum { color:white; }',
				'</style>'
			),
			body: S(
				'<div style="margin-bottom:4px;">',
					'<img style="border:none; width:573px; height:36px;" src="', imgUrl('tpm/tpm-scoreboard.png'), '" />',
				'</div>'
			)
		}
	}
	
	function htmlApiMap() {
		var $window = $(window), ww = $window.width(), wh = $window.height();
		var sw = opt.panelWidth;
		document.body.scroll = 'no';
		return {
			head: S(
				'<style type="text/css">',
					'html, body { margin:0; padding:0; border:0 none; overflow:hidden; width:', ww, 'px; height:', wh, 'px; }',
					'* { font-family: Arial,sans-serif; font-size: ', opt.fontsize, '; }',
					'#outer {}',
					opt.tpm ? '.fullpanel { background-color:#CCC7AA; }' : '.leftpanel { background-color:#EEE; }',
					'#stateSelector, #stateInfoSelector { width:', sw - 12, 'px; }',
					'.barnum { font-weight:bold; }',
					'#eventbar { display:none; }',
					'#links { margin-bottom:4px; }',
					'#news { margin-top:4px; padding:4px; }',
					'#clicknote { display:none; }',
					'h2 { font-size:11pt; margin:0; padding:0; }',
					'#loading { font-weight:normal; }',
					'.favicon { width:16; height:16; float:left; padding:2px 4px 2px 2px; }',
					'#fullstate { margin-top:12px; }',
					'#fullstate table { width:700px; }',
					'#fullstate th, #fullstate td { text-align: right; background-color:#E8E8E8; padding:2px; }',
					'#fullstate th.countyname, #fullstate td.countyname { text-align:left; font-weight:bold; }',
					'.statewide * { font-weight: bold; }',
					'#votestitle { margin:12px 0 3px 0; padding:0; }',
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
				'</style>'
			),
			body: S(
				'<div id="outer">',
					'<table cellpadding="0" cellspacing="0">',
						'<tr valign="top" class="fullpanel">',
							'<td style="width:', sw, 'px;" class="leftpanel">',
								stateSelector,
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
				'</div>'
			)
		}
	}
})();

var map, staticmap, gonzo;

opt.codeUrl = opt.codeUrl || 'http://general-election-2008.googlecode.com/svn/trunk/';
opt.imgUrl = opt.imgUrl || opt.codeUrl + 'images/';
opt.shapeUrl = opt.shapeUrl || 'http://general-election-2008-data.googlecode.com/svn/trunk/json/shapes/';
opt.voteUrl = opt.voteUrl || 'http://general-election-2008-data.googlecode.com/svn/trunk/json/votes/';
opt.state = opt.state || 'us';

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
	if( opt.infoType == 'U.S. House' ) {
		var chart = '';
	}
	else if( curState == stateUS ) {
		var chart = voteBar( barWidth, {
			name: 'Obama',
			letter: 'D',
			votes: 203,
			color: parties.Dem.barColor
		},
		{
			label: '61 undecided - 270 electoral votes needed',
			votes: 61,
			color: parties.x.barColor
		},
		{
			name: 'McCain',
			letter: 'R',
			votes: 274,
			color: parties.GOP.barColor
		},
		{
			votes: 538
		});
	}
	else {
		var type = opt.infoType;
		var seat = '';  // President
		var results = curState.results, candidates = results.candidates;
		var race = results.totals.races[type];
		var tallies = race && race[seat].votes;
		var total = 0;
		var chart = '';
		if( tallies  &&  tallies.length >= 2 ) {
			for( var i = -1, tally;  tally = tallies[++i]; ) total += tally.votes;
			var other = total - tallies[0].votes - tallies[1].votes;
			var top = tallies.slice( 0, 2 );
			var cands = top.map( function( tally ) { return candidates[tally.id].split('|'); } );
			var parts = cands.map( function( cand ) { return parties[ cand[0] ]; } );
			if( parts[0].letter == 'R' ) {
				top = [ top[1], top[0] ];
				parts = [ parts[1], parts[0] ];
				cands = [ cands[1], cands[0] ];
			}
			var who = function( i ) {
				return {
					name: cands[i][1],
					letter: parts[i].letter,
					votes: top[i].votes,
					color: parts[i].barColor
				};
			}
			var chart = voteBar( barWidth, who(0), {
				label:  'Others - ' + formatNumber(other),
				votes: other,
				color: parties.x.barColor
			}, who(1), {
				votes: total
			});
		}
	}
	$('#content-two').html( S(
		'<div id="chart" style="margin:4px;">',
			'<div style="width:', barWidth, 'px;">',
				chart,
			'</div>',
		'</div>'
	) );
	
	if( opt.tpm ) {
		$('#candidate-left').sifr();
		$('#candidate-left').sifr();
		$('#candidate-right').sifr({ textAlign: 'right' });
		$('#centerlabel').sifr();
	}
}

var sm = {
	mapWidth: 573,
	mapHeight: 337,
	insetHeight: 67,
	insetWidth: 67,
	insetPad: 4,
	usZoom: 3.7,
	akZoom: 0.7,
	hiZoom: 3.7
};
sm.insetY = sm.mapHeight - sm.insetHeight;

function stateReady( state ) {
	loadChart();
	staticmap = opt.static  &&  state == stateUS;
	if( staticmap ) {
		$('#map').hide();
		$('#staticmap').show();
		if( ! $('#staticmapimg').length )
			$('#staticmap').html( S(
				'<img id="staticmapimg" border="0" style="width:', sm.mapWidth, 'px; height:', sm.mapHeight, 'px;" src="', imgUrl('static-usa-'+sm.mapWidth+'.png'), '" />'
			) );
	}
	else {
		$('#staticmap').hide();
		$('#map').show();
		initMap();
		map.checkResize();
		map.clearOverlays();
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
	polys();
}

function polys() {
	var congress, districts;
	if( opt.infoType == 'U.S. House' ) {
		var p = stateCD.shapes.places.district;
		congress = true;
		if( curState != stateUS ) districts = [];
	}
	else {
		var p = curState.shapes.places;
		p = p.town || p.county || p.state;
	}
	colorize( congress, p, districts, curState.results, opt.infoType );
	//if( districts ) debugger;
	if( staticmap ) {
		gonzo && gonzo.remove();
		gonzo = new PolyGonzo.Frame({
			container: $('#staticmap')[0],
			places: districts || p
		});
		var coord = gonzo.latLngToPixel( 50.7139, -126.45, sm.usZoom );
		var usOffset = { x: -coord.x, y: -coord.y };
		var ak = p[1], hi = p[11];
		var coord = gonzo.latLngToPixel( 73.8, -182.3, sm.akZoom );
		ak.zoom = sm.akZoom;
		ak.offset = { x: -coord.x, y: -coord.y + sm.insetY };
		var coord = gonzo.latLngToPixel( 23.8, -161.1, sm.hiZoom );
		hi.offset = { x: -coord.x + sm.insetWidth + sm.insetPad, y: -coord.y + sm.insetY };
		hi.zoom = sm.hiZoom;
		gonzo.draw({
			places: p,
			offset: usOffset,
			zoom: sm.usZoom
		});
	}
	else {
		map.clearOverlays();
		// Let map display before drawing polys
		setTimeout( function() {
			gonzo = new PolyGonzo.GOverlay({
				places: districts || p,
				events: {
					mousemove: function( event, where ) {
						//if( curState != stateUS )
						//	$('#content-two').html( '(test) Mouse over:<br />' + ( where && where.place && where.place.name || 'nowhere' ) );
					},
					click: function( event, where ) {
						var place = where && where.place;
						if( ! place ) return;
						if( place.type == 'state' )
							setState( place.state );
					}
				}
			});
			map.addOverlay( gonzo );
			//gonzo.redraw( null, true );
		}, 250 );
	}
}

function colorize( congress, places, districts, results, race ) {
	var locals = results.locals;
	for( var iPlace = -1, place;  place = places[++iPlace]; ) {
		if( congress ) {
			if( districts ) {
				if( place.state.toUpperCase() != curState.abbr )
					continue;
				districts.push( place );
			}
			var seat = place.name;
		}
		else {
			var seat = '';
		}
		place.strokeColor = '#000000';
		place.strokeOpacity = .4;
		place.strokeWidth = 2;
		if( ! congress ) {
			var local = locals[place.name];
		}
		else if( ! districts ) {
			var state = statesByAbbr[ place.state.toUpperCase() ];
			var local = state && locals[state.name];
		}
		else {
			debugger;
		}
		if( ! local ) {
			place.fillColor = '#000000';
			place.fillOpacity = 1;
			//if( ! confirm( 'Missing place ' + place.name + '\nClick Cancel to debug' ) )
			//	debugger;
			continue;
		}
		var color = null;
		var localrace = local.races[race];
		var localseat = localrace && localrace[seat];
		if( localseat ) {
			var tally = localseat.votes;
			//var winner = tally[0];
			//var tally = locals[place.name].races[race].votes;
			var winner = results.candidates[ tally[0].id ];
			var party = parties[ winner.split('|')[0] ];
			var color = party.color;
			var done = localseat.final;
		}
		if( color ) {
			place.fillColor = color;
			place.fillOpacity = done ? fillOpacity : 0;
		}
		else {
			place.fillColor = '#FFFFFF';
			place.fillOpacity = 0;
		}
	}
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
	map.addControl( new CreditsControl() );
	
	GEvent.addListener( map, 'click', closeInfoTip );
	GEvent.addListener( map, 'dragstart', closeInfoTip );
	//GEvent.addListener( map, 'mousemove', mapmousemoved/*.hover*/ );
	//GEvent.addListener( map, 'mouseout', mapmousemoved.clear );
	
	GEvent.addListener( map, 'click', function( overlay, latlng ) {
		var where = hittest( latlng );
		setHilite( where && where.place.name, true );
		openInfo( where && where.place );
	});
}

function load() {
	
	makeIcons();
	
	var testdata = false;
	if( location.search.slice(1) == 'test' )
		testdata = true;
	
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
		loadState();
	}
}

function oneshot() {
	var timer;
	return function( fun, time ) {
		clearTimeout( timer );
		timer = setTimeout( fun, time );
	};
}

function showInfoTip( show, tip ) {
	var $infotip = $('#infotip');
	if( show ) {
		if( $infotip[0] ) return;
		var footer = '';
		if( ! tip ) {
			tip = infoTip();
			footer = S(
				'<div style="margin-top:12px;">',
					'Commentary by <a target="_blank" href="http://www.nationaljournal.com/">National Journal</a>',
				'</div>'
			);
		}
		var $outer = $('#outer'), ow = $outer.width();
		var width = tip.width || ow - 40;
		var offset = $outer.offset();
		var top = offset.top + ( tip.top || 8 );
		//var left = offset.left + 8;
		var left = offset.left + ( ow - width ) / 2 - 8;
		
		$('body').append( S(
			//'<div id="infotip" style="z-index:999; position:absolute; top:', top, 'px; left:', left, 'px; width:', width, 'px; padding:8px; background-color:#F2EFE9; border: 1px solid black;">',
			'<div id="infotip" style="z-index:999; position:absolute; top:', top, 'px; left:', left, 'px; width:', width, 'px; padding:8px; background-color:#F8F7F3; border: 1px solid black;">',
				'<div style="margin-bottom:4px;">',
					'<table cellspacing="0" cellpadding="0">',
						'<tr valign="top">',
							'<td style="width:99%;">',
								'<b>', tip.title, '</b>',
							'</td>',
							'<td style="width:12px;">',
								'<a class="delbox" id="infoclose" href="javascript:void(0)" title="Close">',
								'</a>',
							'</td>',
						'</tr>',
					'</table>',
				'</div>',
				'<div margin-top:12px;>',
					tip.text,
				'</div>',
				footer,
			'</div>'
		) );
		
		$('body').append( S(
			'<iframe id="tipframe" style="position:absolute; top:', top, 'px; left:', left, 'px; width:', width, 'px; height:', $('#infotip').height(), 'px; border:0" frameborder="0">',
			'</iframe>'
		) );
		
		$('#infoclose').click( function() { showInfoTip( false ); })
		$(document).bind( 'keydown', infoTipKeyDown ).bind( 'mousedown', infoTipMouseDown );
	}
	else {
		$(document).unbind( 'keydown', infoTipKeyDown ).unbind( 'mousedown', closeInfoTip );
		$infotip.remove();
		$('#tipframe').remove();
	}
}

function infoTipKeyDown( event ) {
	if( event.keyCode == 27 )
		closeInfoTip();
}

function infoTipMouseDown( event ) {
	if( ! $(event.target).is('a') )
		closeInfoTip();
}

function closeInfoTip() {
	showInfoTip( false );
}

function hittest( latlng ) {
}

function loadState() {
	map && map.clearOverlays();
	var abbr = opt.state;
	var $select = $('#stateInfoSelector');
	opt.infoType = $select.val();
	
	var state = curState = stateByAbbr( abbr );
	getShapes( state, function() {
		getResults( state, function() {
			stateReady( state );
		});
	});
}

function getShapes( state, callback ) {
	if( opt.infoType == 'U.S. House' ) state = stateCD;
	if( state.shapes ) callback();
	else getJSON( S( opt.shapeUrl, state.abbr.toLowerCase(), '.json' ), 120, function( shapes ) {
		state.shapes = shapes;
		callback();
	});
}

function getResults( state, callback ) {
	getJSON( S( opt.voteUrl, state.abbr.toLowerCase(), '-all.json' ), 120, function( results ) {
		state.results = results;
		callback();
	});
}

var infoIcon = S( '<img id="infoicon" style="width:16px; height:16px;" src="', imgUrl('help.png'), '" />' );

function objToSortedKeys( obj ) {
	var result = [];
	for( var key in obj ) result.push( key );
	return result.sort();
}

function localityName( state, place ) {
	var name = place.name.replace( / County$/, '' );
	if( place.type == 'county'  &&  ! state.votesby  &&  ! state.parties[curParty.name].votesby  &&  ! name.match(/ City$/) ) name += ' County';
	return name;
}

function imgUrl( name ) {
	return cacheUrl( opt.imgUrl + name );
}

function voteBar( width, left, center, right, total ) {
	
	var blank = imgUrl( 'blank.gif' );
	
	function topLabel( who, side ) {
		return S(
			'<td width="48%" align="', side, '">',
				'<div id="candidate-', side, '" class="candidate', opt.infoType == 'President' ? '' : 'small', '" style="width:100%; white-space:nowrap;">',
					who.name, ' (', who.letter, ')',
				'</div>',
			'</td>'
		);
	}
	
	function bar( who, side ) {
		var w = who.votes / total.votes * ( width - 1 );
		return S(
			'<div class="barnum" style="float:left; background:', who.color, '; width:', w, 'px; height:20px; padding-top:1px; text-align:', side || 'center', '">',
				side ? S( '&#160;', formatNumber(who.votes), '&#160;' ) : S( '<img src="', blank, '" />' ),
			'</div>'
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

$(function() {
	if( opt.tpm ) {
		$.sifr({
			font: cacheUrl(opt.fontUrl),
			textAlign: 'left',
			textTransform: 'uppercase'
		});
		$('#scoreboard').sifr();
		$('#selectorpanel .sifr').sifr();
	}
});

$(window)
	.bind( 'load', function() {
		var $window = $(window), wh = $window.height();
		var $map = $('#map');
		$map.height( wh - $map.offset().top );
		getShapes( stateUS, load );
	})
	.bind( 'unload', GUnload );

})( jQuery );
