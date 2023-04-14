"use strict";
exports.__esModule = true;
var react_1 = require("react");
var styles_module_css_1 = require("./styles.module.css");
var Home = function () {
    var addButtonRef = react_1.useRef(null);
    var drawCanvasRef = react_1.useRef(null);
    var _a = react_1.useState(false), shouldDraw = _a[0], setShouldDraw = _a[1];
    var _b = react_1.useState(500), size = _b[0], setSize = _b[1];
    var _c = react_1.useState([0, 0]), coord = _c[0], setCoord = _c[1];
    var initStartMatrix = function () {
        var m = new Array();
        for (var i = 0; i < size; i++) {
            var row = new Array();
            for (var j = 0; j < size; j++) {
                row.push(0);
            }
            m.push(row);
        }
        return m;
    };
    var _d = react_1.useState(initStartMatrix()), matrix = _d[0], setMatrix = _d[1];
    react_1.useEffect(function () {
        if (shouldDraw) {
            var interval_1 = setInterval(function () {
                var _a;
                var canvasContext = (_a = drawCanvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
                if (canvasContext)
                    drawLife(canvasContext, matrix);
                var next = nextGen();
                setMatrix(next);
            }, 300);
            return function () { return clearInterval(interval_1); };
        }
    }, [shouldDraw, matrix]);
    var drawLife = function (ctx, matr) {
        for (var row = 0; row < size; row++) {
            for (var column = 0; column < size; column++) {
                if (matr !== null && matr[row][column] === 1) {
                    ctx.fillStyle = '#000000';
                }
                else {
                    ctx.fillStyle = '#FFFFFF';
                }
                ctx.fillRect(column, row, 1, 1);
            }
        }
    };
    var getNeighbourhoods = function (i, j) {
        var sum = 0;
        for (var row = i - 1; row <= i + 1; row++) {
            for (var column = j - 1; column <= j + 1; column++) {
                if (row < 0 || row >= size || column < 0 || column >= size || (row === i && column === j))
                    continue;
                if (matrix !== null && matrix[row][column] === 1)
                    sum++;
            }
        }
        return sum;
    };
    var generate = function () {
        var _a;
        var m = initStartMatrix();
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                m[i][j] = Math.random() < 0.99 ? 0 : 1;
            }
        }
        setMatrix(m);
        var canvasContext = (_a = drawCanvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
        if (canvasContext)
            drawLife(canvasContext, m);
    };
    var nextGen = function () {
        var nextMatrix = initStartMatrix();
        for (var row = 0; row < size; row++) {
            for (var column = 0; column < size; column++) {
                var neights = getNeighbourhoods(row, column);
                if (neights === 2 || neights === 3) {
                    nextMatrix[row][column] = 1;
                }
                else {
                    nextMatrix[row][column] = 0;
                }
            }
        }
        return nextMatrix;
    };
    var drawByMouse = function (event) {
        var _a;
        if (drawCanvasRef !== null && drawCanvasRef.current !== null && event.buttons) {
            if (coord[0] === 0 && coord[1] === 0) {
                var newCoord = [event.clientX - drawCanvasRef.current.offsetLeft, event.clientY - drawCanvasRef.current.offsetTop];
                setCoord(newCoord);
            }
            else {
                var canvasContext = (_a = drawCanvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext('2d');
                if (canvasContext !== null) {
                    canvasContext.fillStyle = '#FF0000';
                }
                canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.beginPath();
                canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.moveTo(coord[0], coord[1]);
                canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.lineTo(event.clientX - drawCanvasRef.current.offsetLeft, event.clientY - drawCanvasRef.current.offsetTop);
                canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.stroke();
                canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.closePath();
                var newCoord = [event.clientX - drawCanvasRef.current.offsetLeft, event.clientY - drawCanvasRef.current.offsetTop];
                setCoord(newCoord);
                console.log(coord);
                console.log(newCoord);
            }
            //console.log((drawCanvasRef.current.offsetLeft) + ' ' + (drawCanvasRef.current.offsetTop));
        }
    };
    var resetCoord = function () {
        setCoord([0, 0]);
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: styles_module_css_1["default"].container },
            react_1["default"].createElement("canvas", { className: styles_module_css_1["default"].poligon, ref: drawCanvasRef, onMouseMove: function (event) { return drawByMouse(event); }, onMouseLeave: resetCoord, onMouseUp: resetCoord }),
            react_1["default"].createElement("div", { className: styles_module_css_1["default"].buttons },
                react_1["default"].createElement("button", { className: styles_module_css_1["default"].launchButton, onClick: function () {
                        setShouldDraw(function (prev) { return !prev; });
                        generate();
                        setShouldDraw(function (prev) { return !prev; });
                    } }, "\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C"),
                react_1["default"].createElement("button", { ref: addButtonRef, className: styles_module_css_1["default"].launchButton, onClick: function () {
                        setShouldDraw(function (prev) { return !prev; });
                    } }, "\u041E\u0436\u0438\u0432\u0438\u0442\u044C")))));
};
exports["default"] = Home;
