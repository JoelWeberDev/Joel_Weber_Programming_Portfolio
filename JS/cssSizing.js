// Next task list:
// - Create multiple layouts for differing screen sizes
// -- Use generic class names to set container getSize
// -- Have 12 different sizes available to use
// -- Resize text or container height (undecided)
// - Set the initial size to the coresponding reoluton
// -deal with text resiszing and relative units

// Detailed next task:
//  - Set the SVG text to always remain centered
//      - How: Get the  

// Css modifications based of of html class names
// Functions contained
    // - Left and right set
    // - 

// Session Goals:
    // Finish pile menu
    // Finish projects page

// Next Steps: This function needs to be made to be able to set and read the size of the text of the element.
// Methods go in order of precidince and running in regular operatation

// Text sizing types:
    // - Limited by character per line and only changing effecting the size of the text no relatives
    // - Limited by characters per line and changing the parent height to accomodate the text
class textSizer{
    constructor() {
        this.root = document.querySelector(":root");
    }

// Goal: Limit the text to a certain number of characters per line
// - Each character will be a fixed pixel size until the character limit is exceeded
    limitWidth(el) {
        // General Window and meta initialization
        // Standard is the indacator that the element contating this class is the standard that the parent element will fit to
        let width = el.width();
        let fontsize = primWin.getStyleProp(el.attr("id"),"font-size");
        // retrieve information from the classes that is specific to the application
        let line_chars = primWin.checkClass(el,"txtRstc");
        let win_wid = parseInt($("html").css("fontSize").match(/[+-]?\d+(\.\d+)?/g));
        let rem_size = primWin.checkClass(el,"fontSz")*win_wid

        // console.log(fontsize*line_chars,width);
        if (fontsize*line_chars <= width & width/line_chars >= rem_size) {
            this.setFont(el);
            // console.log("Font size is set");
        }
        else {
            this.setCssVar(`--${el.attr("id")}fontsz`,width/(line_chars))
        }

        // Set the height of the parent element relative to the height of the child element
        if (el.attr("class").includes("standard")) {
            this.relativeOuterContent(el);
        }

    }

    setFont(el) {
        let nm = `--${el.attr("id")}fontsz`;
        let win_wid = parseFloat($("html").css("fontSize").match(/[+-]?\d+(\.\d+)?/g));
        let size = `${primWin.checkClass(el,"fontSz")*win_wid}`;
        this.setCssVar(nm,size);
    }

    relativeOuterContent(stand_el) {
        let base_height = parseFloat(stand_el.css("height"))/0.95;
        let rel_parent = stand_el.parents(".changeRec");
        rel_parent.css({"height":base_height});
    }

    setCssVar(varNm,val,unit="px") {
        this.root.style.setProperty(varNm,`${val}${unit}`);
    }


    getCssVar(varNm) {
        var rs = getComputedStyle(this.root);
        return(rs.getPropertyValue(varNm));
    }
}

// Layer that controls when the window is adusted and what adjustments occur
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
        this.setInitSize();
        this.calcResIntervals();
        this.html = document.getElementsByTagName('html')[0];
        this.txtSz = new textSizer();
    }

    // Initially set the correct size for specific screen resolutions
    setInitSize() {
        // $("html").css({"font-size":(this.initWidth/40)+"px"});
    }

    // Takes the class name and check for values attached to specific
    // this returns an integer value
    checkClass(el, match) {
        let ind_value = parseFloat((el.attr("class").split(' ').filter(nm => nm.includes(match)))[0].match(/[+-]?\d+(\.\d+)?/g));
        return (ind_value);
    }

    getStyleProp(id_nm,property_nm) {
        let value = window.getComputedStyle(document.getElementById(id_nm),null).getPropertyValue(property_nm);
        let num_val = parseInt(value.match(/[+-]?\d+(\.\d+)?/g));
        return(num_val);
    }

    calcResIntervals() {
        var intervals = Array();
        let minWid = 336;
        let intSize = Math.round((this.initWidth-minWid)/6);
        for (let ints = 6; ints >= 1; ints--) {
            let curint = (intSize*ints)+minWid;
            intervals.push([curint, (curint+intSize)/110]);
        }
        intervals[0][1] = intervals[0][0]/100;
        this.resInts=intervals;
    }

    getSize() {
        const width = document.documentElement.clientWidth;
        for (let size in this.layoutSizes) {
            let params = this.layoutSizes[size];
            if (params[0] < width && width < params[1]) this.size=size;
        }
        return(width);
    }

    adjustLayout(dir) {
        let dPx = this.initWidth-this.getSize();
        
        if (0 >= this.pos < this.resInts.length-1) {
            this.pos = (this.getSize() > this.resInts[this.pos][0]) ? ((--this.pos >  0) ? this.pos:++this.pos): ((++this.pos <  6 && this.getSize() < this.resInts[this.pos][0]) ? this.pos:--this.pos);
        }
        // $("html").css({"fontSize": this.resInts[this.pos][1].toString()+'px'});
        this.media.setels(['side','cent','marg','expand','transp']);
        this.setMargins();
        this.setNavVis();

    }

    // Whenever the window is resized check and adjust the margin according to the preset marginMap
    setMargins() {
        for(let id in this.media.marginMap) {
            let el = document.getElementById(id);
            el.style.margin = `${this.media.marginMap[id][this.size].join('% ')}% `;
        }
    }

    // Methid to set the naviagation bar visibiltiy based on the window size
    setNavVis() {
        let menu = $("#menu");
        if (this.size.includes('s')) {
            menu.css("visibility","hidden");
            return;
        }

        menu.css("visibility","visible");
    }

    resize() {
        if (this.getSize() < this.initWidth) {
            // Move to next view after 336 of resolution change
            $("html").css({"width": "99vw"});
        }
        this.adjustLayout();
        var els = document.getElementsByClassName("txtSet");
        for (let el of document.getElementsByClassName("txtSet")) {
            let jq_el = $(`#${el.id}`);
            primWin.txtSz.setFont(jq_el);
            this.txtSz.limitWidth(jq_el);
        }
    }

    implementCss(href='') {
        var link = document.createElement('link')
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href
        document.getElementsByTagName('HEAD')[0].appendChild(link);
    }
    
}

