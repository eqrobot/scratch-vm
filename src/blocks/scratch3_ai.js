const Cast = require('../util/cast');

class Scratch3AiBlocks {
	construct(runtime) {
		this.runtime = runtime;
		this.speechResultStr = '';
		this.picResultStr = '';
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

	uploadFile() {
		
	}

	speechRecognition(args, util) {
		const AISPE = Cast.toString(args.AISPE);
		console.log(AISPE);
		console.log("语音识别");
	}

	picRecognition(args, util) {
		const AIPIC = Cast.toString(args.AIPIC);
		console.log(AIPIC);
		console.log("图像识别");
	}

	playAudio(args, util) {
		const AIAUDIO = Cast.toString(args.AIAUDIO);
		console.log(AIAUDIO);
		console.log("播放声音");
		lzy('lzy','tts',[AIAUDIO]);
	}

	speechResult(args, util) {
		console.log("语音识别结果");
		return this.speechResultStr;
	}

	picResult(args, util) {
		console.log("图像识别结果");
		return this.picResultStr;
	}

}

module.exports = Scratch3AiBlocks;