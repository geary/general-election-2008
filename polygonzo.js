// polygonzo.js
// Copyright (c) 2008 Ernest Delgado and Michael Geary
// http://ernestdelgado.com/
// http://mg.to/
// Free Beer and Free Speech License (any OSI license)
// http://freebeerfreespeech.org/

PolyGonzo = {
	
	// PolyGonzo.Frame() - Canvas/VML frame
	Frame: function( a ) {
		
		var box = a.container, canvas, ctx;
		
		canvas = document.createElement( 'canvas' );
		if( canvas.getContext ) {
			ctx = this.ctx = canvas.getContext('2d');
		}
		else if( ! document.namespaces.pgz_vml_ ) {
			canvas = document.createElement( 'div' );
			document.namespaces.add( 'pgz_vml_', 'urn:schemas-microsoft-com:vml' );
			document.createStyleSheet().cssText = 'pgz_vml_\\:*{behavior:url(#default#VML)}';
		}
		
		this.canvas = canvas;
		canvas.style.position = 'absolute';
		canvas.style.left = '0px';
		canvas.style.top = '0px';
		canvas.style.width = box.offsetWidth + 'px';
		canvas.style.height = box.offsetHeight + 'px';
		canvas.width = box.offsetWidth;
		canvas.height = box.offsetHeight;
		box.appendChild( canvas );
		
		this.draw = function( b ) {
			var places = b.places || a.places, zoom = b.zoom, offset = b.offset;
			
			if( ctx ) {
				ctx.clearRect( 0, 0, canvas.width, canvas.height );
				
				////// TEST
				//ctx.globalAlpha = 1.0;
				//ctx.fillStyle = '#FFFFFF';
				//ctx.fillRect( 0, 0, canvas.width, canvas.height );
				////// END TEST
				
				eachShape( places, zoom, offset, function( offsetX, offsetY, place, shape, coords, nCoords, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth, round ) {
					var c = ctx;
					c.beginPath();
					
					var coord = coords[0];
					c.moveTo( round( coord[0] + offsetX ) + .5, round( coord[1] + offsetY ) + .5 );
					
					for( var iCoord = 0, coord;  coord = coords[++iCoord]; ) {
						c.lineTo( round( coord[0] + offsetX ) + .5, round( coord[1] + offsetY ) + .5 );
					}
					c.closePath();
					
					c.globalAlpha = strokeOpacity;
					c.strokeStyle = strokeColor;
					c.lineWidth = '' + strokeWidth;
					c.stroke();
					
					c.globalAlpha = fillOpacity;
					c.fillStyle = fillColor;
					c.fill();
				});
			}
			else {
				canvas.firstChild && canvas.removeChild( canvas.firstChild );
				
				var vml = [], iVml = 0;
				eachShape( places, zoom, offset, function( offsetX, offsetY, place, shape, coords, nCoords, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth, round ) {
					
					vml[iVml++] = '<pgz_vml_:shape style="position:absolute;width:10;height:10;" coordorigin="';
					vml[iVml++] = -round( offsetX * 10 );
					vml[iVml++] = ' ';
					vml[iVml++] = -round( offsetY * 10 );
					vml[iVml++] = '" coordsize="100 100" path=" m ';
					
					for( var iCoord = -1, coord;  coord = coords[++iCoord]; ) {
						vml[iVml++] = round( coord[0] * 10 );
						vml[iVml++] = ',';
						vml[iVml++] = round( coord[1] * 10 );
						vml[iVml++] = ' l ';
					}
					
					iVml--;  // remove last ' l '
					
					vml[iVml++] = ' x "><pgz_vml_:stroke color="';
					vml[iVml++] = strokeColor;
					vml[iVml++] = '" opacity="';
					vml[iVml++] = strokeOpacity;
					vml[iVml++] = '" joinstyle="miter" miterlimit="10" endcap="flat" weight="';
					vml[iVml++] = strokeWidth;
					vml[iVml++] = 'px" /><pgz_vml_:fill color="';
					vml[iVml++] = fillColor;
					vml[iVml++] = '" opacity="';
					vml[iVml++] = fillOpacity;
					vml[iVml++] = '" /></pgz_vml_:shape>';
				});
				vml = vml.join('');
				//log( 'joined VML' );
				
				//log( htmlEscape( vml.join('') ) );
				var el = canvas.ownerDocument.createElement( 'div' );
				el.style.width =  canvas.clientWidth + 'px';
				el.style.height = canvas.clientHeight + 'px';
				el.style.overflow = 'hidden';
				el.style.position = 'absolute';
				canvas.appendChild( el );
				el.insertAdjacentHTML( "beforeEnd", '<div>' + vml/*.join('')*/ + '</div>' );
				//log( 'inserted VML' );
			}
		};
		
		this.remove = function() {
			a.container.removeChild( canvas );
		};
		
		this.latLngToPixel = function( lat, lng, zoom, offset ) {
			var point = [lng,lat];
			offset = offset || { x:0, y:0 };
			var shape = { points: [ [lng,lat] ] };
			var place = { shapes: [ shape ] };
			eachShape( [ place ], zoom, offset || { x:0, y:0 }, function() {} );
			var coord = shape.coords[zoom][0];
			return { x: Math.round(coord[0]), y: Math.round(coord[1]) };
		};
		
		function eachShape( places, zoom, offset, callback ) {
			var pi = Math.PI, log = Math.log, round = Math.round, sin = Math.sin,
				big = 1 << 28,
				big180 = big / 180,
				pi180 = pi / 180,
				radius = big / pi,
				divisor = Math.pow( 2, 21 - zoom ),
				multX = big180 / divisor,
				multY = -radius / divisor / 2,
				offsetX = offset.x,
				offsetY  = offset.y;
			
			var totalShapes = 0, totalPoints = 0;
			var nPlaces = places.length;
			
			for( var iPlace = -1, place;  place = places[++iPlace]; ) {
				var shapes = place.shapes, nShapes = shapes.length;
				totalShapes += nShapes;
				
				var
					fillColor = place.fillColor,
					fillOpacity = place.fillOpacity,
					strokeColor = place.strokeColor,
					strokeOpacity = place.strokeOpacity,
					strokeWidth = place.strokeWidth;
				
				for( var iShape = -1, shape;  shape = shapes[++iShape]; ) {
					var points = shape.points, nPoints = points.length;
					totalPoints += nPoints;
					var coords = ( shape.coords = shape.coords || [] )[zoom];
					if( ! coords ) {
						coords = shape.coords[zoom] = new Array( nPoints );
						for( var iPoint = -1, point;  point = points[++iPoint]; ) {
							var s = sin( point[1] * pi180 );
							coords[iPoint] = [
								multX * point[0],
								multY * log( (1+s)/(1-s) )
							];
						}
					}
					callback( offsetX, offsetY, place, shape, coords, nPoints, fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth, round );
				}
			}
			
			//window._log && _log( nPlaces, 'places,', totalShapes, 'shapes,', totalPoints, 'points' );
		}
	},
	
	// PolyGonzo.GOverlay() - Google Maps JavaScript API overlay
	GOverlay: function( a ) {
		var map, pane, frame, canvas;
		
		var pg = new GOverlay;
		
		pg.initialize = function( map_ ) {
			map = map_;
			pane = map.getPane( G_MAP_MAP_PANE );
			frame = new PolyGonzo.Frame({
				group: a.group,
				places: a.places,
				container: pane
			});
			canvas = frame.canvas;
		};
		
		pg.remove = function() {
			frame.remove();
		};
	
		pg.redraw = function( b, force ) {
			if( ! force ) return;  // don't redraw unless forced
			
			var mapSize = map.getSize();
			var zoom = map.getZoom();
			var margin = { x: mapSize.width / 3, y: mapSize.height / 3 };
			var canvasSize = { width: mapSize.width + margin.x * 2, height: mapSize.height + margin.y * 2 };
			
			var offset = {
				x: canvas.offsetParent.offsetParent.offsetLeft,
				y: canvas.offsetParent.offsetParent.offsetTop
			};
			
			canvas.width = canvasSize.width;
			canvas.height = canvasSize.height;
			
			canvas.style.width = canvasSize.width + 'px';
			canvas.style.height = canvasSize.height + 'px';	
			
			canvas.style.left = ( - offset.x - margin.x ) + 'px';
			canvas.style.top = ( - offset.y - margin.y ) + 'px';
			
			var zero = map.fromLatLngToDivPixel( new GLatLng(0,0) );
			offset.x += margin.x + zero.x;
			offset.y += margin.y + zero.y;
			var zoom = map.getZoom();
			
			frame.draw({
				offset: offset,
				zoom: zoom
			});
		};
		
		return pg;
	}
};
