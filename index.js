let params = new URLSearchParams( location.search );
var gameDifficulty = 2;
var isSolved = false;
var words = wordList.split( "," );
var selectedWord;
var typedword = "";
var revealedWord = "";
var define = document.querySelector( "#define" );
var answer = document.querySelector( "#answer" );

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

function newWord( difficulty ) {
  var wordsByDifficulty = words.filter( x => x.length >= 3 && x.length <= ( difficulty + 5 ) );
  selectedWord = wordsByDifficulty[ Math.floor( Math.random() * wordsByDifficulty.length ) ];
  typedword = "";
  revealedWord = "_".repeat( selectedWord.length );
  isSolved = false;
  console.log(selectedWord)
  define.innerText = ''
  answer.innerText = revealedWord.split( "" ).join( " " );

    if (selectedWord === 'gravy'){
        setTimeout( () => {
            define.innerText = 'Hes the god that made this ;)'
        }, 10000 );
    }
    if (selectedWord === 'ego'){
        setTimeout( () => {
            define.innerText = 'Auri has one!'
        }, 10000 );
    }
    if (selectedWord === 'bitch'){
      setTimeout( () => {
          define.innerText = 'Jax is one!'
      }, 10000 );
  }
}

newWord( gameDifficulty );

function checkWord( selectedWord, typedword ) {
  for( var i = 0; i < selectedWord.length && i < typedword.length; i++ ) {
    // console.log( i, selectedWord[ i ], typedword[ i ] );
    if( selectedWord[ i ] === typedword[ i ] ) {
      var parts = revealedWord.split( "" );
      parts[ i ] = selectedWord[ i ];
      revealedWord = parts.join( "" );
      // console.log( revealedWord );
      answer.innerText = revealedWord.split( "" ).join( " " );
    }
  }

  return !revealedWord.includes( "_" );
}

ComfyJS.onChat = ( user, message,flags, self, extra ) => {
  if( checkWord( selectedWord.toLowerCase(), message.split( " " )[ 0 ] ) ) {
    if( !isSolved && selectedWord === message.split( " " )[ 0 ] ) {
      isSolved = true;
      console.log(user)
      document.querySelector( ".lastWord" ).innerText = "Last Word: " + selectedWord;
      document.querySelector( ".recentWinner" ).innerText = "Last Winner: " + user;
      addpoints(user, 250);
      setTimeout( () => {
        newWord( gameDifficulty );
      }, 3000 );
    }
  }
  if (extra.customRewardId == "f18a863c-146e-4f0f-9357-cd0456c136a4") {
    ComfyJS.Say( "/me " + user + " has skipped the word!" );
    newWord( gameDifficulty );
  }
}

ComfyJS.onCommand = ( user, command, message, flags, extra ) => {
  if( flags.broadcaster && command === "newword" ) {
    ComfyJS.Say( "/me The word was " + selectedWord );
    newWord( gameDifficulty );
  }
  if (extra.customRewardId == "f18a863c-146e-4f0f-9357-cd0456c136a4") {
    ComfyJS.Say( "/me " + user + " has skipped the word!" );
    newWord( gameDifficulty );
  }
}

ComfyJS.Init( "BotDagger", "oauth:" + params.get( "oauth" ),  "JaxDagger" );