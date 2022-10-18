import { useEffect, useState } from "react"
import { AbilityScore } from "../interfaces/AbilityScore"
import { Character, CharacterBackground, CharacterClass, CharacterRace } from "../interfaces/CharacterInterfaces"
import ScoresDisplay from "./ScoresDisplay"
import VerticalBarChart from "./VerticalBarChart"
import VerticalBarChart2, { DataPoint } from "./VerticalBarChart2"

const CharacterCards = (props: any) => {

    const classData: CharacterClass = props.characterClass
    const raceData: CharacterRace = props.characterRace
    const backgroundData: CharacterBackground = props.characterBackground

    return (
        <div>
            <h3>Name</h3>
            <h4>the {raceData.raceName} {classData.className}</h4>
            <p>Hit die: d{classData.hitDie}</p>
            <p>Skills:</p>
            <ul>
                {classData.skillProficiencies.map((sk: any) => <li key={sk}>{sk}</li>)}
            </ul>
            <p>Skills from background:</p>
            <ul>
                {backgroundData.skillProficiencies.map((sk: string) => <li key={sk}>{sk}</li>)}
            </ul>
            <p>Languages from race:</p>
            <ul>
                {raceData.languages.map((sk: any) => <li key={sk.index}>{sk.name}</li>)}
            </ul>

            <ScoresDisplay 
                abScores={classData.abilityScores} 
                skillProfs={
                    [...classData.skillProficiencies, ...backgroundData.skillProficiencies]
                }

                bonuses={raceData.bonuses}

                level={classData.level}
            />
        </div>
    )
}


export default CharacterCards