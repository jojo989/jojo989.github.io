var p1InputArray = [];
var p2InputArray = [];
var p1Rule1Breaks = [];
var p2Rule1Breaks = [];
var p1Rule2Breaks = [];
var p2Rule2Breaks = [];
var p1Rule3Breaks = [];
var p2Rule3Breaks = [];
var framerate;
var macroName = '<not provided>';

document.getElementById('textbox').value = '';
document.getElementById('outbox1').value = '';
document.getElementById('outbox2').value = '';

document.getElementById('checkButton').addEventListener('click', async () =>{
    const macroTxt = document.getElementById('textbox').value;
    if(macroTxt === ''){
       return alert('Please provide a macro');
    }

    if(!validMacro(macroTxt)){
        document.getElementById('invalid-text').style.display = 'block';
        return;
    }
    document.getElementById('invalid-text').style.display = 'none';

    parseP1InputsToArray(macroTxt);
    parseP2InputsToArray(macroTxt);

    document.getElementById('fps-text').textContent = 'FPS: ' + framerate;
    document.getElementById('fps-text').style.display = 'block';
    document.getElementById('fps-text').style.fontWeight = 'bold';

    checkP1CpsBreaks();
    checkP2CpsBreaks();

    reportP1Results();
    reportP2Results();

    disable();

    document.getElementById('downloadButton').style.pointerEvents = 'fill';
});

