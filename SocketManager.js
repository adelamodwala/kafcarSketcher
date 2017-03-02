import Q from 'q';

import LoggerFactory from './logger';
const logger = LoggerFactory.getLogger('SocketManager');

class SocketManager {
    constructor(addr) {
        this.ws = null;
        this.addr = addr;
        this.open = false;

        // Set up heartbeat stuff
        this.heartbeatMsg = '--heartbeat--';
        this.heartbeatInterval = null;
        this.missedHeartbeats = 0;
    }

    init() {
        this.ws = new WebSocket(`ws://${this.addr}`);
        this.ws.onopen = this.onOpen.bind(this);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onclose = this.onClose.bind(this);

        return Q.when(this.open);
    }

    destroy() {
        logger.info("calling destroy()");
        this.ws.close();
        this.open = false;
    }

    isOpen() {
        return this.open;
    }

    sendMsg(data) {
        this.ws.send(JSON.stringify({
            data
        }));
    }

    onOpen() {
        logger.info("calling onOpen()");
        this.sendMsg("Init message");
        this.open = true;

        if (this.heartbeatInterval === null) {
            this.missedHeartbeats = 0;
            this.heartbeatInterval = setInterval(() => {
                try {
                    this.missedHeartbeats += 1;
                    if(this.missedHeartbeats > 4) {
                        throw new Error('Too many missed heartbeats');
                    }
                    this.sendMsg(this.heartbeatMsg);
                }
                catch (ex) {
                    clearInterval(this.heartbeatInterval);
                    this.heartbeatInterval = null;
                    logger.warn('Closing connection. Reason: ' + ex.message);
                    this.destroy();
                }
            }, 5000);
        }
    }

    onMessage(evt) {
        logger.info("calling onMessage()", evt);
    }

    onClose() {
        logger.info("calling onClose()");
    }
}

export default SocketManager;