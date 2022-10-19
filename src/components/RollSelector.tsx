import { createPrivateKey } from "crypto"
import { tmpdir } from "os"
import { ChangeEvent, PropsWithChildren, useEffect, useState } from "react"

interface DropdownState {
    index: number,
    values: number[]
}

const Init_Dds: DropdownState = {
    index: 0,
    values: [0]
}

const RollSelector = (props: any) => {

    const numDropdowns: number = props.rolls.length

    const [returnArray, setReturnArray] = useState([0])

    const [dropdownStates, updateDropdownStates] = useState([Init_Dds])

    useEffect(() => {
        const tmp: DropdownState[] = []
        for(let i = 0; i < numDropdowns; i++) {
            const dds: DropdownState = {
                index: i,
                values: ["--", ...props.rolls]
            }
            tmp.push(dds)
        }
        updateDropdownStates(tmp)
    }, [])

    const updateReturnArray = (newValue: number) => {
        setReturnArray((prevState: number[]) => {
            if( prevState[0] === 0 ) {
                return [newValue]
            }
            return [...prevState, newValue]
        })
    }

    useEffect(() => {
        if( returnArray.length === numDropdowns ) {
            props.updater(returnArray)
        }
    }, [returnArray])


    const updateDropdowns = (event: ChangeEvent, index: number) => {
        //remove all values matching the new selected value
        // from all other dropdowns (ignore the one at index)
        
        let el: HTMLSelectElement = event.target as HTMLSelectElement
        let val: string = el.value

        if( val === "--" ) {
            return
        }

        let value: number = parseInt(val)

        const temp: DropdownState[] = []

        for( let i = 0; i < dropdownStates.length; i++ ) {
            if( dropdownStates[i].index != index ) {
                //remove the value val
                let dds: DropdownState = {
                    index: dropdownStates[i].index,
                    values: [...dropdownStates[i].values]
                }

                if( dds.values.includes(value) && dds.values.length > 1) {
                    dds.values.splice(dds.values.indexOf(value), 1)
                }

                temp.push(dds)
            } else {
                temp.push({
                    index: dropdownStates[i].index,
                    values: [value]
                })
            }
        }

        updateDropdownStates(temp)
        updateReturnArray(value)
    }

    return (
        <div id="rollsDiv" >
            {dropdownStates.map((dds: DropdownState) => 
                <select key={dds.index} onChange={e => updateDropdowns(e, dds.index)}>
                    {dds.values === undefined ? <option>undefined</option> :
                    dds.values.map((val: number) => 
                        <option key={Math.random() * val}>
                            {val}
                        </option>
                    )}
                </select>
            )}
        </div>
    )
}

export default RollSelector