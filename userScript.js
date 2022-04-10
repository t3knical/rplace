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
// @require	     https://cdn.jsdelivr.net/npm/toastify-js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/t3knical/rplace/main/userScript.js
// @downloadURL  https://raw.githubusercontent.com/t3knical/rplace/main/userScript.js
// ==/UserScript==

// ==/UserScript==
const DEFAULT_TOAST_DURATION_MS = 10000;

var socket1
var order = undefined
var accessToken
var currentOrderCanvas = document.createElement('canvas')
var currentOrderCtx = currentOrderCanvas.getContext('2d')
var currentPlaceCanvas = document.createElement('canvas')
var cnc_url = 'https://raw.githubusercontent.com/t3knical/rplace/main/test.png'

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
    if (order == undefined) {
        setTimeout(attemptPlace, 10000) // probeer opnieuw in 2sec.
        return
    }
    var ctx1
    try {
        ctx1 = await c

    } catch (e) {
        console.warn('Error retrieving map: ', e)
        Toastify({
            text: 'Error retrieving map. Try again in 10 sec...',
            duration: DEFAULT_TOAST_DURATION_MS,
        }).showToast()
        setTimeout(attemptPlace, 10000) // Try again in 10sec.
        return
    }

    const rgbaOrder = currentOrderCtx.getImageData(0, 0, 2000, 2000).data
    const rgbaCanvas = ctx1.getImageData(0, 0, 2000, 2000).data
    const work = getPendingWork(order, rgbaOrder, rgbaCanvas)

    if (work.length === 0) {
        Toastify({
            text: `All pixels are already in the right place! Try again in 30 sec...`,
            duration: 30000,
        }).showToast()
        setTimeout(attemptPlace, 30000) // Try again in 30sec.
        return
    }

    const percentComplete = 100 - Math.ceil((work.length * 100) / order.length)
    const workRemaining = work.length
    const idx = Math.floor(Math.random() * work.length)
    const i = work[idx]
    const x = i % 2000
    const y = Math.floor(i / 2000)
    const hex = rgbaOrderToHex(i, rgbaOrder)

    Toastify({
        text: `Trying to place pixel ${x}, ${y}, color ${hex},${COLOR_MAPPINGS[hex]}... (${percentComplete}% complete, ${workRemaining} left)`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    console.log(
        `Trying to place pixel ${x}, ${y}, color ${hex},${COLOR_MAPPINGS[hex]}... (${percentComplete}% complete, ${workRemaining} left)`,
    )

    // USED FOR MY LOCALHOST PROJECT
    //ctx.fillStyle = hex;
    //ctx.fillRect(Math.floor(x), Math.floor(y), pixelSize, pixelSize);
    //socket.emit('load image', convertCanvasToImage(canvas).src);

    set(Math.floor(x), Math.floor(y), COLOR_MAPPINGS[hex])

    PEN = COLOR_MAPPINGS[hex]
    set(Math.floor(x), Math.floor(y), PEN)
    let a = new DataView(new Uint8Array(6).buffer)
    a.setUint8(0, 4)
    a.setUint32(1, Math.floor(x) + Math.floor(y) * WIDTH)
    a.setUint8(5, PEN)
    PEN = -1
    ws.send(a)

    //USED FOR
    //sendColorUpdate(x, y, COLOR_MAPPINGS[hex]);

    //const res = await place(x, y, COLOR_MAPPINGS[hex])
    //const data = await res.json()

    setTimeout(attemptPlace, 10000);

};

let rgbaOrderToHex = (i, rgbaOrder) => rgbToHex(rgbaOrder[i * 4], rgbaOrder[i * 4 + 1], rgbaOrder[i * 4 + 2]);

function getCanvasFromUrl(url, canvas1, x = 0, y = 0, clearCanvas = false) {
    return new Promise((resolve, reject) => {
        let loadImage = (ctx1) => {
            var img = new Image()
            img.crossOrigin = 'anonymous'
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



    //putColor(0, 0, 0);
    //sendColorUpdate(0, 0, 0);

    Toastify({
        text: 'Done trying to place a pixel at 0,0...',
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    console.log("userScript - canvas: %O", theCanvas);
    console.log("userScript - ctx: %O", theCTX);

    console.log("userScript - Window load has happened...");

    //attemptPlace();
});

const COLOR_MAPPINGS = {
    //"#fff": 0,      // white
	//"#eee": 1,      // light gray
	//"#888": 2,      // gray
	//"#222": 3,      // black
	//"#fad": 4,      // pink
	//"#e00": 5,      // red
	//"#e90": 6,      // orange
	//"#a64": 7,      // brown
	//"#ed0": 8,      // yellow
	//"#9e4": 9,      // green
	//"#0b0": 10,     // also green
	//"#0dd": 11,     // lightest blue
	//"#08c": 12,     // light blue
	//"#00e": 13,     // blue
	//"#c6e": 14,     // lilac
	//"#808": 15,     // purple
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
    currentOrderCanvas.width = 2000
    currentOrderCanvas.height = 2000
    currentOrderCanvas.style.display = 'none'
    currentOrderCanvas = document.body.appendChild(currentOrderCanvas)
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

    currentOrderCanvas = document.createElement('CANVAS');
    currentOrderCtx = currentOrderCanvas.getContext('2d');
    currentPlaceCanvas = document.createElement('CANVAS');

    GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));
    currentOrderCanvas.width = 2000;
    currentOrderCanvas.height = 2000;
    currentOrderCanvas.style.display = 'none';
    currentOrderCanvas = document.body.appendChild(currentOrderCanvas);
    currentPlaceCanvas.width = 2000;
    currentPlaceCanvas.height = 2000;
    currentPlaceCanvas.style.display = 'none';
    currentPlaceCanvas = document.body.appendChild(currentPlaceCanvas);

    Toastify({
        text: 'Done getting the canvas and context...',
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    Toastify({
        text: `Getting template from github...`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    currentOrderCtx = await getCanvasFromUrl(cnc_url, currentOrderCanvas, 0, 0, true,)
    order = getRealWork(currentOrderCtx.getImageData(0, 0, 2000, 2000).data)

    Toastify({
        text: 'Done getting template from github...',
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    Toastify({
        text: `New map loaded, ${order.length} pixels in total`,
        duration: DEFAULT_TOAST_DURATION_MS,
    }).showToast()

    attemptPlace()
})()
