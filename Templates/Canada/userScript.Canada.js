// ==UserScript==
// @name         Tekz Pixel Bot v2
// @namespace    https://github.com/t3knical/rplace
// @version      2.0.0
// @description  overlay for r/place, For Canada!
// @author       Sir Teknical
// @match        http://place.cslabs.clarkson.edu/*
// @match        http://127.0.0.1:3000/*
// @match        https://rplace.tk/
// @icon         https://rplace.tk/favicon.png
// @require      https://cdn.jsdelivr.net/npm/toastify-js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/userScript.Canada.js
// @downloadURL  https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/userScript.Canada.js
// ==/UserScript==

const DEFAULT_TOAST_DURATION_MS = 10000;

var startXpos = 210;
var startYpos = 448;
var startZoom = 0.03;

var socket1;

var order0 = undefined;
var order1 = undefined;
var order2 = undefined;
var order3 = undefined;

var accessToken;

var currentOrderCanvas0;
var currentOrderCtx0;
var currentOrderCanvas1;
var currentOrderCtx1;
var currentOrderCanvas2;
var currentOrderCtx2;
var currentOrderCanvas3;
var currentOrderCtx3;

var currentPlaceCanvas;

var cnc_url0 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_canada_flag.png';
var cnc_url1 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_canada_full.png';
var cnc_url2 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_just_animes.png';
var cnc_url3 = 'https://raw.githubusercontent.com/t3knical/rplace/main/Templates/Canada/full_canvas_template_with_allies.png';

var theCanvas;
var theCTX;

//var HOST = location.protocol + "//" + location.hostname;
//var WS = "ws://" + location.hostname + ":8081/ws";
//var ws;

function rgbToHex(r, g, b) {
    return (
        '#' +
        ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    )
};

async function attemptPlace() {
    if (order0 == undefined || order1 == undefined || order2 == undefined || order3 == undefined) {
        setTimeout(attemptPlace, 1000) // probeer opnieuw in 2sec.
        return
    }
    //COOLDOWN = 0
    var ctx1
    try {
        ctx1 = await c

    } catch (e) {
        console.warn('Error retrieving map: ', e)
        Toastify({
            text: 'Error retrieving map. Try again in 2.5 sec...',
            duration: DEFAULT_TOAST_DURATION_MS,
        }).showToast()
        setTimeout(attemptPlace, 2500) // Try again in 2.5 sec.
        return
    }

    const rgbaOrder0 = currentOrderCtx0.getImageData(0, 0, 2000, 2000).data
    const rgbaOrder1 = currentOrderCtx1.getImageData(0, 0, 2000, 2000).data
    const rgbaOrder2 = currentOrderCtx2.getImageData(0, 0, 2000, 2000).data
    const rgbaOrder3 = currentOrderCtx3.getImageData(0, 0, 2000, 2000).data

    const rgbaCanvas = ctx1.getImageData(0, 0, 2000, 2000).data

    const work0 = getPendingWork(order0, rgbaOrder0, rgbaCanvas)
    const work1 = getPendingWork(order1, rgbaOrder1, rgbaCanvas)
    const work2 = getPendingWork(order2, rgbaOrder2, rgbaCanvas)
    const work3 = getPendingWork(order3, rgbaOrder3, rgbaCanvas)

    if (work0.length === 0 && work1.length === 0 && work2.length === 0 && work3.length === 0) {
        Toastify({
            text: `All pixels are already in the right place for all imgs! Try again in 2.5 sec...`,
            duration: 5000,
        }).showToast()
        setTimeout(attemptPlace, 2500) // Try again in 2.5sec.
        return
    }

    var percentComplete;
    var workRemaining;
    var idx;
    var i;
    var x1;
    var y1;
    var hex;

    if (work0.length > 0) {
        percentComplete = 100 - Math.ceil((work0.length * 100) / order0.length)
        workRemaining = work0.length
        idx = Math.floor(Math.random() * work0.length)
        i = work0[idx]
        x1 = i % 2000
        y1 = Math.floor(i / 2000)
        hex = rgbaOrderToHex(i, rgbaOrder0)
    }
    else if (work1.length > 0) {
        percentComplete = 100 - Math.ceil((work1.length * 100) / order1.length)
        workRemaining = work1.length
        idx = Math.floor(Math.random() * work1.length)
        i = work1[idx]
        x1 = i % 2000
        y1 = Math.floor(i / 2000)
        hex = rgbaOrderToHex(i, rgbaOrder1)
    }
    else if (work2.length > 0) {
        percentComplete = 100 - Math.ceil((work2.length * 100) / order2.length)
        workRemaining = work2.length
        idx = Math.floor(Math.random() * work2.length)
        i = work2[idx]
        x1 = i % 2000
        y1 = Math.floor(i / 2000)
        hex = rgbaOrderToHex(i, rgbaOrder2)
    }
    else if (work3.length > 0) {
        percentComplete = 100 - Math.ceil((work3.length * 100) / order3.length)
        workRemaining = work3.length
        idx = Math.floor(Math.random() * work3.length)
        i = work3[idx]
        x1 = i % 2000
        y1 = Math.floor(i / 2000)
        hex = rgbaOrderToHex(i, rgbaOrder3)
    }
    // USED FOR MY LOCALHOST PROJECT
    //ctx.fillStyle = hex;
    //ctx.fillRect(Math.floor(x), Math.floor(y), pixelSize, pixelSize);
    //socket.emit('load image', convertCanvasToImage(canvas).src);

    //COOLDOWN = 0

    if (CD <= Date.now()) {
        autoput(x1, y1, hex)
        Toastify({ text: `Trying to place pixel ${x1}, ${y1}, color ${hex},${COLOR_MAPPINGS[hex]}... (${percentComplete}% complete, ${workRemaining} left)`, duration: DEFAULT_TOAST_DURATION_MS, }).showToast()
        console.log(`Trying to place pixel ${x1}, ${y1}, color ${hex},${COLOR_MAPPINGS[hex]},... (${percentComplete}% complete, ${workRemaining} left)`)
    }


    //USED FOR
    //sendColorUpdate(x, y, COLOR_MAPPINGS[hex]);

    //const res = await place(x, y, COLOR_MAPPINGS[hex])
    //const data = await res.json()
    //var loadbuffer = load.buffer
    //console.log("load buffer: %s", place.innerHTML)

    setTimeout(attemptPlace, 50);

};

