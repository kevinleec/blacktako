var LatLng;
var airline_name;
var root_url = "http://comp426.cs.unc.edu:3001/";

function initMap() {
   LatLng = {
      lat: 35.8801,
      lng: -78.7880
   }
   console.log(LatLng);
   map = new google.maps.Map(document.getElementById('map'), {
      center: LatLng,
      zoom: 8
   });
   setMarker(LatLng);
};

function setMarker(LatLng) {
   marker = new google.maps.Marker({
      position: LatLng,
      map: map,
      title: 'RDU'
   });
}

function updateLocation() {
   $.ajax(root_url + 'airports',
   {
      type: 'GET',
      xhrFields: {withCredentials: true},
      success: (airport) => {
         for (let i = 0; i < airport.length; i++) {
            if (document.getElementById('airport').value == airport[i].code) {
               latitude = Number(airport[i].latitude);
               longitude = Number(airport[i].longitude);
               var bounds = new google.maps.LatLngBounds();
               LatLng = {
                  lat: latitude,
                  lng: longitude
               }
               $('#map').empty();
               map = new google.maps.Map(document.getElementById('map'), {
                  center: LatLng,
                  zoom: 8
               });
               setMarker(LatLng);
               loc = new google.maps.LatLng(latitude, longitude);
               bounds.extend(loc);
               RDULatLng = {
                  lat: 35.8801,
                  lng: -78.7880
               }
               setMarker(RDULatLng);
               loc = new google.maps.LatLng(RDULatLng.lat, RDULatLng.lng);
               bounds.extend(loc);
               if (document.getElementById('airport').value != 'RDU') {
                  map.fitBounds(bounds);
                  map.panToBounds(bounds);
               }

               var flightPath = [
                  LatLng,
                  RDULatLng
               ];
               poly = new google.maps.Polyline({
                  path: flightPath,
                  strokeColor: '#000000',
                  strokeOpacity: 1.0,
                  strokeWeight: 3
               });
               poly.setMap(map);
            }
         }
      }

   });
   console.log(document.getElementById('airport').value);
};

function getAirlineName(airline_id) {
	console.log(airline_id);
   $.ajax(root_url + "airlines",
   {
      type: 'GET',
      xhrFields: {withCredentials: true},
      success: (airlines) => {
         airline_name = 'no name';
         for (let i = 0; i < airlines.length; i++) {
            if (airlines[i].id == a_id) {
               airline_name = airlines[i].name;
			}
		 }
		console.log(airline_name);
	  }

   });
};


$(document).ready(() => {
   $('#login_btn').on('click', () => {

      let user = $('#user').val();
      let pass = $('#pass').val();

      console.log(user);
      console.log(pass);

      $.ajax(root_url + "sessions",
      {
         type: 'POST',
         xhrFields: {withCredentials: true},
         data: {
            user: {
               username: user,
               password: pass
            }
         },
         success: () => {
            build_airlines_interface();
         },
         error: (jqxhr, status, error) => {
            alert(error);
         }
      });
   });
});

