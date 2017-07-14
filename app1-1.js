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

var fps = 30;
    
var hits = 0,
    missed = 0,
    
    // Configs for game difficulty
    GAME_LEVEL = 1,
    GROWTH_SPEED = (GAME_LEVEL * 0.5 / fps),    // Controls the speed at which the phrases grow to 50px/60px at 30fps
    SNIPER_DECREASE_STARTING_SPEED = .15,       // Font descrease in sniper until disapear
    PHRASE_LIMIT = 2,                           // Number of phrases on screen at once
    PHRASE_LEN_MIN = 5;
    PHRASE_LEN_MAX = 8,
    TIMEOUT_AFTER_HIT = 500;
                
    phrasesArr = [];
    
    var CANVAS_WIDTH = 1000,
        CANVAS_HEIGHT = 550;
       
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
            hits = 0, missed = 0, GAME_LEVEL= 0;
            canvas = canvas;
            phrasesArr = [];
            $('div#model').fadeIn(1000);
            init();
        }


    function typeMatch() {
        
        $('div#model').fadeOut(2000);
        
        // Program init
        //init();
        userValue = $('#type-input').val();
        
        _.each(phrasesArr, function(obj, i) {
            if ( userValue.trim() === obj.phrase ) {
                userInput.val("");
                hits = hits + 1;
                updateStat('hit', hits);
                
                setTimeout(function() {
                    ctx.fillStyle = '#333'
                    phrasesArr[i] = new PhraseUnit();
                    // phrasesArr.push(new PhraseUnit()); //makes two new unit for each one completed, turn on for imposible mode
                }, TIMEOUT_AFTER_HIT);
                
                if ( (hits % 10 == 0) && (userValue.trim() === obj.phrase) ) {
                    GAME_LEVEL ++;
                    GROWTH_SPEED = (GAME_LEVEL * 0.5/fps);
                    console.log("speed is "+ GROWTH_SPEED);

                    updateStat('level', GAME_LEVEL);
                    //phrasesArr.push(new PhraseUnit()); //makes 1 more after each level up, turn on for insanity mode
                    if ( (GAME_LEVEL % 5 == 0) && (hits % 10 == 0) ) {
                        // Pushing another PhraseUnit on every 5th level up
                        phrasesArr.push(new PhraseUnit());
                    }
                }
                ctx.fillStyle = '#090'
                
            }
        });
        return GAME_LEVEL;    
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
                        charSpaceConfig = 3; //sets to all-keys
                        PHRASE_LEN_MIN = 1; PHRASE_LEN_MAX = 2;

                        snipeModeConfig = 1; console.log(snipeModeConfig);

                        userInput.val("");

                        updateStat('mode', 'sniper mode')

                        startPhrases();
                    }

                }
            });
            
            
            
        userInput.on('keypress', typeMatch);
        function startPhrasesSnipe() { //experimenting
            phrasesArr = [];
            for (var j = 0; j < PHRASE_LIMIT; j++) {
                phrasesArr.push(new PhraseUnit());
            }
            drawPhraseUnitSnipe();
        }

        function startPhrases() {
            phrasesArr = [];
            for (i = 0; i < PHRASE_LIMIT; i++) {
                phrasesArr.push(new PhraseUnit());
            }
            drawPhraseUnit();
            //userInput.on('keypress', typeMatch);
        }

    }

    function PhraseUnit() {
        this.xPosition = _.random(100, CANVAS_WIDTH-100);    //_.random(100, CANVAS_WIDTH-150); //setting the x position of PhraseUnit
        this.yPosition = _.random(100, CANVAS_HEIGHT-100);    //_.random(100, ch-150); //setting the y position of PhraseUnit
        this.phrase = phraseConstructor();
        this.fontSize = 20;
        this.growthSpeed = GROWTH_SPEED;
    }
        
    function phraseConstructor() {
        if (charSpaceConfig == 1) {
            optionOne(PHRASE_LEN_MIN, PHRASE_LEN_MAX);
        }
        else if (charSpaceConfig == 2) {
            optionTwo(PHRASE_LEN_MIN, PHRASE_LEN_MAX);
        }
        else {
            optionThree(PHRASE_LEN_MIN, PHRASE_LEN_MAX);
        }
        return cpStr;
    }

    function optionOne(lenMin, lenMax) {
        // console.log("option1 chosen")
        var cpArr = homeKeys;                   //list possible chars in array
        var randInt = _.random(lenMin, lenMax); //gens random int between 5 and 8
        cpArr = cpArr.concat(cpArr);            //doubles the values in cpArr so double chars are possible
        cpArr = _.shuffle(cpArr);               //shuffles cpArr using underscore's _.shuffle method
        cpStr = cpArr.join("");                 //joins the cpArr into a String
        cpStr = cpStr.substr(0, randInt);       //makes the resulting string 5 - 8 chars long
        return cpStr; console.log(cpStr);
    }

    function optionTwo(lenMin, lenMax) {
        // console.log("option2 chosen")
        var randInt = _.random(lenMin, lenMax)
        var cpArrA = homeKeys, cpArrB = topKeys, apArr;
        cpArrA = cpArrA.concat(cpArrA); cpArrB = cpArrB.concat(cpArrB); 
        cpArr = cpArrA.concat(cpArrB);
        cpArr = _.shuffle(cpArr);
        cpStr = cpArr.join("");
        cpStr = cpStr.substr(0, randInt);
        return cpStr;

        //in one expression
        //final = ((_.shuffle((cpArrA.concat(cpArrA)).concat( (cpArrB.concat(cpArrB)) ))).join("")).substr(0, randInt);  
    }

    function optionThree(lenMin, lenMax) {
        // console.log("option3 chosen")
        var randInt = _.random(lenMin, lenMax)
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
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        _.each(phrasesArr, function(pu, i) {
            if (snipeModeConfig == 1) {
                ctx.font = pu.fontSize+10 + 'px Arial';
            } else {
                ctx.font = pu.fontSize + 'px Arial'
            }
            ctx.fillText(pu.phrase, pu.xPosition, pu.yPosition);
            
            if ( (pu.fontSize > 60) && !(snipeModeConfig == 1) ) {
                missed = missed - 1;
                updateStat('missed', missed);
                ctx.fillStyle = '#900';
                phrasesArr[i] = new PhraseUnit();
            } else if ( (pu.fontSize < 1) && (snipeModeConfig == 1) ) {
                missed += 1;
                updateStat('missed', + missed);
                ctx.fillStyle = '#900';
                phrasesArr[i] = new PhraseUnit();
            }

            if (snipeModeConfig === 1) {
                pu.fontSize = pu.fontSize - SNIPER_DECREASE_STARTING_SPEED;
            } else {
                pu.fontSize += pu.growthSpeed;
            }
        });
            
        if ( missed >= allowedMisses ) {
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.fillText("you lost", 100, 100);
            
        } else {
            setTimeout(drawPhraseUnit, 1000 / fps);
        }
        
    }

    function updateStat(id, newStat) {
        $('#' + id).text(newStat + " ( "+id+" )");
    }
