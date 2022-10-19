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

    const [abilityScores, setAbilityScores] = useState([] as number[])
    const updateAbilityScores = (arr: number[]) => {
        setAbilityScores(arr)
    }

    return (
        <div>
            <h3>Name</h3>
            <h4>the {raceData.raceName} {classData.className}</h4>
            
            <p id="abilitiesInfoP">
                Your ability scores determine how good your character is at performing
                certain actions. A high Intelligence score will give you advantages in
                tasks that require specific knowledge, such as identifying an ancient artifact.
                A high Charisma will help you to persuade or decieve people.
                <br /><br />
                Certain races provide you wil ability score bonuses, which are added to the
                raw score before the skill modifier is calculated. For example, the 
                Dragonborn race provides +2 to Strength and +1 to Charisma. 
                <br /><br />
                Your Constitution score is not used for skill checks. The DM may ask you
                to make a general Constitution check to avoid being poisoned, or to avoid becoming
                intoxicated while drinking at a tavern. This score is also used to determine
                your hit points at each level.
                <br /><br />
                Your actual skill bonuses are determined using the raw ability score by
                subtracting 10 and dividing by two. These numbers will be added to any rolls
                you make with the respective skill. For example, if the DM asks you to make
                an Arcana check, you will roll a d20 then add the skill modifier.
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