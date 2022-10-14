import { useEffect, useState } from "react"
import { Character, CharacterBackground, CharacterClass, CharacterRace } from "../interfaces/CharacterInterfaces"

const CharacterCards = (props: any) => {

    const classData: CharacterClass = props.characterClass
    const raceData: CharacterRace = props.characterRace
    const backgroundData: CharacterBackground = props.characterBackground

    console.log(props)
    console.log(raceData)
    console.log(backgroundData)
    console.log(classData)

    return (
        <div>
            <h3>Name</h3>
            <h4>the {raceData.raceName} {classData.className}</h4>
            <p>Hit die: d{classData.hitDie}</p>

            <p>Ability scores:</p>
            <ul>
                {classData.abilityScores.map((st: any) => <li key={st.index}>{st.name}: 15</li>)}
            </ul>
            <p>Skills:</p>
            <ul>
                {classData.skillProficiencies.map((sk: any) => <li key={sk.skill}>{sk.skill}</li>)}
            </ul>
            <p>Skills from background:</p>
            <ul>
                {backgroundData.skillProficiencies.map((sk: string) => <li key={sk}>{sk}</li>)}
            </ul>
            <p>Languages from race:</p>
            <ul>
                {raceData.languages.map((sk: any) => <li key={sk.index}>{sk.name}</li>)}
            </ul>
            <p>Ability score bonuses from race:</p>
            <ul>
                {raceData.bonuses.map((ability: any) => <li key={ability.name}>{ability.bonus} to {ability.name}</li>)}
            </ul>
        </div>
    )
}


export default CharacterCards