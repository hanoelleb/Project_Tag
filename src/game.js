export {Game};


const Score = (user, score) => {
    return {user, score};
};

const Game = (() => {
    
     var charNumber = 5;
     var found = 0;
     var scores = [];

     const foundCharacter = () => {
         found++;
     }

     const isFinished = () => {
         return found === charNumber;
     }

     const addScore = (userData, scoreData) => {
          let score = Score(userData, scoreData);
	  scores.push(score);
     }

     const checkScore = (score) => {
          for (let i = 0; i < scores.length; i++) {
	      if (score < scores[i].score) {
	          //scores.splice(i,0,score);
		  //scores.pop();
		  return true;
	      }
	  }
	  return false;
     }

     const getScores = () => {
         return scores;
     }

     const enterHighScore = (user, score) => {
          for (let i = 0; i < scores.length; i++) {
              if (score < scores[i].score) {
                  scores.splice(i,0,Score(user,score));
                  scores.pop();
                  return scores;
              }
          }
     }

     return {foundCharacter, addScore, checkScore, getScores, isFinished, enterHighScore}

})();
