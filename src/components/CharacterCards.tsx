import { useEffect, useState } from "react"
import { Character, CharacterBackground, CharacterClass, CharacterRace } from "../interfaces/CharacterInterfaces"

const CharacterCards = (props: any) => {

    const classData: CharacterClass = props.characterClass
    const raceData: CharacterRace = props.characterRace
    const backgroundData: CharacterBackground = props.characterBackground

    console.log(classData)

    return (
        <div>
            <h3>Name</h3>
            <h4>the {raceData.raceName} {classData.className}</h4>
            <p>Ability scores:</p>
            <ul>
                {classData.savingThrows.map((st: any) => <li key={st.index}>{st.name}: 15</li>)}
            </ul>
            <p>Skills:</p>
            <ul>
                {classData.skillProficiencies.map((sk: any) => <li key={sk.skill}>{sk.skill}</li>)}
            </ul>
        </div>
    )
}


export default CharacterCards