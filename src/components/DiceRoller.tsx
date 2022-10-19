import { useEffect, useState } from "react"
import { isGeneratorFunction } from "util/types"

import "./DiceRoller.css"

const DiceRoller = (props: any) => {

    const diceType: number = props.diceType
    const diceCount: number = props.diceCount
    const rerollOnes: boolean = props.rerollOnes

    const maxRolls: number = 5

    const [rollCount, setRollCount] = useState(0)

    const Init_Showing = []
    for( let i = 0; i < diceCount; i++ ) {
        Init_Showing.push(diceType)
    }

    const [showing, updateShowing] = useState(
        Init_Showing
    )

    const [rerolled, setRerolled] = useState(false)

    const rollDefault = () => {
        roll([], true)
    }

    const roll = (indexesToRoll: number[], keepRolling: boolean) => {
        let items: number[] = showing
        for(let i = 0; i < showing.length; i++) {
            if( indexesToRoll.length === 0 || indexesToRoll.includes(i) ) {
                items[i] = Math.floor(Math.random() * 6) + 1
            }
        }
        updateShowing([...items])

        if( keepRolling ) {
            setRollCount((prevState: number) => prevState + 1)
        }
    }

    useEffect(() => {
        if( rollCount !== 0 && rollCount < maxRolls ) {
            setTimeout(() => {roll([], true)}, 100)
        } else if( rollCount === maxRolls ) {
            setTimeout(reroll, 1000)
        }
    }, [rollCount])

    const reroll = () => {
        const indexes: number[] = []

        for( let i = 0; i < showing.length; i++ ) {
            if( showing[i] === 1 ) {
                indexes.push(i)
            }
        }

        if( indexes.length !== 0 ) {

            roll(indexes, false)
        }

        setRerolled(true)
    }

    useEffect(() => {
        if( rerolled ) {
            props.updater(showing)
        }
    }, [rerolled])

    return (
        <div id="diceOuterDiv">
            <div id="diceDiv">
                {showing.map((val: number) => 
                    <img key={Math.random()} src={"/images/dice-" + val + (val === 1 ? "-red" : "") + ".svg"} alt={"Die showing number " + val} />

                )}
            </div>
            
            {!rerolled && <button type="button" onClick={rollDefault}>Roll</button>}
        </div>
    )


}

export default DiceRoller