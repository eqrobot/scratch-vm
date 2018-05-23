const Cast = require('../util/cast');
const axios = require('axios');

const VIDEO_WIDTH = 400;
const VIDEO_HEIGHT = 300;

class Scratch3AiBlocks {
	construct(runtime) {
		this.runtime = runtime;
	}
	
	getPrimitives() {
		return {
			ai_playAudio: this.playAudio,
			ai_speechRecognition: this.speechRecognition,
			ai_speechResult: this.speechResult,
			ai_picRecognition: this.picRecognition,
			ai_picResult: this.picResult
		};
	}

	playAudio(args, util) {
		const text = Cast.toString(args.TEXT);
		var self = this;
		axios({
			url: 'http://server.kenrobot.com/baiduai/tts',
			method: "post", 
			data: {
				content: encodeURI(text),
			},
			responseType: 'json',
		}).then(response => {
			if(response.data.status === 0) {
				self.play(response.data.data);
			}
		}).catch(err => {
			console.log(err);
		});
	}

	speechRecognition(args, util) {
		const delay = Cast.toString(args.DELAY);
		console.log(`speechRecognition: ${delay}`);
		//spe

		var self = this;
		navigator.mediaDevices.getUserMedia({
		    audio: true,
		    video: false,
		}).then(stream => {
			var recorder = self.getRecorder(stream);
			recorder.start();
			setTimeout(() => {
				recorder.stop();
				var blob = recorder.getBlob();
				self.blobToDataURL(blob, data => {
					console.log(data);
					axios({
						url: 'http://server.kenrobot.com/baiduai/asrbase64',
						method: "post", 
						data: {
							content: data,
						},
						responseType: 'json',
					}).then(response => {
						if(response.data.status === 0) {
							var res = response.data.data;
							if(res.err_no === 0) {
								self.speechResultStr = res.result[0];
								console.log(`speechResult: ${self.speechResultStr}`);
							} else {
								self.speechResultStr = null;
							}
						} else {
							self.speechResultStr = null;
						}
					}).catch(err => {
						console.log(err);
					});
				});
			}, delay);
		}, err => {
			console.log(err);
		});
	}

	speechResult(args, util) {
		console.log(`speechResult: ${this.speechResultStr}`);
		return this.speechResultStr  || "识别失败";
	}

