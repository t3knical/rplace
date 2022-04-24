// ==UserScript==
// @name         Tekz Pixel Bot v2.0.5
// @namespace    https://github.com/t3knical/rplace
// @version      2.0.5
// @description  overlay for r/place, For Armenia and Allies!
// @author       Sir Teknical
// @match        https://rplace.t3knical.com/
// @match        https://rplace.tk/
// @require	     https://cdn.jsdelivr.net/npm/toastify-js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @updateURL    https://github.com/t3knical/rplace/raw/main/Templates/Canada/Canada.Script.user.js
// @downloadURL  https://github.com/t3knical/rplace/raw/main/Templates/Canada/Canada.Script.user.js
// ==/UserScript==

// dialog DIV
$("body").append('<div id="mydialog" style="display: none">'
    + '<font style="font-size: 14px"><u>Current Template:</u></font> <font id="currentTemplate" style="font-size: 12px"></font>'
    + '<br /><br />'
    + '<font style="font-size: 14px"><u>Last Placed Pixel (x, y):</u></font> <font id="lastPlacedPixel" style="font-size: 12px"></font>'
    + '<br /><br />'
    + '<font style="font-size: 14px"><u>Pixels Left To Work On:</u></font> <font id="pixelesLeft" style="font-size: 12px"></font>'
    + '<br /><br />'
    + '<font style="font-size: 14px"><u>Current Cooldown:</u></font> <font id="currentCooldown" style="font-size: 12px"></font>'
    + '</div>');

$("head").append(
    '<link '
    + 'href="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/themes/le-frog/jquery-ui.min.css" '
    + 'rel="stylesheet" type="text/css">'
);
// custom CSS for dialog
$("head").append(
    '<style type="text/css">'
    + '#mydialog { margin: 0; border: 2; height:100%; max-height:100%; color:#000 !important;top: 0.5em; left: 0.5em; outline: 0 none; padding: 0 !important; font-family: Verdana,Arial,sans-serif; font-size: 1em; font-size: 12px; vertical-align: baseline; line-height: 1; }'
    + '#mydialog table { border-collapse: collapse; border-spacing: 0; }'
    + '.ui-widget-header { background: #b0de78; border: 2; color: #fff; font-weight: normal; }'
    + '.ui-dialog-titlebar { padding: 0.5em .5em; position: relative; font-family: Verdana,Arial,sans-serif; font-size: 1em; }'
    + '.no-close .ui-dialog-titlebar-close { display: none; }'
    + '.ui-widget-content { background: #1b6a00 scroll 0 0; border: 0 none; overflow: none; position: relative; padding: 0 !important; margin: 0; }'
    + '</style>'
);

// options for dialog, for help look in jQuery docs
var opt = {
    width: 350,
    height: 150,
    minWidth: 350,
    minHeight: 150,
    modal: false,
    autoOpen: false,
    title: "Tekz, rPlace Pixel Placer!",
    dialogClass: "no-close",
    zIndex: 10
};

$("#mydialog").dialog(opt).dialog("open");

// alternative way to position a dialog
$("#mydialog").parent().css({
    position: "fixed",
    top: "50px",
    left: "10px",
    width: "350px"
});

