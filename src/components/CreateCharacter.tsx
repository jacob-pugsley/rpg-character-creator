import { ChangeEvent, useEffect, useState } from "react"
import { isInterfaceDeclaration } from "typescript"
import { Character, CharacterBackground, CharacterClass, CharacterRace } from "../interfaces/CharacterInterfaces"
import BackgroundDisplay from "./BackgroundDisplay"
import CharacterCards from "./CharacterCards"
import ClassDisplay from "./ClassDisplay/ClassDisplay"
import RaceDisplay from "./RaceDisplay/RaceDisplay"

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

let Init_Class: CharacterClass = {
    className: "Barbarian",
    hitDie: 0,
    abilityScores: [],
    skillProficiencies: []
}

const CreateCharacter = () => {
    const [step, setStep] = useState(0) 
    const [rolls, setRolls] = useState(Init_Stat_Rolls)
    const [selectedClass, setSelectedClass] = useState(Init_Class)
    const [selectedRace, setSelectedRace] = useState(Init_Race)
    const [rollCount, setRollCount] = useState(0)
    const [selectedBackground, setSelectedBackground] = useState(Init_Background)

    const [className, setClassName] = useState(Init_Class.className)
    const [raceName, setRaceName] = useState(Init_Race.raceName)
    const [backgroundName, setBackgroundName] = useState(Init_Background.backgroundName)


    //updaters
    const updateClass = (update: CharacterClass) => {
        setSelectedClass(update)
        setClassName(update.className)
    }


    const nextStep = () => {
        setStep(step + 1)
    }


    const handleRoll = () => {
        setRollCount((prevState) => {
            return prevState + 1
        })
        //roll four random numbers from 1 to 6 inclusive
        let minRoll = 7 //max value + 1
        let sumOfRolls = 0

        for (let i = 0; i < 4; i++) {
            let roll = Math.round(Math.random() * 5 + 1)

            if( roll == 1 ) {
                roll = Math.round(Math.random() * 5 + 1)
            }

            if (roll < minRoll) {
                minRoll = roll
            }

            sumOfRolls += roll
        }

        sumOfRolls -= minRoll

        setRolls((prevState) => prevState ? [...prevState, sumOfRolls] : [sumOfRolls])
    }

    const onSelectClass = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value

        if (val != null) {
            setClassName(val)
        }
    }

    const onSelectRace = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value

        if (val != null) {
            setRaceName(val)
        }
    }

    const onSelectBackground = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value

        if (val != null) {
            setBackgroundName(val)
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

                    {rollCount < 6 ? <button onClick={handleRoll}>Roll a d6</button> : <p>Done rolling!</p>}

                    <h4>Rolls:</h4>
                    <ul>
                        {rolls.map((roll) =>
                            <li key={Math.random()}>{roll}</li>
                        )}
                    </ul>

                    {rollCount >= 6 && <button onClick={nextStep}>Move on to the next step</button>}
                </div>
            )
        case 2: 
            return (
                <div>
                    <CharacterCards characterClass={selectedClass} characterRace={selectedRace} CharacterBackground={selectedBackground}/>
                    <h3>Choose your class, race, and background</h3>
                    <p>Your class determines the job or role your character plays in society. Are they a powerful wizard? A thieving rogue? Or a musical bard?</p>
                    <select onChange={onSelectClass}>
                        {Classes.map((c) => <option key={c}>{c}</option>)}
                    </select>

                    <ClassDisplay name={selectedClass} updater={updateClass}/>

                    <p>Your race determines some of your character's abilities as well as your size, movement speed, and the languages you speak.</p>
                    <select onChange={onSelectRace}>
                        {Races.map((c) => <option key={c}>{c}</option>)}
                    </select>

                    <RaceDisplay race={selectedRace}/>


                    <p>Your background provides more specifics on what your character does and what kind of experiences they've had. 
                        Specifically, it provides you with more languages, skill proficiencies, and items.</p>

                    <select onChange={onSelectBackground}>
                        {Backgrounds.map((bg: string) => <option key={bg}>{bg}</option>)}
                    </select>
            

                    <BackgroundDisplay background={selectedBackground}/>


                    <button onClick={nextStep}>Confirm selections and move on.</button>

                </div>
            )
        default: 
            return (<div></div>)
    }

}

export default CreateCharacter