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

    const [hitPointsList, setHitPointsList] = useState(    
        props.editable ? [] as number[] : props.hitPointsList
    )

    const [abilityScores, setAbilityScores] = useState(
        () => {
            if( props.editable ) {
                return [] as number[]
            } else {
                return props.rolls
            }
        })
    const updateAbilityScores = (arr: number[]) => {
        setAbilityScores(arr)
        setHitPointsList(rollHitPoints(getModifier(arr[2])))
    }

    const updateCharName = (event: ChangeEvent) => {
        let el: HTMLInputElement = event.target as HTMLInputElement
        const val: string = el.value

        setCharName(val)
    }

    const updateParent = () => {
        const char: Character = {
            pcName: charName,
            pcClass: classData,
            pcRace: raceData,
            pcBackground: backgroundData,
            pcLevel: classData.level,
            pcAbilityScores: abilityScores,
            pcHitPoints: hitPointsList
        }

        props.updater(char)
    }

    const rollHitPoints = (con: number) => {
        //roll the hitpoints for every level, then only give the ones for the current level
        const points: number[] = [classData.hitDie]
        for( let i = 1; i < 20; i++ ) {
            let rand: number = Math.random()
            let bound: number = (classData.hitDie - 1)

            console.log("hit points", rand, "*", bound, "+", con + 1)


            let hp = Math.floor(rand * bound + con + 1)

            console.log("hit points", hp)

            points.push(hp)
        }
        return points
    }

    const arraySum = (arr: number[], maxIndex: number) => {
        let sum: number = 0
        for( let i = 0; i < maxIndex; i++ ) {
            sum += arr[i]
        }
        return sum
    }

    const getModifier = (score: number) => {
        return Math.floor((score - 10) / 2)
    }

    return (
        <div>
            {props.editable ? <input type="text" placeholder="Name" onChange={updateCharName}/> : <h3>{props.name}</h3>}
            <h4>the {raceData.raceName} {classData.className}</h4>
            
            {props.editable && 
                <p className="contentP reactive-keywords">
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
                    Your <b>proficiency bonus</b> is a number determined by your character level which will be added to checks you make
                    with skills and tools you have proficiency with, as determined by your class.
                    <br /><br />
                    Now, assign one of the six rolls you made to each of the abilities:
                </p>
            }
            {props.editable === true && <RollSelector rolls={props.rolls} updater={updateAbilityScores}/>}
            <ScoresDisplay 
                characterClassName={classData.className} 
                skillProfs={
                    [...classData.skillProficiencies, ...backgroundData.skillProficiencies]
                }

                bonuses={raceData.bonuses}

                level={classData.level}

                abilityScores={abilityScores}

                hitDie={classData.hitDie}

                hitPoints={arraySum(hitPointsList, classData.level)}
            />

            <br />
            <span>Languages you can speak and read:</span>
            <ul>
                {raceData.languages.map((sk: any) => <li key={sk.index}>{sk.name}</li>)}
            </ul>

            <br />
            {props.editable && <button type="button" onClick={updateParent}><b>Use this character</b></button>}
        </div>
    )
}


export default CharacterCards