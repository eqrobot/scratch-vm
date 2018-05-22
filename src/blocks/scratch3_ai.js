const Cast = require('../util/cast');

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
		console.log(`playAudio: ${text}`);
	}

	speechRecognition(args, util) {
		const speech = Cast.toString(args.SPEECH);
		console.log(`speechRecognition: ${speech}`);
	}

	speechResult(args, util) {
		console.log(`speechResult`);
		//return speechResultStr;
		// TODO must return string
	}

	picRecognition(args, util) {
		const tag = Cast.toString(args.TAG);
		console.log(`picRecognition: ${tag}`);
	}

	picResult(args, util) {
		console.log(`picResult`);
		//return picResultStr;
		// TODO must return string
	}
}

module.exports = Scratch3AiBlocks;