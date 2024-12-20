function dragElement(element) {
    element.style.position = (element.style.position!='absolute') ? 'absolute' : 'absolute' ;
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(element.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(element.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
dragElement(document.querySelector("#drag"));




let options = {
    modal: true,
    modal_opacity: 0.5,
    style: 'tooltip',
    arrow: true,
    shadow: true,
    trigger: '#button-show',
    hover: true,
    autoshow: true,
    // autoshow_period: 10,
    // autoshow_identifier: 'tuto',
    tooltips: [ // (Requis) Liste des tooltips à créer
        {
            reference: '#corner-top-left',
            content: 'Un texte suffisament long',
            // placement: 'bottom',
            arrow: false,
        },{
            reference: '#corner-top',
            content: 'Un texte suffisament long',
            // placement: 'bottom',
        },{
            reference: '#corner-top-right',
            content: 'Un texte suffisament long',
            // placement: 'bottom',
        },{
            reference: '#corner-right',
            content: 'Un texte suffisament long',
            // placement: 'left',
        },{
            reference: '#corner-bottom-right',
            content: 'Un texte suffisament long',
            // placement: 'top',
        },{
            reference: '#corner-bottom',
            content: 'Un texte suffisament long',
            // placement: 'top',
        },{
            reference: '#corner-bottom-left',
            content: 'Un texte suffisament long',
            // placement: 'top',
        },{
            reference: '#corner-left',
            content: 'Un texte suffisament long',
            // placement: 'right',
        },{
            reference: '#drag',
            content: 'Un texte suffisament long',
            // placement: 'bottom',
            hover: false,
        },
    ]
};

floating_tuto = createFloatingTooltip(options);
// floating_tuto.show();

console.log(floating_tuto);
