const chart = document.getElementById("chart");
const ink = chart.getContext("2d");
chart.width = innerWidth;
chart.height = innerWidth;
const cu = chart.width / 10;
const vw = chart.width / 100;

const input = document.getElementById("input");
const ictx = input.getContext("2d");
input.width = innerWidth;
input.height = innerWidth/5;

const dayEl = document.getElementById("day");
const budgetEl = document.getElementById("budget-text");
const scoreEl = document.getElementById("score");
const dayTypeEl = document.getElementById("daytype");

const investBox = document.getElementById("investbox");
const profitBox = document.getElementById("profitbox");
const wdBox = document.getElementById("wdbox");

const investButton = document.getElementById("investbutton");
const nextButton = document.getElementById("nextbutton");

const investHead = document.getElementById("investhead");
const profitHead = document.getElementById("profithead");
const wdHead = document.getElementById("wdhead");

const dialog = document.getElementById("dialog-cont");
const dialogScore = document.getElementById("dialogscore");
const dialogHs = document.getElementById("dialoghs");
const playAgain = document.getElementById("playagain");
const resetHs = document.getElementById("reseths");
const dialogImg = document.getElementById("dialogimg");

const hsKey = "lucky-stocks-hs";

const dayname = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const companies = [
    "Trie.Co",
    "Solid Sphere",
    "Coffee Cup"
];

const n = 3;
const days = 7;

const compColor = ["#58c300", "#05f", "#ff8400"];
const profitColor = "#0ba000", lossColor = "#f00";

const axes = new Image();
axes.src = "./graph.png";

let hist = [];
for(var c=0; c<n; c++) hist.push([]);

function short(x){
    return parseInt(x*100)/100;
}


function getRandomCompany(){
    return parseInt(Math.random()*n);
}

const dayProfitTypeText = [
    "Usual Day",
    "2 Profit",
    "2 Loss",
    "1 Peak Profit",
    "1 Heavy Loss",
    "1 Peak Profit, 2 in Loss",
    "1 Heavy Loss, 2 in Profit",
    "1 Peak Profit, 1 Heavy Loss",
    "1 Peak Profit, 2 in Heavy Loss"
];

let companyProfitTypes = [];
for(var c=0; c<n; c++) hist.push(0);
let dayProfitType = 0;
let totalDayProfitTypes = dayProfitTypeText.length;

