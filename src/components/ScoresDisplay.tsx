import Axios from "axios"
import { stringify } from "node:querystring"
import { useEffect, useReducer, useState } from "react"
import { isFunctionDeclaration } from "typescript"
import { AbilityScore, AbilityScoreBonus } from "../interfaces/AbilityScore"
import { getFullSkillName, getShortSkillName } from "./SkillList"

import "./ScoresDisplay.css"

interface AbilityDisplay {
    abName: string,
    abScore: number,
    abModifier: number,
    abBonus: number,
    displayColor: string,

    skills: [
        {
            skillName: string,
            isProficient: boolean
        }
    ]
}

const AbilityScoreNames: string[] = [
    "Strength",
    "Dexterity",
    "Constitution",
    "Charisma",
    "Wisdom",
    "Intelligence"
]

const axios = Axios.create()

const ScoresDisplay = (props: any) => {

    const [data, updateData] = useState({})
    //ability name, score, saving throw

    const skillProfs: string[] = props.skillProfs
    //names of skills that we are proficient in



    //list of abilities mapped to bonuses
    const Init_AbDisplay: AbilityDisplay[] = []

    const getSkillColor = (skillName: string) => {
		switch( skillName.toLowerCase() ) {
			case "str": return "gray"
			case "con": return "red"
			case "dex": return "yellow"
			case "wis": return "blue"
			case "int": return "green"
			case "cha": return "pink"
			default: return ""
		}
	}

    const [abilityDisplay, setAbilityDisplay] = useState( () =>
        {
            let result: AbilityDisplay[] = []

            for( let i = 0; i < AbilityScoreNames.length; i++ ) {
                const abDisplay: AbilityDisplay = {
                    abName: AbilityScoreNames[i],
                    abScore: 0, //these three are set to defaults because they require other properties (separate updates)
                    abModifier: 0,
                    abBonus: 0,
                    displayColor: getSkillColor(getShortSkillName(AbilityScoreNames[i].toLowerCase())),
    
                    skills: [{
                        skillName: "",
                        isProficient: false
                    }]
                }
                result.push(abDisplay)
            }

            return result
        } 
    )

    if( abilityDisplay === undefined ) {
        return <div>Could not load ability display.</div>
    }

    const abilityScores: number[] = props.abilityScores

    const proficiencyBonus = () => {
        const lvl: number = props.level
        if (lvl < 4) {
            return 2
        } else if (lvl < 8) {
            return 3
        } else if (lvl < 12) {
            return 4
        } else if (lvl < 16) {
            return 5
        } else {
            return 6
        }
    }

    const makeRequest = () => {
        //get the ability score names from the api
        axios({
            method: "post",
            url: "http://localhost:8080/skilllist",
            data: ["Acrobatics","Animal Handling","Arcana","Athletics","Deception","History","Insight","Intimidation","Investigation","Medicine","Nature","Perception","Performance","Persuasion","Religion","Sleight of Hand","Stealth","Survival"]
        }).then((response) => {
            updateData(response.data)
        })
    }

    const setAbilityScores = () => {
        console.log("at setAbilityScores")
        console.log(abilityDisplay)
        console.log(abilityScores)
        
        const temp: AbilityDisplay[] = [...abilityDisplay]

        for(let i = 0; i < abilityDisplay.length; i++) {
            temp[i].abScore = abilityScores[i]    
        }

        setAbilityDisplay(temp)

    }

    const setAbilityBonuses = () => {
        const temp: AbilityDisplay[] = [...abilityDisplay]

        for( let i = 0; i < temp.length; i++ ) {
            let hasBonus: boolean = false
            for( let j = 0; j < props.bonuses.length; j++ ) {
                if( props.bonuses[j].name.toLowerCase() === temp[i].abName.toLowerCase()) {
                    temp[i].abBonus = props.bonuses[j].bonus
                    hasBonus = true
                }
            }

            if( !hasBonus ) {
                temp[i].abBonus = 0
            }
        }

        setAbilityDisplay(temp)
    }

    const setAbilityModifiers = () => {
        const temp: AbilityDisplay[] = [...abilityDisplay]
        for( let i = 0; i < temp.length; i++ ) {
            
            temp[i].abModifier = Math.floor(((temp[i].abScore + temp[i].abBonus) - 10) / 2)
        }
        setAbilityDisplay(temp)
    }

    const setSkillProficiencies = () => {
        const temp: AbilityDisplay[] = [...abilityDisplay]
        for( let i = 0; i < abilityDisplay.length; i++ ) {
            //updateDisplayAtIndex({skills:  getSkillsWithProficiencyFromAbility(getShortSkillName(AbilityScoreNames[i]).toLowerCase(), skillProfs, data)}, i)
            temp[i].skills = getSkillsWithProficiencyFromAbility(getShortSkillName(AbilityScoreNames[i]).toLowerCase(), skillProfs, data)
        }
        setAbilityDisplay(temp)
    }

    const initAbilityDisplays = () => {
        //create all the ability displays with initial values
        let result: AbilityDisplay[] = []

        for( let i = 0; i < AbilityScoreNames.length; i++ ) {
            const abDisplay: AbilityDisplay = {
                abName: AbilityScoreNames[i],
                abScore: 0, //these three are set to defaults because they require other properties (separate updates)
                abModifier: 0,
                abBonus: 0,
                displayColor: getSkillColor(getShortSkillName(AbilityScoreNames[i].toLowerCase())),

                skills: [{
                    skillName: "",
                    isProficient: false
                }]
            }
            result.push(abDisplay)
        }
        console.log("abdisplay")
        console.log(result)

        
    }

    useEffect(() => {
        initAbilityDisplays()

        makeRequest()
    }, [])

    useEffect(() => {
        setAbilityBonuses()
        setAbilityModifiers()
    }, [props.bonuses])

    useEffect(() => {
        setSkillProficiencies()
    }, [props.level])

    useEffect(() => {
        setSkillProficiencies()
    }, [props.skillProfs])

    useEffect(() => {
        setAbilityScores()
        setAbilityBonuses()
        setAbilityModifiers()
        setSkillProficiencies()
    }, [props.abilityScores, data])



    function getSkillsWithProficiencyFromAbility(ability: string, skillProfs: string[], dataset: any) {
        const skills: string[] = getSkillsWithAbility(ability, dataset)

        const skillsWithProf: any = skills.map((el: string) => {
            return {
                skillName: getFullSkillName(el),
                isProficient: skillProfs.includes(getFullSkillName(el))
            }
        })

        return skillsWithProf
    
    }


    function getSkillsWithAbility(ability: string, dataset: any) {
        const skills: string[] = []
        for( let i = 0; i < dataset.length; i++ ) {
            const curr: any = dataset[i]
            if( curr.abilityScoreName.toLowerCase() === ability ) {
                skills.push(curr.name)
            }
        }
        return skills
    }

    return ( 
        <div>
            <div className="abilityBoxHolder">

                {abilityDisplay.map((abDisplay: AbilityDisplay) =>
                <div key={abDisplay.abName}>
                    <p className="abilityTitleP">
                        {abDisplay.abName} {isNaN(abDisplay.abScore) ? 0 : abDisplay.abScore}
                        
                        
                        
                        
                        {abDisplay.abBonus != 0 && "+" + abDisplay.abBonus} <br />&nbsp;&nbsp;
                        <b>({(abDisplay.abModifier >= 0 ? "+" : "") + abDisplay.abModifier})</b>
                    </p> 
                    <div className={"abilityBox " + abDisplay.displayColor}>
                        {abDisplay.abName === "Constitution" &&
                        <p>There are no skills <br /> associated with Constitution.</p>}


                        <ul className="abilityBoxUl">   
                            {abDisplay.skills.map((skill: any) => 
                                <li key={skill.skillName}
                                    className={skill.isProficient ? "proficientSkill" : ""}
                                >
                                    {skill.skillName} {(abDisplay.abModifier >= 0 ? "+" : "")} {abDisplay.abModifier + 
                                    (skill.isProficient ? proficiencyBonus() : 0)}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                )}
            </div>
        </div>

    )



}

export default ScoresDisplay