// Minimal TamperMonkey template for keypress-triggered events
(function () {
    'use strict';
    function onAltQ() {
        console.log("Alt Q pressed!");
    }
    function onTest() {
        document.getElementById('currentTemplate').textContent = "<b>Current Template:</b> test.png";
        document.getElementById('lastPlacedPixel').textContent = "<u>Last Placed Pixel (x, y):</u> 324, 354";
        document.getElementById('pixelesLeft').textContent = "<u>Pixels Left To Work On:</u> 3452";
    }
    function toggleUI() {
        $(function () {
            var isDialogOpen = $("#mydialog").dialog("isOpen");// == false) ? $( "#mydialog").dialog("open") : $("#dialog-5").dialog("close");

            if (isDialogOpen) {
                $("#mydialog").dialog("close");
            }
            else {
                $("#mydialog").dialog(opt).dialog("open");
                $("#mydialog").parent().css({
                    position: "fixed",
                    top: "50px",
                    left: "10px",
                    width: "350px"
                });
            }
            console.log("isdialogopen: " + isDialogOpen);
        });
    }
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.keyCode == 84) { // t keypress
            onTest();
        }

        if (evt.keyCode == 81) { // q keypress
            onAltQ();
        }

        if (evt.keyCode == 192) { // `o keypress
            toggleUI();
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();

const DEFAULT_TOAST_DURATION_MS = 10000;

var startXpos = 210;
var startYpos = 448;
var startZoom = 0.03;

var socket1;

var order0 = undefined;
var order1 = undefined;
var order2 = undefined;
var order3 = undefined;
var order4 = undefined;

var accessToken;

var currentOrderCanvas0 = undefined;
var currentOrderCtx0 = undefined;
var currentOrderCanvas1 = undefined;
var currentOrderCtx1 = undefined;
var currentOrderCanvas2 = undefined;
var currentOrderCtx2 = undefined;
var currentOrderCanvas3 = undefined;
var currentOrderCtx3 = undefined;
var currentOrderCanvas4 = undefined;
var currentOrderCtx4 = undefined;

var rgbaOrder0 = undefined;
var rgbaOrder1 = undefined;
var rgbaOrder2 = undefined;
var rgbaOrder3 = undefined;
var rgbaOrder4 = undefined;

var work0 = undefined;
var work1 = undefined;
var work2 = undefined;
var work3 = undefined;
var work4 = undefined;

var rgbaCanvas = undefined;

var currentPlaceCanvas = undefined;

var cnc_url0 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Armenia/full_canvas_template_armenia_flag.png';
var cnc_url1 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_canada_full.png';
var cnc_url2 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_just_animes.png';
var cnc_url3 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_with_allies.png';
var cnc_url4 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_the_blackout.png';

function rgbToHex(r, g, b) {
    return (
        '#' +
        ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    )
};

function autoput(X, Y, color) {
    //if (CD > Date.now()) return
    CD = Date.now() + COOLDOWN;
    var x0 = X;
    var y0 = Y;
    PEN = COLOR_MAPPINGS[color];
    set(Math.floor(x0), Math.floor(y0), PEN);
    audios.cooldownStart.run();
    let a = new DataView(new Uint8Array(6).buffer);
    a.setUint8(0, 4);
    a.setUint32(1, Math.floor(x0) + Math.floor(y0) * WIDTH);
    a.setUint8(5, PEN);
    PEN = -1;
    ws.send(a);
    return true
}

let rgbaOrderToHex = (i, rgbaOrder) => rgbToHex(rgbaOrder[i * 4], rgbaOrder[i * 4 + 1], rgbaOrder[i * 4 + 2]);

function getCanvasFromUrl(url, canvas1, x = 0, y = 0, clearCanvas = false) {
    return new Promise((resolve, reject) => {
        let loadImage = (ctx1) => {
            var img = new Image()
            img.crossOrigin = 'anonymous | use-credentials'
            img.onload = () => {
                if (clearCanvas) {
                    ctx1.clearRect(0, 0, canvas1.width, canvas1.height)
                }
                ctx1.drawImage(img, x, y)
                resolve(ctx1)
            }
            img.onerror = () => {
                Toastify({
                    text: 'Error retrieving folder. Try again in 3 sec...',
                    duration: 3000,
                }).showToast()
                setTimeout(() => loadImage(ctx1), 3000)
            }
            img.src = url
        }
        loadImage(canvas1.getContext('2d'))
    })
};

const COLOR_MAPPINGS = {
    '#6D001A': 0,     // Pinkish Red
    '#BE0039': 1,     // Dark Red
    '#FF4500': 2,     // Red
    '#FFA800': 3,     // Orange
    '#FFD635': 4,     // Yellow
    '#FFF8B8': 5,     // Beige
    '#00A368': 6,     // Dark Green
    '#00CC78': 7,     // Green
    '#7EED56': 8,     // Light Green
    '#00756F': 9,     // Dark Teal
    '#009EAA': 10,    // Light Teal
    '#00CCC0': 11,    // Saturated Teal
    '#2450A4': 12,    // Dark Blue
    '#3690EA': 13,    // Blue
    '#51E9F4': 14,    // Cyan
    '#493AC1': 15,    // Turquoise
    '#6A5CFF': 16,    // Blueish Purple
    '#94B3FF': 17,    // Light Blueish Purple
    '#811E9F': 18,    // Dark Purple
    '#B44AC0': 19,    // Purple
    '#E4ABFF': 20,    // Light Purple
    '#DE107F': 21,    // Saturated Purple
    '#FF3881': 22,    // Dark Pink
    '#FF99AA': 23,    // Light Pink
    '#6D482F': 24,    // Dark Brown
    '#9C6926': 25,    // Brown
    '#FFB470': 26,    // Light Brown
    '#000000': 27,    // Black
    '#515252': 28,    // Dark Grey
    '#898D90': 29,    // Grey
    '#D4D7D9': 30,    // Light Grey
    '#FFFFFF': 31     // White
};

let getRealWork = (rgbaOrder) => {
    let order = []
    for (var i = 0; i < 4000000; i++) {
        if (rgbaOrder[i * 4 + 3] !== 0) {
            order.push(i)
        }
    }
    return order
};

function ensureRange(value, min, max) {
   return Math.min(Math.max(value, min), max);
}

function inRange(value, min, max) {
   return (value>= min) && (value<= max);
}

let getPendingWork = (work, rgbaOrder, rgbaCanvas) => {
    let pendingWork = []
    for (const i of work) {
        if (rgbaOrderToHex(i, rgbaOrder) !== rgbaOrderToHex(i, rgbaCanvas)) {
            pendingWork.push(i)
        }
    }
    return pendingWork
};

(async function () {
    while(document.getElementById('place').textContent != "Place a tile")
    {
        await new Promise(r => setTimeout(r, 150));
    }
    GM_addStyle(GM_getResourceText('TOASTIFY_CSS'))

    currentOrderCanvas0 = document.createElement('CANVAS');
    currentOrderCanvas1 = document.createElement('CANVAS');
    currentOrderCanvas2 = document.createElement('CANVAS');
    currentOrderCanvas3 = document.createElement('CANVAS');
    currentOrderCanvas4 = document.createElement('CANVAS');

    currentOrderCtx0 = currentOrderCanvas0.getContext('2d');
    currentOrderCtx1 = currentOrderCanvas1.getContext('2d');
    currentOrderCtx2 = currentOrderCanvas2.getContext('2d');
    currentOrderCtx3 = currentOrderCanvas3.getContext('2d');
    currentOrderCtx4 = currentOrderCanvas4.getContext('2d');

    currentPlaceCanvas = document.createElement('CANVAS');

    currentOrderCanvas0.width = 2000
    currentOrderCanvas0.height = 2000
    currentOrderCanvas0.style.display = 'none'
    currentOrderCanvas0 = document.body.appendChild(currentOrderCanvas0)

    currentOrderCanvas1.width = 2000
    currentOrderCanvas1.height = 2000
    currentOrderCanvas1.style.display = 'none'
    currentOrderCanvas1 = document.body.appendChild(currentOrderCanvas1)

    currentOrderCanvas2.width = 2000
    currentOrderCanvas2.height = 2000
    currentOrderCanvas2.style.display = 'none'
    currentOrderCanvas2 = document.body.appendChild(currentOrderCanvas2)

    currentOrderCanvas3.width = 2000
    currentOrderCanvas3.height = 2000
    currentOrderCanvas3.style.display = 'none'
    currentOrderCanvas3 = document.body.appendChild(currentOrderCanvas3)

    currentOrderCanvas4.width = 2000
    currentOrderCanvas4.height = 2000
    currentOrderCanvas4.style.display = 'none'
    currentOrderCanvas4 = document.body.appendChild(currentOrderCanvas4)

    currentPlaceCanvas.width = 2000
    currentPlaceCanvas.height = 2000
    currentPlaceCanvas.style.display = 'none'
    currentPlaceCanvas = document.body.appendChild(currentPlaceCanvas)

    Toastify({
        text: 'Done loading...' + location.hostname,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    theCanvas = document.getElementById('canvas');
    theCTX = canvas.getContext('2d');

    Toastify({
        text: 'Done getting the canvas and context...',
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    Toastify({
        text: `Getting template from github...`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    x = startXpos;
    y = startYpos;
    z = startZoom;

    pos();

    currentOrderCtx0 = await getCanvasFromUrl(cnc_url0, currentOrderCanvas0, 0, 0, true,)
    order0 = getRealWork(currentOrderCtx0.getImageData(0, 0, 2000, 2000).data)
    Toastify({
        text: `Done getting template1 from github, ${order0.length} pixels in total...`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    currentOrderCtx1 = await getCanvasFromUrl(cnc_url1, currentOrderCanvas1, 0, 0, true,)
    order1 = getRealWork(currentOrderCtx1.getImageData(0, 0, 2000, 2000).data)
    Toastify({
        text: `Done getting template2 from github, ${order1.length} pixels in total...`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    currentOrderCtx2 = await getCanvasFromUrl(cnc_url2, currentOrderCanvas2, 0, 0, true,)
    order2 = getRealWork(currentOrderCtx2.getImageData(0, 0, 2000, 2000).data)
    Toastify({
        text: `Done getting template3 from github, ${order2.length} pixels in total...`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    currentOrderCtx3 = await getCanvasFromUrl(cnc_url3, currentOrderCanvas3, 0, 0, true,)
    order3 = getRealWork(currentOrderCtx3.getImageData(0, 0, 2000, 2000).data)
    Toastify({
        text: `Done getting template4 from github, ${order3.length} pixels in total...`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    currentOrderCtx4 = await getCanvasFromUrl(cnc_url4, currentOrderCanvas4, 0, 0, true,)
    order4 = getRealWork(currentOrderCtx4.getImageData(0, 0, 2000, 2000).data)
    Toastify({
        text: `Done getting template5 from github, ${order4.length} pixels in total...`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    attemptPlace()
})()

async function attemptPlace() {
    if (order0 == undefined || order1 == undefined || order2 == undefined || order3 == undefined || order4 == undefined) {
        setTimeout(attemptPlace, 1000) // probeer opnieuw in 2sec.
        return
    }
    if (rgbaOrder0 == undefined || rgbaOrder1 == undefined || rgbaOrder2 == undefined || rgbaOrder3 == undefined || rgbaOrder4 == undefined) {
        rgbaOrder0 = currentOrderCtx0.getImageData(0, 0, 2000, 2000).data
        rgbaOrder1 = currentOrderCtx1.getImageData(0, 0, 2000, 2000).data
        rgbaOrder2 = currentOrderCtx2.getImageData(0, 0, 2000, 2000).data
        rgbaOrder3 = currentOrderCtx3.getImageData(0, 0, 2000, 2000).data
        rgbaOrder4 = currentOrderCtx4.getImageData(0, 0, 2000, 2000).data
        setTimeout(attemptPlace, 1000) // probeer opnieuw in 2sec.
        return
    }
    var ctx1
    try {
        ctx1 = await c
        var coolDownTest = ensureRange(Math.floor((CD - Date.now()) / 1000), 0, 10)
        document.getElementById('currentCooldown').textContent = `${coolDownTest} sec(s)`;

    } catch (e) {
        console.warn('Error retrieving map: ', e)
        Toastify({
            text: 'Error retrieving map. Try again in 2.5 sec...',
            duration: DEFAULT_TOAST_DURATION_MS,
        }).showToast()
        setTimeout(attemptPlace, 2500) // Try again in 2.5 sec.
        return
    }

    if(location.origin === 'https://rplace.t3knical.com' && COOLDOWN > 0.05)
    {
        COOLDOWN = 0.05;
    }

    if (CD <= Date.now()) {
        rgbaCanvas = ctx1.getImageData(0, 0, 2000, 2000).data
        work0 = getPendingWork(order0, rgbaOrder0, rgbaCanvas)

        if (work0.length === 0) {
            work1 = getPendingWork(order1, rgbaOrder1, rgbaCanvas)
            if (work1.length === 0) {
                work2 = getPendingWork(order2, rgbaOrder2, rgbaCanvas)
                if (work2.length === 0) {
                    work3 = getPendingWork(order3, rgbaOrder3, rgbaCanvas)
                    if (work3.length === 0) {
                        work4 = getPendingWork(order4, rgbaOrder4, rgbaCanvas)
                    }
                }
            }
        }

        if (work0.length === 0 && work1.length === 0 && work2.length === 0 && work3.length === 0 && work4.length === 0) {
            document.getElementById('currentTemplate').textContent = `None - All Work Is Complete!`;
            document.getElementById('lastPlacedPixel').textContent = `${0}, ${0}`;
            document.getElementById('pixelesLeft').textContent = `All ${order3.length} Pixels Are Fixed!`;
            CD = Date.now() + 5000;

            setTimeout(attemptPlace, 500) // Try again in 500 ms.
            return
        }

        var percentComplete;
        var workRemaining;
        var idx;
        var i;
        var x1;
        var y1;
        var hex;
        var currentcanvas;

        if (work0.length > 0) {
            percentComplete = 100 - Math.ceil((work0.length * 100) / order0.length)
            workRemaining = work0.length
            idx = Math.floor(Math.random() * work0.length)
            i = work0[idx]
            x1 = i % 2000
            y1 = Math.floor(i / 2000)
            hex = rgbaOrderToHex(i, rgbaOrder0)
            document.getElementById('currentTemplate').textContent = `Template 1 - ${percentComplete}% Complete!`;
            document.getElementById('lastPlacedPixel').textContent = `${x1}, ${y1}`;
            document.getElementById('pixelesLeft').textContent = `${workRemaining}/${order0.length}`;
        }
        else if (work1.length > 0) {
            percentComplete = 100 - Math.ceil((work1.length * 100) / order1.length)
            workRemaining = work1.length
            idx = Math.floor(Math.random() * work1.length)
            i = work1[idx]
            x1 = i % 2000
            y1 = Math.floor(i / 2000)
            hex = rgbaOrderToHex(i, rgbaOrder1)
            document.getElementById('currentTemplate').textContent = `Template 2 - ${percentComplete}% Complete!`;
            document.getElementById('lastPlacedPixel').textContent = `${x1}, ${y1}`;
            document.getElementById('pixelesLeft').textContent = `${workRemaining}/${order1.length}`;
        }
        else if (work2.length > 0) {
            percentComplete = 100 - Math.ceil((work2.length * 100) / order2.length)
            workRemaining = work2.length
            idx = Math.floor(Math.random() * work2.length)
            i = work2[idx]
            x1 = i % 2000
            y1 = Math.floor(i / 2000)
            hex = rgbaOrderToHex(i, rgbaOrder2)
            document.getElementById('currentTemplate').textContent = `Template 3 - ${percentComplete}% Complete!`;
            document.getElementById('lastPlacedPixel').textContent = `${x1}, ${y1}`;
            document.getElementById('pixelesLeft').textContent = `${workRemaining}/${order2.length}`;
        }
        else if (work3.length > 0) {
            percentComplete = 100 - Math.ceil((work3.length * 100) / order3.length)
            workRemaining = work3.length
            idx = Math.floor(Math.random() * work3.length)
            i = work3[idx]
            x1 = i % 2000
            y1 = Math.floor(i / 2000)
            hex = rgbaOrderToHex(i, rgbaOrder3)
            document.getElementById('currentTemplate').textContent = `Template 4 - ${percentComplete}% Complete!`;
            document.getElementById('lastPlacedPixel').textContent = `${x1}, ${y1}`;
            document.getElementById('pixelesLeft').textContent = `${workRemaining}/${order3.length}`;
        }
        else if (work4.length > 0) {
            percentComplete = 100 - Math.ceil((work4.length * 100) / order4.length)
            workRemaining = work4.length
            idx = Math.floor(Math.random() * work4.length)
            i = work4[idx]
            x1 = i % 2000
            y1 = Math.floor(i / 2000)
            hex = rgbaOrderToHex(i, rgbaOrder4)
            document.getElementById('currentTemplate').textContent = `Template 5 - ${percentComplete}% Complete!`;
            document.getElementById('lastPlacedPixel').textContent = `${x1}, ${y1}`;
            document.getElementById('pixelesLeft').textContent = `${workRemaining}/${order4.length}`;
        }
        autoput(x1, y1, hex);
        //Toastify({ text: `Trying to place pixel ${x1}, ${y1}, color ${hex},${COLOR_MAPPINGS[hex]}... (${percentComplete}% complete, ${workRemaining} left)`, duration: DEFAULT_TOAST_DURATION_MS, }).showToast()
        console.log(`Trying to place pixel ${x1}, ${y1}, color ${hex},${COLOR_MAPPINGS[hex]},... (${percentComplete}% complete, ${workRemaining} left)`);
    }

    setTimeout(attemptPlace, 250);

};
