// 请根据不用的测试环境添加引用
/**
 * aStar
 */

var a = new aStar(30, 30);

// a.addObstacle({ x: 0, y: 1 });
// a.addObstacle({ x: 2, y: 0 });
// a.addObstacle({ x: 2, y: 1 });
// a.addObstacle({ x: 2, y: 2 });
// a.addObstacle({ x: 1, y: 3 });
// a.addObstacle({ x: 10, y: 20 });
// a.addObstacle({ x: 14, y: 13 });
// a.addObstacle({ x: 14, y: 14 });
// a.addObstacle({ x: 14, y: 15 });
// a.addObstacle({ x: 14, y: 16 });


a.addObstacle({ x: 6, y: 0 });
a.addObstacle({ x: 5, y: 1 });
a.addObstacle({ x: 5, y: 2 });
a.addObstacle({ x: 5, y: 3 });
a.addObstacle({ x: 5, y: 4 });
a.addObstacle({ x: 5, y: 5 });
a.addObstacle({ x: 5, y: 6 });
a.addObstacle({ x: 5, y: 7 });
a.addObstacle({ x: 5, y: 8 });
a.addObstacle({ x: 5, y: 9 });

console.time('a');
var route = a.getRoute({ x: 0, y: 0 }, { x: 6, y: 5 });
console.timeEnd('a');

for (var i = 0; i < route.length; i++) {
    var p = route[i];
    a._list[p.x][p.y] = '@';
}

for (var i = 0; i < a._list.length; i++) {
    console.log(a._list[i].toString());
}