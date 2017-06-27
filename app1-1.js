//Version 1.1 typetrainer
//vers.1.1
//Adrien Shen
/*

Feature: snipe mode. 1-2 letter units, fast reaction
Feature: add really vocab words, as a mode.
Feature: add a actual type trainer
Feature: add highscores database.

*/

var phrasesArr;
var canvas = document.getElementById('app-view'),
    ctx = canvas.getContext('2d');
var fps = 30;       //frames per second
    
    //declaring need variables
    //stats
var hits = 0,
    missed = 0,
    
    //Effects game difficulty settings, configuration
    lvl = 1,
        s = (lvl * 0.5 / fps), //controls the speed at which the phrases grow to 50px/60px at 30fps
        uqty = 2,              //control the number of phrases on board.
        wordLenMax = 8,
        wordLenMin = 5;
               
                
    phrasesArr = [];
    
    var cw = 900,
        ch = 550;
       
    //identify key groups    
    var homeKeys = ["a", "s", "d", "f", ";", "l", "k", "j", "g", "h"],
        topKeys = ["q", "w", "e", "r", "p", "o", "i", "u", "t", "y"],
        lowerKeys = ["z", "x", "c", "v", ".", ",", "m", "n", "b"];
        
    var snipeModeConfig = 0;
    var charSpaceConfig = 3;  //1 for homekeys, 2 for homekeys + topkeys, 3 for allkeys
    var allowedMisses = 20;
        
    var userInput = $('#type-input');
    //console.log(charSpaceConfig);
    ctx.fillStyle = '#333' ;

$(document).ready(function() { 
    init();
});

        var refreshAll = function() {
            hits = 0, missed = 0, lvl= 0;
            canvas = canvas;
            phrasesArr = [];
            $('div#model').fadeIn(1000);
            init();
        }

