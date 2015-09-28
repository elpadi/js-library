function injectJS(src, cb) {
	var script = document.createElement('script');
	script.setAttribute('type','text/javascript');
	script.onreadystatechange = script.onload = function () {
		var readyState = script.readyState;
		if (!readyState || readyState == 'loaded' || readyState == 'complete' || readyState == 'uninitialized') {
			cb && cb();
			script.onload = script.onreadystatechange = script.onerror = null;
		}
	};
	script.src = src;
	document.body.appendChild(script);
}
