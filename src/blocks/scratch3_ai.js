const Cast = require('../util/cast');
const axios = require('axios');

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
	}

	speechResult(args, util) {
		console.log(`speechResult`);
		//return speechResultStr;
		// TODO must return string
	}

	picRecognition(args, util) {
		const tag = Cast.toString(args.TAG);
		console.log(`picRecognition: ${tag}`);
		//pic
	}

	picResult(args, util) {
		console.log(`picResult`);
		//return picResultStr;
		// TODO must return string
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
}

module.exports = Scratch3AiBlocks;