	picRecognition(args, util) {
		const tag = Cast.toString(args.TAG);
		console.log(`picRecognition: ${tag}`);
		const self = this;

		navigator.mediaDevices.getUserMedia({
		    audio: false,
		    video: {
		        width: VIDEO_WIDTH,
		        height: VIDEO_HEIGHT,
		    }
		}).then(stream => {
			self.toggleDom(true);

		    self.video.src = window.URL.createObjectURL(stream);
		    self.video.play();

		    setTimeout(() => {
		    	self.canvas.getContext('2d').drawImage(self.video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
		    	var data = self.canvas.toDataURL("image/png");

		    	self.closeStream(stream);
		    	self.video.src = null;
		    	self.toggleDom(false);

		    	axios({
		    		url: `http://server.kenrobot.com/baiduai/imageclassify/${tag}`,
		    		method: "post", 
		    		data: {
		    			content: data.slice(data.indexOf(",") + 1),
		    		},
		    		responseType: 'json',
		    	}).then(response => {
		    		if(response.data.status === 0) {
		    			var res = response.data.data;
		    			if(res.err_no === 0) {
		    				self.picResultStr = res.result[0].name;
		    				console.log(`picResult: ${self.picResultStr}`);
		    			} else {
		    				self.picResultStr = null;
		    			}
		    		} else {
		    			self.picResultStr = null;
		    		}
		    	}).catch(err => {
		    		self.picResultStr = null;
		    		console.log(err);
		    	});
		    }, 5000);
		}, err => {
			console.log(err);
		});
	}

	picResult(args, util) {
		return this.picResultStr || "识别失败";
	}

	initDom() {
		if(this.dom) {
			return;
		}

		this.dom = document.createElement("div");
		this.dom.style.position = "absolute";
		this.dom.style.width = `${VIDEO_WIDTH}px`;
		this.dom.style.height = `${VIDEO_HEIGHT}px`;
		this.dom.style.background = "#ccc";
		this.dom.style.top = "0";
		this.dom.style.left = "0";
		this.dom.style.bottom = "0";
		this.dom.style.right = "0";
		this.dom.style.margin = "auto";
		this.dom.style.zIndex = 99;
		document.body.appendChild(this.dom);

		this.video = document.createElement("video");
		this.video.width = VIDEO_WIDTH;
		this.video.height = VIDEO_HEIGHT;
		this.dom.appendChild(this.video);

		this.canvas = document.createElement("canvas");
	}

	toggleDom(visiable) {
		this.initDom();

		this.dom.style.display = visiable ? "block" : "none";
	}

	play(data) {
		var self = this;

		if(!this.audioContext) {
			this.audioContext = new AudioContext();
		}

		if(this.audioSource) {
			this.audioSource.stop(0);
		}

		this.audioContext.decodeAudioData(this.base64ToBuffer(data), buffer => {
			self.audioSource = self.audioContext.createBufferSource();
			self.audioSource.buffer = buffer;
			self.audioSource.loop = false;
			self.audioSource.connect(self.audioContext.destination);
			self.audioSource.start(0);
		});
	}

	base64ToBuffer(base64) {
	    var binary = window.atob(base64);
	    var buffer = new ArrayBuffer(binary.length);
	    var bytes = new Uint8Array(buffer);
	    for (var i = 0; i < buffer.byteLength; i++) {
	        bytes[i] = binary.charCodeAt(i) & 0xFF;
	    }

	    return buffer;
	}

	closeStream(stream) {
        if (typeof stream.stop === 'function') {
            stream.stop();
            return;
        }

        let tracks = [].concat(stream.getAudioTracks() || []).concat(stream.getVideoTracks() || []);
        tracks.forEach(track => track.stop());
    }

    getRecorder(stream) {
    	var self = this;
    	var context = new AudioContext();
    	var audioInput = context.createMediaStreamSource(stream);
    	audioInput.connect(context.createGain());
    	var recorder = context.createScriptProcessor(4096, 1, 1);

    	var audioData = {
    	    size: 0, //录音文件长度  
    	    buffer: [], //录音缓存  
    	    inputSampleRate: context.sampleRate, //输入采样率  
    	    inputSampleBits: 16, //输入采样数位 8, 16  
    	    outputSampleRate: 16000, //输出采样率  
    	    oututSampleBits: 16, //输出采样数位 8, 16

    	    input: function (data) {
    	        this.buffer.push(new Float32Array(data));
    	        this.size += data.length;
    	    },

    	    compress: function () { //合并压缩  
    	        //合并  
    	        var data = new Float32Array(this.size);
    	        var offset = 0;
    	        for (var i = 0; i < this.buffer.length; i++) {
    	            data.set(this.buffer[i], offset);
    	            offset += this.buffer[i].length;
    	        }
    	        //压缩  
    	        var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
    	        var length = data.length / compression;
    	        var result = new Float32Array(length);
    	        var index = 0,
    	            j = 0;
    	        while (index < length) {
    	            result[index] = data[j];
    	            j += compression;
    	            index++;
    	        }
    	        return result;
    	    },

    	    encodeWAV: function () {
    	        var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
    	        var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
    	        var bytes = this.compress();
    	        var dataLength = bytes.length * (sampleBits / 8);
    	        var buffer = new ArrayBuffer(44 + dataLength);
    	        var data = new DataView(buffer);

    	        var channelCount = 1; //单声道  
    	        var offset = 0;

    	        var writeString = function (str) {
    	            for (var i = 0; i < str.length; i++) {
    	                data.setUint8(offset + i, str.charCodeAt(i));
    	            }
    	        };

    	        // 资源交换文件标识符   
    	        writeString('RIFF');
    	        offset += 4;
    	        // 下个地址开始到文件尾总字节数,即文件大小-8   
    	        data.setUint32(offset, 36 + dataLength, true);
    	        offset += 4;
    	        // WAV文件标志  
    	        writeString('WAVE');
    	        offset += 4;
    	        // 波形格式标志   
    	        writeString('fmt ');
    	        offset += 4;
    	        // 过滤字节,一般为 0x10 = 16   
    	        data.setUint32(offset, 16, true);
    	        offset += 4;
    	        // 格式类别 (PCM形式采样数据)   
    	        data.setUint16(offset, 1, true);
    	        offset += 2;
    	        // 通道数   
    	        data.setUint16(offset, channelCount, true);
    	        offset += 2;
    	        // 采样率,每秒样本数,表示每个通道的播放速度   
    	        data.setUint32(offset, sampleRate, true);
    	        offset += 4;
    	        // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8   
    	        data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
    	        offset += 4;
    	        // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8   
    	        data.setUint16(offset, channelCount * (sampleBits / 8), true);
    	        offset += 2;
    	        // 每样本数据位数   
    	        data.setUint16(offset, sampleBits, true);
    	        offset += 2;
    	        // 数据标识符   
    	        writeString('data');
    	        offset += 4;
    	        // 采样数据总数,即数据总大小-44   
    	        data.setUint32(offset, dataLength, true);
    	        offset += 4;
    	        // 写入采样数据   
    	        if (sampleBits === 8) {
    	            for (var i = 0; i < bytes.length; i++, offset++) {
    	                var s = Math.max(-1, Math.min(1, bytes[i]));
    	                var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
    	                val = parseInt(255 / (65535 / (val + 32768)));
    	                data.setInt8(offset, val, true);
    	            }
    	        } else {
    	            for (var i = 0; i < bytes.length; i++, offset += 2) {
    	                var s = Math.max(-1, Math.min(1, bytes[i]));
    	                data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    	            }
    	        }

    	        return new Blob([data], {
    	            type: 'audio/wav'
    	        });
    	    }
    	};

    	//音频采集  
    	recorder.onaudioprocess = e => audioData.input(e.inputBuffer.getChannelData(0));

    	//开始录音  
    	var start = function () {
    	    audioInput.connect(recorder);
    	    recorder.connect(context.destination);
    	};

    	//停止  
    	var stop = function () {
    	    recorder.disconnect();
    	    self.closeStream(stream);
    	};

    	//获取音频文件  
    	var getBlob = function () {
    	    this.stop();
    	    return audioData.encodeWAV();
    	};

    	return {
    		start: start,
    		stop: stop,
    		getBlob: getBlob,
    	};
    }

    blobToDataURL(blob, callback) {
        var reader = new FileReader();
        reader.onload = e => callback(e.target.result);
        reader.readAsDataURL(blob);
    }
}

module.exports = Scratch3AiBlocks;