import { useState, useEffect, ChangeEvent } from "react"
import Axios from "axios"
import SkillList, { getShortSkillName } from "../SkillList"

import "./ClassDisplay.css"
import { AbilityScore, RawAbilityScore } from "../../interfaces/AbilityScore"
import { CharacterClass } from "../../interfaces/CharacterInterfaces"
import { create } from "domain"

/* eslint-disable */
const axios = Axios.create()

function getFullSkillName(skill: string) {
    skill = skill.toLowerCase()
    switch(skill) {
        case "str": return "Strength"
        case "con": return "Constitution"
        case "dex": return "Dexterity"
        case "cha": return "Charisma"
        case "int": return "Intelligence"
        case "wis": return "Wisdom"
		default: return ""
    }
}

const getSkills = (skills: any) => {
	const skillList: string[] = []

	for( let sk=0; sk < skills.length; sk++ ) {
		skillList.push(skills[sk])
	}
	return skillList
}

const getSavingThrows = (savingThrows: any) => {
	const skillList: string[] = []
	for( let sk=0; sk < savingThrows.length; sk++ ) {
		skillList.push(getFullSkillName(savingThrows[sk]))
	}
	return skillList
	
}

//hardcode the data for a barbarian here to avoid data being undefined
const Default_Data = {
	"hitDie": 8,
	"abilityScores": [
		"DEX",
		"INT"
	],
	"skillProficiencies": [
		"Acrobatics",
		"Athletics",
		"Deception",
		"Insight",
		"Intimidation",
		"Investigation",
		"Perception",
		"Performance",
		"Persuasion",
		"Sleight of Hand",
		"Stealth"
	],
	"proficiencyBonuses": [
		2,
		2,
		2,
		2,
		3,
		3,
		3,
		3,
		4,
		4,
		4,
		4,
		5,
		5,
		5,
		5,
		6,
		6,
		6,
		6
	],
	"choices": 4,
	"index": "rogue",
	"name": "Rogue",
	"url": "/api/classes/rogue"
}

const abilityScores: string[] = [
	"Strength",
	"Constitution",
	"Dexterity",
	"Charisma",
	"Intelligence",
	"Wisdom"
]

const Init_RawAbilities: RawAbilityScore[] = []

const ClassDisplay = (props: any) => {

	//data is what is returned from axios
	const [data, updateData] = useState(Default_Data);
	const [abilities, updateAbilities] = useState(Init_RawAbilities)
 
	useEffect(() => {
		getData()
	}, [props.className])

	useEffect(() => {
		getData()
	}, [])
	

	const getData = () => {
		axios.get("http://localhost:8080/getabilities")
		.then((response) => {
			updateAbilities(response.data)
			const abilities: any = response.data
	
			axios.get("http://localhost:8080/classinfo?name=" + props.className.toLowerCase())
			.then((response) => {
				updateData(response.data)

				props.updater(
					{
						abilityScores: getAbilityScoreObjects(response.data.abilityScores, abilities),	
						skillProficiencies: [],
						hitDie: response.data.hitDie
					}
				)
			})
		})
	}

	const updateSkills = (skills: string[]) => {
		props.updater({skillProficiencies: skills})
	}

	const getAbilityScoreObjects = (abScores: any, basicAbilities: any) => {
		const usedAbilities: string[] = []
		const result: AbilityScore[] = []
		for(let i = 0; i < abScores.length; i++) {
			result.push(createAbilityScore(abScores[i], false))
			usedAbilities.push(
				getShortSkillName(abScores[i].toLowerCase())
			)
		}

		//now add the ability scores that aren't saving throws
		for( let i = 0; i < basicAbilities.length; i++ ) {
			if( !usedAbilities.includes(basicAbilities[i].name.toLowerCase()) ) {
				result.push(createAbilityScore(basicAbilities[i].name, false))
			}
		}

		return result
	}

	const createAbilityScore = (abScore: any, savingThrow: boolean) => {
		const temp: AbilityScore = {
			name: getFullSkillName(abScore),
			score: Math.floor(Math.random() * (20 - 10 + 1	)) + 10,
			isSavingThrow: savingThrow,
			bonus: 0,
			modifier: 0
		}
		return temp
	}

	const updateLevel = (event: ChangeEvent) => {
        let el = event.target as HTMLSelectElement;
        let val = el.value

        if (val != null) {
            //setClassName(val)
            props.updater(
                {level: data.proficiencyBonuses[parseInt(val)-1]}
            )
        }
	}



    return (
		<div className="block-display">
			<h1>The class info for {data.name} is:</h1>
			<div className="flex-display">
				<div>Hit Die: d{data.hitDie}</div>
				<select onChange={updateLevel}>
					{[...Array(20).keys()].map((level: number) => <option key={level}>{level + 1}</option>)}
				</select>
			</div>
			<div className="flex-display">
				<div>
					<span>
						Saving Throws
					</span>
					<p>You will have a better chance of escaping using the following skills.</p>
					<SkillList skills={getSavingThrows(data.abilityScores)} addProficiency={false} checkable={false} />
				</div>
				<div>
					<span >
						Skill Proficiencies
					</span>
					<p>Choose {data.choices} of the following skills to become better at than others.</p> 
					<SkillList skills={getSkills(data.skillProficiencies)} addProficiency={true} checkable={true} updater={updateSkills}/>
				</div>
			</div>
		</div>
	)


}

export default ClassDisplay