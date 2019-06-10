// 动态规划涉及两个问题：重叠子问题和最优子结构


// 动态规划算法基本框架
// for(j=1; j<=m; j=j+1) // 第一个阶段
//    xn[j] = 初始值;

//  for(i=n-1; i>=1; i=i-1)// 其他n-1个阶段
//    for(j=1; j>=f(i); j=j+1)//f(i)与i有关的表达式
//      xi[j]=j=max（或min）{g(xi-1[j1:j2]), ......, g(xi-1[jk:jk+1])};

// t = g(x1[j1:j2]); // 由子问题的最优解求解整个问题的最优解的方案
// print(x1[j1]);

// for(i=2; i<=n-1; i=i+1）
// {  
//      t = t-xi-1[ji];

//      for(j=1; j>=f(i); j=j+1)
//         if(t=xi[ji])
//              break;
// }



// test expample 1
// 钢管长度规格与盈利的关系对照表
// 长度：1，  2，  3，  4，  5，  6，  7，  8，  9，  10
// 盈利：1，  5，  8，  9，  10， 17， 17， 20， 24， 30

function cut(p, n) {
    if (n == 0)
        return 0;
    let q = Number.MIN_VALUE;
    for (let i = 1; i <= n; i++) {
        q = Math.max(q, p[i - 1] + cut(p, n - i));
    }
    return q;
}

const p = [0, 1, 5, 8, 9, 10, 17, 17, 20, 24, 30];
console.log(cut(p, 7));