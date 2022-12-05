class importtextFit{
    constructor() {
        this.imp_file = document.createElement('script');
        this.imp_file.src = 'nodeJS_npm/node_modules/textfit/textFit.js';
        // this.imp_file.onload = function() {
        //     doFit();
        // }
        document.body.appendChild(this.imp_file);
    }

    doFit() {
        for (let el in document.getElementsByClassName('txtFt')){
            console.log(el)
            textFit(el,{alignVert: true, multiLine: true});

        }
    }
}