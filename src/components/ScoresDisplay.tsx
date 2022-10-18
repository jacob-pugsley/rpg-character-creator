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

const axios = Axios.create()

const ScoresDisplay = (props: any) => {

    const [data, updateData] = useState({})
    //ability name, score, saving throw

    const skillProfs: string[] = props.skillProfs
    //names of skills that we are proficient in

    const bonuses: AbilityScoreBonus[] = props.abScoreBonuses
    //list of abilities mapped to bonuses
    const Init_AbDisplay: AbilityDisplay[] = []

    const [abilityDisplay, setAbilityDisplay] = useState(Init_AbDisplay)


    const updateAbilityDisplay = (abDisplay: AbilityDisplay) => {
        setAbilityDisplay((prevState) => {

            //make sure the update doesn't already exist in the list
            for( let i = 0; i < prevState.length; i++ ) {
                if( prevState[i].abName === abDisplay.abName) {
                    return [...prevState]
                }
            }
            //if it does not, then add it to the end
            return [...prevState, abDisplay]
        })
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

    //first, update the props.abScores with bonuses
    useEffect(() => {
        setAbilityDisplay(Init_AbDisplay)
        makeRequest()
    }, [])

    useEffect(() => {
        setAbilityDisplay(Init_AbDisplay)
        makeRequest();
    }, [props])

    useEffect(() => {
        for( let j = 0; j < props.abScores.length; j++ ) {
           
            //then, create a new ability display object
            const abDisplay: AbilityDisplay = {
                abName: props.abScores[j].name,
                abScore: props.abScores[j].score,
                abModifier: 0,
                abBonus: 0,
                displayColor: getSkillColor(getShortSkillName(props.abScores[j].name.toLowerCase())),

                skills: getSkillsWithProficiencyFromAbility(getShortSkillName(props.abScores[j].name).toLowerCase(), skillProfs, data)
            }

            for( let i = 0; i < props.bonuses.length; i++ ) {
                if( props.bonuses[i].name === abDisplay.abName ) {
                    abDisplay.abBonus = props.bonuses[i].bonus
                    break
                }
            }

            //then, calculate the ab score modifier
            abDisplay.abModifier = Math.floor(((props.abScores[j].score + props.abScores[j].bonus) - 10) / 2)

            //and add it to the list
            //setAbilityDisplay(abDisplay)
            updateAbilityDisplay(abDisplay)
        }
    }, [data])

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
        <div className="abilityBoxHolder">
            {abilityDisplay.map((abDisplay: AbilityDisplay) =>
            <div key={abDisplay.abName}>
                <p className="abilityTitleP">
                    {abDisplay.abName} {abDisplay.abScore} {abDisplay.abBonus != 0 && "+" + abDisplay.abBonus} <br />&nbsp;&nbsp;
                    <b>(+{abDisplay.abModifier})</b>
                </p> 
                <div className={"abilityBox " + abDisplay.displayColor}>
                    {abDisplay.abName === "Constitution" &&
                    <p>There are no skills <br /> associated with Constitution.</p>}


                    <ul className="abilityBoxUl">   
                        {abDisplay.skills.map((skill: any) => 
                            <li key={skill.skillName}>
                                {skill.skillName} +{abDisplay.abModifier + 
                                (skill.isProficient ? props.level : 0)}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            )}
        </div>
    )



}

export default ScoresDisplay