// Next task list:
// - Create multiple layouts for differing screen sizes
// -- Use generic class names to set container getSize
// -- Have 12 different sizes available to use
// -- Resize text or container height (undecided)
// - Set the initial size to the coresponding reoluton
// -deal with text resiszing and relative units

// Css modifications based of of html class names
// Functions contained
    // - Left and right set
    // - 
class mediaQ{
    constructor() {
        this.setSide();
    }
        // Use the key indacators to determine classes that neeed to be set left or right
    setSide() {
        let sides = document.getElementsByClassName('side-');
        console.log(sides.length);
        for (let side of sides) {
            for (let nm of side.className.split(' ')) {
                if (nm.includes('le')) {
                    console.log(nm.slice(-2,0));
                    side.style.left = nm.slice(-2,0);
                }
            }
        }
    }
}

class windowObject{
    constructor() {
        this.initWidth=this.getSize();
        this.calcResIntervals();
        this.html = document.getElementsByTagName('html')[0];
        this.pos = 0;
    }

    calcResIntervals() {
        var intervals = Array();
        let minWid = 336;
        let intSize = Math.round((this.initWidth-minWid)/6);
        for (let ints = 6; ints >= 1; ints--) {
            let curint = (intSize*ints)+minWid;
            intervals.push([curint, (curint+intSize)/110]);
            // intervals.push(intSize*ints);
        }
        intervals[0][1] = intervals[0][0]/100;
        console.log(intervals);
        this.resInts=intervals;
    }

    getSize() {
        const width = document.documentElement.clientWidth;
        return(width);
    }

    adjustLayout(dir) {
        let dPx = this.initWidth-this.getSize();
        if (0 >= this.pos < this.resInts.length-1) {
            this.pos = (this.getSize() > this.resInts[this.pos][0]) ? ((--this.pos >  0) ? this.pos:++this.pos): ((++this.pos <  6 && this.getSize() < this.resInts[this.pos][0]) ? this.pos:--this.pos);
        }
        this.html.style.fontSize = this.resInts[this.pos][1].toString()+'px';
        // this.html.style.fontSize = (parseFloat(this.html.style.fontSize.replace("px",""))*0.9)+"px";
        console.log(this.html.style.fontSize);
        // if 
    }

    // shrinkLayout() {
    //     this.pos = (this.pos>)
    // }
}


function priorContLoad() {
    return (new windowObject());
}

let primWin = priorContLoad();

function postContLoad() {
    return (new mediaQ());
}

console.log((primWin.initWidth/100)+"px");
$("html").css({"font-size":(primWin.initWidth/100)+"px"});

$( window ).on('resize', function(){
    if (primWin.getSize() <= primWin.initWidth) {
        // Move to next view after 336 of resolution change
        // return;
        // html.style.fontSize = "2vw";
        primWin.html.style.width = "99vw";
        primWin.adjustLayout()
    }
    else if (primWin.getSize() > primWin.initWidth) {
        // return;
        primWin.html.style.fontSize = (primWin.initWidth/100)+'px';
        primWin.html.style.width = (primWin.initWidth)+'px';
    }
});


function alignfooter() {
    const menu = document.getElementsByTagName("nav")[0];
    const foot = document.getElementById("baseLine"); 
}