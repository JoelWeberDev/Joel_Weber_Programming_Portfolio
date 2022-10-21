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

// Session Goals:
    // Finish margin automator
    // Finish dedault layout
class mediaQ{
    constructor() {
        this.marginMap = {};
        this.dupeClassName();
        this.setels('side','cent','marg');
    }

    setels(...classNm) {
        for (let ind of classNm) {
            for (let el of document.getElementsByClassName(ind)) {
                if (ind == 'marg' && el.className.includes('m*')) this.mapMargins(el);
                for (let nm of el.className.split(' ')) {
                    switch (ind) {
                        case 'cent':
                            this.centerEl(el, nm);
                            break;
                        case 'side':
                            this.setSide(el, nm);
                            break;
                        // case 'marg':
                        //     if (nm.includes('m*')) this.mapMargins(el, nm);
                        //     break;
                    }
                }
            }
        }
    }
        // Use the key indacators to determine classes that neeed to be set left or right
    setSide(setClass, nm) {
        if (nm.includes('le')) {
            // console.log(parseInt(nm.slice(-2)));
            setClass.style.left = `${nm.slice(-2)}%`;
        }
        else if (nm.includes('ri')) {
            setClass.style.right = `${nm.slice(-2)}%`;
        }
    }

    // Translate(-50%) replacement
    // use the translate functions to absolutely center an element in a container
    centerEl(setClass, nm) {
        setClass.style.position = `absolute`;
        if (nm.includes('-x')) {
            this.setSide(setClass,'le50')
            setClass.style.transform = `translateX(-50%)`;
        }
        if (nm.includes('-y')) {
            setClass.style.top = `50%`;
            setClass.style.transform = `translateY(-50%)`;
        }
    }

    // Sets the initial margins and any cases where they may be subject to change
    // Command indacators
    // - m*: indicates to the progam that this is a margin property
    // - a: absolute and it will not change Write as m*-a
    // - d: Default margin if there is no specific alternative
    // - b: Prefix to screen sized to apply to sizes equal to or smaller than 
    // - xl: Specific to xl sized screen
    // - l: Specific to large sized screen
    // - s: Specific to small sized screen
    // - xs: Specific to extra small sized screens
    // - sc: Denotates a scale and only requires a number between 0-100 for a percentage

    // Map template:
    // |-----|---xl---|---l---|---s---|---xs---|---d---|-----a-----|
    // | id1 |T,R,B,L-|T,R,B,L|T,R,B,L|T,R,B,L-|T,R,B,L|True/False-|
    // | id2 |T,R,B,L-|T,R,B,L|T,R,B,L|T,R,B,L-|T,R,B,L|True/False-|

    // Stop Point!!
    // - Error the for loop to set the map is running everytime there is a name containing m*

    mapMargins(setClass, nm) {
        let id = setClass.id.toString();
        let newId = {[id]:{
            'xl':[0,0,0,0],
            'l':[0,0,0,0],
            's':[0,0,0,0],
            'xs':[0,0,0,0],
            'd':[0,0,0,0],
            'a':false
        }};
        this.marginMap = {...this.marginMap,...newId};
        for (let nm of setClass.className.split(' ').filter((classNm)=>classNm.includes('m*'))) {
            // if (nm.includes('a')) continue;
            // console.log(nm.slice(nm.indexOf('*')+1,nm.indexOf('-')),nm);
            this.marginMap[id][nm.slice(nm.indexOf('*')+1,nm.indexOf('-'))] = (nm.includes('a') ? false: (nm.split('-').slice(1,5)).map(x=>parseInt(x)));
                // Convert the data from the name string into array in the margin map
            }
        for (let key in this.marginMap[id]) {
            switch (key) {
                case 'd':
                    continue
                case 'a':
                    continue;
            }
            if (this.marginMap[id][key].filter(i=>i!=0).length == 0){
                this.marginMap[id][key] = this.marginMap[id]['d'];
            }
            
        }   
    }


    // Class name duplicator for similar containers
    dupeClassName() {
        let parents = document.getElementsByClassName('dupe-');
        for (let p of parents) {
            let nmp = p.className;
            for (let child of p.children) {
                let nmc = child.className;
                if (nmc.includes('dupeRec')) child.className = `${nmc} ${nmp.slice(nmp.indexOf('(')+1,nmp.indexOf(')')).replace(/,/g, ' ')} `;
            }
        }
    }

}

class windowObject{
    constructor() {
        this.pos = 0;
        this.size;
        this.layoutSizes = {
            'xs':[0,600],
            's': [600,1024],
            'l':[1024,1320],
            'xl':[1320,100000]
        };
        this.initWidth=this.getSize();
        this.calcResIntervals();
        this.html = document.getElementsByTagName('html')[0];
        
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
        for (let size in this.layoutSizes) {
            let params = this.layoutSizes[size];
            if (params[0] < width && width < params[1]) this.size=size;
            console.log(this.size);
        }
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

    setMargins() {
        for(let id in this.media.marginMap) {
            let el = document.getElementById(id);
            console.log(`${this.media.marginMap[id][this.size].join('% ')}% `);
            el.style.margin = `${this.media.marginMap[id][this.size].join('% ')}% `;
        }
    }
}


function priorContLoad() {
    return (new windowObject());
}

let primWin = priorContLoad();

function postContLoad() {
    primWin.media = new mediaQ();
}

console.log((primWin.initWidth/100)+"px");
$("html").css({"font-size":(primWin.initWidth/100)+"px"});

$( window ).on('resize', function(){
    primWin.setMargins();
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