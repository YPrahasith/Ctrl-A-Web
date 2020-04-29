// Make connection
var protocol = window.location.protocol;
var socket = io.connect(
  protocol + "//" + document.domain + ":" + location.port
);

// Function to get cookie
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

// Function to generate random number
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// UID Setup
var uid = getCookie("uid");
console.log(uid);
if (uid == false) {
  uid = randomNumber(1000, 9999);
  document.cookie = "uid=" + uid;
}

socket.emit("join", uid);
document.getElementById("uid").innerHTML = "Unique ID: " + uid;

// Talkify
talkify.config.remoteService.host = "https://talkify.net";
talkify.config.remoteService.apiKey = "a800fd35-db29-4ef9-997b-cf040b6e5f5d";

talkify.config.ui.audioControls = {
  enabled: true, //<-- Disable to get the browser built in audio controls
  container: document.getElementById("player-and-voices"),
};

var player = new talkify.TtsPlayer().enableTextHighlighting();

var playlist = new talkify.playlist()
  .begin()
  .usingPlayer(player)
  .withTextInteraction()
  .withElements(document.querySelectorAll("p")) //<--Any element you'd like. Leave blank to let Talkify make a good guess
  .build();
var player1 = new talkify.TtsPlayer(); //or new talkify.Html5Player()
player1.playText(uid);

// Listen for events
socket.on("scroll", function (data) {
  if (data == "up") window.scrollBy(0, -300);
  else if (data == "down") window.scrollBy(0, 300);
});

socket.on("navigate", function (data) {
  if (data == "videos")
    window.location = protocol + "//" + document.domain + "/videos.html";
  else if (data == "about")
    window.location = protocol + "//" + document.domain + "/about.html";
  else if (data == "home")
    window.location = protocol + "//" + document.domain + "/";
});

socket.on("play", function (data) {
  var vid = document.getElementById("myVideo");
  if (data == "play") vid.play();
  else if (data == "pause") {
    try {
      vid.pause();
    } catch (e) {}
    try {
      playlist.pause();
    } catch (e) {}
  }
});

socket.on("narrate", function () {
  playlist.play();
});
