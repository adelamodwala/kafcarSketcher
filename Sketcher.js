import LoggerFactory from './logger';
const logger = LoggerFactory.getLogger('Sketcher');

class Sketcher {
    constructor(windowApi, documentApi, canvasApi, onDraw) {
        this.windowApi = windowApi;
        this.documentApi = documentApi;
        this.canvasApi = canvasApi;

        // Variables for referencing the canvas and 2dcanvas context
        this.canvas = null;
        this.ctx = null;
        this.size = 3;
        this.mouseDown = 0;
        this.pointsDrawn = 0;

        // Variables to keep track of the mouse position and left-button status
        this.mouseX = null;
        this.mouseY = null;

        // Variables to keep track of the touch position
        this.touchX = null;
        this.touchY = null;

        // Callback functions
        this.onDraw = onDraw;
    }

    // Draws a dot at a specific position on the supplied canvas name
    // Parameters are: A canvas context, the x position, the y position, the size of the dot
    drawDot(x, y) {
        // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
        let color = [0, 0, 0];
        let alpha = 255;

        // Select a fill style
        this.ctx.fillStyle = `rgba(${color.join(',')},${alpha / 255})`;

        // Draw a filled circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();

        this.onDraw(x, this.canvasApi.height - y);
        this.pointsDrawn += 1;
    }

    // Clear the canvas context using the canvas width and height
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvasApi.width, this.canvasApi.height);
        logger.info("points drawn this time: " + this.pointsDrawn);
        this.pointsDrawn = 0;
    }

    // Keep track of the mouse button being pressed and draw a dot at current location
    sketchpad_mouseDown() {
        this.mouseDown = 1;
        this.drawDot(this.mouseX, this.mouseY);
    }

    // Keep track of the mouse button being released
    sketchpad_mouseUp() {
        this.mouseDown = 0;
    }

    // Keep track of the mouse position and draw a dot if mouse button is currently pressed
    sketchpad_mouseMove(e) {
        // Update the mouse co-ordinates when moved
        this.getMousePos(e);

        // Draw a dot if the mouse button is currently being pressed
        if (this.mouseDown == 1) {
            this.drawDot(this.mouseX, this.mouseY);
        }
    }



    // Get the current mouse position relative to the top-left of the canvas
    getMousePos(e) {
        let ev = e;
        if (!ev)
            ev = event;

        if (ev.offsetX) {
            this.mouseX = ev.offsetX;
            this.mouseY = ev.offsetY;
        } else if (ev.layerX) {
            this.mouseX = ev.layerX;
            this.mouseY = ev.layerY;
        }
    }

    // Draw something when a touch start is detected
    sketchpad_touchStart() {
        // Update the touch co-ordinates
        this.getTouchPos();

        this.drawDot(this.touchX, this.touchY);

        // Prevents an additional mousedown event being triggered
        event.preventDefault();
    }

    // Draw something and prevent the default scrolling when touch movement is detected
    sketchpad_touchMove(e) {
        // Update the touch co-ordinates
        this.getTouchPos(e);

        // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
        this.drawDot(this.touchX, this.touchY);

        // Prevent a scrolling action as a result of this touchmove triggering.
        event.preventDefault();
    }

    // Get the touch position relative to the top-left of the canvas
    // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
    // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
    // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
    getTouchPos(e) {
        let ev = e;
        if (!ev)
            ev = event;

        if (ev.touches) {
            if (ev.touches.length == 1) { // Only deal with one finger
                const touch = ev.touches[0]; // Get the information for finger #1
                this.touchX = touch.pageX - touch.target.offsetLeft;
                this.touchY = touch.pageY - touch.target.offsetTop;
            }
        }
    }

    // Set-up the canvas and add our event handlers after the page has loaded
    init() {
        // Get the specific canvas element from the HTML document
        this.canvas = this.documentApi.getElementById('sketchpad');

        // If the browser supports the canvas tag, get the 2d drawing context for this canvas
        if (this.canvas.getContext)
            this.ctx = this.canvas.getContext('2d');

        // Check that we have a valid context to draw on/with before adding event handlers
        if (this.ctx) {
            // React to mouse events on the canvas, and mouseup on the entire document
            this.canvas.addEventListener('mousedown', this.sketchpad_mouseDown.bind(this), false);
            this.canvas.addEventListener('mousemove', this.sketchpad_mouseMove.bind(this), false);
            this.windowApi.addEventListener('mouseup', this.sketchpad_mouseUp.bind(this), false);

            // React to touch events on the canvas
            this.canvas.addEventListener('touchstart', this.sketchpad_touchStart.bind(this), false);
            this.canvas.addEventListener('touchmove', this.sketchpad_touchMove.bind(this), false);
        }
    }
}

export default Sketcher;