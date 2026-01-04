class AudioStreamProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.bufferSize = 4096;
        this.buffer = new Float32Array(this.bufferSize);
        this.bufferIndex = 0;
        this.isActive = true;

        this.port.onmessage = (event) => {
            if (event.data.type === 'stop') {
                this.isActive = false;
            }
        };
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (!input || !input[0] || !this.isActive) {
            return true;
        }

        const inputChannel = input[0];

        for (let i = 0; i < inputChannel.length; i++) {
            this.buffer[this.bufferIndex++] = inputChannel[i];

            if (this.bufferIndex >= this.bufferSize) {
                // Send buffer to main thread
                this.port.postMessage({
                    type: 'audio',
                    data: this.buffer.slice(0, this.bufferIndex)
                });

                this.bufferIndex = 0;
            }
        }

        return true;
    }
}

registerProcessor('audio-stream-processor', AudioStreamProcessor);