var build_airlines_interface = function() {
   $('head').append("<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBs0A4Cgt04LwXWEdMNbEtRDOdWwJx9Yrg&callback=initMap' async defer></script>");
   let body = $('body');

   body.empty();
   body.append("<div class = 'topdiv'><header class = 'top' role = 'banner'><h1>Track Your Flight</h1></header></div>");
   body.append("<div id = 'info'><div>");
   let info = $('#info');
   info.append("<h2> Select an Airline</h2>");

   let airline_list = $("<form id = 'airline_form'><select id = 'airline'></select></form>");
   let airport_list = $("<form id = 'airport_form'><select id = 'airport' onchange = 'updateLocation()'></select></form>");
   info.append(airline_list);

   info.append("<h2> Select an Airport </h2>");
   info.append(airport_list);
   info.append("<h2> Arrivals or Departures? </h2>");
   info.append("<form><input type = 'radio' name = 'arde' value = 'arrival'> Arrivals <br><input type = 'radio' name = 'arde' value = 'departure'> Departures <br></form>");
   body.append("<div id = 'map'></div>");
   $('#airline').append("<option value = ''> Select an Airline </option>");
   $('#airport').append("<option value = ''> Select an Airport </option>");

   $.ajax(root_url + "airlines",
   {
      type: 'GET',
      xhrFields: {withCredentials: true},
      success: (airlines) => {
         for (let i = 0; i < airlines.length; i++) {
            $('#airline').append("<option value = '" + airlines[i].name + "'>" + airlines[i].name + "</option>");
         }

      }
   });

   $.ajax(root_url + "airports",
   {
      type: 'GET',
      xhrFields: {withCredentials: true},
      success: (airport) => {
         for (let i = 0; i < airport.length; i++) {
            $('#airport').append("<option value = '" + airport[i].code + "'>" + airport[i].name + "</option>");
         }
      }
   });

   info.append("<div><button id = 'submit' class = 'button'> Submit </button></div>");
   info.append("<div class = 'table'></div>");
   $('#submit').on('click', function() {
      $('.table').empty();
      $('.table').append(`<table id = 'disTab'><thead><tr>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(1)')" style="cursor:pointer">Airline</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(2)')" style="cursor:pointer">From</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(3)')" style="cursor:pointer">To</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(4)')" style="cursor:pointer">Depart Time</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(5)')" style="cursor:pointer">Arrival Time</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(6)')" style="cursor:pointer">Flight No.</th>
  </tr></thead>`);
      $('#disTab').append("<tbody id = 'tableBod'></tbody>");
      var airline_name;
      $.ajax(root_url + "flights",
      {
         type: 'GET',
         xhrFields: {
            withCredentials: true
         },
         success: (flight) => {
            console.log(flight.length);
            airline = document.getElementById('airline').value;
            airport = document.getElementById('airport').value;

            for (let i = 0; i < flight.length; i++) {
               a = flight[i];
			   a_id = a.airline_id;
			   let airline_name;
			   if (a_id == 2547) {
					airline_name = 'Alaska Airlines';
			   } else if (a_id == 2546) {
					airline_name = 'JetBlue Airways';
			   } else if (a_id == 2545) {
					airline_name = 'Frontier Airlines';
		   		} else if (a_id == 2544) {
					airline_name = 'Southwest Airlines';
			   	} else if (a_id == 2543) {
					airline_name = 'United Airlines';
			   	} else if (a_id == 2542) {
					airline_name = 'Delta Airlines';
			   	} else if (a_id == 2541) {
					airline_name = 'American Airlines';
				}
				d_id = a.departure_id;
				ar_id = a.arrival_id;
				let depart_airport;
				let arrival_airport;
				if (d_id == 73306) {
					depart_airport = 'SEA';
				} else if (d_id == 20676) {
					depart_airport = 'LAX';
				} else if (d_id == 20675) {
					depart_airport = 'SFO';
				} else if (d_id == 20674) {
					depart_airport = 'DEN';
				} else if (d_id == 20673) {
					depart_airport = 'IAH';
				} else if (d_id == 20672) {
					depart_airport = 'ORD';
				} else if (d_id == 20671) {
					depart_airport = 'BOS';
				} else if (d_id == 20670) {
					depart_airport = 'JFK';
				} else if (d_id == 20669) {
					depart_airport = 'ATL';
				} else if (d_id == 20668) {
					depart_airport = 'IAD';
				} else if (d_id == 20667) {
					depart_airport = 'RDU';
				}

				if (ar_id == 73306) {
					arrival_airport = 'SEA';
				} else if (ar_id == 20676) {
					arrival_airport = 'LAX';
				} else if (ar_id == 20675) {
					arrival_airport = 'SFO';
				} else if (ar_id == 20674) {
					arrival_airport = 'DEN';
				} else if (ar_id == 20673) {
					arrival_airport = 'IAH';
				} else if (ar_id == 20672) {
					arrival_airport = 'ORD';
				} else if (ar_id == 20671) {
					arrival_airport = 'BOS';
				} else if (ar_id == 20670) {
					arrival_airport = 'JFK';
				} else if (ar_id == 20669) {
					arrival_airport = 'ATL';
				} else if (ar_id == 20668) {
					arrival_airport = 'IAD';
				} else if (ar_id == 20667) {
					arrival_airport = 'RDU';
				}
			   console.log(airline_name);
               let dep_time = new Date(a.departs_at);
               let conv_dep_time = moment(dep_time * 1000).format('HH:mm')
               let arr_time = new Date(a.arrives_at);
               let conv_arr_time = moment(arr_time * 1000).format('HH:mm')

               $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + depart_airport + "</td><td>" +
               arrival_airport + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td><td>" + a.number + "</tr>");
            }
         }
      });
   });
};

// GOOGLE MAPS API KEY AIzaSyBs0A4Cgt04LwXWEdMNbEtRDOdWwJx9Yrg