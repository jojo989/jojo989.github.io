var p1InputArray = [];
var p2InputArray = [];
var p1breaks = [];
var p2breaks = [];
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

    checkP1CpsBreaks();
    checkP2CpsBreaks();

    reportP1Results();
    reportP2Results();

    disable();

    document.getElementById('downloadButton').style.pointerEvents = 'fill';
});

document.getElementById('downloadButton').addEventListener('click', async () =>{
    var resultString = 'Macro name:\n' + macroName +'\n';
    resultString += '\nFPS:\n' + framerate +'\n';
    resultString += '\nPlayer 1 CPS breaks:\n';
    if(p1breaks.length == 0){
        resultString += 'None\n';
    }
    else{
        const content1 = document.getElementById('outbox1').value;
        resultString += content1;
    }
    resultString += '\nPlayer 2 CPS breaks:\n';
    if(p2breaks.length == 0){
        resultString += 'None\n';
    }
    else{
        const content2 = document.getElementById('outbox2').value;
        resultString += content2;
    }
    
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
    if(p1breaks.length == 0){
        document.getElementById('outbox1').value = "\n\n<< Player 1 does not break CPS rules! >>";
        document.getElementById('check1').style.visibility = 'visible';
    }
    else{
        for(var i = 0; i < p1breaks.length; i++){
            document.getElementById('outbox1').value = document.getElementById('outbox1').value + p1breaks[i];
        }
        document.getElementById('cross1').style.visibility = 'visible';
    }
}

function reportP2Results(){
    if(p2breaks.length == 0){
        document.getElementById('outbox2').value = "\n\n<< Player 2 does not break CPS rules! >>";
        document.getElementById('check2').style.visibility = 'visible';
    }
    else{
        for(var i = 0; i < p2breaks.length; i++){
            document.getElementById('outbox2').value = document.getElementById('outbox2').value + p2breaks[i];
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
    verifyCps(p1InputArray, p1breaks, 15, "1");
	verifyCps(p1InputArray, p1breaks, 14, "7/9");
	verifyCps(p1InputArray, p1breaks, 13, "13/18");
	verifyCps(p1InputArray, p1breaks, 12, "2/3");
	verifyCps(p1InputArray, p1breaks, 11, "11/18");
	verifyCps(p1InputArray, p1breaks, 10, "5/9");
	verifyCps(p1InputArray, p1breaks, 9, "1/2");
	verifyCps(p1InputArray, p1breaks, 8, "4/9");
	verifyCps(p1InputArray, p1breaks, 7, "7/18");
	verifyCps(p1InputArray, p1breaks, 6, "3/10");
	verifyCps(p1InputArray, p1breaks, 5, "1/4");
	verifyCps(p1InputArray, p1breaks, 4, "1/5");
}

function checkP2CpsBreaks(){
    verifyCps(p2InputArray, p2breaks, 15, "1");
	verifyCps(p2InputArray, p2breaks, 14, "7/9");
	verifyCps(p2InputArray, p2breaks, 13, "13/18");
	verifyCps(p2InputArray, p2breaks, 12, "2/3");
	verifyCps(p2InputArray, p2breaks, 11, "11/18");
	verifyCps(p2InputArray, p2breaks, 10, "5/9");
	verifyCps(p2InputArray, p2breaks, 9, "1/2");
	verifyCps(p2InputArray, p2breaks, 8, "4/9");
	verifyCps(p2InputArray, p2breaks, 7, "7/18");
	verifyCps(p2InputArray, p2breaks, 6, "3/10");
	verifyCps(p2InputArray, p2breaks, 5, "1/4");
	verifyCps(p2InputArray, p2breaks, 4, "1/5");
}

function verifyCps(inputFrames, breakArray, numOfClicks, minTimeS){
    if(minTimeS !== '1'){
        var ratio = minTimeS.split('/');
        var minTimeF = parseFloat(ratio[0]) / parseFloat(ratio[1]);
    }
    else{
        minTimeF = parseFloat(minTimeS);
    }
    for(var i = 0; i + (numOfClicks-1) < inputFrames.length; i++){
        let firstClick = inputFrames[i];
        let lastClick = inputFrames[i + (numOfClicks-1)];
        let framesBetweenClicks = lastClick - firstClick;
        let timeBetweenClicks = parseFloat(framesBetweenClicks) / framerate;
        if(timeBetweenClicks <= minTimeF){
            breakArray.push("- " + numOfClicks + " clicks within " + minTimeS + " second: " + timeBetweenClicks.toFixed(4) + 
            "s between frames " + firstClick + " and " + lastClick + "\n");
        }
    }
}

function validMacro(macro){
    const arrayOfLines = macro.split('\n');
    if(arrayOfLines.length < 2){ return false; }
    for(var i = 0; i < arrayOfLines.length; i++){
        var lineChoppedUp = arrayOfLines[i].split(/(\s+)/).trim();
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
    const lineArray = macroTxt.split('\n');
    for(var i = 0; i < lineArray.length; i++){
        var lineAsInts = lineArray[i].split(/(\s+)/).trim();
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
    const lineArray = macroTxt.split('\n');
    for(var i = 0; i < lineArray.length; i++){
        var lineAsInts = lineArray[i].split(/(\s+)/).trim();
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