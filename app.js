/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

//constants
var F = 1;
// var C = 2;

var UI = require('ui');
var Vector2 = require('vector2');
var Light = require('ui/light');
var Vibe = require('ui/vibe'); // Import the Vibe object
var ajax = require('ajax');
var temp_unit = F; //Default temp unit is Fahrenheit

var vibration_on = localStorage.getItem("vibration"); 
if (vibration_on === null)
    vibration_on = 1; //vib on by default

// Create the Window
var window = new UI.Window();

// Create a background Rect
var bgRect = new UI.Rect({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  backgroundColor: 'white'
});

var time = new UI.TimeText({
    position: new Vector2(0,120),
    size: new Vector2(144, 48),
    text:"%H:%M",
    color: 'black',
    font: 'bitham-30-black',
});

window.add(bgRect);
window.add(time);
// window.add(image);
window.show();
console.log("all done");

//default location: Hanover, NH
var lat= 43.7;
var lon= -72.29;

function locationSuccess(pos) {
  lat = pos.coords.latitude;
  lon = pos.coords.longitude;
    
    /*hardcoded location for a place where it's raining, wellington in this case
    uncomment this to see if the predition actually works for a place where its raining*/
    
       //lat =-41.2443701;
       //lon = 174.7618546;
    
    
  console.log('lat= ' + lat + ' lon= ' + lon);
  // Construct URL
  var URL = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=2d38ac38e959152f19c2781fa05f133e';
  // Make the request
  ajax(
    {
      url: URL,
      type: 'json'
    },
    function(data) {
      // Success!
      console.log("Successfully fetched weather data!");
  
      // Extract data
      var location = data.name;
      var temperature;
      if (temp_unit == F)
        temperature = Math.round( (data.main.temp - 273.15)*9/5 + 32 ) + "F";
      else
        temperature = Math.round( data.main.temp - 273.15 ) + "C";
  
      // Always upper-case first letter of description
      var description = data.weather[0].description;
      description = description.charAt(0).toUpperCase() + description.substring(1);
  
      console.log(data.weather[0].main);
     if (data.weather[0].main == 'rain' || data.weather[0].main == 'Rain'){
         var loc_text = new UI.Text({
            position: new Vector2(0,0),
            size: new Vector2(144,20),
            text: location + ', ' + temperature,
            font: 'gothic-14',
            color: 'black',
            textOverflow: 'wrap',
            textAlign: 'left',
            borderColor: 'clear',    
            backgroundColor: 'white'
        });
      window.add(loc_text);

      var desc_text = new UI.Text({
            position: new Vector2(0,15),
            size: new Vector2(144,20),
            text: description,
            font: 'gothic-14-bold',
            color: 'black',
            textOverflow: 'wrap',
            textAlign: 'left',
            borderColor: 'clear',    
            backgroundColor: 'white'
        });
      window.add(desc_text); 
         
      var image = new UI.Image({
          position: new Vector2(38, 48),
          size: new Vector2(67, 71),
          backgroundColor: 'white',
          image: 'images/umbrella-wbg.png',
        });
      window.add(image);
     }
      // Show to user
//       card.subtitle(location + ", " + temperature);  
      //card.body(description);

        
//       Light.trigger();
      
//       vibration_on = localStorage.getItem("vibration");
//       Vibe.vibrate('short');
    },
    function(error) {
      // Failure!
      console.log('Failed fetching weather data: ' + error);
     // card.subtitle('Failed to get weather');
    }
  );

}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
  //card.subtitle('Failed to get location');
}


var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

// Make an asynchronous request
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);