document.getElementById('downloadButton').addEventListener('click', async () =>{
    var resultString = 'Macro name:\n' + macroName +'\n';
    resultString += '\nFPS:\n' + framerate +'\n\n';

    resultString += '** Player 1 CPS Violations: **\n';
    const content1 = document.getElementById('outbox1').value;
    resultString += content1;

    resultString += '\n\n** Player 2 CPS Violations: **\n';
    const content2 = document.getElementById('outbox2').value;
    resultString += content2;
    
    const link = document.createElement("a");
    const file = new Blob([resultString], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "cpsbreaks.txt";
    link.click();
    URL.revokeObjectURL(link.href);
});

document.getElementById('refreshButton').addEventListener('click', async () =>{
    location.reload();
});

function reportP1Results(){
    if(p1Rule1Breaks.length == 0 && p1Rule2Breaks.length == 0
        && p1Rule3Breaks.length == 0){
        document.getElementById('check1').style.visibility = 'visible';
        document.getElementById('outbox1').value = "Rule 1 violations:\n[none]\n\n";
        document.getElementById('outbox1').value = document.getElementById('outbox1').value + "Rule 2 violations:\n[none]\n\n";
        document.getElementById('outbox1').value = document.getElementById('outbox1').value + "Rule 3 violations:\n[none]";
    }
    else{
        if(p1Rule1Breaks.length == 0){
            document.getElementById('outbox1').value = "Rule 1 violations:\n[none]\n\n";
        }
        else{
            for(var i = 0; i < p1Rule1Breaks.length; i++){
                document.getElementById('outbox1').value = document.getElementById('outbox1').value + p1Rule1Breaks[i];
            }
            document.getElementById('outbox1').value = document.getElementById('outbox1').value + "\n";
        }
        if(p1Rule2Breaks.length == 0){
            document.getElementById('outbox1').value = document.getElementById('outbox1').value + "Rule 2 violations:\n[none]\n\n";
        }
        else{
            for(var i = 0; i < p1Rule2Breaks.length; i++){
                document.getElementById('outbox1').value = document.getElementById('outbox1').value + p1Rule2Breaks[i];
            }
            document.getElementById('outbox1').value = document.getElementById('outbox1').value + "\n";
        }
        if(p1Rule3Breaks.length == 0){
            document.getElementById('outbox1').value = document.getElementById('outbox1').value + "Rule 3 violations:\n[none]";
        }
        else{
            for(var i = 0; i < p1Rule3Breaks.length; i++){
                document.getElementById('outbox1').value = document.getElementById('outbox1').value + p1Rule3Breaks[i];
            }
        }
        document.getElementById('cross1').style.visibility = 'visible';
    }
}

function reportP2Results(){
    if(p2Rule1Breaks.length == 0 && p2Rule2Breaks.length == 0
        && p2Rule3Breaks.length == 0){
        document.getElementById('check2').style.visibility = 'visible';
        document.getElementById('outbox2').value = "Rule 1 violations:\n[none]\n\n";
        document.getElementById('outbox2').value = document.getElementById('outbox2').value + "Rule 2 violations:\n[none]\n\n";
        document.getElementById('outbox2').value = document.getElementById('outbox2').value + "Rule 3 violations:\n[none]";
    }
    else{
        if(p2Rule1Breaks.length == 0){
            document.getElementById('outbox2').value = "Rule 1 violations:\n[none]\n\n";
        }
        else{
            for(var i = 0; i < p2Rule1Breaks.length; i++){
                document.getElementById('outbox2').value = document.getElementById('outbox2').value + p2Rule1Breaks[i];
            }
            document.getElementById('outbox2').value = document.getElementById('outbox2').value + "\n";
        }
        if(p2Rule2Breaks.length == 0){
            document.getElementById('outbox2').value = document.getElementById('outbox2').value + "Rule 2 violations:\n[none]\n\n";
        }
        else{
            for(var i = 0; i < p2Rule2Breaks.length; i++){
                document.getElementById('outbox2').value = document.getElementById('outbox2').value + p2Rule2Breaks[i];
            }
            document.getElementById('outbox2').value = document.getElementById('outbox2').value + "\n";
        }
        if(p2Rule3Breaks.length == 0){
            document.getElementById('outbox2').value = document.getElementById('outbox2').value +"Rule 3 violations:\n[none]";
        }
        else{
            for(var i = 0; i < p2Rule3Breaks.length; i++){
                document.getElementById('outbox2').value = document.getElementById('outbox2').value + p2Rule3Breaks[i];
            }
            document.getElementById('outbox2').value = document.getElementById('outbox2').value + "\n";
        }
        document.getElementById('cross2').style.visibility = 'visible';
    }
}

function disable(){
   document.getElementById('upload').style.pointerEvents = 'none';
   document.getElementById('checkButton').style.pointerEvents = 'none';
   document.getElementById('textbox').setAttribute('readonly', 'readonly');
}

function checkP1CpsBreaks(){
    verifyRule1(p1InputArray, p1Rule1Breaks);
    verifyRule2(p1InputArray, p1Rule2Breaks);
    verifyRule3(p1InputArray, p1Rule3Breaks);
}

function checkP2CpsBreaks(){
    verifyRule1(p2InputArray, p2Rule1Breaks);
    verifyRule2(p2InputArray, p2Rule2Breaks);
    verifyRule3(p2InputArray, p2Rule3Breaks);
}

function verifyRule1(inputFrames, breakArray){
    var violationNo = 0;
    for(var i = 0; i < inputFrames.length; i++){
        var firstClickFrame = inputFrames[i];
        var frameOneSecondLater = firstClickFrame + framerate;
        var numClicks = 0;
        var lastClickWithinTime = firstClickFrame;
        for(var j = 0; j < inputFrames.length; j++){
            if(inputFrames[i + j] < frameOneSecondLater){
                lastClickWithinTime = inputFrames[i + j];
                numClicks ++;
            }
            else if(inputFrames[i + j] > frameOneSecondLater){
                break;
            }
            else if(inputFrames[i + j] == frameOneSecondLater){
                lastClickWithinTime = inputFrames[i + j];
                numClicks++;
                break;
            }
        }
        var timeBetween = parseFloat((lastClickWithinTime-firstClickFrame))/framerate;
        if(numClicks > 15){
            violationNo ++;
            if(violationNo == 1){
                breakArray.push('Rule 1 violations:\n');
            }
            breakArray.push("- " + numClicks + " clicks in 1s: [frame " + firstClickFrame+" to "+ frameOneSecondLater+
            "]: (" + timeBetween.toFixed(3) + "s between first and last)\n");
        }
    }
} 


function verifyRule2(inputFrames, breakArray){
    var violationNo = 0;
    for(var i = 0; i + 3 < inputFrames.length; i++){
        let firstClick = inputFrames[i];
        let lastClick = inputFrames[i + 3];
        let framesBetweenClicks = lastClick - firstClick;
        let timeBetweenClicks = parseFloat(framesBetweenClicks) / framerate;
        let cps = (3)/timeBetweenClicks;
        if(cps > 18 && timeBetweenClicks >= parseFloat(1/3) && timeBetweenClicks < 1){
            violationNo ++;
            if(violationNo == 1){
                breakArray.push('Rule 2 violations:\n');
            }
            breakArray.push('- ' + cps.toFixed(3) + " cps rate for the " + 4 + " click stint from " 
            + firstClick + " to " + lastClick + " (" +timeBetweenClicks.toFixed(3)+"s)\n");
        }
    }
}

/* function verifyRule2(inputFrames, breakArray){
    var violationNo = 0;
    for(var i = 0; i < inputFrames.length; i++){
        var firstClickFrame = inputFrames[i];
        var frameThirdOfASecondLater = firstClickFrame + parseFloat(framerate)/3;
        var numClicks = 0;
        var earliestClick = firstClickFrame;
        for(var j = 0; j < inputFrames.length; j++){
            if(inputFrames[i + j] < frameThirdOfASecondLater){
                earliestClick = inputFrames[i + j];
                numClicks ++;
            }
            else if(inputFrames[i + j] >= frameThirdOfASecondLater){
                earliestClick = inputFrames[i + j];
                numClicks ++;
                break;
            }
        }
        var timeBetweenClicks = parseFloat(earliestClick-firstClickFrame)/framerate;
        var cps = (numClicks-1)/timeBetweenClicks;
        if(numClicks > 3 && cps > 18 && timeBetweenClicks >= parseFloat(1/3) && timeBetweenClicks < 1 ){
            violationNo ++;
            if(violationNo == 1){
                breakArray.push('Rule 2 violations:\n');
            }
            breakArray.push('- ' + cps.toFixed(3) + " cps rate for the " + numClicks + " click stint from " 
            + firstClickFrame + " to " + earliestClick + " (" +timeBetweenClicks.toFixed(3)+"s)\n");
        }
    }
} */

function verifyRule3(inputFrames, breakArray){
    var violationNo = 0;
    for(var i = 0; i + 3 < inputFrames.length; i++){
        let firstClick = inputFrames[i];
        let lastClick = inputFrames[i + 3];
        let framesBetweenClicks = lastClick - firstClick;
        let timeBetweenClicks = parseFloat(framesBetweenClicks) / framerate;
        let cps = (3)/timeBetweenClicks;
        if(cps > 20 && timeBetweenClicks < parseFloat(1/3)){
            violationNo ++;
            if(violationNo == 1){
                breakArray.push('Rule 3 violations:\n');
            }
            breakArray.push('- ' + cps.toFixed(3) + " cps rate for the " + 4 + " click stint from " 
            + firstClick + " to " + lastClick + " (" +timeBetweenClicks.toFixed(3)+"s)\n");
        }
    }
}

/* function verifyRule3(inputFrames, breakArray){
    var violationNo = 0;
    for(var i = 0; i < inputFrames.length; i++){
        var firstClickFrame = inputFrames[i];
        var frameThirdOfASecondLater = firstClickFrame + parseFloat(framerate)/3;
        var numClicks = 0;
        var lastClickWithinTime = firstClickFrame;
        for(var j = 0; j < inputFrames.length; j++){
            if(inputFrames[i + j] < frameThirdOfASecondLater){
                lastClickWithinTime = inputFrames[i + j];
                numClicks ++;
            }
            else if(inputFrames[i + j] >= frameThirdOfASecondLater){
                break;
            }
        }
        var timeBetweenClicks = parseFloat(lastClickWithinTime-firstClickFrame)/framerate;
        var cps = (numClicks-1)/timeBetweenClicks;
        if(numClicks == 4 && cps > 20){
            violationNo ++;
            if(violationNo == 1){
                breakArray.push('Rule 3 violations:\n');
            }
            breakArray.push('- ' + cps.toFixed(3) + " cps rate for the " + numClicks + " click stint from " 
            + firstClickFrame + " to " + lastClickWithinTime + " (" +timeBetweenClicks.toFixed(3)+"s)\n");
        }
    }
} */

function validMacro(macro){
    const arrayOfLines = macro.trim().split('\n');
    if(arrayOfLines.length < 2){ return false; }
    for(var i = 0; i < arrayOfLines.length; i++){
        var lineChoppedUp1 = arrayOfLines[i].trim().split(/(\s+)/);
        var lineChoppedUp = lineChoppedUp1.filter(n => isANumber(n));
        if(i == 0){
           if(lineChoppedUp.length != 1 || !isANumber(lineChoppedUp[0])){
            return false;
           }
        }
        else{
            if(lineChoppedUp.length != 3 || !isANumber(lineChoppedUp[0])
            || !isANumber(lineChoppedUp[1]) || !isANumber(lineChoppedUp[2])){
                return false;
            }
        }
    }
    return true;
}

function isANumber(str){
    return !/\D/.test(str);
  }

function parseP1InputsToArray(macroTxt){
    const lineArray = macroTxt.trim().split('\n');
    for(var i = 0; i < lineArray.length; i++){
        var lineAsInts1 = lineArray[i].trim().split(/(\s+)/);
        var lineAsInts= lineAsInts1.filter(n => isANumber(n));
        if(i == 0){
            framerate = parseInt(lineAsInts, 10);
            continue;
        }
        if(parseInt(lineAsInts[1],10) == 1){
            p1InputArray.push(parseInt(lineAsInts[0],10));
        }
    }
}

function parseP2InputsToArray(macroTxt){
    const lineArray = macroTxt.trim().split('\n');
    for(var i = 0; i < lineArray.length; i++){
        var lineAsInts1 = lineArray[i].trim().split(/(\s+)/);
        var lineAsInts= lineAsInts1.filter(n => isANumber(n));
        if(i == 0){
            framerate = parseInt(lineAsInts, 10);
            continue;
        }
        if(parseInt(lineAsInts[2],10) == 1){
            p2InputArray.push(parseInt(lineAsInts[0],10));
        }
    }
}

document.getElementById('upload').addEventListener('change', async () =>{
    const fr = new FileReader();
    const file = document.getElementById('in').files[0];
    fr.readAsText(file);
    fr.onload = (() => {
        document.getElementById('textbox').value = fr.result;    
        document.getElementById('noFile').innerHTML = file.name;
        document.getElementById('noFile').style.fontWeight = 'bold';
        document.getElementById('noFile').style.fontSize = '15px';
        macroName = file.name.split('.').slice(0,-1).join('.');
    });     
});

document.getElementById('help-area').addEventListener('click', async () =>{
    document.getElementById('help-box').style.display='block';
});

document.getElementById('close-button').addEventListener('click', async () =>{
    document.getElementById('help-box').style.display='none';
});

document.getElementById('help-area-2').addEventListener('click', async () =>{
    document.getElementById('help-box-2').style.display='block';
});

document.getElementById('close-button-2').addEventListener('click', async () =>{
    document.getElementById('help-box-2').style.display='none';
});