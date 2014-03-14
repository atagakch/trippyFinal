// JavaScript Document
var caller;
var queue = new Array();
var geocoder;
var map;
var map2;
var directionsService;
var directionsDisplay;

function searchSpecific(caller, mode){
	//alert(caller);
	//document.getElementById('grocs').innerHTML="HELLO";
	if(checkifnotin(caller,queue)){
		var type = new Object();
		type.name = caller;
		type.mode = mode;
		queue.push(type);	
		console.log("added " + caller);
		addToQue();
	}else{
		console.log("not added " + caller);
	}
}

function changeName(callerp){
	console.log("called " + callerp);
	caller = callerp;
	document.getElementById('CHANGEME').innerHTML = callerp;	
}

function checkifnotin(caller, queue){
	for (var i=0;i<queue.length;i++)
	{ 
		if(queue[i].name==caller){
			return false;	
		}
	}
	return true;
}

function moveLeft(callerp){
	caller = callerp;
	var loc;
	console.log("moveLeft param " + callerp);
	for (var i=1;i<queue.length;i++)
	{ 
		console.log("ml position " + i + " is " + queue[i].name);
		if(queue[i].name==caller){
			loc = i;	
			console.log("found " + loc);
			break;
		}
	}
	var temp =new Object()
	temp.name = queue[loc-1].name;
	temp.mode = queue[loc-1].mode;
	queue[loc-1].name = queue[loc].name;
	queue[loc-1].mode = queue[loc].mode
	queue[loc].name = temp.name;
	queue[loc].mode = temp.mode;
	addToQue();
}

function moveRight(callerp){
	caller = callerp;
	var loc;
	console.log("moveLeft param " + callerp);
	for (var i=0;i<queue.length-1;i++)
	{ 
		console.log("ml position " + i + " is " + queue[i].name);
		if(queue[i].name==caller){
			loc = i;	
			console.log("found " + loc);
			break;
		}
	}
	var temp =new Object()
	temp.name = queue[loc+1].name;
	temp.mode = queue[loc+1].mode;
	queue[loc+1].name = queue[loc].name;
	queue[loc+1].mode = queue[loc].mode
	queue[loc].name = temp.name;
	queue[loc].mode = temp.mode;
	addToQue();
}

function returnImage(caller){
	if(caller==="GAS"){
		return "images/gas.png";
	}else if(caller==="GROCERIES"){
		return "images/grocs.png";
	}else if(caller==="BANKS"){
		return "images/banks.png";
	}else if(caller==="CONVENIENCE"){
		return "images/conv.png";
	}else if(caller==="CARWASH"){
		return "images/car.png";
	}else if(caller==="COFFEE"){
		return "images/coffee.png";
	}else if(caller==="FOOD"){
		return "images/food.png";
	}else if(caller==="OTHER"){
		return "images/other.png";
	}else if(caller==="SHOP"){
		return "images/shop.png";
	}
}

function addToQue(mode){
	for(i=0;i<queue.length;i++){
		console.log("position " + i + " is " + queue[i].name);
	}
	document.getElementById('queue').innerHTML = "";
	var alpha = ["a","b","c","d","e"];
	for (var i=0;i<queue.length;i++)
	{ 
		var str = ' <div class="ui-block-' + alpha[i%5] + '"><a class="ui-btn ui-shadow-icon ui-btn-b" onclick="changeName(\'' + queue[i].name + '\')" href="#queOpts" data-rel="popup" data-transition="slideup"><img src="' + returnImage(queue[i].name) + '" class="itempicq"></a></div>';
		console.log(" adding link: " + str);
		document.getElementById('queue').innerHTML += str;
	}	
}

/*
 * Google Maps documentation: http://code.google.com/apis/maps/documentation/javascript/basics.html
 * Geolocation documentation: http://dev.w3.org/geo/api/spec-source.html
 */
$( document ).on( "pagecreate", "#page2", function() {
	geocoder = new google.maps.Geocoder();
    // var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    if ( navigator.geolocation ) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
    function drawMap(latlng) {
        var myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });
    }
});

$( document ).on( "pagecreate", "#page3", function() {
	//geocoder = new google.maps.Geocoder();
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
	var myOptions = {
            zoom: 10,
            center: new google.maps.LatLng(34.0983425, -118.3267434)
        };
	map2 = new google.maps.Map(document.getElementById("map-canvas2"), myOptions);
	directionsDisplay.setMap(map2);
	calcRoute();
});

function searchMap(event)
{
	if(event.keyCode==13){
		
		var searchVal = document.getElementById("search").value;
		console.log(searchVal);
		searchMe(searchVal);
	}
}

function searchMe(search){
geocoder.geocode( { 'address': search}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		  map.setCenter(results[0].geometry.location);
		  var marker = new google.maps.Marker({
			  map: map,
			  position: results[0].geometry.location
		  });
		} else {
		  alert('Geocode was not successful for the following reason: ' + status);
	 }
	});
}

function calcRoute() {
	console.log("calcRoute");
  var start = "9500 Gilman Dr, San Diego, CA";
  var end = "8510 Genesee Ave";
  var request = {
      origin:start,
      destination:end,
	  waypoints:[{location:"3233 La Jolla Village Drive", stopover: true}],
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
	  console.log("directions");
    }else{
		console.log("wrong: " + status.toString());
	}
  });
}



