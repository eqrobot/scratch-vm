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
		const speech = Cast.toString(args.SPEECH);
		console.log(`speechRecognition: ${speech}`);
		//spe

		navigator.mediaDevices.getUserMedia({
		    audio: {
		    	
		    },
		    video: false,
		}).then(stream => {

		}, err => {
			console.log(err);
		});
	}

	speechResult(args, util) {
		console.log(`speechResult`);
		//return speechResultStr;
		// TODO must return string
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

		    self.videoStream = stream;
		    self.video.src = window.URL.createObjectURL(stream);
		    self.video.play();

		    setTimeout(() => {
		    	self.canvas.getContext('2d').drawImage(self.video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
		    	var data = self.canvas.toDataURL("image/png");

		    	self.closeStream(self.videoStream);
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

	// data: base64
	// eg. : //MoxAALoEH4AU8AANKcb4R8DOCrEzR5fAc4SMl7uA81g/BD/gmH+H//9QIO8u//qBCCDsuf9YP//8EFsfMsIh9gGGCahkQI//MoxAwQElKUAZuYAGZsYnY/7d7Q4BK85cZMD+cpJ/45hdPr/84eUin/+3///tp///2QMET1Mz////ekaWzn//pVq/zVWUuy//MoxAYOofaoAdsQAI8gG/Gt0HBM7Z7jnHBoGFhp/pd3//4wJ/l/0/yf///7/7f2f8xW02V3/UO/FX2QA7KI4Ial3389bqR8//MoxAYN+Hq4ANZmSMFFO4NsUVtY63mMCgBjDbysefkcTBcQ/+t////emsHQ2CDgCCB8uD4GHnyHx4smqwdQi8PF/pB/QM+A//MoxAkPYb7IypNElDTEAzZs6XRNQmgL4IQMA2qkdNC+bp////////9mau6Mc5zlMU4gKpDODYcbcUIGlAwP//6ay1vP8KG9//MoxAYOsSq0AMLEcKshRSBwgm18yYEkCEHJZTI5fplIijsfuj/+/kb87oogi01EwEBaINC+oKnfhBDFFtn///+m9CTKtTHA//MoxAYN0Uq0ADDMcKAAEHIyTPJl8lOzqy87FcuSOf//cU2pJzPKpUa0TQYk5E2Pry8kdddT2af9+v9v/Trq8opDbDs5UfSQ//MoxAkM2Q60AAiMcIz+jl3/x71LofX/etnRdmyOdYOnR0nhUPQwfUKtUr///QpK3kn+3uTf8vX5AseBAcgo85ufFeZjIT/1//MoxBALeQa8ACjScPdSu4XPIfwjUXrpGzttKrESATLUEyNBUiL1///8Liqqqx9RiDoHebItegY5GvHYITUdJgw9IitIUBg+//MoxB0L8OrliGmScUCthuOkZO2gmntElTSMIFFUL870CABItRJwwBJMQQMtFWGIjiIcePECaBsNlg2Ai4QGjQ8o8/E8qgJQ//MoxCgM2P7gADmScFGRTg3qqzSqfIi1NRdZbI27gMAB6DJ0qNAqJPfQLW+mEczuutiCYTgw6hjmexrY60iFQzwqgRAd2OVo//MoxC8NMPMuXjmGcv///1Lcaa5ZI006AKAB/GHa8AEEClAKAMBV+OlgId9h454ETI0dtPLPnbjiJGs9V1ybJiZ/////55CF//MoxDUNIPsOXjDMckU5KJUAEgA/K3lEkylBLAxvarecvm+i/P8zwCRv0l622NzmkRoaI3FRh7/////7gL/62KU7uZ7QBaAP//MoxDsM4MrmPjGMcvsJNwiaskxtjgqVl47AiGBpn/vibgMupx2+lB8QNG3//////rAgLhF+1dLD6kJ7QBaAPKGqCq4kM6s4//MoxEINAM7dnjDMcsBTI5KsFQRa8p4qS4AR4SUBWPFTISS1//////8UAoiJBVH0MGJVEIRFHoByJISKEQyHi6Bt25uNIToq//MoxEkM0KqVXhjMTJeKZSFQpGoTR4JZwvWMXppVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVMQU1FMy45OS41VVVVVVVVVVVV//MoxFAJUJlAwDJYTVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MoxGUAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MoxKAAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//MoxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
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
}

module.exports = Scratch3AiBlocks;