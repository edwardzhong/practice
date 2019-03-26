function getElementsByClassName(name) {
	var objs = document.getElementsByTagName('*'),
		len = objs.length,
		i,
		arr = [];
	var regex = new RegExp("(?:^|\\s)" + name + "(?:\\s|$)");
	for (i = 0; i < len; i++) {
		if (regex.test(objs[i].className)) {
			arr.push(objs[i]);
		}
	}
	return arr;
}
function getStyle(obj, styleName) {
	if (obj.currentStyle) {
		return obj.currentStyle[styleName];
	} else {
		return getComputedStyle(obj, false)[styleName];
	}
}
function move(obj, json, fnCallack) {
	clearInterval(obj.timer);
	var cur = 0, speed = 0, isStop = true, attr;
	obj.timer = setInterval(function () {
		isStop = true;
		for (attr in json) {
			if (attr == 'opacity') {
				cur = Math.round(parseFloat(getStyle(obj, 'opacity'), 10) * 100);
			} else {
				cur = parseInt(getStyle(obj, attr), 10);
			}
			speed = (json[attr] - cur) / 3;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			if (cur != json[attr]) {
				isStop = false;
				if (attr == "opacity") {
					obj.style.filter = 'alpha(opacity:' + (cur + speed) + ')';
					obj.style.opacity = (cur + speed) / 100;
				} else {
					obj.style[attr] = (cur + speed) + 'px';
				}
			}
		}
		if (isStop) {
			clearInterval(obj.timer);
			if (fnCallack) { fnCallack(); }
		}
	}, 30);
}