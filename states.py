#!/usr/bin/env python

array = [
	{
		'abbr': 'AL',
		'name': 'Alabama',
	},
	{
		'abbr': 'AK',
		'name': 'Alaska',
	},
	{
		'abbr': 'AZ',
		'name': 'Arizona',
	},
	{
		'abbr': 'AR',
		'name': 'Arkansas',
		'fix': {
			"Saint Francis": "St. Francis"
		}
	},
	{
		'abbr': 'CA',
		'name': 'California',
	},
	{
		'abbr': 'CO',
		'name': 'Colorado',
	},
	{
		'abbr': 'CT',
		'name': 'Connecticut',
		'votesby': 'town',
	},
	{
		'abbr': 'DE',
		'name': 'Delaware',
	},
	{
		'abbr': 'DC',
		'name': 'District of Columbia',
	},
	{
		'abbr': 'FL',
		'name': 'Florida',
	},
	{
		'abbr': 'GA',
		'name': 'Georgia',
	},
	{
		'abbr': 'HI',
		'name': 'Hawaii',
	},
	{
		'abbr': 'ID',
		'name': 'Idaho',
	},
	{
		'abbr': 'IL',
		'name': 'Illinois',
		'fix': {
			"DeWitt": "De Witt",
			"JoDaviess": "Jo Daviess",
			"LaSalle": "La Salle"
		}
	},
	{
		'abbr': 'IN',
		'name': 'Indiana',
	},
	{
		'abbr': 'IA',
		'name': 'Iowa',
	},
	{
		'abbr': 'KS',
		'name': 'Kansas',
		'votesby': 'district',
	},
	{
		'abbr': 'KY',
		'name': 'Kentucky',
		'fix': {
			"LaRue": "Larue"
		}
	},
	{
		'abbr': 'LA',
		'name': 'Louisiana',
		'fix': {
			"DeSoto": "De Soto",
			"Jeff Davis": "Jefferson Davis",
			"LaSalle": "La Salle"
		}
	},
	{
		'abbr': 'ME',
		'name': 'Maine',
		'fix': {
			#"": "Androscoggin"
		}
	},
	{
		'abbr': 'MD',
		'name': 'Maryland',
	},
	{
		'abbr': 'MA',
		'name': 'Massachusetts',
		'votesby': 'town',
	},
	{
		'abbr': 'MI',
		'name': 'Michigan',
	},
	{
		'abbr': 'MN',
		'name': 'Minnesota',
		'fix': {
			"Lac Qui Parle": "Lac qui Parle"
		}
	},
	{
		'abbr': 'MS',
		'name': 'Mississippi',
		'fix': {
			"Jeff Davis": "Jefferson Davis"
		}
	},
	{
		'abbr': 'MO',
		'name': 'Missouri',
		'fix': {
			"LaClede": "Laclede"
		}
	},
	{
		'abbr': 'MT',
		'name': 'Montana',
		'fix': {
			"Lewis & Clark": "Lewis and Clark"
		}
	},
	{
		'abbr': 'NE',
		'name': 'Nebraska',
	},
	{
		'abbr': 'NV',
		'name': 'Nevada',
	},
	{
		'abbr': 'NH',
		'name': 'New Hampshire',
		'votesby': 'town',
		#'fix': {
		#	"Harts Location": "Hart's Location",
		#	"Waterville": "Waterville Valley",
		#}
	},
	{
		'abbr': 'NJ',
		'name': 'New Jersey',
	},
	{
		'abbr': 'NM',
		'name': 'New Mexico',
		'fix': {
			"DeBaca": "De Baca"
		}
	},
	{
		'abbr': 'NY',
		'name': 'New York',
		'fix': {
			"Brooklyn": "Kings",
			"Manhattan": "New York",
			"Staten Island": "Richmond",
			"Saint Lawrence": "St. Lawrence"
		}
	},
	{
		'abbr': 'NC',
		'name': 'North Carolina',
	},
	{
		'abbr': 'ND',
		'name': 'North Dakota',
	},
	{
		'abbr': 'OH',
		'name': 'Ohio',
	},
	{
		'abbr': 'OK',
		'name': 'Oklahoma',
		'fix': {
			"LeFlore": "Le Flore"
		}
	},
	{
		'abbr': 'OR',
		'name': 'Oregon',
	},
	{
		'abbr': 'PA',
		'name': 'Pennsylvania',
	},
	#{
	#	'abbr': 'PR',
	#	'name': 'Puerto Rico',
	#},
	{
		'abbr': 'RI',
		'name': 'Rhode Island',
	},
	{
		'abbr': 'SC',
		'name': 'South Carolina',
	},
	{
		'abbr': 'SD',
		'name': 'South Dakota',
	},
	{
		'abbr': 'TN',
		'name': 'Tennessee',
	},
	{
		'abbr': 'TX',
		'name': 'Texas',
		'fix': {
			"De Witt": "DeWitt",
			"La Vaca": "Lavaca"
		}
	},
	{
		'abbr': 'UT',
		'name': 'Utah',
	},
	{
		'abbr': 'VT',
		'name': 'Vermont',
		'votesby': 'town',
	},
	{
		'abbr': 'VA',
		'name': 'Virginia',
		'fix': {
			# Clifton Forge is a town in Alleghany County
			#"": "Clifton Forge"
		}
	},
	{
		'abbr': 'WA',
		'name': 'Washington',
	},
	{
		'abbr': 'WV',
		'name': 'West Virginia',
	},
	{
		'abbr': 'WI',
		'name': 'Wisconsin',
	},
	{
		'abbr': 'WY',
		'name': 'Wyoming',
	}
]

byAbbr = {}
for state in array:
	byAbbr[ state['abbr'] ] = state

byName = {}
for state in array:
	byName[ state['name'] ] = state
