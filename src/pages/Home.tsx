import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import cl from './styles.module.css';

const Home = () => {

    const addButtonRef = useRef<HTMLButtonElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const [shouldDraw, setShouldDraw] = useState(false);
    const [size, setSize] = useState(500);
    const [coord, setCoord] = useState([0, 0]);

    const initStartMatrix = () => {
        let m: Array<Array<number>> = new Array<Array<number>>();
        for (let i = 0; i < size; i++) {
            let row = new Array<number>();
            for (let j = 0; j < size; j++) {
                row.push(0);
            }
            m.push(row);
        }
        return m;
    };

    const [matrix, setMatrix] = useState<number[][]>(initStartMatrix());

    useEffect(() => {
        if (shouldDraw) {
            let interval = setInterval(() => {
                let canvasContext = drawCanvasRef.current?.getContext('2d');
                if (canvasContext)
                    drawLife(canvasContext, matrix);
                let next = nextGen();
                setMatrix(next);
            }, 300);
            return () => clearInterval(interval);
        }
    }, [shouldDraw, matrix]);

    const drawLife = (ctx: CanvasRenderingContext2D, matr: number[][]) => {
        for (let row = 0; row < size; row++) {
            for (let column = 0; column < size; column++) {
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

    const getNeighbourhoods = (i: number, j: number) => {
        let sum = 0;
        for (let row = i - 1; row <= i + 1; row++) {
            for (let column = j - 1; column <= j + 1; column++) {
                if (row < 0 || row >= size || column < 0 || column >= size || (row === i && column === j))
                    continue;
                if (matrix !== null && matrix[row][column] === 1)
                    sum++;
            }
        }
        return sum;
    };

    const generate = () => {
        let m = initStartMatrix();
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                m[i][j] = Math.random() < 0.99 ? 0 : 1;
            }
        }
        setMatrix(m);
        let canvasContext = drawCanvasRef.current?.getContext('2d');
        if (canvasContext)
            drawLife(canvasContext, m);
    };

    const nextGen = () => {
        let nextMatrix: Array<Array<number>> = initStartMatrix();
        for (let row = 0; row < size; row++) {
            for (let column = 0; column < size; column++) {
                let neights = getNeighbourhoods(row, column);
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

    const drawByMouse = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (drawCanvasRef !== null && drawCanvasRef.current !== null && event.buttons) {
            if (coord[0] === 0 && coord[1] === 0) {
                let newCoord = [
                    event.clientX - drawCanvasRef.current.offsetLeft,
                    event.clientY - drawCanvasRef.current.offsetTop];
                setCoord(newCoord);
            }
            else {
                let canvasContext = drawCanvasRef.current?.getContext('2d');
                if (canvasContext !== null) {
                    canvasContext.fillStyle = '#000000';
                }

                canvasContext?.beginPath();
                canvasContext?.moveTo(coord[0], coord[1]);
                canvasContext?.lineTo(
                    event.clientX - drawCanvasRef.current.offsetLeft,
                    event.clientY - drawCanvasRef.current.offsetTop);
                canvasContext?.closePath();
                canvasContext?.stroke();
                let newCoord = [
                    event.clientX - drawCanvasRef.current.offsetLeft,
                    event.clientY - drawCanvasRef.current.offsetTop];
                setCoord(newCoord);
            }
        }
    };

    const resetCoord = () => {
        setCoord([0, 0]);
    };

    const letUsePainting = () => {
        let m = initStartMatrix();
        let canvasContext = drawCanvasRef.current?.getContext('2d');
        const imageData = canvasContext?.getImageData(0, 0, size, size).data;

        if (imageData)
            for (let i = 1; i <= size; i++) {
                for (let j = 1; j <= size; j++) {
                    let index = j * size + i;
                    m[j - 1][i - 1] = (imageData[index * 4] + imageData[index * 4 + 1] + imageData[index * 4 + 2] + imageData[index * 4 + 3]) > 0 ? 1 : 0;
                }
            }

        setMatrix(m);
    };

    let sizeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSize(+event.currentTarget.value);
    };

    return (
        <>
            <div className={cl.container}>
                <div className={cl.slidecontainer}>
                    <input
                        type="range"
                        min="50"
                        max="500"
                        value={size}
                        className={cl.slider}
                        id="myRange"
                        onChange={(event) => sizeChange(event)} />
                </div>
                <canvas className={cl.poligon}
                    ref={drawCanvasRef}
                    onMouseMove={(event) => drawByMouse(event)}
                    onMouseLeave={resetCoord}
                    onMouseUp={resetCoord}
                    width={size}
                    height={size}
                    style={{ width: size, height: size }}
                >
                </canvas>

                <div className={cl.buttons}>

                    <div className={cl.buttonsGenerate}>

                        <button
                            className={cl.launchButton}
                            onClick={() => {
                                setShouldDraw(prev => !prev);
                                generate();
                                setShouldDraw(prev => !prev);
                            }}
                        >
                            Сгенерировать точки
                        </button>

                        <button
                            className={cl.launchButton}
                            onClick={letUsePainting}
                        >
                            Использовать рисунок
                        </button>

                    </div>

                    <button
                        ref={addButtonRef}
                        className={cl.launchButton}
                        onClick={() => {
                            setShouldDraw(prev => !prev);
                        }}
                    >
                        Оживить
                    </button>

                </div>

            </div>
        </>
    );
};

export default Home;
