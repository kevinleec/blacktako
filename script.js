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
        tab_interface();
      },
      error: (jqxhr, status, error) => {
        alert(error);
      }
    });
  });
});

var tab_interface = function () {
  let body = $('body');
  let section = $('section');

  body.empty();
  body.append("<div class = 'tabs'><button class = 'tab_link' onclick = 'build_search_interface(this)' id = 'defaultOpen'>Search</button><button class = 'tab_link' onclick = 'build_departure_table(this)'>Departures</button><button class = 'tab_link' onclick = 'build_arrival_table(this)'>Arrivals</button><button class = 'tab_link' onclick = 'build_post_interface(this)'>blah</button></div>");
  body.append("<section></section>");
  document.getElementById("defaultOpen").click();

}

var build_search_interface = function (elmnt) {
  var numbers=[];
  $('head').append("<script src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBs0A4Cgt04LwXWEdMNbEtRDOdWwJx9Yrg&callback=initMap' async defer></script>");
  let section = $('section');
  tablinks = document.getElementsByClassName("tab_link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  elmnt.style.backgroundColor = '#005daa';
  section.empty();
  section.append("<div class = 'topdiv' id = 'dark'><header class = 'top' role = 'banner'><h1>Flight Search</h1></header></div>");
  section.append("<div id = 'searchinfo'><div>");
  let info = $('#searchinfo');
  info.append("<h2> Select an Airline</h2>");

  let airline_list = $("<form id = 'airline_form'><select id = 'airline'></select></form>");
  let airport_list = $("<form id = 'airport_form'><select id = 'airport' onchange = 'updateLocation()'></select></form>");
  let autocomplete_form=$("<div id=autocomplete-div><form autocomplete=off><input id=autocomplete-input type=text name=flightid placeholder= 'Flight Number'></form></div>");
  info.append(airline_list);
  info.append("<h2> Select an Airport </h2>");
  info.append(airport_list);
  info.append("<h2> Find by Flight Number </h2>");
  info.append(autocomplete_form);
  info.append("<br>");
  section.append("<div id = 'map'></div>");
  $('#airline').append("<option value = ''> Select an Airline </option>");
  $('#airport').append("<option value = ''> Select an Airport </option>");

  info.append("<div><button id = 'submit' class = 'button'> Submit </button></div>");
  info.append("<div class = 'table2'></div>");
  let autocomplete_input=document.getElementById('autocomplete-input');
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
  $.ajax(root_url + "flights",
  {
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: (flight) => {
      console.log(flight.length);
      for (let i = 0; i < flight.length; i++) {
        a = flight[i];
        numbers.push(a.number);
      }
    }
  });
  autocomplete(autocomplete_input,numbers);

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

  $('#submit').on('click', function() {
    $('.table2').empty();
    $('.table2').append(`<table id = 'disTab'><thead><tr>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(1)')" style="cursor:pointer">Airline</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(2)')" style="cursor:pointer">Flight No.</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(3)')" style="cursor:pointer">Origin</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(4)')" style="cursor:pointer">Destination</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(5)')" style="cursor:pointer">Departure</th>
    <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(6)')" style="cursor:pointer">Arrival</th>
    </tr></thead>`);
    $('#disTab').append("<tbody id = 'tableBod'></tbody>");

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
		  flight_number = a.number;
          numbers.push(a.number);
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
            depart_city = 'Seattle, WA';
          } else if (d_id == 20676) {
            depart_airport = 'LAX';
            depart_city = 'Los Angeles, CA';
          } else if (d_id == 20675) {
            depart_airport = 'SFO';
            depart_city = 'San Francisco, CA';
          } else if (d_id == 20674) {
            depart_airport = 'DEN';
            depart_city = 'Denver, CO';
          } else if (d_id == 20673) {
            depart_airport = 'IAH';
            depart_city = 'Houston, TX';
          } else if (d_id == 20672) {
            depart_airport = 'ORD';
            depart_city = 'Chicago, IL';
          } else if (d_id == 20671) {
            depart_airport = 'BOS';
            depart_city = 'Boston, MA';
          } else if (d_id == 20670) {
            depart_airport = 'JFK';
            depart_city = 'New York, NY';
          } else if (d_id == 20669) {
            depart_airport = 'ATL';
            depart_city = 'Atlanta, GA';
          } else if (d_id == 20668) {
            depart_airport = 'IAD';
            depart_city = 'Washington, DC';
          } else if (d_id == 20667) {
            depart_airport = 'RDU';
            depart_city = 'Raleigh, NC';
          }

          if (ar_id == 73306) {
            arrival_airport = 'SEA';
            arrival_city = 'Seattle, WA';
          } else if (ar_id == 20676) {
            arrival_airport = 'LAX';
            arrival_city = 'Los Angeles, CA';
          } else if (ar_id == 20675) {
            arrival_airport = 'SFO';
            arrival_city = 'San Francisco, CA';
          } else if (ar_id == 20674) {
            arrival_airport = 'DEN';
            arrival_city = 'Denver, CO';
          } else if (ar_id == 20673) {
            arrival_airport = 'IAH';
            arrival_city = 'Houston, TX';
          } else if (ar_id == 20672) {
            arrival_airport = 'ORD';
            arrival_city = 'Chicago, IL';
          } else if (ar_id == 20671) {
            arrival_airport = 'BOS';
            arrival_city = 'Boston, MA';
          } else if (ar_id == 20670) {
            arrival_airport = 'JFK';
            arrival_city = 'New York, NY';
          } else if (ar_id == 20669) {
            arrival_airport = 'ATL';
            arrival_city = 'Atlanta, GA';
          } else if (ar_id == 20668) {
            arrival_airport = 'IAD';
            arrival_city = 'Washington, DC';
          } else if (ar_id == 20667) {
            arrival_airport = 'RDU';
            arrival_city = 'Raleigh, NC';
          }
          let dep_time = new Date(a.departs_at);
          let conv_dep_time = moment(dep_time).format('HH:mm')
          let arr_time = new Date(a.arrives_at);
		  let conv_arr_time = moment(arr_time).format('HH:mm')

		  let autocomplete_result = getSearchValue();
		  console.log(autocomplete_result);

		  if (airline == '' && airport == '' && autocomplete_result == '') {
            $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + a.number + "</td><td>" +
            depart_city + "</td><td>" + arrival_city + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td></tr>");
          } else if (airline == '' && airport == '' && autocomplete_result != '') {
			if (flight_number == autocomplete_result) {
				$('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + a.number + "</td><td>" +
				depart_city + "</td><td>" + arrival_city + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td></tr>");
			}
          } else if (airline != '' && airport == '') {
            if (airline_name == airline) {
              $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + a.number + "</td><td>" +
              depart_city + "</td><td>" + arrival_city + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td></tr>");
            }
          } else if (airline == '' && airport != '') {
            if (depart_airport == airport || arrival_airport == airport) {
              $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + a.number + "</td><td>" +
              depart_city + "</td><td>" + arrival_city + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td></tr>");
            }
          } else if (airline != '' && airport != '') {
            if (airline_name == airline && (arrival_airport == airport || depart_airport == airport)) {
              $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + a.number + "</td><td>" +
              depart_city + "</td><td>" + arrival_city + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td></tr>");
            }
		  }


        }
      }
    });
  });
};
var build_departure_table = function(elmnt) {
  let section = $('section');

  section.empty();
  section.append("<div class = 'topdiv' id = 'blue'><header class = 'top' role = 'banner'><h1>All Departures</h1><img src='images/depart.png' alt='logo'/></header></div>");
  tablinks = document.getElementsByClassName("tab_link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  elmnt.style.backgroundColor = '#4285f4';
  section.append("<div id = 'info'></div>");
  let info = $('#info');
  info.append("<div class = 'table'></div>");
  $('.table').empty();
  $('.table').append(`<table id = 'disTab'><thead><tr>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(1)')" style="cursor:pointer">Airline</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(2)')" style="cursor:pointer">Flight No.</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(3)')" style="cursor:pointer">Destination</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(4)')" style="cursor:pointer">Depart Time</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(5)')" style="cursor:pointer">Arrival Time</th>
  </tr></thead>`);
  info.append("<div id = 'video'><iframe width='510' height='330' src='https://www.youtube.com/embed/P9FoitNKVjA' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></div>");

  $('#disTab').append("<tbody id = 'tableBod'></tbody>");
  $.ajax(root_url + "flights",
  {
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: (flight) => {
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
          depart_city = 'Seattle, WA';
        } else if (d_id == 20676) {
          depart_airport = 'LAX';
          depart_city = 'Los Angeles, CA';
        } else if (d_id == 20675) {
          depart_airport = 'SFO';
          depart_city = 'San Francisco, CA';
        } else if (d_id == 20674) {
          depart_airport = 'DEN';
          depart_city = 'Denver, CO';
        } else if (d_id == 20673) {
          depart_airport = 'IAH';
          depart_city = 'Houston, TX';
        } else if (d_id == 20672) {
          depart_airport = 'ORD';
          depart_city = 'Chicago, IL';
        } else if (d_id == 20671) {
          depart_airport = 'BOS';
          depart_city = 'Boston, MA';
        } else if (d_id == 20670) {
          depart_airport = 'JFK';
          depart_city = 'New York, NY';
        } else if (d_id == 20669) {
          depart_airport = 'ATL';
          depart_city = 'Atlanta, GA';
        } else if (d_id == 20668) {
          depart_airport = 'IAD';
          depart_city = 'Washington, DC';
        } else if (d_id == 20667) {
          depart_airport = 'RDU';
          depart_city = 'Raleigh, NC';
        }

        if (ar_id == 73306) {
          arrival_airport = 'SEA';
          arrival_city = 'Seattle, WA';
        } else if (ar_id == 20676) {
          arrival_airport = 'LAX';
          arrival_city = 'Los Angeles, CA';
        } else if (ar_id == 20675) {
          arrival_airport = 'SFO';
          arrival_city = 'San Francisco, CA';
        } else if (ar_id == 20674) {
          arrival_airport = 'DEN';
          arrival_city = 'Denver, CO';
        } else if (ar_id == 20673) {
          arrival_airport = 'IAH';
          arrival_city = 'Houston, TX';
        } else if (ar_id == 20672) {
          arrival_airport = 'ORD';
          arrival_city = 'Chicago, IL';
        } else if (ar_id == 20671) {
          arrival_airport = 'BOS';
          arrival_city = 'Boston, MA';
        } else if (ar_id == 20670) {
          arrival_airport = 'JFK';
          arrival_city = 'New York, NY';
        } else if (ar_id == 20669) {
          arrival_airport = 'ATL';
          arrival_city = 'Atlanta, GA';
        } else if (ar_id == 20668) {
          arrival_airport = 'IAD';
          arrival_city = 'Washington, DC';
        } else if (ar_id == 20667) {
          arrival_airport = 'RDU';
          arrival_city = 'Raleigh, NC';
        }
        let dep_time = new Date(a.departs_at);
        let conv_dep_time = moment(dep_time).format('HH:mm')
        let arr_time = new Date(a.arrives_at);
        let conv_arr_time = moment(arr_time).format('HH:mm')

        if (depart_airport == 'RDU') {
          $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + a.number + "</td><td>" + arrival_city + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td></tr>");
        }
      }
    }
  });
};
var build_arrival_table = function(elmnt) {
  let section = $('section');

  section.empty();
  section.append("<div class = 'topdiv' id = 'blue'><header class = 'top' role = 'banner'><h1>All Arrivals</h1><img src='images/arrival.png' alt='logo'/></header></div>");
  tablinks = document.getElementsByClassName("tab_link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  elmnt.style.backgroundColor = '#4285f4';
  section.append("<div id = 'info'></div>");
  let info = $('#info');
  info.append("<div class = 'table'></div>");
  $('.table').empty();
  $('.table').append(`<table id = 'disTab'><thead><tr>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(1)')" style="cursor:pointer">Airline</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(2)')" style="cursor:pointer">Flight No.</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(3)')" style="cursor:pointer">Origin</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(4)')" style="cursor:pointer">Depart Time</th>
  <th onclick="w3.sortHTML('#disTab', '.item', 'td:nth-child(5)')" style="cursor:pointer">Arrival Time</th>
  </tr></thead>`);
  info.append("<div class = 'mapTitle' id = 'blue'><header class = 'title' role = 'banner'><h3>Current Air Traffic To/From RDU</h3></header></div>")
  info.append("<img id='elementMap' src='https://tracker.flightview.com/fvAccessCommonCgimap/FlightViewCGI.exe?qtype=gif&amp;find5=airport&amp;arrap=RDU2&amp;temp=1543966789525'>");

  $('#disTab').append("<tbody id = 'tableBod'></tbody>");
  $.ajax(root_url + "flights",
  {
    type: 'GET',
    xhrFields: {
      withCredentials: true
    },
    success: (flight) => {
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
          depart_city = 'Seattle, WA';
        } else if (d_id == 20676) {
          depart_airport = 'LAX';
          depart_city = 'Los Angeles, CA';
        } else if (d_id == 20675) {
          depart_airport = 'SFO';
          depart_city = 'San Francisco, CA';
        } else if (d_id == 20674) {
          depart_airport = 'DEN';
          depart_city = 'Denver, CO';
        } else if (d_id == 20673) {
          depart_airport = 'IAH';
          depart_city = 'Houston, TX';
        } else if (d_id == 20672) {
          depart_airport = 'ORD';
          depart_city = 'Chicago, IL';
        } else if (d_id == 20671) {
          depart_airport = 'BOS';
          depart_city = 'Boston, MA';
        } else if (d_id == 20670) {
          depart_airport = 'JFK';
          depart_city = 'New York, NY';
        } else if (d_id == 20669) {
          depart_airport = 'ATL';
          depart_city = 'Atlanta, GA';
        } else if (d_id == 20668) {
          depart_airport = 'IAD';
          depart_city = 'Washington, DC';
        } else if (d_id == 20667) {
          depart_airport = 'RDU';
          depart_city = 'Raleigh, NC';
        }

        if (ar_id == 73306) {
          arrival_airport = 'SEA';
          arrival_city = 'Seattle, WA';
        } else if (ar_id == 20676) {
          arrival_airport = 'LAX';
          arrival_city = 'Los Angeles, CA';
        } else if (ar_id == 20675) {
          arrival_airport = 'SFO';
          arrival_city = 'San Francisco, CA';
        } else if (ar_id == 20674) {
          arrival_airport = 'DEN';
          arrival_city = 'Denver, CO';
        } else if (ar_id == 20673) {
          arrival_airport = 'IAH';
          arrival_city = 'Houston, TX';
        } else if (ar_id == 20672) {
          arrival_airport = 'ORD';
          arrival_city = 'Chicago, IL';
        } else if (ar_id == 20671) {
          arrival_airport = 'BOS';
          arrival_city = 'Boston, MA';
        } else if (ar_id == 20670) {
          arrival_airport = 'JFK';
          arrival_city = 'New York, NY';
        } else if (ar_id == 20669) {
          arrival_airport = 'ATL';
          arrival_city = 'Atlanta, GA';
        } else if (ar_id == 20668) {
          arrival_airport = 'IAD';
          arrival_city = 'Washington, DC';
        } else if (ar_id == 20667) {
          arrival_airport = 'RDU';
          arrival_city = 'Raleigh, NC';
        }
        let dep_time = new Date(a.departs_at);
        let conv_dep_time = moment(dep_time).format('HH:mm')
        let arr_time = new Date(a.arrives_at);
        let conv_arr_time = moment(arr_time).format('HH:mm')

        if (arrival_airport == 'RDU') {
          $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + a.number + "</td><td>" + depart_city + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td></tr>");
        }
      }
    }
  });
};
var build_post_interface = function(elmnt) {
  let section = $('section');

  section.empty();
  section.append("<div class = 'topdiv' id = 'green'><header class = 'top' role = 'banner'><h1>blah</h1></header></div>");
  tablinks = document.getElementsByClassName("tab_link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  elmnt.style.backgroundColor = '#009999';
  section.append("<div id = 'info'></div>");
  let info = $('#info');
};




var build_airlines_interface = function(elmnt) {
  let section = $('section');

  section.empty();
  section.append("<div class = 'topdiv' id = 'blue'><header class = 'top' role = 'banner'><h1>Flight Status</h1></header></div>");
  tablinks = document.getElementsByClassName("tab_link");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  elmnt.style.backgroundColor = '#4285f4';
  section.append("<div id = 'info'><div>");
  let info = $('#info');

  info.append("<h2> Arrivals or Departures? </h2>");
  info.append("<form><input type = 'radio' name = 'arde' value = 'arrival'> Arrivals <br><input type = 'radio' name = 'arde' value = 'departure'> Departures <br></form>");

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

    $.ajax(root_url + "flights",
    {
      type: 'GET',
      xhrFields: {
        withCredentials: true
      },
      success: (flight) => {
        console.log(flight.length);
        var radioValue;
        radioValue = $("input[name='arde']:checked").val();
        console.log(radioValue);
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
          let dep_time = new Date(a.departs_at);
          let conv_dep_time = moment(dep_time * 1000).format('HH:mm')
          let arr_time = new Date(a.arrives_at);
          let conv_arr_time = moment(arr_time * 1000).format('HH:mm')

          if (radioValue == 'departure') {
            if (depart_airport == 'RDU') {
              $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + depart_airport + "</td><td>" +
              arrival_airport + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td><td>" + a.number + "</tr>");
            }
          } else if (radioValue == 'arrival') {
            if (arrival_airport == 'RDU') {
              $('#disTab').append("<tr class='item'><td>" + airline_name + "</td><td>" + depart_airport + "</td><td>" +
              arrival_airport + "</td><td>" + conv_dep_time + "</td><td>" + conv_arr_time + "</td><td>" + a.number + "</tr>");
            }
          }
        }
      }
    });
  });
};
function autocomplete(input,numbers){
  let focused_selection;
  input.addEventListener('input',function(e){
    let value=this.value;
    closelists(input);
    if(!value){
      return false;
    }
    focused_selection=-1;
    div1=$('<div></div>');
    div1.attr('id',this.id+'autocomplete-matches');
    div1.attr('class','autocomplete-strings');
    $(this).parent().append(div1);
    for(i=0;i<numbers.length;i++){
      if(numbers[i].substring(0,value.length).toLowerCase()==value.toLowerCase()){
        div2=document.createElement('DIV');
        div2.innerHTML=(numbers[i]+'<input type=hidden value='+numbers[i]+'>');
        div2.addEventListener('click',function(e){
          input.value=this.getElementsByTagName('input')[0].value;
          console.log(getSearchValue());
          closelists(input);
        });
        div1.append(div2);
      }
    }
  });
  input.addEventListener('keydown',function(e){
    let list=document.getElementById(this.id+'autocomplete-matches')
    if(list){
      list=list.getElementsByTagName('div');
      if(e.keyCode==40){
        focused_selection++;
        make_active(list,focused_selection);
      }
      else if(e.keyCode==38){
        focused_selection--;
        make_active(list,focused_selection);
      }
      else if(e.keyCode==13){
        e.preventDefault();
        if(focused_selection>-1){
          if(list){
            list[focused_selection].click();
          }
        }
      }
    }
  });
  document.addEventListener('click',function(e){
    closelists(input);
  });
}
function make_active(list,focused_selection){
  if(!list){
    return false;
  }
  make_inactive(list);
  if(focused_selection>=list.length){
    focused_selection=0;
  }
  if(focused_selection<0){
    focused_selection=list.length-1;
  }
  list[focused_selection].classList.add('autocomplete-active');
}
function make_inactive(list){
  for(i=0;i<list.length;i++){
    list[i].classList.remove("autocomplete-active");
  }
}
function closelists(input,element){
  let list=document.getElementsByClassName('autocomplete-strings');
  for(let i=0;i<list.length;i++){
    if(element!=list[i] && element!=input){
      list[i].parentNode.removeChild(list[i]);
    }
  }
}
function getSearchValue(){
  return document.getElementById('autocomplete-input').value;
}
// GOOGLE MAPS API KEY AIzaSyBs0A4Cgt04LwXWEdMNbEtRDOdWwJx9Yrg
