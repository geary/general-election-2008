#!/usr/bin/env python
# coding: utf-8

# voter.py - vote reader for 2008 general election
# Copyright (c) 2008 Michael Geary - http://mg.to/
# Free Beer and Free Speech License (MIT+GPL)
# http://freebeerfreespeech.org/
# http://www.opensource.org/licenses/mit-license.php
# http://www.opensource.org/licenses/gpl-2.0.php

import copy
import os
import os.path
import re
import sys
import time
import random
import simplejson as sj
import xml.dom.minidom

import states

candidates = {}
trends = {}

isTestData = False

#def str( text ):
#	strings = {
#		'county': 'town',
#		'counties': 'towns'
#	}
#	return strings[text] or text

def formatNumber( number ):
	return str(number)

def json( obj ):
	if 0:
		# Pretty print
		json = sj.dumps( obj, indent=4 )
	#elif 0:
	#	# Use compact format, but add some newlines in the hope of using less space for svn revisions
	#	json = sj.dumps( obj, separators=( ',', ':' ) )
	#	json = re.sub( '\],"', '],\n"', json )
	#	json = re.sub( ':\[{', ':[\n{', json )
	#	json = re.sub( '":{', '":\n{', json )
	#	json = re.sub( '},{', '},\n{', json )
	#	json = re.sub( '},"', '},\n"', json )
	else:
		# Compact JSON
		json = sj.dumps( obj, separators=( ',', ':' ) )
	return json

def getPrecincts( row ):
	#print 'getPrecincts %s %s %s %s' %( row[0], row[1], row[2], row[3] )
	return {
		'reporting': int(row[3]),
		'total': int(row[2])
	}

def fixCountyName( state, name ):
	name = re.sub( ' County$', '', name )
	if name in state.get( 'fix', {} ):
		name = state['fix'][name]
	return name

def loadPresSummary():
	result = {}
	feed = datapath + 'pres_summary.xml'
	print 'Processing %s' % feed
	dom = xml.dom.minidom.parse( feed )
	cands = dom.getElementsByTagName( 'Cand' )
	for cand in cands:
		name = cand.getAttribute( 'name' )
		result[name] = {
			'votes': cand.getAttribute( 'PopVote' ),
			'electoral': cand.getAttribute( 'ElectWon' ),
			'won': bool( cand.getAttribute( 'Winner' ) )
		}
	return result

def loadTrends( house ):
	result = {}
	feed = datapath + house + '.xml'
	print 'Processing %s' % feed
	dom = xml.dom.minidom.parse( feed )
	parties = dom.getElementsByTagName( 'party' )
	for party in parties:
		name = party.getAttribute( 'title' )
		result[name] = {}
		trends = party.getElementsByTagName( 'trend' )
		for trend in trends:
			type = trend.getAttribute( 'name' )
			result[name][type] = int( trend.getAttribute('value') )
	return result

def loadElectoralVotes( usall ):
	feed = datapath + 'pres_electoral.txt'
	print 'Processing %s' % feed
	f = open( feed, 'r' )
	for line in f:
		row = line.rstrip('\n').split(';')
		abbr = row[2]
		id = row[4]
		electoral = int(row[5])
		total = int(row[11])
		state = usall
		if abbr != 'US':
			state = states.byAbbr[abbr]
		votes = state['races']['President']['']['votes']
		if id not in votes: votes[id] = { 'id': id, 'votes': 0 }
		votes[id]['electoral'] = electoral
		state['electoral'] = total
	f.close()

def readVotes( report ):
	feed = datapath + report
	print 'Processing %s' % feed
	f = open( feed, 'r' )
	for line in f:
		setVoteData( line.rstrip('\n').split(';') )
	f.close()

def setVoteData( row ):
	# why does this crash Python?
	#isTestData = isTestData or row[0] == 't'
	if row[0] == 't': isTestData = True
	abbr = row[2]
	entity = state = states.byAbbr[abbr]
	race = row[10]
	seat = re.sub( '^District ', '', row[11] )
	if 'counties' not in state: state['counties'] = {}
	counties = state['counties']
	fips = row[4]
	if len(fips) == 4: fips = '0' + fips  # change 4-digit FIPS to 5, AP omits leading 0
	if fips != '0':
		countyname = fixCountyName( state, row[5] )
		if countyname not in counties:
			counties[countyname] = {
				'fips': fips,
				'name': countyname
			}
		entity = counties[countyname]
	if 'races' not in entity: entity['races'] = {}
	races = entity['races']
	if race not in races: races[race] = {}
	seats = races[race]
	if seat not in seats: seats[seat] = { 'votes': {} }
	if 'precincts' not in entity:
		entity['precincts'] = {
			'reporting': int(row[17]),
			'total': int(row[18])
		}
	
	for col in xrange( 19, len(row), 12 ):
		can = row[col:col+12]
		if len(can) < 12: continue
		id = can[11] or abbr + can[0]
		if id not in candidates:
			party = can[2]
			first = can[3]
			last = can[5]
			jr = ''
			if can[7] != '0': jr = ', ' + can[6]
			name = first + ' ' + last + jr
			#candidates[id] = {
			#	'party': party,
			#	'last': last,
			#	'full': name
			#}
			candidates[id] = '|'.join([ party, last, name ]);
			print 'Added %s candidate %s' %( party, name )
		candidate = candidates[id]
		votes = int(can[9])
		seats[seat]['votes'][id] = { 'id': id, 'votes': votes }
		if can[10]: seats[seat]['final'] = True

