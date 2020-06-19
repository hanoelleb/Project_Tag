//image resources
import waldo from './resources/waldo.png';
import wilma from './resources/wilma.png';
import odlaw from './resources/odlaw.png';
import wizard from './resources/wizard.png';
import woof from './resources/woof.png';

export {makeCharacterBanner, makeTimer, disableButton, createMarker, highScorePopUp, displayScores};

//for all elements that do not need additional listeners/functionality
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
    time.innerHTML = '0.00';
    timer.appendChild(time);

    container.appendChild(timer);
}

function disableButton(character) {
    document.getElementById(character+'btn').style.display = 'none';
}

function createMarker(character, xPos, yPos){
    var found = document.createElement('div');
    document.getElementById('content').appendChild(found);

    var charBox = document.createElement('div');
    charBox.id = character+'found';

     var getX = 'left: ' + xPos + 'px;';
     var getY = 'top: ' + yPos + 'px;';
     charBox.style.cssText = 'position: absolute; width: 50px; height: 100px; border: 5px solid red;' + getX + getY;
     found.appendChild(charBox);
}

function highScorePopUp() {
    var scoreBox = document.createElement('div');
    scoreBox.id = 'highscore';
    scoreBox.style.cssText = 'position: fixed; top: 40%; left: 33%; width: 33vw; height: 20vw;' +
    'color: white; background-color: red; border: 5px solid white; display: flex; justify-content: center; align-items: center;' +
    'flex-wrap: wrap;';

    var scoreMessage = document.createElement('span');
    scoreMessage.innerHTML = 'Congratulations, you got a high score! Please enter a nickname.';

    var form = document.createElement('form');
    form.id = 'scoreForm';

    var nameField = document.createElement('input');
    nameField.id = 'user';
    nameField.type = 'text';

    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Enter';

    form.appendChild(nameField);
    form.appendChild(submit);

    scoreBox.appendChild(scoreMessage);
    scoreBox.appendChild(form);

    document.body.appendChild(scoreBox);
    return form;
}

function displayScores( scoreList ) {
    console.log('displaying scores');
    var scores = document.createElement('div');   
    scores.id = 'scoreList';
    scores.style.cssText = 'position: fixed; top: 30%; left: 33%; width: 30vw; height: 35vw;' +
    'color: white; background-color: red; border: 5px solid white; display: flex; justify-content: center; align-items: center;' +
    'flex-direction: column; flex-wrap: wrap;';

    var scoreHeader = document.createElement('h2');
    scoreHeader.innerHTML = 'Scores';
    scores.appendChild(scoreHeader);

    for (var i = 0; i < scoreList.length; i++) {
        var score = document.createElement('span');
	score.innerHTML = scoreList[i].user + ': ' + scoreList[i].score;
	scores.appendChild(score);
    }

    document.body.appendChild(scores);
}
