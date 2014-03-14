// JavaScript Document
var caller;
var queue = new Array();
var geocoder;
var map;
var map2;
var directionsService;
var directionsDisplay;
var otherAddress;
var address;
var address2;
var mode;
var globalType;
var startTimeV;
var endTimeV;
var diff;
function clearQueue(){
	queue = new Array();
	addToQue();
	document.getElementById('queue').innerHTML = '<h3 style="text-align:center">Your queue is empty</h3>';
	checkRoute();
}

function startTime(){
	startTimeV = new Date().getTime();
	console.log("start time");
}

function endTime(){
    endTimeV = new Date().getTime();
    diff = endTimeV - startTimeV;
	console.log("end time");
	console.log("start time " + diff + " seconds");
	ga('send', 'event', 'route', 'clicked', 'time', diff);
}

function searchSpecific(caller, modep){
	//alert(caller);
	//document.getElementById('grocs').innerHTML="HELLO";
	if(caller=='other'){
		var type = new Object();
		type.name = "other";
		type.mode = modep;
		type.address = otherAddress;
		globalType = type;
		mode = modep;
		queue.push(type);	
		console.log("added " + otherAddress);
		addToQue();
		$( "#gasItems" ).popup( "close" );
		$( "#chosenAddress" ).popup( "open" );
	}
	else if(checkifnotin(caller,queue)){
		var type = new Object();
		type.name = caller;
		type.mode = modep;
		globalType = type;
		mode = modep;
		searchForCategory(returnType(caller), modep);
			// console.log("address added: " + address);
		// type.address = address;
		queue.push(type);	
		console.log("added " + caller);
		addToQue();
		$( "#gasItems" ).popup( "close" );
		$( "#chosenAddress" ).popup( "open" );
	}else{
		console.log("not added " + caller);
	}
	checkRoute();
}

function changeName(callerp){
	console.log("called " + callerp);
	caller = callerp;
	document.getElementById('CHANGEME').innerHTML = callerp;	
}

function removeFromQueue(){
	for (var i=0;i<queue.length;i++)
	{ 
		if(queue[i].name==caller){
			queue.splice(i, 1);	
			break;
		}
	}
	$( "#queOpts" ).popup( "close" );
	addToQue();
	checkRoute();
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

function checkRoute(){
	if(queue.length>0){
		document.getElementById("routeButton").innerHTML = '<a href="#page3"  class="ui-btn ui-btn-b" onclick="checkRoute();" id="routeButton">ROUTE!</a>';
		for(var i = 0; i < queue.length; i++){
			console.log("check queue at " + i + "with address " + queue[i].address);
		}
	}else{
		console.log("nothing in queue");
		document.getElementById('queue').innerHTML = '<h3 style="text-align:center">Your queue is empty</h3>';
		document.getElementById("routeButton").innerHTML = '<a href="#routePopup"  data-rel="popup" class="ui-btn ui-btn-b" onclick="checkRoute();" id="routeButton" data-transition="pop">ROUTE!</a>';
	}
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
	}else{
		return "images/other.png";
	}
}

function returnType(category){
	if(caller==="GAS"){
		return "gas_station";
	}else if(caller==="GROCERIES"){
		return "grocery_or_supermarket";
	}else if(caller==="BANKS"){
		return "bank";
	}else if(caller==="CONVENIENCE"){
		return "convenience_store";
	}else if(caller==="CARWASH"){
		return "car_wash";
	}else if(caller==="COFFEE"){
		return "cafe";
	}else if(caller==="FOOD"){
		return "food";
	}else if(caller==="OTHER"){
		return "images/other.png";
	}else if(caller==="SHOP"){
		return "shopping_mall";
	}else{
		return category;
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
		var input = document.getElementById("search");
		var autocomplete = new google.maps.places.Autocomplete(input);
		google.maps.event.addListener(autocomplete, 'place_changed', function(){
			var place = autocomplete.getPlace();
			searchMe(place.formatted_address);
			otherAddress = place.geometry.location;
		});

        // Add an overlay to the map of current lat/lng
        /*var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });*/
    }
});

$( document ).on( "pageshow", "#page3", function() {
	//geocoder = new google.maps.Geocoder();
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
	var myOptions = {
            zoom: 12,
            center: new google.maps.LatLng(32.8400,-117.2769)
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
	}else{
		
	}
}


function searchMe(search){
console.log("search" + search);
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
  ways = [];
  for(var i =0; i< queue.length-1; i++){
    ways.push({location: queue[i].address, stopover:true});
  }
    var pyrmont = new google.maps.LatLng(32.8400,-117.2769);

	var ua = navigator.userAgent.toLowerCase();
	var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
	if(isAndroid) {
		var url = 'https://maps.google.com/?saddr=' + pyrmont.toString() + '&daddr=' + queue[queue.length-1].address;
		//var url = 'https://maps.apple.com/?saddr=' + pyrmont.toString() + '&daddr=' + queue[queue.length-1].address;
		 for(var i =0; i< queue.length-1; i++){
			url += '+to:'+ queue[i].address;
		}
		window.open(url);
		console.log("url: " + url);
	}
	
	
  var request = {
      origin:pyrmont,
      destination:queue[queue.length-1].address,
	  waypoints:ways,
      travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
	  console.log("directions");
	  google.maps.event.trigger(map2,'resize');
	  // kick out to google maps
    }else{
		console.log("wrong: " + status.toString());
	}
  });
  
}