def percentage( n ):
	pct = int( round( 100.0 * float(n) ) )
	if pct == 100 and n < 1: pct = 99
	return pct

def sortVotes( entity ):
	for race in entity['races'].itervalues():
		for seat in race.itervalues():
			if not seat.get('votes'): seat['votes'] = {}
			tally = seat['votes'].values()
			tally.sort( lambda a, b: b['votes'] - a['votes'] )
			seat['votes'] = tally

def cleanNum( n ):
	return int( re.sub( '[^0-9]', '', n ) or 0 )

def makeJson( type ):
	ustotal = 0
	usvotes = {}
	usprecincts = { 'total': 0, 'reporting': 0 }
	usall = {
		'races': {
			'President': {
				'': { 'votes': usvotes, 'precincts': usprecincts }
			}
		}
	}
	statevotes = {}
	#leaders = {}
	#def addLeader( party ):
	#	if len(party['votes']):
	#		leaders[ party['votes'][0]['name'] ] = True
	loadElectoralVotes( usall )
	for st in states.array:
		state = copy.deepcopy( st )
		statetotal = 0
		sortVotes( state )
		statevotes[ state['name'] ] = state
		#print 'Loading %s' %( state['name'] )
		cands = {}
		for key, race in state['races'].iteritems():
			for seat in race.itervalues():
				for vote in seat['votes']:
					id = vote['id']
					if id not in cands: cands[id] = candidates[id]
					if key == 'President':
						count = vote['votes']
						if id not in usvotes:
							usvotes[id] = { 'id': id, 'votes': 0 }
						usvotes[id]['votes'] += count
						ustotal += count
						statetotal += count
		countyvotes = {}
		counties = state.get( 'counties', {} )
		for countyname, county in counties.iteritems():
			sortVotes( county )
			#addLeader( county )
			countytotal = 0
			for vote in county['races']['President']['']['votes']:
				countytotal += vote['votes']
			county['races']['President']['']['total'] = countytotal
			countyvotes[countyname] = county
		#setPins( countyvotes )
		del state['counties']
		if type == 'all':
			writeFile(
				'%s/%s-%s.json' %( jsonpath, state['abbr'].lower(), type ),
				json({
					'state': state['abbr'],
					'candidates': cands,
					'total': statetotal,
					'totals': state,
					'locals': countyvotes
				}) )
	sortVotes( usall )
	#setPins( statevotes )
	j = {
		'state': 'US',
		'candidates': candidates,
		'total': ustotal,
		'totals': usall,
		'locals': statevotes
	}
	if type == 'all':
		j['trends'] = trends
	writeFile(
		'%s/%s-%s.json' %( jsonpath, 'us', type ),
		json( j )
	)
	#print '%s of %s precincts reporting' %( state['precincts']['reporting'], state['precincts']['total'] )
	#print '%s leaders:' % party
	#for leader in leaders.iterkeys():
	#	print leader

def readFile( filename ):
	f = open( filename, 'rb' )
	data = f.read()
	f.close()
	return data

def writeFile( filename, data ):
	print 'Writing %s' % filename
	f = open( filename, 'wb' )
	f.write( data )
	f.close()

def update():
	#fetchData( feed )
	trends['President'] = loadPresSummary()
	trends['U.S. House'] = loadTrends( 'h' )
	trends['U.S. Senate'] = loadTrends( 's' )
	readVotes( 'pres_county.txt' )
	print 'Creating presidential votes JSON...'
	makeJson( 'pres' )
	readVotes( 'US.txt' )
	print 'Creating top of ticket votes JSON...'
	makeJson( 'all' )
	print 'Done!'

def main():
	#while 1:
		update()
		#print 'Waiting 10 minutes...'
		#time.sleep( 600 )

if __name__ == "__main__":
	testTime = sys.argv[1]
	datapath = '../general-election-data/live/monday/' + testTime + '/'
	jsonpath = 'results/test/' + testTime
	if not os.path.exists( jsonpath ): os.mkdir( jsonpath )
	main()