//refreshAll fn, maybe thinking about putting click handler for reset ln:53
    //problems with switching between modes, states are stuck/glitched
        //lots of work, organizing, indenting.


    function typeMatch() {
        
        $('div#model').fadeOut(2000);
        //program init
        //init();
        userValue = $('#type-input').val();
        //console.log(userValue);
        
        
        _.each(phrasesArr, function(obj, i) {
            if ( userValue.trim() === obj.phrase ) {
                userInput.val("");
                hits ++; console.log("hits : " + hits);
                updateStat('hit', hits);
                
                
                setTimeout(function() {
                    ctx.fillStyle = '#333'
                    phrasesArr[i] = new PhraseUnit();
                //  phrasesArr.push(new PhraseUnit()); //makes two new unit for each one completed, turn on for imposible mode
                    
                }, 500);
                
                if ( (hits % 10 == 0) && (userValue.trim() === obj.phrase) ) {
                    console.log(lvl);
                    lvl ++;
                    s = (lvl*0.5/fps); console.log("speed is "+ s);
                    updateStat('level', lvl);
                    //phrasesArr.push(new PhraseUnit()); //makes 1 more after each level up, turn on for insanity mode
                    if ( (lvl % 5 == 0) && (hits % 10 == 0) ) {
                        console.log("Lvl equals 5!, adding another unit");
                        phrasesArr.push(new PhraseUnit()); //pushing another PhraseUnit on every 5th level up
                    }
                }
                ctx.fillStyle = '#090'
                
             }
        });
        return lvl;    
    };





        function init() {
            
            //charSpaceConfig = 3; console.log(charSpaceConfig);
            $(document).on('keyup', function(key) {
                userValue = $('#type-input').val();
                if (userValue == 1) {
                    charSpaceConfig = 1; console.log(charSpaceConfig);
                    userInput.val("");

                    updateStat('mode', '1.only home-row keys')

                    startPhrases();
                }
                else if (userValue == 2) {
                    charSpaceConfig = 2; console.log(charSpaceConfig);
                    userInput.val("");
                    
                    updateStat('mode', '2.home-row+top-row')
                    
                    startPhrases();
                }
                else if (userValue == 3) {
                    charSpaceConfig = 3; console.log(charSpaceConfig);
                    userInput.val("");
                    
                    updateStat('mode', 'all 3 rows')
                    
                    startPhrases();
                }
                else if (userValue == 9) {
                    
                    if ( snipeModeConfig == 1 ) {
                        snipeModeConfig = 0;
                        charSpaceConfig = 3;
                        userInput.val("");

                        updateStat('mode', 'all 3 rows')

                        startPhrases();
                    }

                    else if ( snipeModeConfig == 0 ) {

                    console.log("mode set to sniper!");
                    charSpaceConfig = 3; //sets the keys to all-keys
                    wordLenMin = 1; wordLenMax = 2; //set len of letter between 1 and 2

                    snipeModeConfig = 1; console.log(snipeModeConfig);

                    userInput.val(""); //clears user input field

                    updateStat('mode', 'sniper mode')

                    startPhrases();
                    }
                }


            });  
            
            
            
                userInput.on('keypress', typeMatch);
        function startPhrasesSnipe() { //experimenting
            phrasesArr = [];
            for (var j = 0; j < uqty; j++) {
                phrasesArr.push(new PhraseUnit());
            }
            drawPhraseUnitSnipe();
        }

        function startPhrases() {
            phrasesArr = [];
            for (i = 0; i < uqty; i++) {
                phrasesArr.push(new PhraseUnit());
            }
            drawPhraseUnit();
            //userInput.on('keypress', typeMatch);
        }

        }






        function PhraseUnit() {
            this.xPos = _.random(100, cw-100);    //_.random(100, cw-150); //setting the x position of PhraseUnit
            this.yPos = _.random(100, ch-100);    //_.random(100, ch-150); //setting the y position of PhraseUnit 
           
            console.log( phraseConstructor());
            this.phrase = phraseConstructor();
            this.fsize = 20;
            this.s = s;
        }
        
        function phraseConstructor() {
            
            if (charSpaceConfig == 1) {
                optionOne(wordLenMin, wordLenMax);
            }
            else if (charSpaceConfig == 2) {
                optionTwo(wordLenMin, wordLenMax);
            }
            else {
                optionThree(wordLenMin, wordLenMax);
            }
            return cpStr;
        }


        function optionOne(lMin, lMax) {
            console.log("option1 chosen")
            
            var cpArr = homeKeys;                   //list possible chars in array
            var randInt = _.random(lMin, lMax);   //gens random int between 5 and 8
            cpArr = cpArr.concat(cpArr);    //doubles the values in cpArr so double chars are possible
            cpArr = _.shuffle(cpArr);       //shuffles cpArr using underscore's _.shuffle method
            cpStr = cpArr.join("");         //joins the cpArr into a String
            
            cpStr = cpStr.substr(0, randInt); //makes the resulting string 5 - 8 chars long
            return cpStr; console.log(cpStr);
            
        }
        function optionTwo(lMin, lMax) {
            console.log("option2 chosen")
            
            var randInt = _.random(lMin, lMax)
            var cpArrA = homeKeys, cpArrB = topKeys, apArr;

            cpArrA = cpArrA.concat(cpArrA); cpArrB = cpArrB.concat(cpArrB); 
            cpArr = cpArrA.concat(cpArrB);
            cpArr = _.shuffle(cpArr);
            cpStr = cpArr.join("");
            
            cpStr = cpStr.substr(0, randInt);
            return cpStr;
            //final = ((_.shuffle((cpArrA.concat(cpArrA)).concat( (cpArrB.concat(cpArrB)) ))).join("")).substr(0, randInt);  //in one expression
        }
        function optionThree(lMin, lMax) {
            console.log("option3 chosen")
            
            var randInt = _.random(lMin, lMax)
            var cpArrA = homeKeys, cpArrB = topKeys, cpArrC = lowerKeys, cpArr;
            
            cpArrA= cpArrA.concat(cpArrA);
            cpArrB= cpArrB.concat(cpArrB);
            cpArrC= cpArrC.concat(cpArrC);
            cpArr = cpArrA.concat( ( cpArrB.concat(cpArrC) ) );
            
            cpArr = _.shuffle(cpArr);
            cpStr = cpArr.join("");
            
            cpStr = cpStr.substr(0, randInt);
            return cpStr;
        }


        function drawPhraseUnit() {
            //ctx.font = '20px Arial' ;
            ctx.clearRect(0,0,cw,ch);
            
            _.each(phrasesArr, function(pu, i) {
                if (snipeModeConfig == 1) {
                    ctx.font = pu.fsize+10 + 'px Arial';
                }
                else {
                ctx.font = pu.fsize + 'px Arial'
            }
                ctx.fillText(pu.phrase, pu.xPos, pu.yPos);
                
                if ( (pu.fsize > 60) && !(snipeModeConfig == 1) ) {
                    console.log('phrase missed! not sniper mode!');
                    missed += 1;
                    console.log("missed : " + missed);
                    updateStat('missed', missed);
                    
                    ctx.fillStyle = '#900';
                    phrasesArr[i] = new PhraseUnit();
                }
                    else if ( (pu.fsize < 1) && (snipeModeConfig == 1) ) {
                        //console.log('yo');
                        missed += 1;
                        updateStat('missed', + missed);

                        ctx.fillStyle = '#900';
                        phrasesArr[i] = new PhraseUnit();
                    }


               if (snipeModeConfig == 1) {
                    pu.fsize -= .25;
               } 
               else {
                pu.fsize += pu.s; //console.log("speed is "+ s + " level is " + lvl);
                }
            });
            
            if ( missed >= allowedMisses ) {
                ctx.clearRect(0, 0, cw, ch);
                ctx.fillText("you lost", 100, 100);
                
            } else {
                setTimeout(drawPhraseUnit, 1000 / fps);
                
            }
            
        }




        function updateStat(id, newStat) {
            $('#' + id).text(newStat + " ( "+id+" )");
        }
