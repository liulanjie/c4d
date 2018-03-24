const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const userEvents = new MyEmitter();
var rhttps = require('https');
var WebSocket = require('ws');

var _binanceMessages = [
{
  "e": "depthUpdate", 
  "E": 123456789,     
  "s": "LTCBTC",      
  "U": 157,           
  "u": 160,           
  "b": [              
    [
      "0.018882",       
      "10",
      []              
    ]
  ],
  "a": [              
    [
      "0.018881",       
      "100",         
      []              
    ]
  ]
},
{
  "e": "depthUpdate", 
  "E": 123456789,     
  "s": "BTCUSDT",      
  "U": 157,           
  "u": 160,           
  "b": [              
    [
      "9000",       
      "10",
      []              
    ]
  ],
  "a": [              
    [
      "8500",       
      "100",         
      []              
    ]
  ]
},
{
  "e": "depthUpdate", 
  "E": 123456789,     
  "s": "LTCUSDT",      
  "U": 157,           
  "u": 160,           
  "b": [              
    [
      "170",       
      "10",
      []              
    ]
  ],
  "a": [              
    [
      "164",       
      "100",         
      []              
    ]
  ]
}
]
var _email ={
	server:{
		connect:function(){
			return{
				send:function(string,cb){
					return cb(null,true);
				}
			}
		}
	}
}

var _https = {
	request:function(options,func){
		const events = new MyEmitter();
		var data = {};
		//get Account proxy
		//console.log("proxy:",options.path);
		if(options.path.search("/api/v1/account") > -1 && options.method === "GET"){
			//console.log("proxy get Binance Account");
			data = {balances:[{asset:'BTC',free:'0',locked:'0'},{asset:'LTC',free:'0',locked:'0'},{asset:'ETH',free:'0',locked:'0'}]}
		}
		//get existing orders proxy
		else if(options.path.search("openOrders") > -1 && options.method === "POST"){
			//console.log("proxy get existing Binance order");
			data = {orderId:'111222333'};
		}
		//get listen key proxy
		else if(options.path === "/api/v1/userDataStream"){
			//console.log("proxy get Binance listen key");
			data = {listenKey:"pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sv8a65a1"}
		}
		//place trade proxy
		else if(options.path.search("&type=LIMIT&quantity=") > -1){
			data = {orderId:123}
			var x = Math.round(Math.random(1)*10);
			var _data1={
					  "e": "executionReport",        
					  "E": 1499405658658,            
					  "s": "LTCBTC",                
					  "c": "mUvoqJxFIILMdfAW5iGSOW", 
					  "S": "BUY",                   
					  "o": "LIMIT",                 
					  "f": "GTC",                   
					  "q": "1.00000000",            
					  "p": "0.10264410",            
					  "P": "0.00000000",            
					  "F": "0.00000000",             
					  "g": -1,                      
					  "C": "null",                   
					  "x": "FILLED",                    
					  "X": "FILLED",                    
					  "r": "NONE",                  
					  "i": 4293153,                 
					  "l": "0.00000000",             
					  "z": "0.00000000",             
					  "L": "0.00000000",             
					  "n": "0",                     
					  "N": null,                     
					  "T": 1499405658657,            
					  "t": -1,                       
					  "I": 8641984,                 
					  "w": true,                     
					  "m": false,                    
					  "M": false              
			}
			var _data2={
					  "e": "executionReport",        
					  "E": 1499405658658,            
					  "s": "LTCBTC",                
					  "c": "mUvoqJxFIILMdfAW5iGSOW", 
					  "S": "BUY",                   
					  "o": "LIMIT",                 
					  "f": "GTC",                   
					  "q": "1.00000000",            
					  "p": "0.10264410",            
					  "P": "0.00000000",            
					  "F": "0.00000000",             
					  "g": -1,                      
					  "C": "null",                   
					  "x": "NEW",                    
					  "X": "NEW",                    
					  "r": "NONE",                  
					  "i": 4293153,                 
					  "l": "0.00000000",             
					  "z": "0.00000000",             
					  "L": "0.00000000",             
					  "n": "0",                     
					  "N": null,                     
					  "T": 1499405658657,            
					  "t": -1,                       
					  "I": 8641984,                 
					  "w": true,                     
					  "m": false,                    
					  "M": false              
			}		
			var data2 = x%2 == 0 ? _data1 : _data2;	
			userEvents.emit("trade",data2);
		}
		//use listen key proxy
		else if(options.path.search("listenKey=") > -1){
			//console.log("proxy use Binance listen key");
			data = {}
		}
		//get open orders proxy
		else if(options.path.search("/api/v1/openOrders") > -1){
			//console.log("proxy get Binance open orders");
			data = [{},{}];
		}		
		//slack proxy
		else if(options.path.search("Slack") > -1){
			//console.log("Proxy slack message");
			func(events);
			events.emit("data",'ok');
			return events.emit("end");
		}		
		else if(options.method === "DELETE"){
			//console.log("proxy cancel Binance order");
			data = {symbol:'BTCUSDT'};
			userEvents.emit("delete",options);
		}		
		else{
			return rhttps.request(options,func);		
		}
		func(events)
		events.emit("data",JSON.stringify(data));
		return events.emit("end");
	}
}

