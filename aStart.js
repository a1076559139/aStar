//曼哈顿估价法
function manhattan(point, endPoint) {
    return Math.abs(point.x - endPoint.x) + Math.abs(point.y - endPoint.y);
}

/**
 * 
 * @param {Number} row 行
 * @param {Number} col 列
 */
var aStar = function (row, col) {
    if (row <= 0 || col <= 0) {
        console.error('error query');
        return;
    }
    //初始化棋盘
    this._list = [];
    this._row = row;
    this._col = col;
    for (var i = 0; i < row; i++) {
        this._list[i] = [];
        for (var j = 0; j < col; j++) {
            this._list[i][j] = 1;
        }
    }
};

/**
 * 添加障碍物
 */
aStar.prototype.addObstacle = function (points) {
    if (points && typeof points.length !== 'undefined') {
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            this._list[point.x][point.y] = 0;
        }
    } else {
        this._list[points.x][points.y] = 0;
    }
};

/**
 * 获得路径
 */
aStar.prototype.getRoute = function (startPoint, endPoint, direction) {
    if (!this._list[startPoint.x][startPoint.y] || !this._list[endPoint.x][endPoint.y]) {
        console.error('起点或终点不能是障碍物');
        return [];
    }

    if (startPoint.x == endPoint.x && startPoint.y == endPoint.y) {
        console.error('起点和终点不能相同');
        return [];
    }

    this._openList = [];    //一个记录下所有被考虑来寻找最短路径的方块
    this._closeList = {};   //一个记录下不会再被考虑的方块

    //将节点添加到open列表中去
    var head = null;
    var node = this._createNode(head, startPoint, endPoint);
    this._addNodeToOpenList(node);

    return this._getRoute(endPoint, direction);
};

aStar.prototype._getRoute = function (endPoint, direction) {
    //获得open列表中最小和值的节点
    var list = this._getOpenMin();
    if (list.length === 0) {
        return [];
    }

    for (var i = 0; i < list.length; i++) {
        var e = list[i];
        var index = e.index;
        var node = e.node;

        if (node.data.H === 0/** 已经是终点*/) {
            var route = [];
            while (node.head) {
                route.splice(0, 0, node.point);
                node = node.head;
            }
            route.splice(0, 0, node.point);
            return route;
        }

        //添加到close列表中去
        this._addOpenToCloseList(index, node);

        //遍历邻居点
        /**
         * 如果p在closed列表中：不管它。
         * 如果p不在open列表中：添加它然后计算出它的和值。
         * 如果p已经在open列表中：当我们使用当前生成的路径到达那里时，检查F 和值是否更小。如果是，更新它的和值和它的前继。
         * 8方向不查找穿墙邻居
         */
        this._getNeighbor(node.point, function (point) {
            if (this._list[point.x][point.y]/** 不是障碍物*/ && !this._closeList[point.x + ',' + point.y]/** 不在close表里面*/) {
                var n = this._createNode(node, point, endPoint);
                this._addNodeToOpenList(n);
            }
        }, direction);
    }

    return this._getRoute(endPoint, direction);
};

/**
 * 寻找周围的节点
 * 
 * @param {any} point 基础点
 * @param {any} cb 回掉
 * @param {bool} d 8方向还是4方向，默认8 8方向
 * 
 */
aStar.prototype._getNeighbor = function (point, cb, d) {
    var xMin = point.x > 0 ? (point.x - 1) : 0;
    var xMax = (point.x < this._col - 1) ? (point.x + 1) : point.x;
    var yMin = point.y > 0 ? (point.y - 1) : 0;
    var yMax = (point.y < this._row - 1) ? (point.y + 1) : point.y;
    for (var i = xMin; i <= xMax; i++) {
        for (var j = yMin; j <= yMax; j++) {
            if (d === 4) {
                //4方向
                if ((i !== point.x && j === point.y) || (i === point.x && j !== point.y)) {
                    cb.call(this, { x: i, y: j });
                }
            } else {
                if (this._judgeAcross(point, { x: i, y: j })) {
                    //8方向
                    if (i !== point.x || j !== point.y) {
                        cb.call(this, { x: i, y: j });
                    }
                }
            }
        }
    }
};

/**
 * 主要用于8方向时判断路径是否穿墙了
 */
aStar.prototype._judgeAcross = function (p1, p2) {
    if (p1.x !== p2.x && p1.y !== p2.y) {
        if (this._list[p1.x][p2.y] === 0 || this._list[p2.x][p1.y] === 0) {
            return false;
        }
    }

    return true;
};

/**
 * 将open列表里面的节点添加到close里面去，同时从open中删除
 */
aStar.prototype._addOpenToCloseList = function (index, node) {
    var k = node.point.x + ',' + node.point.y;
    this._closeList[k] = node;
    this._openList.splice(index, 1);
};

/**
 * 添加节点到open列表
 */
aStar.prototype._addNodeToOpenList = function (node) {
    for (var i = this._openList.length - 1; i >= 0; i--) {
        var n = this._openList[i];
        if (n.point.x === node.point.x && n.point.y === node.point.y) {
            if (n.data.F < node.data.F) {
                return;
            }
            this._openList.splice(i, 1);
            break;
        }
    }
    this._openList.push(node);
};

aStar.prototype._createNode = function (head, point, endPoint) {
    var addG = 1;
    if (head && head.x !== point.x && head.y !== point.y) {
        addG = 1.414213562373095;
    }
    var G = head ? head.data.G + addG : 0;
    var H = manhattan(point, endPoint);
    return {
        head: head,
        data: {
            F: G + H,
            G: G,
            H: H
        },
        point: point
    };
};

aStar.prototype._getOpenMin = function () {
    var min = [];
    var minF = 0;
    for (var i = this._openList.length - 1; i >= 0; i--) {
        var element = this._openList[i];
        if (!minF) {
            minF = element.data.F;
        }
        if (element.data.F === minF) {
            min.push({ index: i, node: element });
        } else if (element.data.F < minF) {
            minF = element.data.F;
            min = [{ index: i, node: element }];
        }
    }
    return min;
};