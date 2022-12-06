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
    //  Cohort with the limit width function to set the css varaible to the desired font size
    setFont(el) {
        let nm = `--${el.attr("id")}fontsz`;
        // Extract the rem font size of the document
        let win_wid = parseFloat($("html").css("fontSize").match(/[+-]?\d+(\.\d+)?/g));
        let size = `${primWin.checkClass(el,"fontSz")*win_wid}`;
        this.setCssVar(nm,size);
    }
    // Allows a lower level element to set the height of the parent element
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
        this.html = document.getElementsByTagName('html')[0];
        this.txtSz = new textSizer();
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

    getSize() {
        const width = document.documentElement.clientWidth;
        for (let size in this.layoutSizes) {
            let params = this.layoutSizes[size];
            if (params[0] < width && width < params[1]) this.size=size;
        }
        return(width);
    }

    adjustLayout() {
        // Keep getSize() to ensure that the responsive nav bar adjust properly
        this.getSize();
        this.media.setels(['side','cent','marg','transp']);
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

    // Method to set the naviagation bar visibiltiy based on the window size
    setNavVis() {
        let menu = $("#menu");
        if (this.size.includes('s')) {
            menu.css("visibility","hidden");
            return;
        }

        menu.css("visibility","visible");
    }

    resize() {
        this.adjustLayout();
        for (let el of document.getElementsByClassName("txtSet")) {
            let jq_el = $(`#${el.id}`);
            primWin.txtSz.setFont(jq_el);
            this.txtSz.limitWidth(jq_el);
        }
    }
    
}

// This class deals with the extraction of information from the html document and acts accordingly
// - The class properties of the html document are used to identify necessary actions
// - Note: For more information on the implementation use of the class commands see the index file 
class mediaQ{
    constructor() {
        this.marginMap = {};
        this.dupeClassName();
        this.setels(['side','cent','marg','transp']);
    }

    // Hub function that read parses through the class names and calls the appropriate coresponding functions
    setels(key_words=[]) {
        for (let ind of key_words) {
            for (let el of document.getElementsByClassName(ind)) {
                // The margin setter is called outside the class name iterator because the marginMap does 
                // that instead
                var jq_el = (document.getElementById(el.id))?$(`#${el.id}`):NaN;
                if (ind == 'marg' && el.className.includes('m*')) this.mapMargins(el);

                for (let nm of el.className.split(' ')) {
                    switch (ind) {
                        case 'cent':
                            this.centerEl(el, nm);
                            break;
                        case 'side':
                            this.setSide(el, nm);
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

// Load this content before the DOM is ready
function priorContLoad() {
    return (new windowObject());
}

let primWin = priorContLoad();

// UI Functions
$(document).ready(function(){
    primWin.media = new mediaQ();
    primWin.resize(); 
    $( window ).on('resize', function(){
        primWin.resize();
    }), 
    // Allow the nav drop down menu to activate when the pile is hovered or active 
    $("#pile").click(function(){
        let menu = $('#menu');
        menu.css('visibility') == 'hidden' ? menu.css('visibility','visible') : menu.css('visibility','hidden')
    });      
});

