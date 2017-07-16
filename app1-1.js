/*
*    v1.2 TypeTrainer.io
*    adrienshen
*/


var phrasesArr = []
var canvas = document.getElementById('app-view'),
    ctx = canvas.getContext('2d');

var gameStarted = false;
var FPS = 30;
    
var hits = 0,
    missed = 0,
    
// Configs for game difficulty
// Actually these are not constants so should not be ALL_CAPS
GAME_LEVEL = 1,
GROWTH_SPEED = (GAME_LEVEL * 0.5 / FPS),    // Controls the speed at which the phrases grow to 50px/60px at 30FPS
SNIPER_DECREASE_STARTING_SPEED = .15,       // Font descrease in sniper until disapear
SNIPER_MODE_GROWTH_SPEED = 10
PHRASE_LIMIT = 2,                           // Number of phrases on screen at once
PHRASE_LEN_MIN = 5,
PHRASE_LEN_MAX = 8,
TIMEOUT_AFTER_HIT = 500;

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
ctx.fillStyle = '#333';

var userTypedValue;

$(document).ready(function() { 
    init();
});

var refreshResetAll = function() {
    gameStarted = false;
    hits = 0, missed = 0, GAME_LEVEL= 0;
    canvas = canvas;
    phrasesArr = [];
    $('div#model').fadeIn(1000);
    init();
}

function init() {
    $(document).on('keyup', function(e) {

        userTypedValue = $('#type-input').val();
        utv = parseInt(userTypedValue)

        var allowedKeys = [1, 2, 3, 9];
        if (!gameStarted) {
            if (allowedKeys.indexOf(utv) === -1) {
                userInput.val("");
                $modeNums = document.querySelectorAll('.mode-nums')
                $modeNums.forEach(function(item){
                    item.style.background = "lightgreen"
                })
                return 0
            }
        }

        gameStarted = true;
        $('div#model').fadeOut(1200);

        if (userTypedValue == 1) {
            charSpaceConfig = 1; console.log(charSpaceConfig);
            userInput.val("");
            updateStat('mode', '1.only home-row keys')
            startPhrases();
        }
        else if (userTypedValue == 2) {
            charSpaceConfig = 2; console.log(charSpaceConfig);
            userInput.val("");
            updateStat('mode', '2.home-row+top-row')
            startPhrases();
        }
        else if (userTypedValue == 3) {
            charSpaceConfig = 3; console.log(charSpaceConfig);
            userInput.val("");
            updateStat('mode', 'all 3 rows')
            startPhrases();
        }
        else if (userTypedValue == 9) {
            
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
                PHRASE_LEN_MIN = 1;
                PHRASE_LEN_MAX = 2;

                snipeModeConfig = 1; console.log(snipeModeConfig);
                userInput.val("");
                updateStat('mode', 'sniper mode')
                startPhrases();
            }

        } else if (utv == 0) {
            refreshResetAll()
            userInput.val("");
            return 0
        } else {
            return 0
        }
    });    
}

// function startPhrasesSnipe() { //experimenting
//     phrasesArr = [];
//     for (var j = 0; j < PHRASE_LIMIT; j++) {
//         phrasesArr.push(new PhraseUnit());
//     }
//     drawPhraseUnitSnipe();
// }

function startPhrases() {
    phrasesArr = [];
    for (i = 0; i < PHRASE_LIMIT; i++) {
        phrasesArr.push(new PhraseUnit());
    }
    drawPhraseUnit();
    userInput.on('keyup', matchByType);
}

function matchByType() {
    userTypedValue = $('#type-input').val();

    _.each(phrasesArr, function(obj, i) {
        if (userTypedValue.trim() === obj.phrase) {
            userInput.val("");
            hits = hits + 1;
            updateStat('hit', hits);
            
            setTimeout(function() {
                ctx.fillStyle = '#333'
                phrasesArr[i] = new PhraseUnit();
                // phrasesArr.push(new PhraseUnit()); //makes two new unit for each one completed, turn on for imposible mode
            }, TIMEOUT_AFTER_HIT);
            
            if ( (hits % 10 == 0) && (userTypedValue.trim() === obj.phrase) ) {
                GAME_LEVEL = GAME_LEVEL + 1;
                GROWTH_SPEED = (GAME_LEVEL * 0.5/FPS);
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

function PhraseUnit() {
    this.xPosition = _.random(100, CANVAS_WIDTH-100);    //_.random(100, CANVAS_WIDTH-150); //setting the x position of PhraseUnit
    this.yPosition = _.random(100, CANVAS_HEIGHT-100);    //_.random(100, ch-150); //setting the y position of PhraseUnit
    this.phrase = phraseConstructor();
    this.fontSize = 20;
    this.growthSpeed = GROWTH_SPEED;
}
        
function phraseConstructor() {
    var gameChoices = {
        1: optionHomeKeys(PHRASE_LEN_MIN, PHRASE_LEN_MAX),
        2: optionHomeTopRowKeys(PHRASE_LEN_MIN, PHRASE_LEN_MAX),
        3: optionAllKeys(PHRASE_LEN_MIN, PHRASE_LEN_MAX)
    }
    return gameChoices[charSpaceConfig]
}

function shufflePhrase(arr, min, max) {
    var randomInt = _.random(min, max)
    return _.shuffle(arr)
                .join('')
                .substr(0, randomInt)
}

function optionHomeKeys(lenMin, lenMax) {
    var doubleHomeKeys = homeKeys.concat(homeKeys);
    return shufflePhrase(doubleHomeKeys, lenMin, lenMax)
}

function optionHomeTopRowKeys(lenMin, lenMax) {
    var doubleHomeKeys = homeKeys.concat(homeKeys);
    var doubleTopKeys = topKeys.concat(topKeys);
    var combinedDoubleHomeTop = doubleHomeKeys.concat(doubleTopKeys);
    return shufflePhrase(combinedDoubleHomeTop, lenMin, lenMax)
}

function optionAllKeys(lenMin, lenMax) {
    var doubleHomeKeys = homeKeys.concat(homeKeys);
    var doubleTopKeys = topKeys.concat(topKeys);
    var doubleLowKeys = lowerKeys.concat(lowerKeys);
    var combinedAll = doubleHomeKeys.concat(
        doubleTopKeys.concat(doubleLowKeys))
    return shufflePhrase(combinedAll, lenMin, lenMax);
}

function drawPhraseUnit() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    _.each(phrasesArr, function(pu, i) {
        if (snipeModeConfig == 1) {
            ctx.font = pu.fontSize+SNIPER_MODE_GROWTH_SPEED + 'px Arial';
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
        setTimeout(drawPhraseUnit, 1000 / FPS);
    }
    
}

function updateStat(id, newStat) {
    $('#' + id).text(newStat + " ( "+id+" )");
}
