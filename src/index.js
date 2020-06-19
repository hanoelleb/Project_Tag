import './style.css';
import pic from './resources/waldo.jpg';
import * as firebase from 'firebase';

import {charLocation} from './location';

import waldo from './resources/waldo.png';
import wilma from './resources/wilma.png';
import odlaw from './resources/odlaw.png';
import wizard from './resources/wizard.png';
import woof from './resources/woof.png';

var Stopwatch = require('timer-stopwatch');

var app = firebase.initializeApp({ 
   apiKey: "AIzaSyBVPUvW7C24IwCsqTNIkWD1f37UfGFhl3I",
   authDomain: "phototag-63c9e.firebaseapp.com",
   databaseURL: "https://phototag-63c9e.firebaseio.com",
   projectId: "phototag-63c9e",
   storageBucket: "phototag-63c9e.appspot.com",
   messagingSenderId: "678680507435",
   appId: "1:678680507435:web:c0b5badc5dcc238be8666e"
});

var database = firebase.database();

var stopwatch;
var targetBox = document.createElement('div');
var currentX = 0;
var currentY = 0;

var locations = [];

function addPic() {
    var content = document.getElementById('content');
    
    var img = document.createElement('img');
    img.id = 'page';
    img.style.cssText = 'z-index: 5';
    img.src = pic;
    img.addEventListener('click', photoClick);
    content.appendChild(img);
}

function photoClick(e) {
    var offset = 40;
    var targetBox = document.getElementById('target');
    var xPos = e.layerX;
    var yPos = e.layerY;

    targetBox.style.marginLeft = (xPos - offset) + 'px';
    targetBox.style.marginTop = (yPos - offset) + 'px';
    targetBox.style.display = 'flex';
    
    currentX = xPos;
    currentY = yPos;
}

function makeCharacterBanner(container) {
     var characterBanner = document.createElement('div');
     characterBanner.style.cssText = 'display: flex; position: fixed; background-color: white; border: 5px red solid;';

     var images = [waldo, wilma, odlaw, wizard, woof];
     var names =  ['Waldo', 'Wilma', 'Odlaw', 'Wizard', 'Woof'];

     for (var i = 0; i < images.length; i++) {
          var icon = document.createElement('figure');
	  var img = document.createElement('img');
	  img.src = images[i];
            
	  var cap = document.createElement('figcaption');
	  cap.innerHTML = names[i];

	  icon.appendChild(img);
	  icon.appendChild(cap);

	  characterBanner.appendChild(icon);
     }

     container.appendChild(characterBanner);
}

function makeTimer(container) {
    var timer = document.createElement('div');
    timer.style.cssText = 'position: fixed; left: 75vw; width: 20vw; height: 8vw; float: right; color: white;' + 
		'background-color: red; border: 5px white solid; display: flex; justify-content: center; align-items: center;'

    var time = document.createElement('span');
    time.id = 'time';
    time.style.fontSize = '200%';
    time.innerHTML = '0:00';
    timer.appendChild(time);

    container.appendChild(timer);
}

function makeTarget(container) {
    var target = document.createElement('div');
    target.id = 'target';
    target.style.cssText = 'position: absolute; display: none'

    var targetBox = document.createElement('div');
    targetBox.id = 'targetBox';
    targetBox.style.cssText = 'width: 50px; height: 100px; border: 5px solid red;';
    target.appendChild(targetBox);

    var dropdown = document.createElement('div');
    dropdown.style.cssText = 'display: flex; flex-direction: column;'
    var names =  ['Waldo', 'Wilma', 'Odlaw', 'Wizard', 'Woof'];

    for (var i = 0; i < names.length; i++) {
	const index = i;
        var charBtn = document.createElement('button');
	charBtn.id = names[i].toLowerCase() + 'btn';
	charBtn.innerHTML = names[i];
	charBtn.style.cssText = 'color: white; background-color: red; border: 2px solid white;'
	//todo: add button functionality/event listener
	charBtn.addEventListener('click', () => {
	   var lookup = names[index].toLowerCase();
	   console.log('lookup: ' + lookup);
	   for (var i = 0; i < locations.length; i++) {
	       if (lookup === locations[i].name) {
		   const offset = 40;
		   var answerX = locations[i].xPos;
		   var answerY = locations[i].yPos;
		   
		   var x = Math.abs(currentX - answerX);
		   var y = Math.abs(currentY - answerY);

		   console.log('answer: ' + answerX + ' current: ' + currentX + ' x: ' + x);

		   if (x <= 25 && y <= 50) {
		       console.log('found ' + lookup);
		       document.getElementById(lookup+'btn').style.display = 'none';

		       var found = document.createElement('div');
                       document.getElementById('content').appendChild(found);

		       var charBox = document.createElement('div');
		       charBox.id = lookup+'found';
		    
		       var getX = 'left: ' + (answerX - offset) + 'px;';
		       var getY = 'top: ' + (answerY - offset) + 'px;';
		       charBox.style.cssText = 'position: absolute; width: 50px; height: 100px; border: 5px solid red;' + getX + getY;
		       found.appendChild(charBox);
		   }
		  return;
	       }
	   }
	});
	dropdown.appendChild(charBtn);
    }
    target.appendChild(dropdown);

    container.appendChild(target);

}

function setUp() {
    var content = document.getElementById('content');

    makeCharacterBanner(content);
        
    makeTimer(content);

    makeTarget(content);
    
    addPic();
}

function updateTimeDisplay(time) {
    var timeDis = document.getElementById('time');
    timeDis.innerHTML = time.ms / 1000;
}

function start() {
    var start = document.getElementById('start');
    start.style.display = 'none';
    
     var query = database.ref('locations');
     query.once('value')
        .then(function(snapshot) {
	    snapshot.forEach(function (childSnapshot) {
		  var key = childSnapshot.key;
		  var childData = childSnapshot.val();
		  const data = charLocation(key, childData.xPos, childData.yPos);
		  locations.push(data);
	    });
	});
    stopwatch = new Stopwatch();
    stopwatch.onTime(updateTimeDisplay);
    stopwatch.start();
    
}

setUp();

var startBox = document.createElement('div');
startBox.id = 'start';
startBox.style.cssText = 'position: fixed; top: 40%; left: 33%; width: 33vw; height: 20vw;' + 
    'color: white; background-color: red; border: 5px solid white; display: flex; justify-content: center; align-items: center;' +
    'flex-wrap: wrap;';

var startMessage = document.createElement('span');
startMessage.innerHTML = 'Welcome! Find Waldo and his friends as quickly as you can!' + 
    ' If you find them fast enough, you might get a high score. Good luck!'

var startButton = document.createElement('button');
startButton.innerHTML = 'Start';
startButton.addEventListener('click', start);

startBox.appendChild(startMessage);
startBox.appendChild(startButton);

document.body.appendChild(startBox);