class mediaQ{
    constructor() {
        this.marginMap = {};
        this.dupeClassName();
        this.setels(['side','cent','marg','expand','transp']);
    }

    setels(key_words=[],size = primWin.size) {
        for (let ind of key_words) {
            for (let el of document.getElementsByClassName(ind)) {
                var jq_el = (document.getElementById(el.id))?$(`#${el.id}`):NaN;
                if (ind == 'marg' && el.className.includes('m*')) this.mapMargins(el);
                
                else if (jq_el != NaN) {
                    if (ind == 'expand') {
                        if ((el.className.baseVal.includes('sib')))
                            this.expCont(jq_el,el.className.baseVal);
                        else if ((el.className.includes('sib'))) {
                            this.expCont(el,el.className);
                        }
                        continue;
                    }
                }

                for (let nm of el.className.split(' ')) {
                    switch (ind) {
                        case 'cent':
                            this.centerEl(el, nm);
                            break;
                        case 'side':
                            this.setSide(el, nm);
                            break;
                        case 'expand':
                            this.expCont(el,nm)
                            break;
                        case 'transp':
                            this.transp(jq_el,nm);
                            break;
                    }
                }
            }
        }
    }


    // Use the key indacators to determine classes that neeed to be set left or right
    setSide(setClass, nm) {
        
        if (nm.includes('le')) {
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
    // CRUCIAL FOR USE: Every element that this will be applied to requires an id
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

    mapMargins(setClass) {
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
            this.marginMap[id][nm.slice(nm.indexOf('*')+1,nm.indexOf('-'))] = (nm.includes('a') ? false: (nm.split('-').slice(1,5)).map(x=>parseInt(x)));
                // Convert the data from the name string into array in the margin map
            }
        for (let key in this.marginMap[id]) {
            switch (key) {
                case 'd':
                    continue;
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

    // Goal: Make the children elements within a sections or division align in a developer-set configuration
    expCont(jq_el,class_nm) {        
        let sibling = jq_el.siblings().eq(parseInt(class_nm.split(' ').filter(nm=>(nm.includes("sib")))[0].match(/[+-]?\d+(\.\d+)?/g))-1)
        var rel_height = sibling.outerHeight()
        jq_el.css("height",rel_height*2.5);
    }

    // Set the class to make multiple classes responsive and abide by the DRY principle for coding
    repeatClassNm(jq_el,new_nm='') {
        jq_el.addClass(new_nm).removeClass('resp')
    }
    
    // transpose items to remove vertical space between them
    //  - The element will be identified by the key phrase transp followed by the id of the base unit element.
    //  - 
    transp(jq_el,nm) {
        if (nm.includes("base:")) {
            // Obtain the reference element from the base class name
            // Set the top of the to the bottom of the base element
            let base_id = `#${nm.slice(nm.indexOf(":")+1,)}`;
            let base_el = $(base_id);  
            let trans_height = base_el.outerHeight();
            document.querySelector(":root").style.setProperty(`--${jq_el.attr('id')}trans`,`${trans_height*(-1)}px`);
        }
    }
}

function priorContLoad() {
    return (new windowObject());
}

let primWin = priorContLoad();

function postContLoad(href='') {
    primWin.media = new mediaQ();
    primWin.resize(); 
    primWin.implementCss(href);
}

// UI Functions
$(document).ready(function(){
    $( window ).on('resize', function(){
        primWin.resize();
    }), 
    // Allow the nav drop down menu to activate when the pile is hovered or active 
    $("#pile").click(function(){
        let menu = $('#menu');
        menu.css('visibility') == 'hidden' ? menu.css('visibility','visible') : menu.css('visibility','hidden')
    });      
});

