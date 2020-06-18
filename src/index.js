import './style.css';
import pic from './waldo.jpg';
import * as firebase from 'firebase';

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

function addPic() {
    var content = document.getElementById('content');
    
    var img = document.createElement('img');
    img.src = pic;
    img.addEventListener('click', photoClick);
    //img.style.cssText = 'width: 100vw; height: auto;';
    content.appendChild(img);
}

function photoClick(e) {
    var xPos = e.layerX;
    var yPos = e.layerY;
    /*
    if (e)
    {
        //FireFox
        xPos = mouseEvent.screenX;
        yPos = mouseEvent.screenY;
    } */
    console.log('x: ' + xPos + ' y: ' + yPos);
}

addPic();
