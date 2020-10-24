function KMP(pat) {
	const M = pat.length();
	// dp[状态][字符] = 下个状态
	dp = new Array(M).fill(Array[256]);
	// base case
	dp[0][pat.charCodeAt(0)] = 1;
	// 影子状态 X 初始为 0
	let X = 0;
	// 当前状态 j 从 1 开始
	for (let j = 1; j < M; j++) {
		for (let c = 0; c < 256; c++) {
			if (pat.charCodeAt(j) == c) dp[j][c] = j + 1;
			else dp[j][c] = dp[X][c];
		}
		// 更新影子状态
		X = dp[X][pat.charCodeAt(j)];
	}
}
