// static-results-map.js
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

//(function( $ ) {
//	
//	var opt = {
//		slop: 7,
//		interval: 200
//	};
//	
//	function start() {
//		if( ! timer ) {
//			timer = setInterval( check, opt.interval );
//			$(document.body).bind( 'mousemove', move );
//		}
//	}
//	
//	function clear() {
//		if( timer ) {
//			clearInterval( timer );
//			timer = null;
//			$(document.body).unbind( 'mousemove', move );
//		}
//	}
//	
//	function check() {
//		if ( ( Math.abs( cur.x - last.x ) + Math.abs( cur.y - last.y ) ) < opt.slop ) {
//			clear();
//			for( var i  = 0,  n = functions.length;  i < n;  ++i )
//				functions[i]();
//		}
//		else {
//			last = cur;
//		}
//	}
//	
//	function move( e ) {
//		cur = { x:e.screenX, y:e.screenY };
//	}
//	
//	var timer, last = { x:0, y:0 }, cur = { x:0, y:0 }, functions = [];
//	
//	hoverize = function( fn, fast ) {
//		
//		function now() {
//			fast && fast.apply( null, args );
//		}
//		
//		function fire() {
//			clear();
//			return fn.apply( null, args );
//		}
//		functions.push( fire );
//		
//		var args;
//		
//		return {
//			clear: clear,
//			
//			now: function() {
//				args = arguments;
//				now();
//				fire();
//			},
//			
//			hover: function() {
//				args = arguments;
//				now();
//				start();
//			}
//		};
//	}
//})( jQuery );

opt.fontsize = '15px';

var p = new _IG_Prefs();
function str( key, def ) { return p.getString(key) || ''+def || ''; }
function nopx( key, def ) { return str(key,def).replace( /px$/, '' ); }
var win = { height:$(window).height(), width:$(window).width() };
opt.state = p.getString('state');

opt.infoHeight = 45;
opt.mapHeight = win.height - opt.infoHeight;

var imgBaseUrl = opt.imgBaseUrl || 'http://general-election-2008.googlecode.com/svn/trunk/images/';

var parties = [
	{ name: 'Dem', color: '#0000FF', shortName: 'Democratic', fullName: 'Democratic Party' },
	{ name: 'GOP', color: '#FF0000', shortName: 'Republican', fullName: 'Republican Party' }
].index('name');

var states = [
	{
		'abbr': 'AL',
		'name': 'Alabama'
	},
	{
		'abbr': 'AK',
		'name': 'Alaska'
	},
	{
		'abbr': 'AZ',
		'name': 'Arizona'
	},
	{
		'abbr': 'AR',
		'name': 'Arkansas'
	},
	{
		'abbr': 'CA',
		'name': 'California'
	},
	{
		'abbr': 'CO',
		'name': 'Colorado'
	},
	{
		'abbr': 'CT',
		'name': 'Connecticut',
		'votesby': 'town'
	},
	{
		'abbr': 'DE',
		'name': 'Delaware'
	},
	{
		'abbr': 'DC',
		'name': 'District of Columbia'
	},
	{
		'abbr': 'FL',
		'name': 'Florida'
	},
	{
		'abbr': 'GA',
		'name': 'Georgia'
	},
	{
		'abbr': 'HI',
		'name': 'Hawaii'
	},
	{
		'abbr': 'ID',
		'name': 'Idaho'
	},
	{
		'abbr': 'IL',
		'name': 'Illinois'
	},
	{
		'abbr': 'IN',
		'name': 'Indiana'
	},
	{
		'abbr': 'IA',
		'name': 'Iowa'
	},
	{
		'abbr': 'KS',
		'name': 'Kansas',
		'votesby': 'district'
	},
	{
		'abbr': 'KY',
		'name': 'Kentucky'
	},
	{
		'abbr': 'LA',
		'name': 'Louisiana'
	},
	{
		'abbr': 'ME',
		'name': 'Maine'
	},
	{
		'abbr': 'MD',
		'name': 'Maryland'
	},
	{
		'abbr': 'MA',
		'name': 'Massachusetts',
		'votesby': 'town'
	},
	{
		'abbr': 'MI',
		'name': 'Michigan'
	},
	{
		'abbr': 'MN',
		'name': 'Minnesota'
	},
	{
		'abbr': 'MS',
		'name': 'Mississippi'
	},
	{
		'abbr': 'MO',
		'name': 'Missouri'
	},
	{
		'abbr': 'MT',
		'name': 'Montana'
	},
	{
		'abbr': 'NE',
		'name': 'Nebraska'
	},
	{
		'abbr': 'NV',
		'name': 'Nevada'
	},
	{
		'abbr': 'NH',
		'name': 'New Hampshire',
		'votesby': 'town'
	},
	{
		'abbr': 'NJ',
		'name': 'New Jersey'
	},
	{
		'abbr': 'NM',
		'name': 'New Mexico'
	},
	{
		'abbr': 'NY',
		'name': 'New York'
	},
	{
		'abbr': 'NC',
		'name': 'North Carolina'
	},
	{
		'abbr': 'ND',
		'name': 'North Dakota'
	},
	{
		'abbr': 'OH',
		'name': 'Ohio'
	},
	{
		'abbr': 'OK',
		'name': 'Oklahoma'
	},
	{
		'abbr': 'OR',
		'name': 'Oregon'
	},
	{
		'abbr': 'PA',
		'name': 'Pennsylvania'
	},
	//{
	//	'abbr': 'PR',
	//	'name': 'Puerto Rico'
	//},
	{
		'abbr': 'RI',
		'name': 'Rhode Island'
	},
	{
		'abbr': 'SC',
		'name': 'South Carolina'
	},
	{
		'abbr': 'SD',
		'name': 'South Dakota'
	},
	{
		'abbr': 'TN',
		'name': 'Tennessee'
	},
	{
		'abbr': 'TX',
		'name': 'Texas'
	},
	{
		'abbr': 'UT',
		'name': 'Utah'
	},
	{
		'abbr': 'VT',
		'name': 'Vermont',
		'votesby': 'town'
	},
	{
		'abbr': 'VA',
		'name': 'Virginia'
	},
	{
		'abbr': 'WA',
		'name': 'Washington'
	},
	{
		'abbr': 'WV',
		'name': 'West Virginia'
	},
	{
		'abbr': 'WI',
		'name': 'Wisconsin'
	},
	{
		'abbr': 'WY',
		'name': 'Wyoming'
	}
];

