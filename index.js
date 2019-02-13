#!/usr/bin/env node

if ( process.argv.length < 3 ) throw 'USAGE: node ' + process.argv[ 1 ] + ' data.json [ port ]'

let		data			= JSON.parse( require( 'fs' ).readFileSync( process.argv[ 2 ] ) )

const	Defined			= p => typeof p != 'undefined'

const	IsObject		= p => typeof p == 'object'

const	IsArray			= p => Array.isArray( p )

const	PathElements	= req => req.path.split( '/' ).filter( p => p != '' )

const	Get				= req => {
	let	v = data
	for ( const k of PathElements( req ) ) {
		if ( ! Defined( v ) ) break;
		v = v[ k ]
	}
	return v
}

const express = require( 'express' )
const app = express()
app.use( express.json( { strict:false } ) )

app.get(
	'/*'
,	( req, res ) => {
		let	v = Get( req )
		if ( ! Defined( v ) ) res.status( 404 ).end()
		else
			if ( Object.entries( req.query ).length == 0 ) res.json( v )
			else
				if ( ! IsObject( v ) ) res.status( 400 ).end()
				else {
					if ( IsArray( v ) ) for ( const k in req.query ) v = v.filter( p => p[ k ] == req.query[ k ] )
					else 
						for ( const k in req.query )
							v = Object.keys( v ).filter(
								p => v[ p ][ k ] == req.query[ k ]
							).reduce(
								( p, k ) => ( p[ k ] = v[ k ], p )
							,	{}
							)
					res.json( v )
				}
	}
)

app.post(
	'/*'
,	( req, res ) => {
		let	w = Get( req )
		if ( !IsArray( w ) ) res.status( 400 ).end()
		else {
			v = w.length
			w.push( req.body )
			res.json( v )
		}
	}
)

app.put(
	'/*'
,	( req, res ) => {
		const wPEs = PathElements( req )
		if ( wPEs.length == 0 ) {
			const v = data
			data = req.body
			res.json( v )
		} else {
			let wC = data
			let wS = wPEs[ 0 ]
			wPEs.shift()
			for ( const w of wPEs ) {
				if ( !Defined( wC ) ) break;
				wC = wC[ wS ]
				wS = w
			}
			if ( !IsObject( wC ) ) res.status( 400 ).end()
			else {
				const v = wC[ wS ]
				wC[ wS ] = req.body
				res.json( Defined( v ) ? v : null )
			}
		}
	}
)

app.delete(
	'/*'
,	( req, res ) => {
		const wPEs = PathElements( req )
		if ( wPEs.length == 0 ) {
			const v = data
			data = null
			res.json( v )
		} else {
			let wC = data
			let wS = wPEs[ 0 ]
			wPEs.shift()
			for ( const w of wPEs ) {
				if ( !Defined( wC ) ) break;
				wC = wC[ wS ]
				wS = w
			}
			if ( !IsObject( wC ) ) res.status( 400 ).end()
			else {
				const v = wC[ wS ]
				if ( !Defined( v ) ) res.status( 404 ).end()
				else {
					if ( Array.isArray( wC ) )	wC.splice( wS, 1 )
					else						delete wC[ wS ]
					res.json( v )
				}
			}
		}
	}
)

const	wPort = process.argv[ 3 ] || 3000
console.log( 'serve-json started listening port: ' + wPort )
app.listen( wPort )

