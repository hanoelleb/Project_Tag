import * as firebase from 'firebase';

//main picture
import pic from './resources/waldo.jpg';

//modules/factories
import {charLocation} from './location';
import {Game} from './game';
import {makeCharacterBanner, makeTimer, disableButton, createMarker, highScorePopUp, displayScores} from './DOM';

import './style.css';

//installations
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
    img.style.cssText = 'z-index: 1';
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
	   for (var i = 0; i < locations.length; i++) {
	       if (lookup === locations[i].name) {
		   const offset = 40;
		   var answerX = locations[i].xPos;
		   var answerY = locations[i].yPos;
		   
		   var x = Math.abs(currentX - answerX);
		   var y = Math.abs(currentY - answerY);

		   if (x <= 25 && y <= 50) {
		       Game.foundCharacter();
                       if (Game.isFinished()){
		           stopwatch.stop();
			   let gotHighScore = Game.checkScore(stopwatch.ms/1000);
                           if (gotHighScore) {
			       var form = highScorePopUp();
                               form.addEventListener('submit', submitForm);
			   }
		       }
                       disableButton(lookup);
	               createMarker(lookup, (answerX-offset), (answerY-offset));
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

function submitForm(e) {
    e.preventDefault()
    var form = document.getElementById('scoreForm');
    var name = form.childNodes[0].value;
    console.log(name + ' with time: ' + (stopwatch.ms / 1000));
    const newScores = Game.enterHighScore(name, stopwatch.ms/ 1000);
    document.getElementById('highscore').style.display = 'none';
    updateScores(newScores);
    displayScores(newScores);
    //todo: display high scores after update
}

function updateScores(scoreList) {
    var scoresRef = [];

    for (let i = 0; i < scoreList.length; i++) {
	const user = scoreList[i].user;
	const score = scoreList[i].score;
        database.ref('scores/' + user).set({
            score
        });
    }
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

    var count = 0;
    var scoreQuery = database.ref('scores');
    scoreQuery.once('value')
        .then(function(snapshot) {
	    snapshot.forEach(function (childSnapshot) {
                  var key = childSnapshot.key;
                  var childData = childSnapshot.val().score;
		  if (count < 10) {
		      Game.addScore(key, childData);
                      count++;
		  } 
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
