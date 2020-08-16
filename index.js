let params = new URLSearchParams( location.search );
var isSolved = false;
var wordLists = wordList.replace(/ /g, '');
var words = wordLists.split( "," );
var selectedWord;
var typedword = "";
var revealedWord = "";
var define = document.querySelector( "#define" );
var answer = document.querySelector( "#answer" );
var dailySolvedCount = 0;
var players = new Map;

function addpoints(name, points) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = xhttp.responseText;
        }
    };
    xhttp.open("PUT", "https://api.streamelements.com/kappa/v2/points/"+params.get( "streamid" )+ "/" + name + "/" + points, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + params.get( "streamejwt" ));
    
    xhttp.send();
}

function newWord() { 
  selectedWord = words[ Math.floor( Math.random() * words.length ) ];
  typedword = "";
  revealedWord = "_".repeat( selectedWord.length );
  isSolved = false;
  console.log(selectedWord)
  define.innerText = ''
  answer.innerText = revealedWord.split( "" ).join( " " );
  setTimeout( () => {
    switch (selectedWord) {
      case 'gravy':
        define.innerText = 'Hes the god that made this ;)'
        break;
      case 'ego':
          define.innerText = 'Auri has one!'
        break;
      case 'bitch':
          define.innerText = 'Jax is one!'
        break;
    }
  }, 10000 );
}

newWord();

function checkWord( selectedWord, typedword ) {
  for( var i = 0; i < selectedWord.length && i < typedword.length; i++ ) {
    //console.log( i, selectedWord[ i ], typedword[ i ] );
    if( selectedWord[ i ] === typedword[ i ] ) {
      var parts = revealedWord.split( "" );
      parts[ i ] = selectedWord[ i ];
      revealedWord = parts.join( "" );
      //console.log( revealedWord );
      answer.innerText = revealedWord.split( "" ).join( " " );
    }
  }

  return !revealedWord.includes( "_" );
}

function addWordGuessedCount(user) {
  if (players.get(user) === 0 || !players.has(user)){
    players.set(user, 1)
  } else {
    var points = players.get(user) + 1;
    players.set(user, points)
  }
}


ComfyJS.onChat = ( user, message,flags, self, extra ) => {
  if( checkWord( selectedWord.toLowerCase(), message.toLowerCase().split( " " )[ 0 ] ) ) {
    if(!isSolved) {
      isSolved = true;
      dailySolvedCount++;
      //console.log(user)
      document.querySelector( ".recentWinner" ).innerText = "Last Winner: " + user;
      addpoints(user, selectedWord.length * 75);
      ComfyJS.Say(`${user} has solved the word!`);
      addWordGuessedCount(user.toLowerCase());
      setTimeout( () => {
        newWord();
      }, 3000 );
    }
  }
  if (extra.customRewardId == "f18a863c-146e-4f0f-9357-cd0456c136a4") {
    ComfyJS.Say( `/me ${user} has skipped the word!`);
    ComfyJS.Say( `/me the word skipped was ${selectedWord}.`);
    newWord();
  }
}

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if(command === "solvedcount" ) {
    ComfyJS.Say( `@${user} todays daily solved word count is ${dailySolvedCount}.` );
  }
  if(command === "wordcount" ) {
    if (message.trim().toLowerCase().length > 0){
      if (players.has(message.trim().toLowerCase().replace("@", ""))){
        ComfyJS.Say( `@${user}, ${message.trim()}'s amount of words guessed correctly today is ${players.get(message.trim().toLowerCase().replace("@", ""))}.` );
      } else {
        ComfyJS.Say( `@${user} please enter a valid username or dont add a message at the end to see your own stats.` );
      }
    }else {
      ComfyJS.Say( `@${user} your amount of words guessed correctly today is ${players.get(user.toLowerCase())}.` );
    }
  }

  if( flags.broadcaster && command === "newword" ) {
    ComfyJS.Say( `/me The word was ${selectedWord}.` );
    newWord();
  }

  if (extra.customRewardId == "f18a863c-146e-4f0f-9357-cd0456c136a4") {
    ComfyJS.Say( `/me ${user} has skipped the word!` );
    ComfyJS.Say( `/me the word skipped was ${selectedWord}.`);
    newWord();
  }
}

ComfyJS.Init( params.get( "botname" ), "oauth:" + params.get( "oauth" ),  params.get( "channel" ) );