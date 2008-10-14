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

opt.dataUrl = opt.dataUrl || 'http://general-election-2008-data.googlecode.com/svn/trunk/';

var imgBaseUrl = opt.imgBaseUrl || 'http://general-election-2008.googlecode.com/svn/trunk/images/';

var parties = [
	{ name: 'Dem', color: '#0000FF', shortName: 'Democratic', fullName: 'Democratic Party' },
	{ name: 'GOP', color: '#FF0000', shortName: 'Republican', fullName: 'Republican Party' }
].index('name');

var states = [
	{ 'abbr': 'AL', 'name': 'Alabama' },
	{ 'abbr': 'AK', 'name': 'Alaska' },
	{ 'abbr': 'AZ', 'name': 'Arizona' },
	{ 'abbr': 'AR', 'name': 'Arkansas' },
	{ 'abbr': 'CA', 'name': 'California' },
	{ 'abbr': 'CO', 'name': 'Colorado' },
	{ 'abbr': 'CT', 'name': 'Connecticut', 'votesby': 'town' },
	{ 'abbr': 'DE', 'name': 'Delaware' },
	{ 'abbr': 'DC', 'name': 'District of Columbia' },
	{ 'abbr': 'FL', 'name': 'Florida' },
	{ 'abbr': 'GA', 'name': 'Georgia' },
	{ 'abbr': 'HI', 'name': 'Hawaii' },
	{ 'abbr': 'ID', 'name': 'Idaho' },
	{ 'abbr': 'IL', 'name': 'Illinois' },
	{ 'abbr': 'IN', 'name': 'Indiana' },
	{ 'abbr': 'IA', 'name': 'Iowa' },
	{ 'abbr': 'KS', 'name': 'Kansas', 'votesby': 'district' },
	{ 'abbr': 'KY', 'name': 'Kentucky' },
	{ 'abbr': 'LA', 'name': 'Louisiana' },
	{ 'abbr': 'ME', 'name': 'Maine' },
	{ 'abbr': 'MD', 'name': 'Maryland' },
	{ 'abbr': 'MA', 'name': 'Massachusetts', 'votesby': 'town' },
	{ 'abbr': 'MI', 'name': 'Michigan' },
	{ 'abbr': 'MN', 'name': 'Minnesota' },
	{ 'abbr': 'MS', 'name': 'Mississippi' },
	{ 'abbr': 'MO', 'name': 'Missouri' },
	{ 'abbr': 'MT', 'name': 'Montana' },
	{ 'abbr': 'NE', 'name': 'Nebraska' },
	{ 'abbr': 'NV', 'name': 'Nevada' },
	{ 'abbr': 'NH', 'name': 'New Hampshire', 'votesby': 'town' },
	{ 'abbr': 'NJ', 'name': 'New Jersey' },
	{ 'abbr': 'NM', 'name': 'New Mexico' },
	{ 'abbr': 'NY', 'name': 'New York' },
	{ 'abbr': 'NC', 'name': 'North Carolina' },
	{ 'abbr': 'ND', 'name': 'North Dakota' },
	{ 'abbr': 'OH', 'name': 'Ohio' },
	{ 'abbr': 'OK', 'name': 'Oklahoma' },
	{ 'abbr': 'OR', 'name': 'Oregon' },
	{ 'abbr': 'PA', 'name': 'Pennsylvania' },
	{ 'abbr': 'RI', 'name': 'Rhode Island' },
	{ 'abbr': 'SC', 'name': 'South Carolina' },
	{ 'abbr': 'SD', 'name': 'South Dakota' },
	{ 'abbr': 'TN', 'name': 'Tennessee' },
	{ 'abbr': 'TX', 'name': 'Texas' },
	{ 'abbr': 'UT', 'name': 'Utah' },
	{ 'abbr': 'VT', 'name': 'Vermont', 'votesby': 'town' },
	{ 'abbr': 'VA', 'name': 'Virginia' },
	{ 'abbr': 'WA', 'name': 'Washington' },
	{ 'abbr': 'WV', 'name': 'West Virginia' },
	{ 'abbr': 'WI', 'name': 'Wisconsin' },
	{ 'abbr': 'WY', 'name': 'Wyoming' }
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

function htmlEscape( str ) {
	var div = document.createElement( 'div' );
	div.appendChild( document.createTextNode( str ) );
	return div.innerHTML;
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

function oneshot() {
	var timer;
	return function( fun, time ) {
		clearTimeout( timer );
		timer = setTimeout( fun, time );
	};
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

function candidateLegend( side, color, votes, name ) {
	votes = votes || 0;
	var win = votes >= 270;
	var check = ! win ? '' : S(
			'<img src="', imgUrl('green-check'), '" style="width:12px; height:12px; border:none;" />'
	);
	return S(
		'<div style="position:relative; float:', side, ';">',
			'<img src="', imgUrl(color+'-box'), '" style="width:13px; height:13px; border:none; margin-right:3px;" />',
			check,
			'<span style="', win ? 'font-weight:bold;' : '', '">',
				name,
				votes ? S( ' - ', votes, ' votes' ) : '',
			'</span>',
		'</div>'
	);
}

function loadPanel( data ) {
	var electors = 538, dem = 0, gop = 0, total = 0;
	var votes = data.totals.races.President[''].votes;
	for( var i = -1, vote;  vote = votes[++i]; ) {
		var e = vote.electoral;
		total += e;
		if( vote.id == '1918' ) dem = e;
		if( vote.id == '1701' ) gop = e;
	}
	var undecided = electors - total;
	
	_gel('panel').innerHTML = S(
		'<div style="padding:6px 1px 0 1px;">',
			'<div>',
				candidateLegend( 'left', 'blue', dem, 'Obama (D)' ),
				candidateLegend( 'right', 'red', gop, 'McCain (R)' ),
				'<div style="clear:both;">',
				'</div>',
			'</div>',
			'<div style="padding-top:4px">',
				'270 electoral votes needed to win, ', undecided, ' undecided',
			'</div>',
		'</div>'
	);
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
		loadPanel( json );
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
	getJSON( opt.dataUrl + 'json/shapes/us.json', function( json ) {
		usPlaces = json.places/*.index('name')*/;
		usPlaces.splice( 39, 1 );  // hack: remove Puerto Rico
		gonzo = new PolyGonzo.Frame({
			container: document.getElementById('map'),
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

var mapWidth = 356, mapHeight = 190, insetHeight = 37, insetWidth = 37, insetPad = 4, insetY = mapHeight - insetHeight;

document.body.scroll = 'no';
document.write(
	'<style type="text/css">',
		'#panel, #panel * { font-family: Arial,sans-serif; font-size: 13px; }',
	'</style>',
	'<div id="map" style="width:', mapWidth, 'px; height:', mapHeight, 'px; position:relative; border:1px solid blue;">',
		'<img id="mapImg" style="position:absolute; left:0; top:0; width:', mapWidth, 'px; height:', mapHeight, 'px; border:none;" src="', imgUrl('static-usa'), '" />',
	'</div>',
	'<div id="panel" style="position:relative; width:', mapWidth, 'px;">',
	'</div>'
);		
