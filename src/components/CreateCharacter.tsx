import { ChangeEvent, useEffect, useReducer, useState } from "react"
import { isInterfaceDeclaration } from "typescript"
import { Character, CharacterBackground, CharacterClass, CharacterRace } from "../interfaces/CharacterInterfaces"
import BackgroundDisplay from "./BackgroundDisplay"
import CharacterCards from "./CharacterCards"
import ClassDisplay from "./ClassDisplay/ClassDisplay"
import DiceRoller from "./DiceRoller"
import RaceDisplay from "./RaceDisplay/RaceDisplay"

import "./CreateCharacter.css"

const Init_Stat_Rolls: number[] = []

const Classes = [
    "Barbarian",
    "Bard",
    "Cleric",
    "Druid",
    "Fighter",
    "Monk",
    "Paladin",
    "Ranger",
    "Rogue",
    "Sorcerer",
    "Warlock",
    "Wizard"
]

const Races = [
    "Dragonborn",
    "Dwarf",
    "Elf",
    "Gnome",
    "Half-Orc",
    "Half-Elf",
    "Halfling",
    "Human",
    "Tiefling"
]

const Backgrounds = [
    "Acolyte" //acolyte is the only background provided by the api
]



let Init_Background: CharacterBackground = {
    backgroundName: "Acolyte",
    skillProficiencies: []
}

let Init_Race: CharacterRace = {
    raceName: "Dragonborn",
    languages: [],
    bonuses: []
}

const Init_Class: CharacterClass = {
    className: "Barbarian",
    hitDie: 0,
    abilityScores: [],
    skillProficiencies: [],
    proficiencyChoices: 0,
    level: 1
}

const CreateCharacter = () => {
    const [step, setStep] = useState(0) 
    const [rolls, setRolls] = useState(Init_Stat_Rolls)
    const [rollCount, setRollCount] = useState(0)

    const [selectedClass, setSelectedClass] = useReducer(
        (selectedClass: CharacterClass, updates: any) => ({...selectedClass, ...updates}),
        Init_Class
    )

    const [selectedRace, setSelectedRace] = useReducer(
        (selectedRace: CharacterRace, updates: any) => ({...selectedRace, ...updates}),
        Init_Race
    )

    const [selectedBackground, setSelectedBackground] = useReducer(
        (selectedBackground: CharacterBackground, updates: any) => ({...selectedBackground, ...updates}),
        Init_Background
    )

    const [character, setCharacter] = useState({} as Character)

    

    //updaters
    const updateClass = (update: any) => {

        setSelectedClass(update)
    }

    const updateBackground = (update: any) => {
        setSelectedBackground(update)
    }

    const updateRace = (update: any) => {
        setSelectedRace(update)
    }

    const nextStep = () => {
        setStep(step + 1)
    }


    // const handleRoll = () => {
    //     setRollCount((prevState) => {
    //         return prevState + 1
    //     })
    //     //roll four random numbers from 1 to 6 inclusive
    //     let minRoll = 7 //max value + 1
    //     let sumOfRolls = 0

    //     for (let i = 0; i < 4; i++) {
    //         let roll = Math.round(Math.random() * 5 + 1)

    //         if( roll == 1 ) {
    //             roll = Math.round(Math.random() * 5 + 1)
    //         }

    //         if (roll < minRoll) {
    //             minRoll = roll
    //         }

    //         sumOfRolls += roll
    //     }

    //     sumOfRolls -= minRoll

    //     setRolls((prevState) => prevState ? [...prevState, sumOfRolls] : [sumOfRolls])
    // }

    const updateRolls = (rolls: number[]) => {

        //sum up the rolls and subtract the lowest value
        let lowest: number = 99
        let sum: number = 0

        for( let i = 0; i < rolls.length; i++ ) {
            sum += rolls[i]
            if( rolls[i] < lowest ) {
                lowest = rolls[i]
            }
        }

        sum -= lowest

        setRolls((prevState: number[]) => {
            if( prevState.length === 0 ) {
                return [sum]
            }
            return [...prevState, sum]
        })
    }

    const characterUpdater = (char: Character) => {
        setCharacter(char)

        nextStep()
    }

    switch (step) {
        case 0:
            return (
                <button onClick={nextStep}>+ Create new character</button>
            )
        case 1:
            return (
                <div>
                    <h3>Roll your initial stats</h3>
                    <p className="contentP">Roll 4d6 for each of your six basic stats, rerolling any 1s once, then dropping the lowest value. 
                        This number will be assigned to one of your basic stats later.</p>

                    <div id="diceRollerHolder">
                        <DiceRoller diceType={6} diceCount={4} updater={updateRolls} rerollOnes={true}/>

                        <DiceRoller diceType={6} diceCount={4} updater={updateRolls} rerollOnes={true}/>
                    </div>

                    <div id="diceRollerHolder">
                        <DiceRoller diceType={6} diceCount={4} updater={updateRolls} rerollOnes={true}/>

                        <DiceRoller diceType={6} diceCount={4} updater={updateRolls} rerollOnes={true}/>
                    </div>

                    <div id="diceRollerHolder">
                        <DiceRoller diceType={6} diceCount={4} updater={updateRolls} rerollOnes={true}/>

                        <DiceRoller diceType={6} diceCount={4} updater={updateRolls} rerollOnes={true}/>
                    </div>
                    

                    <h4>Rolls:</h4>

                    <p className="contentP">                        
                        {rolls.map((roll) =>
                            <span key={Math.random()}>{roll}&nbsp;&nbsp;</span>
                        )}
                    </p>

                    {rolls.length >= 6 && <button onClick={nextStep}>Move on to the next step</button>}
                </div>
            )
        case 2: 
            return (
                <div>
                    <CharacterCards characterClass={selectedClass} characterRace={selectedRace} characterBackground={selectedBackground} 
                        rolls={rolls}
                        editable={true}
                        updater={characterUpdater} 
                    />
                    <h3>Choose your class, race, and background</h3>

                    <ClassDisplay className={selectedClass.className} updater={updateClass} classlist={Classes}/>

                    <RaceDisplay raceName={selectedRace.raceName} updater={updateRace} racelist={Races}/>

                    <BackgroundDisplay backgroundName={selectedBackground.backgroundName} updater={updateBackground} backgroundlist={Backgrounds}/>
                </div>
            )
        case 3:
            return (
                <div>
                    <h3>This character is confirmed:</h3>
                    <CharacterCards characterClass={character.pcClass} characterRace={character.pcRace} characterBackground={character.pcBackground}
                        name={character.pcName} 
                        rolls={character.pcAbilityScores}
                        editable={false}
                        hitPointsList={character.pcHitPoints}
                        updater={characterUpdater} 
                    />
                </div>
            )
        default: 
            return (<div></div>)
    }

}

export default CreateCharacter