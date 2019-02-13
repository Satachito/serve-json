# serve-json

A light weight mock server for any kind of JSON file.


This software is released under the MIT License, see LICENSE.txt.

## Features

* Serves all the data in JSON file via api.
* Light weight.
* Source code is ultra small. Easy to undarstand and modify.
* Supports query.
* Deep nesting.

## Installation

Install globally with npm

```bash
$ npm i serve-json -g
```

## Getting started

Prepare your JSON file.

A sample file named data.json is prepared for modification in this package. 

Start serve-json specifying your JSON file.

```bash
$ serve-json data.json
serve-json started listening port: 3000
```

## Explanation

If your JSON file is like this, serve-json automatically serves APIs below.

### data.json

```data.json
{	"jockeys":
	{	"05339":
		{	"name": "Christophe Patrice Lemaire"
		,	"birthday": 19790520
		}
	,	"05212":
		{	"name": "Mirco Demuro"
		,	"birthday": 19790111
		}
	}
,	"races":
	[	{	"date":	20181125
		,	"name": "Japan Cup"
		,	"grade": "G1"
		,	"horses": [ "Almond Eye" ]
		}
	,	{	"date":	20181125
		,	"name": "Keihan Hai"
		,	"grade": "G3"
		,	"horses": [ "Danon Smash" ]
		}
	,	{	"date":	20190120
		,	"name": "Tokai S."
		,	"grade": "G2"
		,	"horses": [ "Inti" ]
		}
	,	{	"date":	20190120
		,	"name": "American Jockey Club Cup"
		,	"grade": "G2"
		,	"horses": [ "Sciacchetra" ]
		}
	]
}
```

### Available APIs

- for GET, PUT, DELETE

```
/
/jockeys
/jockeys/05339
/jockeys/05339/name
/jockeys/05339/birthday
/jockeys/05212
/jockeys/05212/name
/jockeys/05212/birthday
/races
/races/0
/races/0/date
/races/0/name
/races/0/grade
/races/0/horses
/races/0/horses/0
/races/1
/races/1/date
/races/1/name
/races/1/grade
/races/1/horses
/races/1/horses/0
/races/2
/races/2/date
/races/2/name
/races/2/grade
/races/2/horses
/races/2/horses/0
/races/3
/races/3/date
/races/3/name
/races/3/grade
/races/3/horses
/races/3/horses/0
```

- for POST

```
/races
/races/0/horses
/races/1/horses
/races/2/horses
/races/3/horses
```

### Sample

Assuming that your serve-json is running on port 3000.

#### Get all data.

```
$ curl localhost:3000
{"jockeys":{"05339":{"name":"Christophe Patrice Lemaire","birthday":19790520},"05212":{"name":"Mirco Demuro","birthday":19790111}},"races":[{"date":20181125,"name":"Japan Cup","grade":"G1","horses":["Almond Eye"]},{"date":20181125,"name":"Keihan Hai","grade":"G3","horses":["Danon Smash"]},{"date":20190120,"name":"Tokai S.","grade":"G2","horses":["Inti"]},{"date":20190120,"name":"American Jockey Club Cup","grade":"G2","horses":["Sciacchetra"]}]}
```

#### Get some data

```
$ curl 'localhost:3000/jockeys/05339/birthday'
19790520
```

#### Query

```
$ curl localhost:3000/jockeys?name=Mirco+Demuro
{"05212":{"name":"Mirco Demuro","birthday":19790111}}
$ curl 'localhost:3000/races?date=20181125&grade=G3'
[{"date":20181125,"name":"Keihan Hai","grade":"G3","horses":["Danon Smash"]}]
```

#### Post to array

Don't forget to set Content-Type.

```
$ curl -H "Content-Type: application/json" localhost:3000/races -d '{ "date": 20181228, "name": "Hopeful S.", "grade": "G1", "horses": [ "Saturnalia", "Admire Justa" ] }'
4
$ curl -H "Content-Type: application/json" localhost:3000/races/4/horses -d '"Vin de Garde"'
2
```

POST returns index where data is pushed.

#### Put

```
$ curl -X PUT -H "Content-Type: application/json" localhost:3000/jockeys/05339/birthday -d '0'
19790520
$ curl -X PUT -H "Content-Type: application/json" localhost:3000/jockeys/05339/sex -d '1'
null
```

PUT returns old data.

#### Delete

```
$ curl -X DELETE localhost:3000/jockeys/05212/birthday
19790111
```

DELETE returns old data.

## License

MIT

