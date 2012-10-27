#!/usr/bin/env python
# coding: utf-8

# fetcher.py - vote reader for 2008 general election
# Copyright (c) 2008 Michael Geary - http://mg.to/
# Free Beer and Free Speech License (MIT+GPL)
# http://freebeerfreespeech.org/
# http://www.opensource.org/licenses/mit-license.php
# http://www.opensource.org/licenses/gpl-2.0.php

import copy
import os
import os.path
import re
import time

from ftplib import FTP

import private

livepath = '../general-election-private/ap/2010-test'

def download():
	def fetch( name ):
		print 'Fetching ' + name
		ftp.retrbinary( 'RETR ' + name, open( livepath + '/' + name, 'wb' ).write )
	print 'Connecting'
	ftp = FTP( private.ap_host )
	ftp.login( private.ap_username, private.ap_password )
	try:
		ftp.cwd( '/Pres_Reports/flat' )
		fetch( 'pres_county.txt' )
		fetch( 'pres_electoral.txt' )
		ftp.cwd( '/Pres_Reports/xml' )
		fetch( 'pres_summary.xml' )
		ftp.cwd( '/Trend/xml' )
		fetch( 'h.xml' )
		fetch( 's.xml' )
		ftp.cwd( '/US_topofticket/flat' )
		fetch( 'US.txt' )
	finally:
		print 'Disconnecting'
		ftp.quit()
	print 'Done'
	
def main():
	#while 1:
		download()
		#print 'Waiting 1 minute...'
		#time.sleep( 60 )

if __name__ == "__main__":
    main()