var stateUS = {
	'abbr': 'US',
	'name': 'United States'
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

function cacheUrl( url, cache, always ) {
	if( opt.nocache  &&  ! always ) return url + '?q=' + new Date().getTime();
	if( opt.nocache ) cache = 0;
	if( typeof cache != 'number' ) cache = 120;
	url = _IG_GetCachedUrl( url, { refreshInterval:cache } );
	if( ! url.match(/^http:/) ) url = 'http://' + location.host + url;
	return url;
}

function loadScript( url, cache ) {
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.charset = 'utf-8';
	script.src = cacheUrl( url );
	//console.log( 'loadScript', script.src );
	script.title = 'jsonresult';
	$('head')[0].appendChild( script );
}

function htmlEscape( str ) {
	var div = document.createElement( 'div' );
	div.appendChild( document.createTextNode( str ) );
	return div.innerHTML;
}

var mapWidth = 356, mapHeight = 190, insetHeight = 37, insetWidth = 37, insetPad = 4, insetY = mapHeight - insetHeight;

document.body.scroll = 'no';
document.write(
	'<style type="text/css">',
		'* { font-family: Arial,sans-serif; font-size: 12px; }',
	'</style>',
	'<div id="mapDiv" style="width:', mapWidth, 'px; height:', mapHeight, 'px; position:relative; border:1px solid blue;">',
		'<img id="mapImg" style="position:absolute; left:0; top:0; width:', mapWidth, 'px; height:', mapHeight, 'px; border:none;" src="', imgUrl('static-usa'), '" />',
	'</div>'
);		

opt.dataUrl = opt.dataUrl || 'http://general-election-2008-data.googlecode.com/svn/trunk/';

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

function showPins( state, party ) {
	//function tallyColor( place, tally ) {
	//	if( ! tally ) return;
	//	place.precincts = tally.precincts;
	//	//place.total = tally.total;
	//	var leader = tally.votes && tally.votes[0];
	//	if( ! leader ) return;
	//	var votes = leader.votes;
	//	var candidate = candidates[party.name].by.name[leader.name];
	//	//var icon = candidate.icon;
	//	place.color = candidate.color;
	//	place.opacity = place.precincts.reporting / place.precincts.total * .5 + .1;
	//}
	
	var tallies = state.votes && state.votes[party.name] || {};
	
	//var statecolor = {};
	//if( state.abbr != 'US' )
	//	tallyColor( statecolor, tallies.totals );
	
	// TODO - do this in voter.py instead
	var min = Infinity, max = -Infinity;
	var places = state.places;
	places.forEach( function( place ) {
		if( tallies && tallies.locals ) {
			var tally = tallies.locals[place.name];
			if( tally ) {
				var leader = tally.votes && tally.votes[0];
				if( leader ) {
					var votes = leader.votes;
					if( votes ) {
						min = Math.min( min, votes );
						max = Math.max( max, votes );
					}
				}
			}
		}
	});
	
	places.forEach( function( place ) {
		//place.color = statecolor.color || randomGray();
		place.color = '#DDDDDD';
		
		// TODO: refactor this with tallyColor() - it broke when I tried it :-)
		if( tallies && tallies.locals ) {
			var tally = tallies.locals[place.name];
			if( tally ) {
				place.precincts = tally.precincts;
				//place.total = tally.total;
				var leader = tally.votes && tally.votes[0];
				if( leader ) {
					var votes = leader.votes;
					var candidate = candidates[party.name].by.name[leader.name];
					var icon = candidate.icon;
					place.color = candidate.color;
				}
			}
		}
		
		var size = 20;
		if( leader  &&  min < max ) {
			var fraction = ( leader.votes - min ) / ( max - min ) * ( place.precincts.reporting / place.precincts.total );
			size = Math.floor( 20 + fraction * 24 );
		}
		
		place.marker = createStateMarker( place, size );
	});
	
	setTimeout( function() {
		places.forEach( function( place ) {
			map.addOverlay( place.marker );
			if( ! mapplet ) {
				GEvent.addListener( place.marker, 'mouseover', function() {
					mouseOverMarker = true;
					setHilite( place.name, true );
				});
				GEvent.addListener( place.marker, 'mouseout', function() {
					mouseOverMarker = false;
				});
			}
		});
		setTimeout( function() {
			places.forEach( function( place ) {
				bindStateMarker( place );
			});
		}, 100 );
	}, 100 );
}

function oneshot() {
	var timer;
	return function( fun, time ) {
		clearTimeout( timer );
		timer = setTimeout( fun, time );
	};
}

//var hilite = { polys:[] };
//var hiliteOneshot = oneshot();
//
//function setHilite( name, scroll ) {
//	hiliteOneshot( function() {
//		var id = name && ( 'place-' + name.replace( ' ', '_' ) );
//		if( id == hilite.id ) return;
//		
//		if( hilite.id ) $('#'+hilite.id).removeClass( 'placerow-hilite' );
//		hilite.id = id;
//		var $row = $('#'+id);
//		$row.addClass( 'placerow-hilite' );
//		autoScrollContent.clear();
//		if( scroll ) autoScrollContent.hover( $row[0] );
//		
//		hilite.polys.forEach( function( poly ) { map.removeOverlay( poly ); } );
//		hilite.polys = [];
//		if( id && curState.places ) {
//			var place = curState.places.by.name[name];
//			if( place ) {
//				place.shapes.forEach( function( shape ) {
//					var poly = new GPolygon( shapeVertices(shape), '#000000', 1, .8, '#000000', .2 );
//					hilite.polys.push( poly );
//					map.addOverlay( poly );
//				});
//			}
//		}
//	}, 10 );
//}

function objToSortedKeys( obj ) {
	var result = [];
	for( var key in obj ) result.push( key );
	return result.sort();
}

function imgUrl( name ) {
	return cacheUrl( imgBaseUrl + name + '.png' );
}

function getJSON( url, callback, cache ) {
	_IG_FetchContent( url, function( json ) {
		callback( eval( '(' + json + ')' ) );
	}, {
		refreshInterval: opt.nocache ? 1 : cache
	});
}

function colorize( places, results ) {
	for( var i = -1, place;  place = places[++i]; ) {
		var color = 0, opacity = 0;
		var local = results.locals[place.name];
		if( local ) {
			var race = results.locals[place.name].races.President[''];
			var winner = race.votes[0];
			var candidate = results.candidates[winner.id];
			var party = parties.by.name[ candidate.split('|')[0] ] || { color:'#00FF00' };
			color = party.color;
			opacity = race.final ? .5 : .2;
		}
		place.fillColor = color;
		place.fillOpacity = opacity;
		place.strokeColor = '#000000';
		place.strokeOpacity = 0.5;
		place.strokeWidth = 1.5;
	}
}

function loadVotes() {
	getJSON( opt.dataUrl + 'json/votes/us-pres.json', function( json ) {
		colorize( usPlaces, json );
		gonzo.draw({
			places: usPlaces,
			offset: usOffset,
			zoom: 3
		});
	});
}

var gonzo, usPlaces, usOffset;

function load() {
	getJSON( opt.dataUrl + 'json/shapes/us.json?1', function( json ) {
		//console.log( json );
		usPlaces = json.places/*.index('name')*/;
		usPlaces.splice( 39, 1 );  // hack: remove Puerto Rico
		gonzo = new PolyGonzo.Frame({
			container: document.getElementById('mapDiv'),
			places: usPlaces
		});
		var coord = gonzo.latLngToPixel( 49.7, -125.5, 3 );
		usOffset = { x: -coord.x, y: -coord.y };
		//var ak = usPlaces.by.name('Alaska');
		//var hi = usPlaces.by.name('Hawaii');
		var ak = usPlaces[1], hi = usPlaces[11];
		var coord = gonzo.latLngToPixel( 72.5, -179.4, 0 );
		ak.zoom = 0;
		ak.offset = { x: -coord.x, y: -coord.y + insetY };
		var coord = gonzo.latLngToPixel( 23.2, -160.5, 3 );
		hi.offset = { x: -coord.x + insetWidth + insetPad, y: -coord.y + insetY };
		loadVotes();
	});
}

window.onload = load;
