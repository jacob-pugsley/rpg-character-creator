import { useState, useEffect, ChangeEvent } from "react"
import Axios from "axios"
import SkillList, { getShortSkillName } from "../SkillList"
import { AbilityScore, RawAbilityScore } from "../../interfaces/AbilityScore"
import { CharacterClass } from "../../interfaces/CharacterInterfaces"
import { create } from "domain"
import CharacterInfoDisplay from "../CharacterInfoDisplay"

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

const Init_RawAbilities: RawAbilityScore[] = []

const ClassDisplay = (props: any) => {

	//data is what is returned from axios
	const [data, updateData] = useState({} as CharacterClass);
 
	useEffect(() => {
		getData()
	}, [props.className])

	useEffect(() => {
		getData()
	}, [])
	

	const getData = () => {
		axios.get("http://localhost:8080/getabilities")
		.then((response) => {
			const abilities: any = response.data
	
			axios.get("http://localhost:8080/classinfo?name=" + props.className.toLowerCase())
			.then((response) => {
				updateData(response.data)

				props.updater(
					{
						abilityScores: getAbilityScoreObjects(response.data.abilityScores, abilities),	
						skillProficiencies: [],
						proficiencyChoices: response.data.proficiencyChoices,
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
            props.updater(
                {level: parseInt(val) - 1}
            )
        }
	}



    return (
		<CharacterInfoDisplay title={`Class: ${props.className}`} namelist={props.classlist} titleContent={
			<div>
				<div>Hit Die: d{data.hitDie}</div>
				<div>
					<span>Level: </span>
					<select onChange={updateLevel}>
						{[...Array.from({length: 20}, (_, i) => i + 1).keys()].map((level: number) => <option key={level}>{level + 1}</option>)}
					</select>
				</div>
			</div>
			}
			infotext={
				"Your class determines the job or role your character plays in society. Are they a powerful wizard? A thieving rogue? Or a musical bard?"
			}
		>
			<div className="skillListContainerLeft">
				<span>
					Saving Throws
				</span><br /><br />
				<p className="contentP">A <b>saving throw</b> or save is a skill check you make to avoid a bad outcome. The DM may ask you to make a Dexterity save
				if you trigger a trap, or a Wisdom save to avoid a magical effect. You may add your proficiency bonus to saves you make with the following
				abilities:
				</p><br /><br />
				{data.abilityScores !== undefined && <SkillList skills={getSavingThrows(data.abilityScores)} addProficiency={false} checkable={false} />}
			</div>
			<div className="skillListContainerRight">
				<span >
					Skill Proficiencies
				</span><br /><br />
				<p className="contentP">Your <b>skill proficiencies</b> are skills that you are particularly good at. Think about the skills that would best fit
				your character's background as well as your own play style. Choose {data.proficiencyChoices} of the following skills:</p>
				<br /><br /><br /> 
				{data.skillProficiencies !== undefined && <SkillList skills={getSkills(data.skillProficiencies)} addProficiency={true} checkable={true} updater={updateSkills}/>}
			</div>
		</CharacterInfoDisplay>
	)


}

export default ClassDisplay