function autoput(X, Y, color) {
    //if (CD > Date.now()) return
    CD = Date.now() + COOLDOWN;
    var x0 = X;
    var y0 = Y;
    //z = 0.03;
    //pos();
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

window.addEventListener('load', function () {
    //currentOrderCtx = getCanvasFromUrl(cnc_url, currentOrderCanvas, 0, 0, true)
    //console.log("userScript - currentOrderCtx: %O", currentOrderCtx)
    //order = getRealWork(currentOrderCtx.result.canvas.getImageData(0, 0, 2000, 2000).data)

    console.log("userScript - canvas: %O", theCanvas);
    console.log("userScript - ctx: %O", theCTX);

    console.log("userScript - Window load has happened...");

    //attemptPlace();
});

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
    await new Promise(r => setTimeout(r, 10000));

    GM_addStyle(GM_getResourceText('TOASTIFY_CSS'))

    currentOrderCanvas0 = document.createElement('CANVAS');
    currentOrderCanvas1 = document.createElement('CANVAS');
    currentOrderCanvas2 = document.createElement('CANVAS');
    currentOrderCanvas3 = document.createElement('CANVAS');

    currentOrderCtx0 = currentOrderCanvas0.getContext('2d');
    currentOrderCtx1 = currentOrderCanvas1.getContext('2d');
    currentOrderCtx2 = currentOrderCanvas2.getContext('2d');
    currentOrderCtx3 = currentOrderCanvas2.getContext('2d');

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
    await new Promise(r => setTimeout(r, 1000));
    order0 = getRealWork(currentOrderCtx0.getImageData(0, 0, 2000, 2000).data)
    currentOrderCtx1 = await getCanvasFromUrl(cnc_url1, currentOrderCanvas1, 0, 0, true,)
    await new Promise(r => setTimeout(r, 1000));
    order1 = getRealWork(currentOrderCtx1.getImageData(0, 0, 2000, 2000).data)
    currentOrderCtx2 = await getCanvasFromUrl(cnc_url2, currentOrderCanvas2, 0, 0, true,)
    await new Promise(r => setTimeout(r, 1000));
    order2 = getRealWork(currentOrderCtx2.getImageData(0, 0, 2000, 2000).data)
    currentOrderCtx3 = await getCanvasFromUrl(cnc_url3, currentOrderCanvas3, 0, 0, true,)
    await new Promise(r => setTimeout(r, 1000));
    order3 = getRealWork(currentOrderCtx3.getImageData(0, 0, 2000, 2000).data)

    Toastify({
        text: 'Done getting template from github...',
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    Toastify({
        text: `New map loaded, ${order0.length} pixels in total`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    attemptPlace()
})()
