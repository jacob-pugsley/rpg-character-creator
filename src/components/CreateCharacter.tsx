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

    const onSelectClass = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value

        if (val != null) {
            //setClassName(val)
            updateClass(
                {className: val}
            )
        }
    }

    const onSelectRace = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value

        if (val != null) {
            updateRace(
                {raceName: val}
            )
        }
    }

    const onSelectBackground = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value

        if (val != null) {
            updateBackground(
                {backgroundName: val}
            )
        } 
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
                    <p>Roll 4d6 for each of your six basic stats, rerolling any 1s once, then dropping the lowest value. 
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

                    <p>                        
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
                    <CharacterCards characterClass={selectedClass} characterRace={selectedRace} characterBackground={selectedBackground} rolls={rolls}/>
                    <h3>Choose your class, race, and background</h3>
                    <p>Your class determines the job or role your character plays in society. Are they a powerful wizard? A thieving rogue? Or a musical bard?</p>
                    <select onChange={onSelectClass}>
                        {Classes.map((c) => <option key={c}>{c}</option>)}
                    </select>

                    <ClassDisplay className={selectedClass.className} updater={updateClass}/>

                    <p>Your race determines some of your character's abilities as well as your size, movement speed, and the languages you speak.</p>
                    <select onChange={onSelectRace}>
                        {Races.map((c) => <option key={c}>{c}</option>)}
                    </select>

                    <RaceDisplay raceName={selectedRace.raceName} updater={updateRace}/>


                    <p>Your background provides more specifics on what your character does and what kind of experiences they've had. 
                        Specifically, it provides you with more languages, skill proficiencies, and items.</p>

                    <select onChange={onSelectBackground}>
                        {Backgrounds.map((bg: string) => <option key={bg}>{bg}</option>)}
                    </select>
            

                    <BackgroundDisplay backgroundName={selectedBackground.backgroundName} updater={updateBackground} />


                    <button onClick={nextStep}>Confirm selections and move on.</button>

                </div>
            )
        default: 
            return (<div></div>)
    }

}

export default CreateCharacter