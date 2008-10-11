#!/usr/bin/env python
# coding: utf-8

# voter.py - vote reader for 2008 general election
# Copyright (c) 2008 Michael Geary - http://mg.to/
# Free Beer and Free Speech License (MIT+GPL)
# http://freebeerfreespeech.org/
# http://www.opensource.org/licenses/mit-license.php
# http://www.opensource.org/licenses/gpl-2.0.php

import csv
import os
import re
import time

#from template import *
import private
import random
import simplejson as sj
import states

votespath = '../general-election-data'
jsonpath = votespath + '/json'

candidates = {
	'US': {}
}

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
	elif 0:
		# Use compact format, but add some newlines in the hope of using less space for svn revisions
		json = sj.dumps( obj, separators=( ',', ':' ) )
		json = re.sub( '\],"', '],\n"', json )
		json = re.sub( ':\[{', ':[\n{', json )
		json = re.sub( '":{', '":\n{', json )
		json = re.sub( '},{', '},\n{', json )
		json = re.sub( '},"', '},\n"', json )
	else:
		json = sj.dumps( obj, separators=( ',', ':' ) )
	return json

def getPrecincts( row ):
	#print 'getPrecincts %s %s %s %s' %( row[0], row[1], row[2], row[3] )
	return {
		'reporting': int(row[3]),
		'total': int(row[2])
	}

def fixCountyName( name ):
	name = re.sub( ' County$', '', name )
	fixNames = {
		# NH
		"Harts Location": "Hart's Location",
		"Waterville": "Waterville Valley",
	}
	if( name in fixNames ):
		name = fixNames[name]
	#print 'County: %s' % name
	return name

def readPresVotes():
	path = votespath + '/AP/Pres_Reports/flat/'
	feed = path + 'pres_county.txt'
	print 'Processing %s' % feed
	f = open( feed, 'r' )
	for line in f:
		setPresData( line.rstrip('\n').split(';') )
	f.close()

def setPresData( row ):
	# why does this crash Python?
	#isTestData = isTestData or row[0] == 't'
	if row[0] == 't': isTestData = True
	abbr = row[2]
	entity = state = states.byAbbr[abbr]
	if 'counties' not in state: state['counties'] = {}
	counties = state['counties']
	fips = row[4]
	if len(fips) == 4: fips = '0' + fips  # always 5-digit FIPS, AP omits leading 0
	if fips != '0':
		countyname = fixCountyName( row[5] )
		if countyname not in counties:
			counties[countyname] = {
				'fips': fips,
				'name': countyname
			}
		entity = counties[countyname]
	if 'precincts' not in entity:
		entity['precincts'] = {
			'reporting': int(row[17]),
			'total': int(row[18])
		}
	if 'votes' not in entity:
		entity['votes'] = {}
	
	for col in xrange( 19, len(row), 12 ):
		can = row[col:col+12]
		if len(can) < 12: continue
		id = can[11] or abbr + can[0]
		if id not in candidates:
			middle = can[4]
			if middle: middle += ' '
			jr = ''
			if can[7] != '0': jr = ', ' + can[6]
			name = can[3] + ' ' + middle + can[5] + jr
			candidates[id] = {
				'id': id,
				'party': can[2],
				'lastName': can[5],
				'fullName': name
			}
			print 'Added %s candidate %s' %( can[2], name )
		candidate = candidates[id]
		votes = int(can[9])
		if votes: entity['votes'][id] = votes
		if can[10]: entity['final'] = True

def percentage( n ):
	pct = int( round( 100.0 * float(n) ) )
	if pct == 100 and n < 1: pct = 99
	return pct

def sortVotes( entity ):
	if not entity.get('votes'): entity['votes'] = {}
	tally = []
	for name, votes in entity['votes'].iteritems():
		tally.append({ 'name':name, 'votes':votes })
	tally.sort( lambda a, b: b['votes'] - a['votes'] )
	entity['votes'] = tally

def cleanNum( n ):
	return int( re.sub( '[^0-9]', '', n ) or 0 )

def makeJson():
	ustotal = 0
	usvotes = {}
	usprecincts = { 'total': 0, 'reporting': 0 }
	usall = { 'votes': usvotes, 'precincts': usprecincts }
	statevotes = {}
	leaders = {}
	#def addLeader( party ):
	#	if len(party['votes']):
	#		leaders[ party['votes'][0]['name'] ] = True
	for state in states.array:
		statetotal = 0
		sortVotes( state )
		statevotes[ state['name'] ] = state
		#print 'Loading %s' %( state['name'] )
		for vote in state['votes']:
			name = vote['name']
			count = vote['votes']
			if name not in usvotes:
				usvotes[name] = 0
			usvotes[name] += count
			ustotal += count
			statetotal += count
		countyvotes = {}
		counties = state.get( 'counties', {} )
		for countyname, county in counties.iteritems():
			sortVotes( county )
			#addLeader( county )
			countytotal = 0
			for vote in county['votes']:
				countytotal += vote['votes']
			county['total'] = countytotal
			countyvotes[countyname] = county
		#setPins( countyvotes )
		writeFile(
			'%s/%s.js' %( jsonpath, state['abbr'].lower() ),
			json({
				'status': 'ok',
				#'party': party,
				'state': state['abbr'],
				'total': statetotal,
				'totals': state,
				'locals': countyvotes
			}) )
	sortVotes( usall )
	#setPins( statevotes )
	writeFile(
		'%s/%s.js' %( jsonpath, 'us' ),
		json({
				'status': 'ok',
				#'party': party,
				'state': 'US',
				'total': ustotal,
				'totals': usall,
				'locals': statevotes
		})
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
	readPresVotes()
	print 'Creating votes JSON...'
	makeJson()
	#print 'Checking in votes JSON...'
	#os.system( 'svn ci -m "Vote update" %s' % votespath )
	print 'Done!'

def main():
	#while 1:
		update()
		#print 'Waiting 10 minutes...'
		#time.sleep( 600 )

if __name__ == "__main__":
    main()
