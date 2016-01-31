;(function(window){
	var slice=Array.prototype.slice,
		nativeForEach=Array.prototype.forEach;

	function each(obj,callback,context){
		if(obj==null){return;}
		if(nativeForEach&&nativeForEach==obj.forEach){
			obj.forEach(callback,context);
		}else{
			for(var i=0,l=obj.length;i<l;i++){
				callback.call(context,obj[i],i);
			}
		}
	}
	function bind(event,fn){
		var events=this.events=this.events||{},
			parts=event.split(/\s+/),
			part;
		// if (events[event] && events[event].length) {return this;}
		each(parts,function(part,index){
			events[part]=events[part]||[];
			events[part].push(fn);
		});
		return this;
	}
	function unbind(event,fn){
		var events=this.events,
			parts,eventName;
		if(!events){return;}
		parts=event.split(/\s+/);
		each(parts,function(eventName,index){
			if(eventName in events){
				events[eventName].splice(events[eventName].indexOf(fn),1);
				if(!events[eventName].length){//如果该事件对应处理函数已经清空,则删除该事件
					delete events[eventName];
				}
			}
		});
		return this;
	}

	function one(event,fn){
		bind.call(this,event,function fnc(){
			fn.apply(this,slice.call(arguments));
			unbind.call(this,event,fnc);
		});
		return this;
	}

	function trigger(event){
		var events=this.events,
		i,args,ret;
		if(!events||event in events===false){return;}
		args=slice.call(arguments,1);
		for(i=events[event].length-1;i>=0;i--){
			ret=events[event][i].apply(this,args);
		}
		return ret;
	}

/*	window.aObserver=new function(){
		this.add = bind;
		this.remove = unbind;
		this.fire = trigger;
		this.one = one;
		return this;
	};*/
	window.aObserver={
		add:bind,
		remove:unbind,
		fire:trigger,
		one:one
	};
}(window));