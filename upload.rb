#!/usr/bin/env ruby

# upload.rb
# Copyright (c) 2008 Michael Geary - http://mg.to/
# Free Beer and Free Speech License (MIT+GPL)
# http://freebeerfreespeech.org/
# http://www.opensource.org/licenses/mit-license.php
# http://www.opensource.org/licenses/gpl-2.0.php

require 'rubygems'

require 'secret'
require 'aws/s3'

class Updater
	
	def initialize
		@FILES = [
			'ak-all.json',
			'al-all.json',
			'ar-all.json',
			'az-all.json',
			'ca-all.json',
			'co-all.json',
			'ct-all.json',
			'dc-all.json',
			'de-all.json',
			'fl-all.json',
			'ga-all.json',
			'hi-all.json',
			'ia-all.json',
			'id-all.json',
			'il-all.json',
			'in-all.json',
			'ks-all.json',
			'ky-all.json',
			'la-all.json',
			'ma-all.json',
			'md-all.json',
			'me-all.json',
			'mi-all.json',
			'mn-all.json',
			'mo-all.json',
			'ms-all.json',
			'mt-all.json',
			'nc-all.json',
			'nd-all.json',
			'ne-all.json',
			'nh-all.json',
			'nj-all.json',
			'nm-all.json',
			'nv-all.json',
			'ny-all.json',
			'oh-all.json',
			'ok-all.json',
			'or-all.json',
			'pa-all.json',
			'ri-all.json',
			'sc-all.json',
			'sd-all.json',
			'tn-all.json',
			'tx-all.json',
			'us-all.json',
			'us-pres.json',
			'ut-all.json',
			'va-all.json',
			'vt-all.json',
			'wa-all.json',
			'wi-all.json',
			'wv-all.json',
			'wy-all.json',
		]
	end
	
	def checkin( time )
		print "Uploading to S3\n"
		AWS::S3::Base.establish_connection!(
			:access_key_id     => Secret::S3_KEY,
			:secret_access_key => Secret::S3_SECRET
		)
		@FILES.each { |file|
			print "#{file}\n"
			AWS::S3::S3Object.store( "test/#{time}/#{file}", open("results/test/#{time}/#{file}"), 'election2008', :access => :public_read )
		}
		print "Done uploading\n"
	end
	
end

updater = Updater.new
updater.checkin( ARGV[0] )
