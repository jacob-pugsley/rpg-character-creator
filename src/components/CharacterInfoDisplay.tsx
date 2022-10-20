import { ChangeEvent } from "react";

import "./CharacterInfoDisplay.css"



const CharacterInfoDisplay = (props: any) => {
    const onSelectName = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value
    
        if (val != null) {
            props.updateSelectedName(val)
        }
    }

    return (
    <div>
        <div className="block-display">
            <div className="flex-display">
                <p className="titleP">{props.title}</p>

                {props.titleContent}

                {props.namelist !== undefined && 
                    <select onChange={onSelectName} className="dataSelect">
                        {props.namelist.map((c: string) => <option key={c}>{c}</option>)}
                    </select>
                }
            </div>
            <hr />

            <p className="infoTextP">
                {props.infotext} 
            </p>

            {props.infotext !== undefined && <hr />}

            <div className="flex-display">
                {props.children}
            </div>
        </div>
    </div>
    )
}

export default CharacterInfoDisplay