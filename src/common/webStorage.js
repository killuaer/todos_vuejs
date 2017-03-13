function WebStorage(saveKey){

	this.fetch =  function(){
		var data = JSON.parse(localStorage.getItem(saveKey) || '[]');
		return data;
	};

	this.save = function(data){
		localStorage.setItem(saveKey,JSON.stringify(data));
	};
}

export default function(saveKey){
	return new WebStorage(saveKey);
}