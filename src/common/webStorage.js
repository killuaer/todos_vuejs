// 数据持久化存储和读取

class WebStorage {
	constructor (saveKey = 'default') {
		this.saveKey = saveKey;
	}
	// 获取存储在浏览器中的数据，它是以JSON字符串形式保存的，若值不存在，那么返回[]，若存在则对JSON字符串进行解析
	fetch () {
		// JSON解析错误 则重置存储的数据
		try {
		     var data = JSON.parse(window.localStorage.getItem(this.saveKey) || '[]');
		} catch (e) {
			window.localStorage.setItem(this.saveKey, JSON.stringify('[]'));
			data = [];
		}
		return data;
	}
	// 获取saveKey，不存在则'default'赋值给saveKey，然后对需要保存的数据序列化成JSON字符串，并保存到浏览器中
	save (data) {
		window.localStorage.setItem(this.saveKey, JSON.stringify(data));
	}
}

export default (saveKey) => new WebStorage(saveKey);
