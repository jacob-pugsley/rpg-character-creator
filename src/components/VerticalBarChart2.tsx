import { text } from "node:stream/consumers"
import { useEffect } from "react"
import "./VerticalBarChart2.css"

export interface DataPoint {
    label: string,
    data: number,
    color: string
}

const VerticalBarChart2 = (props: any) => {

    const dataPoints: DataPoint[] = props.dataPoints


    const getMaxDataValue = () => {
        let max: number = 0
        for( let i = 0; i < dataPoints.length; i++ ) {
            if (dataPoints[i].data > max) {
                max = dataPoints[i].data
            }
        }
        return max
    }

    const setBarHeights = () => {
        //set the height of each div within the parent div
        //  based on the max data value in the set
        const max: number = getMaxDataValue()

        const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
        const draw: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D
        const textBuffer: number = 30
        const leftBuffer: number = 30

        //draw a rectangle for each datapoint in the list
        for( let i = 0; i < dataPoints.length; i++ ) {
            let value: number = dataPoints[i].data

            let ratio: number = value / max

            //bars[i].setAttribute("height", (parentHeight * ratio) + "px")

            draw.fillStyle = dataPoints[i].color

            const barHeight: number = (canvas.height * ratio) - textBuffer

            draw.fillRect(
                (i*100) + leftBuffer, canvas.height - barHeight,
                10, barHeight
            )

            draw.font = "20px Arial"
            draw.fillText(dataPoints[i].label, 
                ((i*100) + leftBuffer) -
                (draw.measureText(dataPoints[i].label).width / 2) 
                , textBuffer - 2)

        }
        

    }

    //set the bar heights after the component is rendered
    useEffect(() => {
        setBarHeights()
    }, [])

    return (
        <canvas id="canvas">



        </canvas>
    )

}

export default VerticalBarChart2