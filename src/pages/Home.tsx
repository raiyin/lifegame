import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import cl from './styles.module.css';

const Home = () => {

    const addButtonRef = useRef<HTMLButtonElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const [shouldDraw, setShouldDraw] = useState(false);
    const [size, setSize] = useState(500);
    const [coord, setCoord] = useState([0, 0]);
    const [matrix, setMatrix] = useState<number[][]>([[]]);
    const [isDrawByMouse, setIsDrawByMouse] = useState(true);

    const initStartMatrix = () => {

        let m = new Array(size);
        for (var i = 0; i < size; i++) {
            m[i] = new Array(size);
        }

        return m;
    };


    useEffect(() => {
        if (shouldDraw) {
            let interval = setInterval(() => {
                drawGeneration(matrix);
                let next = nextGen(matrix);
                setMatrix(next);

            }, 300);
            return () => clearInterval(interval);
        }

    }, [shouldDraw, matrix]);


    const drawGeneration = (matr: number[][]) => {

        let ctx = drawCanvasRef.current?.getContext('2d');
        if (!ctx)
            return;

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


    const generatePoints = () => {
        let m = initStartMatrix();
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                m[i][j] = Math.random() < 0.99 ? 0 : 1;
            }
        }

        setMatrix(_ => m);
        drawGeneration(m);
        setIsDrawByMouse(_ => false);
    };


    const getNeighbourhoods = (matr: number[][], i: number, j: number) => {
        let sum = 0;
        for (let row = i - 1; row <= i + 1; row++) {
            for (let column = j - 1; column <= j + 1; column++) {
                if (row < 0 || row >= size ||
                    column < 0 || column >= size ||
                    (row === i && column === j))
                    continue;
                if (matr !== null && matr[row][column] === 1)
                    sum++;
            }
        }
        return sum;
    };


    const nextGen = (m: number[][]) => {
        let nextMatrix: Array<Array<number>> = initStartMatrix();
        for (let row = 0; row < size; row++) {
            for (let column = 0; column < size; column++) {
                let neights = getNeighbourhoods(m, row, column);
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

        if (drawCanvasRef === null || drawCanvasRef.current === null || !event.buttons) {
            return;
        }

        if (coord[0] === 0 && coord[1] === 0) {
            let newCoord = [
                event.clientX - drawCanvasRef.current.offsetLeft,
                event.clientY - drawCanvasRef.current.offsetTop];
            setCoord(newCoord);
        }
        else {
            let canvasContext = drawCanvasRef.current?.getContext('2d');
            if (canvasContext === null) {
                return;
            }

            canvasContext.fillStyle = '#000000';
            let newCoord = [
                event.clientX - drawCanvasRef.current.offsetLeft,
                event.clientY - drawCanvasRef.current.offsetTop
            ];

            canvasContext.beginPath();
            canvasContext.moveTo(coord[0], coord[1]);
            canvasContext.lineTo(newCoord[0], newCoord[1]);
            canvasContext.closePath();
            canvasContext.stroke();
            setCoord(newCoord);
        }

        setIsDrawByMouse(_ => true);
    };


    const resetCoord = () => {
        setCoord([0, 0]);
    };


    const MakeMatrixFromDraw = () => {
        let m = initStartMatrix();

        let canvasContext = drawCanvasRef.current?.getContext('2d');
        const imageData = canvasContext?.getImageData(0, 0, size, size).data;

        if (imageData) {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let index = i * size + j;
                    let pixelValue =
                        imageData[index * 4] +
                        imageData[index * 4 + 1] +
                        imageData[index * 4 + 2] +
                        imageData[index * 4 + 3];
                    m[i][j] = pixelValue !== 0 ? 1 : 0;
                }
            }
        }

        setMatrix(m);
    };


    let sizeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSize(+event.currentTarget.value);
    };


    const reset = () => {
        let context = drawCanvasRef.current?.getContext('2d');
        if (drawCanvasRef.current?.width) {
            context?.clearRect(0, 0, drawCanvasRef.current?.width, drawCanvasRef.current?.height);
        }
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
                                setShouldDraw(_ => false);
                                generatePoints();
                            }}
                        >
                            Сгенерировать точки
                        </button>

                    </div>

                </div>

                <button
                    ref={addButtonRef}
                    className={cl.launchButton}
                    onClick={() => {
                        if (isDrawByMouse) {
                            MakeMatrixFromDraw();
                        }
                        setShouldDraw(_ => true);
                    }}
                >
                    Оживить
                </button>

                <button
                    ref={addButtonRef}
                    className={cl.launchButton}
                    onClick={() => {
                        setIsDrawByMouse(_ => false);
                        setShouldDraw(_ => false);
                    }}
                >
                    Пауза
                </button>

                <button
                    ref={addButtonRef}
                    className={cl.launchButton}
                    onClick={() => {
                        setShouldDraw(_ => false);
                        reset();
                    }}
                >
                    Сбросить
                </button>

            </div>
        </>
    );
};

export default Home;
