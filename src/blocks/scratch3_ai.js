const Cast = require('../util/cast');

class Scratch3AiBlocks {
	construct(runtime) {
		/**
		 * The runtime instantiating this block package.
		 * @type {Runtime}
		 */
		this.runtime = runtime;
	}



	getPrimitives() {
		return {
			ai_recognitionspeech: this.recognitionspeech,
			ai_listentome: this.listentome,
			ai_playAudio: this.playAudio,
			ai_addImge: this.addImge,
			ai_recoType: this.recoType
		};
	}
	uploadFile() {
		
	}
	recognitionspeech(args, util) {}

	listentome(args, util) {}

	playAudio() {
		console.log("播放 声音");
		function ajax(){ 
		  var ajaxData = { 
		    type:arguments[0].type || "GET", 
		    url:arguments[0].url || "", 
		    async:arguments[0].async || "true", 
		    data:arguments[0].data || null, 
		    dataType:arguments[0].dataType || "text", 
		    contentType:arguments[0].contentType || "application/x-www-form-urlencoded", 
		    beforeSend:arguments[0].beforeSend || function(){}, 
		    success:arguments[0].success || function(){}, 
		    error:arguments[0].error || function(){} 
		  } 
		  ajaxData.beforeSend() 
		  var xhr = createxmlHttpRequest();  
		  xhr.responseType=ajaxData.dataType; 
		  xhr.open(ajaxData.type,ajaxData.url,ajaxData.async);  
		  xhr.setRequestHeader("Content-Type",ajaxData.contentType);  
		  xhr.send(convertData(ajaxData.data));  
		  xhr.onreadystatechange = function() {  
		    if (xhr.readyState == 4) {  
		      if(xhr.status == 200){ 
		        ajaxData.success(xhr.response) 
		      }else{ 
		        ajaxData.error() 
		      }  
		    } 
		  }  
		} 
		  
		function createxmlHttpRequest() {  
		  if (window.ActiveXObject) {  
		    return new ActiveXObject("Microsoft.XMLHTTP");  
		  } else if (window.XMLHttpRequest) {  
		    return new XMLHttpRequest();  
		  }  
		} 
		  
		function convertData(data){ 
		  if( typeof data === 'object' ){ 
		    var convertResult = "" ;  
		    for(var c in data){  
		      convertResult+= c + "=" + data[c] + "&";  
		    }  
		    convertResult=convertResult.substring(0,convertResult.length-1) 
		    return convertResult; 
		  }else{ 
		    return data; 
		  } 
		}

		ajax({ 
		  type:"POST", 
		  url:"http://192.168.1.230/sign/Server/oldServer/signup.php", 
		  dataType:"json", 
		  data:{        
		    'username': 'liskysun',
		    'password': '666666',
		    'email': 'liskysun@qq.com'
		  }, 
		  beforeSend:function(){ 
		    //some js code 
		  }, 
		  success:function(msg){ 
		    console.log(msg) 
		    
		  }, 
		  error:function(){ 
		    console.log("error") 
		  } 
		})
	}

	addImge(args, util) {}

	recoType(args, util) {}

}

module.exports = Scratch3AiBlocks;