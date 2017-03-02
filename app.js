import Rx from 'rx';

import LoggerFactory from './logger';
const logger = LoggerFactory.getLogger('app');
import Sketcher from './Sketcher';
import SocketManager from './SocketManager';

logger.info('app loaded');

function main() {
    logger.info('window loaded');

    // let socketManager = new SocketManager('localhost:9050/demo/name');
    // socketManager.init();

    let sketcher = new Sketcher(window, document, document.getElementById('sketchpad'), (posX, posY) => {
        logger.debug(posX, posY);
        // if(socketManager.isOpen()) {
        //     socketManager.sendMsg({
        //         x: posX, y: posY
        //     });
        // }
        fetch('https://ethoca-stream-epistemic-spina.cfapps.io/event', {
            method: 'POST',
            body: {
                x: posX, y: posY
            }
        }).then((resp) => {
           logger.debug(resp);
        });
    });
    sketcher.init();


    let el = document.getElementById('sketchpadapp');
    let clearButton = document.getElementById('clearbutton');
    clearButton.addEventListener('click', () => {
        logger.debug('clear!');
        sketcher.clearCanvas();
    }, false);
    logger.debug(el);

}

window.onload = main;