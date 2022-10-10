function getSize(){
    const width = document.documentElement.clientWidth;
    return(width);
}

// let initWidth = getSize();
// let resInts = calcResIntervals();
// let html = document.getElementsByTagName('html')[0];

class windowObject{
    constructor() {
        this.initWidth=getSize();
        this.resInts=calcResIntervals();
        this.html=document.getElementsByTagName('html')[0];
    }
}

console.log((initWidth/100)+"px");
$("html").css({"font-size":(initWidth/100)+"px"});

$( window ).on('resize', function(){
    if (getSize() < initWidth) {
        // Move to next view after 336 of resolution change
        // return;
        // html.style.fontSize = "2vw";
        html.style.width = "99vw";
        adjustLayout()
    }
    else if (getSize() > initWidth) {
        // return;
        html.style.fontSize = (initWidth/100)+'px';
        html.style.width = (initWidth)+'px';
    }
});

function calcResIntervals() {
    var intervals = Array();
    let minWid = 336;
    let intSize = Math.round((initWidth-minWid)/6);
    for (let ints = 6; ints >= 1; ints--) {
        intervals.push(intSize*ints);
    }
    console.log(intervals);
    return(intervals);
}

function adjustLayout() {
    if 
}

function alignfooter() {
    const menu = document.getElementsByTagName("nav")[0];
    const foot = document.getElementById("baseLine");
    
}