var _MongoClient = {
	connect:function(string,func){
		var database = {
			createCollection:function(coll,opts,func){
				func(true);
			},
			collection:(_name)=>{
				return {
					insert:function(x,y,func){func(false,true);},
					remove:function(x,func){func(false,true);},
					update:function(x,y,z,func){func(false,true);}
				};
			}
		}
		var dbConnection = {
			db:function(){
				return database;
			}
		}
		return func(undefined,dbConnection);
	}
}

var settings1 ={
	"Binance":
		{
			"apikey":"Binance_API_Key",
			"secretkey":"Binance_API_Secret",
			"enabled":true,
			"pairs":[{
			"liquidTrades":true,
			"lowerLimit1":100,
			"lowerLimit2":99,
			"optimalTrades":true,
			"pair1":"ltcbtc",
			"pair2":"btcusdt",
			"pair3":"ltcusdt",
			"upperLimit1":100.5,
			"upperLimit2":99.99
			}]
		},
	"Bittrex":
		{
			"apikey":"Bittrex_API_Key",
			"secret":"Bittrex_API_Secret",
			"minimum":0.001
		},
	"Config":
		{
			"enabled":true,
			"key":"Secret Private Key",	
			"liquidTrades":true,
			"logs":3,
			"lowerLimit":98.3,
			"pair1":"BTC-XXX",
			"pair2":"USDT-BTC",
			"pair3":"USDT-XXX",		
			"percentage1":1,
			"percentage2":0.5,					
			"polling":45000,
			"port":7073,
			"saneTrades":true,
			"upperLimit":101.79,
			"viewBook":false
		},
	"Email":
		{
			"addr":"Recipient_Email_Address",
			"host_smtp":"Email_SMTP_IP_Address",
			"use":false,
			"usr":"Email_Account_Address",
			"pwd":"Email_Password"		
		},
	"MongoDB":
		{
			"db_string":"mongodb://xxxx:xxxxxxxx@ipaddress:port/database",
			"connect":true
		},	
	"Slack":
		{
			"channel":"Slack_Channel",
			"hook":"Slack_Webhook",
			"use":false,
			"usr":"Slack_user_to_notify"
		},
	"Swing":
		{
			"amount":0.001,
			"pair":"BTC-XXX",
			"rate":60000,
			"swing":0.02,
			"swingTrade":false
		}		
}

//mock Binance Market
function _marketStream(){
	var wss = new WebSocket.Server({port:8080});
	return wss.on('connection',(ws,req)=>{
		//console.log("Websocket connection created:",req.rawHeaders,req.url);
		ws.on('error',(e)=>{
			console.log("Mock socket error:",e);
		})
		ws.on('close',(e)=>{
			return console.log("Mock WebSocket Closed:",e,new Date());
		})			
		ws.on('message',(message)=>{
			ws.send("");
		});				
	})	
}

//mock Binance Userstream
function _userStream(){
	var wss = new WebSocket.Server({port:8090});
	var clients = []
	userEvents.on('trade',(data)=>{
		for(var i = 0;i < clients.length;i++){
			try{
				clients[i].send(JSON.stringify(data));
			}
			catch(e){
				console.log(e);
			}
		}
	});
	return wss.on('connection',(ws,req)=>{
		clients.push(ws);
		ws.on('error',(e)=>{
			console.log("Mock socket error:",e);
		})
		ws.on('close',(e)=>{
			return console.log("Mock WebSocket Closed:",e,new Date());
		})					
	})	
}


module.exports = {
	market:"ws://localhost:8080/pair?=xxx",
	marketStream:_marketStream,
	userStream:_userStream,
	mockSettings1:settings1,
	email:_email,
	https:_https,
	MongoClient:_MongoClient,
	binanceMessages:_binanceMessages
}