// 数据持久化存储和读取
function WebStorage(saveKey){
	// 获取存储在浏览器中的数据，它是以JSON字符串形式保存的，若值不存在，那么返回[]，若存在则对JSON字符串进行解析
	this.fetch =  function(){
		// JSON解析错误 则重置存储的数据
		try{
		     var data = JSON.parse(localStorage.getItem(saveKey) || '[]');
		}catch(e){
			localStorage.setItem(saveKey,JSON.stringify('[]'));
			data=[];
		}
		return data;
	};
	// 获取saveKey，不存在则'default'赋值给saveKey，然后对需要保存的数据序列化成JSON字符串，并保存到浏览器中
	this.save = function(data){
		if(!saveKey) saveKey = 'default';
		localStorage.setItem(saveKey,JSON.stringify(data));
	};
}

export default function(saveKey){
	return new WebStorage(saveKey);
}