function searchForCategory(category, mode) {
  var pyrmont = new google.maps.LatLng(32.8400,-117.2769);
  if(queue.length >= 1){
	pyrmont = queue[queue.length-1].address;
	console.log("location " + pyrmont);
  }
	
	  
  map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: pyrmont,
      zoom: 15
    });
	console.log("searchForCategory");
	
	places = new google.maps.places.PlacesService(map);

  service = new google.maps.places.PlacesService(map);
  console.log("search");
  var search = {
	location: pyrmont,
	//radius: '1000',
	rankBy: google.maps.places.RankBy.DISTANCE,
    types: [category]
	}

	var position;
  places.nearbySearch(search,callbackResults);
	
}

function callbackResults(results, status) {
	resultsRef = results;
	console.log("nearbysearch");
	console.log("status" + status);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
		console.log("results: " + results[i].geometry.location);
		console.log("results: " + results[i].name);
		var ref = results[i].reference;
		var request = {
			reference: ref
		}
		var min = -1;
		// service.getDetails(request,function(place, status){if(place != null) { console.log("formatted_address: " + place.formatted_address); console.log("price: " + place.price_level);
					// if(min == -1 || place.price_level < min){
						// min = place.price_level;
						// position = i;
					// }					
		
		
				// }});
        
      }
    }
	console.log("check");
	if(mode=='quick'){
		console.log("returning quick " + results[0].geometry.location);
		address = results[0].geometry.location;
		globalType.address =  results[0].geometry.location;
		address2 = results[0].geometry.location;
	}else{
		console.log("returning cheap " + results[getRandomInt(0,results.length)].geometry.location);
		address = results[getRandomInt(0,results.length)].geometry.location;
		globalType.address = results[getRandomInt(0,results.length)].geometry.location;
		address2 = results[getRandomInt(0,results.length)].geometry.location;
	}
	
}

function getRandomInt(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function gasbtnp(){
	console.log("clicked gas");
	ga("send", "event", "gasbtn", "click", "items"); 
}

function groceriesbtnp(){
	console.log("clicked groc");
	ga("send", "event", "groceriesbtn", "click", "items");
}

function banksp(){
	console.log("clicked bank");
	ga("send", "event", "banks", "click", "items");
}

function conveniencebtnp(){
	console.log("clicked conv");
	ga("send", "event", "conveniencebtn", "click", "items");
}

function carwashbtnp(){
	console.log("clicked carwashbtn");
	ga("send", "event", "carwashbtn", "click", "items");
}

function coffeebtnp(){
	console.log("clicked coffeebtn");
	ga("send", "event", "coffeebtn", "click", "items");
}

function helpbtnp(){
    console.log("clicked helpbtn");
	ga("send","event","helpbtn","click");
}

function foodbtnp(){
	console.log("clicked foodbtn");
	ga("send", "event", "foodbtn", "click", "items");
}

function movebtnp(){
	console.log("clicked movebtn");
	ga("send", "event", "movebtn", "click");
}



function shopbtnp(){
	console.log("clicked shopbtn");
	ga("send", "event", "shopbtn", "click", "items");
}

function otherbtnp(){
	console.log("clicked other");
	ga("send", "event", "otherbtn", "click", "items");
}

//$("#gasbtn").keydown(function(){ ga("send", "event", "gasbtn", "click"); console.log("clicked");}); 
// $("#groceriesbtn").click(function(){ ga("send", "event", "groceriesbtn", "click");}); 
// $("#banks").click(function(){ ga("send", "event", "banks", "click");}); 
// $("#conveniencebtn").click(function(){ ga("send", "event", "conveniencebtn", "click");}); 
// $("#carwashbtn").click(function(){ ga("send", "event", "carwashbtn", "click");}); 
// $("#coffeebtn").click(function(){ ga("send", "event", "coffeebtn", "click");}); 
// $("#foodbtn").click(function(){ ga("send", "event", "foodbtn", "click");}); 
// $("#shopbtn").click(function(){ ga("send", "event", "shopbtn", "click");}); 
// $("#otherbtn").click(function(){ ga("send", "event", "otherbtn", "click");}); 