var arr = [10, 2, 7, 11, 24, 6, 56, 8, 4, 33, 5, 3, 1, 17];

function swap(i, j) {
	const t = arr[i];
	arr[i] = arr[j];
	arr[j] = t;
}

/**
 * 冒泡排序
 * 从最小开始冒
 */
function bubbleSort() {
	const l = arr.length;
	let isSort = true; //是否已经排好序

	for (let i = 0; i < l - 1; i++) {
		isSort = true;
		for (let j = i + 1; j < l; j++) {
			if (arr[i] > arr[j]) {
				isSort = false;
				swap(i, j);
			}
		}
		if (isSort) break;
	}
}

/**
 * 选择排序
 * 每次选出最小的下标，然后再与当前左边的项进行交换
 */
function selectSort() {
	let m = 0;
	const l = arr.length;

	for (let i = 0; i < l - 1; i++) {
		m = i;
		for (let j = i + 1; j < l; j++) {
			if (arr[m] > arr[j]) {
				m = j; //找出值最小项的索引
			}
		}
		if (m != i) swap(m, i);
	}
}

/**
 * 插入排序
 * 将无序数列的第一项与有序数列的项从后往前逐个比较，找到插入位置
 */
function insertSort() {
	const l = arr.length;

	for (let i = 1; i < l; i++) {
		for (let j = i; arr[j] < arr[j - 1] && j > 0; j--) {
			swap(j, j - 1);
		}
	}
}

/**
 * 希尔排序，直接插入排序的改进，又称为缩小增量排序
 * 先将序列分成几个子序列，分别进行插入排序，最后合并
 */
function shellSort() {
	const l = arr.length;
	let d = 1;

	while (Math.floor(l / d) > 0) d = d * 3 + 1;
	while (d) {
		for (let i = d; i < l; i++) {
			for (let j = i; j >= d && arr[j] < arr[j - d]; j -= d) {
				swap(j, j - d);
			}
		}
		d = Math.floor(d / 3);
	}
}

//归并排序
function mergeSort(low, high) {
	if (low >= high) return;
	const mid = low + Math.floor((high - low) / 2);

	mergeSort(low, mid);
	mergeSort(mid + 1, high);
	merge(low, mid, high);
}

function merge(low, mid, high) {
	let i = low,
		j = mid + 1,
		l = 0,
		r = 0;
	const lArr = arr.slice(i, j),
		rArr = arr.slice(j, high + 1);

	for (; i <= high; i++) {
		if (l == j - low) arr[i] = rArr[r++]; //左半部分已空
		else if (r == high - mid) arr[i] = lArr[l++]; //右半部分已空
		else if (lArr[l] > rArr[r]) arr[i] = rArr[r++];
		else arr[i] = lArr[l++];
	}
}

/**
 * 快速排序
 * @param  {[type]} low  [description]
 * @param  {[type]} high [description]
 */
function quickSort(low, high) {
	if (low >= high) return;
	let i = low,
		k = low + 1,
		j = high,
		key = arr[low];

	while (k <= j) {
		if (arr[k] < key) swap(k++, i++); //小于切分，与切分元素交换后，左边届和游标向右推进
		else if (arr[k] > key) swap(k, j--); //大于切分，与右侧元素交换后，右边界往左推进
		else k++; // 等于切分，游标直接向右推进
	}
	quickSort(low, i - 1);
	quickSort(j + 1, high);
}

// 上浮
function swim(k) {
	while (k > 0 && arr[Math.floor(k / 2)] < arr[k]) {
		swap(k, Math.floor(k / 2));
		k = Math.floor(k / 2);
	}
}

// 下沉
function sink(k, l) {
	while (k * 2 + 1 <= l) {
		let i = k * 2 + 1;
		if (i < l && arr[i] < arr[i + 1]) i++;
		if (arr[k] >= arr[i]) break;
		swap(k, i);
		k = i;
	}
}

/*
 * 堆排序
 * 构建二叉堆只需对前半部分的节点进行 sink 操作，因为二叉堆后半部分是最后一层子节点
 */
function pileSort() {
	let N = arr.length - 1;
	for ( let i = Math.floor(N / 2); i >= 0; i--) //构建二叉堆
		sink(i, N);
	while (N) {
		// 下沉排序，将堆中最大的元素删除后，放入堆缩小后数组空出来的位置
		swap(0, N--);
		sink(0, N);
	}
}

/**
 * 奇偶排序 多线程有优势
 */
function oddEvenSort() {
	const len = arr.length;
	let isSort = false;
	while (!isSort) {
		isSort = true;
		for (let i = 0; i < len; i += 2) {
			if (i + 1 < len && arr[i] > arr[i + 1]) {
				isSort = false;
				swap(i, i + 1);
			}
		}

		for (let i = 1; i < len; i += 2) {
			if (i + 1 < len && arr[i] > arr[i + 1]) {
				isSort = false;
				swap(i, i + 1);
			}
		}
	}
}

/**
 * 鸡尾酒排序 头尾分别进行冒泡排序
 */
function cockTailSort() {
	const len = arr.length;
	let isSort = false;

	for (let i = 1; i < Math.floor(len / 2); i++) {
		isSort = true;
		for (let j = i - 1; j < len; j++) {
			if (j + 1 < len && arr[j] > arr[j + 1]) {
				isSort = false;
				swap(j, j + 1);
			}
		}
		for (let j = len - i - 1; j >= i; j--) {
			if (j > 0 && arr[j - 1] > arr[j]) {
				isSort = false;
				swap(j - 1, j);
			}
		}
		if (isSort) {
			break;
		}
	}
}

// [10, 2, 7, 11, 24, 6, 56, 8, 4, 33, 5, 3, 1, 17]
// bubbleSort();
// selectSort();
// insertSort();
// shellSort();
// mergeSort(0, arr.length-1);
// quickSort(0,arr.length-1);
pileSort();
// oddEvenSort();
// cockTailSort();
console.log(arr);
