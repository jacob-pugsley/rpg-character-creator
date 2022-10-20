import { ChangeEvent, useEffect, useState } from "react"
import { AbilityScore } from "../interfaces/AbilityScore"
import { Character, CharacterBackground, CharacterClass, CharacterRace } from "../interfaces/CharacterInterfaces"
import ScoresDisplay from "./ScoresDisplay"
import "./CharacterCards.css"
import RollSelector from "./RollSelector"

const CharacterCards = (props: any) => {

    const classData: CharacterClass = props.characterClass
    const raceData: CharacterRace = props.characterRace
    const backgroundData: CharacterBackground = props.characterBackground

    const [charName, setCharName] = useState("")

    const [abilityScores, setAbilityScores] = useState([] as number[])
    const updateAbilityScores = (arr: number[]) => {
        setAbilityScores(arr)
    }

    const updateCharName = (event: ChangeEvent) => {
        let el: HTMLInputElement = event.target as HTMLInputElement
        const val: string = el.value

        setCharName(val)
    }

    return (
        <div>
            <input type="text" placeholder="Name" onChange={updateCharName}/>
            <h4>the {raceData.raceName} {classData.className}</h4>
            
            <p id="abilitiesInfoP">
                Your <b>ability scores</b> determine how good your character is at performing
                actions within respective skill categories. A high Intelligence score will give you advantages in
                tasks that require specific knowledge, such as identifying an ancient artifact.
                A high Charisma will help you to persuade or deceive people.
                <br /><br />
                Certain races provide you with <b>ability score bonuses</b>, which are added to the
                raw score before the skill modifier is calculated. For example, the 
                Dragonborn race provides +2 to Strength and +1 to Charisma. 
                <br /><br />
                Your Constitution score is not used for skill checks. The DM may ask you
                to make a general Constitution check to avoid being poisoned or affected by a spell. This score is also used to determine
                your hit points at each level.
                <br /><br />
                Your <b>skill modifiers</b> are determined using the raw ability score by
                subtracting 10 and dividing by two. These numbers will be added to any rolls
                you make with the respective skill. For example, if the DM asks you to make
                an Arcana check, you will roll a d20 and add your Intelligence modifier.
                <br /><br />
                Now, assign one of the six rolls you made to each of the abilities:
            </p>
            <RollSelector rolls={props.rolls} updater={updateAbilityScores}/>
            <ScoresDisplay 
                abScores={classData.abilityScores} 
                skillProfs={
                    [...classData.skillProficiencies, ...backgroundData.skillProficiencies]
                }

                bonuses={raceData.bonuses}

                level={classData.level}

                abilityScores={abilityScores}
            />
            <br />
            <span>Languages you can speak and read:</span>
            <ul>
                {raceData.languages.map((sk: any) => <li key={sk.index}>{sk.name}</li>)}
            </ul>
        </div>
    )
}


export default CharacterCards