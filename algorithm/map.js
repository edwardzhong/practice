//使用邻接矩阵建立图
function Map(type, vertexNum, edges) {
	this.vertexNum = vertexNum;
	this.vertexs = [];
	this.edges = [];
	this.type = 0; //0无向，1有向
	this.edgeList = [];
	var temp = [],
		start = 0,
		end = 0,
		weight = 0;
	for (var i = 0; i < this.vertexNum; i++) {
		this.vertexs.push(i);
		temp = [];
		for (var j = 0; j < this.vertexNum; j++) temp.push(0);
		this.edges.push(temp);
	}

	for (var i = 0, len = edges.length; i < len; i++) {
		start = edges[i].start;
		end = edges[i].end;
		weight = edges[i].weight;
		this.edges[start][end] = weight;
		if (!type) this.edges[end][start] = weight; //无向图
	}
	//优先队列
	for (var i = 0; i < vertexNum; i++) {
		for (var j = i; j < vertexNum; j++) {
			if (this.edges[i][j]) {
				this.edgeList.push({
					start: i,
					end: j,
					weight: this.edges[i][j],
				});
			}
		}
	}
}

Map.prototype = {
	bTravel: function (callback) {
		//广度优先遍历
		var edges = this.edges,
			isTrav = [],
			nexts = [],
			temp = null;
		for (var i = 0; i < this.vertexNum; i++) isTrav.push(false);
		for (var i = 0; i < this.vertexNum; i++) {
			nexts = [];
			if (!isTrav[i]) {
				isTrav[i] = true;
				nexts.push(i);
				callback(i); //顶点
				while ((temp = nexts.shift()) != null) {
					for (var j = 0; j < this.vertexNum; j++) {
						if (!isTrav[j] && edges[(temp, j)]) {
							isTrav[j] = true;
							nexts.push(j);
							callback(j, edges[temp][j]);
						}
					}
				}
			}
		}
	},
	dTravel: function (callback) {
		//深度优先遍历
		var edges = this.edges,
			isTrav = [],
			vertexNum = this.vertexNum;
		for (var i = 0; i < vertexNum; i++) isTrav.push(false);
		for (var i = 0; i < vertexNum; i++) {
			if (!isTrav[i]) travel(i);
		}

		function travel(index, weight) {
			isTrav[index] = true;
			callback(index, weight);
			for (var j = 0; j < vertexNum; j++) {
				if (!isTrav[j] && edges[index][j]) travel(j, edges[index][j]);
			}
		}
	},
	prim: function () {
		//prim算法
		var edges = this.edges,
			num = this.vertexNum,
			paths = [],
			list = [],
			min,
			index = 0;
		// 初始化根节点
		for (var i = 0; i < num; i++) {
			list.push({
				prev: i == 0 ? -1 : 0,
				curr: i,
				weight: edges[0][i],
				visit: false,
			});
		}
		//根节点
		paths.push(list[0]);
		for (var i = 1; i < num; i++) {
			index = 1;
			min = 9999;
			//找出最小权值的路径
			for (var j = 1; j < num; j++) {
				if (!list[j].visit && list[j].weight > 0 && list[j].weight < min) {
					min = list[j].weight;
					index = j;
				}
			}

			list[index].visit = true;
			//当前最小的节点
			paths.push(list[index]);
			//从最新节点出发
			for (var j = 1; j < num; j++) {
				// 如果比上一节点的边短或上一节点没连接，则替换上一节点
				if (!list[j].visit && edges[index][j] > 0 && (edges[index][j] < list[j].weight || list[j].weight == 0)) {
					list[j] = {
						prev: index,
						curr: j,
						weight: edges[index][j],
						visit: false,
					};
				}
			}
		}
		return paths;
	},
	dijkstra: function (vertex) {
		//Dijkstra算法
		var edges = this.edges,
			num = this.vertexNum,
			paths = [],
			list = [],
			min,
			index = 0;
		// 初始化根节点
		var vertexItem = {
			prevList: [],
			prev: -1,
			curr: vertex,
			currWeight: 0,
			weight: 0,
			visit: true,
		};
		for (var i = 0; i < num; i++) {
			if (i == vertex) {
				list.push(vertexItem);
				continue;
			}
			list.push({
				prevList: [vertexItem],
				prev: vertex,
				curr: i,
				currWeight: edges[vertex][i],
				weight: edges[vertex][i],
				visit: false,
			});
		}

		for (var i = 0; i < num - 1; i++) {
			index = 0;
			min = 9999;
			for (var j = 0; j < num; j++) {
				if (j == vertex) continue;
				if (!list[j].visit && list[j].weight > 0 && list[j].weight < min) {
					min = list[j].weight;
					index = j;
				}
			}

			list[index].visit = true;
			paths.push(list[index]);

			for (var j = 0; j < num; j++) {
				if (j == vertex) continue;
				if (
					!list[j].visit &&
					edges[index][j] > 0 &&
					(list[j].weight == 0 || list[index].weight + edges[index][j] < list[j].weight)
				) {
					var prevList = list[j].prevList;
					list[j] = {
						prevList: prevList,
						prev: index,
						curr: j,
						currWeight: edges[index][j],
						weight: list[index].weight + edges[index][j],
						visit: false,
					};
				}
			}
		}
		paths.unshift(vertexItem);
		paths.forEach(function (item, index) {
			if (item.curr == vertex || item.prev == vertex) return true;
			var prevList = [],
				temp = item;
			while (temp.curr != vertex) {
				temp = getPrev(temp.prev);
				prevList.unshift(temp);
			}
			item.prevList = prevList;
		});

		paths.forEach(function (item, index) {
			console.log(item);
		});
		function getPrev(index) {
			for (var i = 0; i < paths.length; i++) {
				if (paths[i].curr == index) {
					return paths[i];
				}
			}

			return null;
		}

		return paths;
	},
	kruskal: function () {},
};

var map = new Map(0, 5, [
	{ start: 0, end: 1, weight: 1 },
	{ start: 0, end: 2, weight: 3 },
	{ start: 0, end: 4, weight: 2 },
	{ start: 1, end: 3, weight: 5 },
	{ start: 2, end: 4, weight: 4 },
	{ start: 3, end: 4, weight: 1 },
]);
map.bTravel(function (i, weight) {
	var w = weight ? ':' + weight + '-->' : '-->';
	console.log(i + w);
});

map.dijkstra(1);