function getRandomPermutation(x){
    var arr = [];
    for(var a=0; a<x; a++) arr.push(a);
    for(var i=n-1; i>0; i--){
        var j = parseInt(Math.random()*(i+1));
        var t=arr[j];
        arr[j] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function setRandomDayProfitType(){

    /* refer dayProfitTypeText for day types*/

    dayProfitType = parseInt(Math.random()*totalDayProfitTypes);

    dayTypeEl.innerText = dayProfitTypeText[dayProfitType];

    var rc = getRandomCompany();

    for(var c=0; c<n; c++){
        if(dayProfitType == 0) companyProfitTypes[c] = 0;
        else if(dayProfitType == 1){
            if(c == rc) companyProfitTypes[c] = 0;
            else companyProfitTypes[c] = 1;
        }
        else if(dayProfitType == 2){
            if(c == rc) companyProfitTypes[c] = 0;
            else companyProfitTypes[c] = 2;
        }
        else if(dayProfitType == 3){
            if(c == rc) companyProfitTypes[c] = 3;
            else companyProfitTypes[c] = 0;
        }
        else if(dayProfitType == 4){
            if(c == rc) companyProfitTypes[c] = 4;
            else companyProfitTypes[c] = 0;
        }
        else if(dayProfitType == 5){
            if(c == rc) companyProfitTypes[c] = 3;
            else companyProfitTypes[c] = 2;
        }
        else if(dayProfitType == 6){
            if(c == rc) companyProfitTypes[c] = 4
            else companyProfitTypes[c] = 1;
        }
        else if(dayProfitType == 8){
            if(c == rc) companyProfitTypes[c] = 3;
            else companyProfitTypes[c] = 4;
        }
    }
    if(dayProfitType == 7){
        var shuffle = getRandomPermutation(n);
        for(var c=0; c<n; c++){
            if(shuffle[c]==0) companyProfitTypes[c] = 0;
            else if(shuffle[c]==1) companyProfitTypes[c] = 3;
            else if(shuffle[c]==2) companyProfitTypes[c] = 4;
        }
    }
}

function getRandomProfit(type=0){

    /*
    0 neutral
    1 profit
    2 loss
    3 high profit
    4 high loss
    */

    var r = 0;

    if(type == 0){
        var r = Math.random()*200-100;
    }
    else if(type == 1){
        var r = Math.random()*100;
    }
    else if(type == 2){
        var r = -Math.random()*100;
    }
    else if(type == 3){
        var r = Math.random()*10 + 90;
    }
    else if(type == 4){
        var r = -(Math.random()*10 + 90);
    }
    
    return short(r);
}

function draw_axes(){
    ink.globalAlpha = .5;
    ink.drawImage(axes, 0, 0, 10*cu, 10*cu);
    ink.globalAlpha = 1;
}
axes.onload = draw_axes;

function drawGraph(){
    ink.clearRect(0,0,10*cu,10*cu);
    draw_axes();

    let y0 = 5, x0 = 1, nodeR = .15*cu;
    ink.lineWidth = parseInt(.1*cu);
    for(var c=0; c<n; c++){
        ink.strokeStyle = compColor[c];
        ink.beginPath();
        ink.moveTo(x0*cu, y0*cu);
        var x = x0+1;
        for(var p of hist[c]){
            var yp = p * 4 / 100;
            var y = y0 - yp;
            ink.lineTo(x*cu, y*cu);
            x++;
        }
        ink.stroke();        
    }
    ink.strokeStyle = "#000";
    ink.lineWidth = parseInt(.05*cu);
    for(var c=0; c<n; c++){
        var x = x0+1;
        for(var p of hist[c]){
            if(p >= 0) ink.fillStyle = profitColor;
            else ink.fillStyle = lossColor;
            var yp = p * 4 / 100;
            var y = y0 - yp;
            ink.beginPath();
            ink.arc(x*cu, y*cu, nodeR, 0, 2*Math.PI);
            ink.closePath();
            ink.fill();
            ink.beginPath();
            ink.arc(x*cu, y*cu, nodeR, 0, 2*Math.PI);
            ink.closePath();
            ink.stroke();
            x++;
        }
    }
    ink.fillStyle = "#000";
}
drawGraph();

let hooks = [25, 50, 75];
let inputScale = 100/90;

function getInpCord(x){
    x-=50;
    x/=inputScale;
    x+=50;
    x*=vw;
    return[x, input.height/2];
}
function getInpValue(x){
    x/=vw;
    x-=50;
    x*=inputScale;
    x+=50;
    return x;
}
function getSelectedHook(val){
    for(var c=0; c<n; c++){
        if(hooks[c]-hookR <= val && val <= hooks[c]+hookR){
            selectedHook = c;
            return;
        }
    }
}

const hookR = 3*vw;

function drawInput(){
    ictx.clearRect(0,0,input.width,input.height);

    let prev = getInpCord(0);
    ictx.lineWidth = 2*vw;
    for(var c=0; c<n; c++){
        ictx.strokeStyle = compColor[c];
        
        var current = getInpCord(hooks[c]);
        
        ictx.beginPath();
        ictx.moveTo(prev[0], prev[1]);
        ictx.lineTo(current[0], current[1]);
        ictx.stroke();
        
        prev = current;
    }
    
    ictx.strokeStyle = "#000";
    var current = getInpCord(100);
    ictx.beginPath();
    ictx.moveTo(prev[0], prev[1]);
    ictx.lineTo(current[0], current[1]);
    ictx.stroke();

    ictx.lineWidth = 1*vw;
    for(var c=0; c<n; c++){
        ictx.strokeStyle = compColor[c];
        var coord = getInpCord(hooks[c]);
        ictx.beginPath();
        ictx.arc(coord[0], coord[1], hookR, 0, 2*Math.PI);
        ictx.stroke();
    }

}
drawInput();

let selectedHook = -1;

input.ontouchstart = e => {

    var x = e.touches[0].clientX;
    var val = getInpValue(x);
    
    getSelectedHook(val);
}

input.ontouchmove = e => {

    var x = e.touches[0].clientX;
    var val = getInpValue(x);
    if(val > 100) val = 100;
    if(val < 0) val = 0;
    
    hooks[selectedHook] = val;
    hooks.sort((a, b) => a - b);
    drawInput();
    updateInvestTable();
}

function addTableRow(table, elems){
    
    let row = document.createElement("div");
    row.classList.add("tablerow");
    
    let childs = [];

    for(var el of elems){
        let elem = document.createElement("span");
        elem.innerText = el;
        row.appendChild(elem);
        childs.push(elem);
    }
    table.appendChild(row);
    return [row, childs];
}

function updateInvestTable(){
    for(var c=0; c<n; c++){
        var val = hooks[c];
        if(c > 0) val -= hooks[c-1];
        val *= budget/100;
        val = short(val);
        investTable[c][1].innerText = String(val);
        investments[c] = val;
    }
}

let initial = 1000;
let budget = initial;
let day = 0;
let score = 0;

let investTable = [];
let investments = [];
for(var c=0; c<n; c++){
    var val = hooks[c]*budget/100;
    investments.push(short(val));
}

for(var c=0; c<n; c++){
    var comp = companies[c];

    var rowdata = addTableRow(investBox, [comp, String(investments[c])]);
    investTable.push(rowdata[1]);
    rowdata[0].style.color = compColor[c];
}

let profitTable = [];
for(var c=0; c<n; c++){
    var comp = companies[c];
    var rowdata = addTableRow(profitBox, [comp, "0"]);
    profitTable.push(rowdata[1]);
    profitTable[c][0].style.color = compColor[c];
    profitTable[c][1].style.color = profitColor;
}

let wdTable = [];
for(var c=0; c<n; c++){
    var comp = companies[c];
    var rowdata = addTableRow(wdBox, [comp, "0"]);
    wdTable.push(rowdata[1]);
    wdTable[c][0].style.color = compColor[c];
    wdTable[c][1].style.color = profitColor;
}

function updateProfitTable(){
    for(var c=0; c<n; c++){
        profitTable[c][1].innerText = String(profits[c]);
        profitTable[c][1].style.color = ((profits[c] >= 0)?profitColor:lossColor);
    }
}

function updateWdTable(){
    for(var c=0; c<n; c++){
        wdTable[c][1].innerText = String(wd[c]);
        wdTable[c][1].style.color = ((profits[c] >= 0)?profitColor:lossColor);
    }
}

function calculateBudget(){
    budget -= getTotalValue();
    for(var w of wd){
        budget+=w;
    }
    budget = short(budget);
    budgetEl.innerText = String(budget);
}

function getTotalValue(){
    var sum = 0;
    for(var c=0; c<n; c++){
        sum += investments[c];
    }
    return sum;
}

function updateScore(){
    score = budget - initial;
    score = short(score);
    if(score >= 0) scoreEl.style.color = profitColor;
    else scoreEl.style.color = lossColor;
    scoreEl.innerText = String(score);
}

function updateDay(){
    dayEl.innerText = dayname[day];
}


function investMode(){
    profitBox.style.display = "none";
    wdBox.style.display = "none";
    profitHead.style.display = "none";
    wdHead.style.display = "none";
    nextButton.style.display = "none";
    investButton.style.display = "block";
    updateInvestTable();
    setRandomDayProfitType();
}
investMode();

function reviewMode(){
    profitBox.style.display = "flex";
    wdBox.style.display = "flex";
    profitHead.style.display = "block";
    wdHead.style.display = "block";
    nextButton.style.display = "block";
    investButton.style.display = "none";
}

let profits = [];
let wd = [];
for(var c of companies){
    profits.push(0);
    wd.push(0);
}


function setDayProfits(){
    for(var c=0; c<n; c++){
        profits[c] = getRandomProfit(companyProfitTypes[c]);
        wd[c] = investments[c] + profits[c] * investments[c] / 100;
        wd[c] = short(wd[c]);
        hist[c].push(profits[c]);
    }

}

function invest(){
    setDayProfits();
    calculateBudget();
    updateScore();
    drawGraph();
    updateProfitTable();
    updateWdTable();
    reviewMode();
}
investButton.onclick = invest;

function nextPress(){
    day++;

    if(day == 7){
        over();
        nextButton.style.display = "none";
        return;
    }

    updateDay();
    investMode();
}
nextButton.onclick = nextPress;


function over(){

    if(score < 0){
        dialogImg.setAttribute("src", "loss.png");
    } else {
        dialogImg.setAttribute("src", "profit.png");
    }

    dialogScore.innerText = String(score);
    dialogScore.style.color = ((score >= 0)? profitColor: lossColor);
    
    var hs = getHighScore();
    dialogHs.innerText = String(hs);
    dialogHs.style.color = ((hs >= 0)? profitColor: lossColor);

    dialog.style.display = "flex";

    setHighScore();
}

function setHighScore(){
    var hs = localStorage[hsKey];
    if(hs){
        if(score > hs){
            localStorage[hsKey] = score;
        }
    } else{
        localStorage[hsKey] = score;
    }
}

function getHighScore(){
    var hs = localStorage[hsKey];
    if(hs) return hs;
    return 0;
}

playAgain.onclick = () => location.reload();
resetHs.onclick = () => {
    localStorage.removeItem(hsKey);
    resetHs.style.display = "none";
}
