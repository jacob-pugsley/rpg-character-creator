import { useState, useEffect } from "react"
import Axios from "axios"
import SkillList from "../SkillList"

import "./ClassDisplay.css"
import { AbilityScore } from "../../interfaces/AbilityScore"

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


	for( let sk=0; sk < skills.from.options.length; sk++ ) {
		skillList.push(skills.from.options[sk].item.name.split("Skill: ")[1])
	}
	return skillList
}

const getSavingThrows = (savingThrows: any) => {
	const skillList: string[] = []
	for( let sk=0; sk < savingThrows.length; sk++ ) {
		if (savingThrows[sk] === undefined || savingThrows[sk].name === undefined) {
			return
		}
			skillList.push(getFullSkillName(savingThrows[sk].name))
	}
	return skillList
	
}

const getSavingThrowList = (savingThrows: any[]) => {
	const throwList: AbilityScore[] = []
	for( let i = 0; i < savingThrows.length; i++ ){
		const savingThrow: any = savingThrows[i]

		let abScore: AbilityScore = {
			...savingThrow,
			score: 0,
			isSavingThrow: true
		}

		throwList.push(abScore)
	}
	return throwList
}

//hardcode the data for a barbarian here to avoid data being undefined
const Default_Data = {
	"index": "barbarian",
	"name": "Barbarian",
	"hit_die": 12,
	"proficiency_choices": [
		{
			"desc": "Choose two from Animal Handling, Athletics, Intimidation, Nature, Perception, and Survival",
			"choose": 2,
			"type": "proficiencies",
			"from": {
				"option_set_type": "options_array",
				"options": [
					{
						"option_type": "reference",
						"item": {
							"index": "skill-animal-handling",
							"name": "Skill: Animal Handling",
							"url": "/api/proficiencies/skill-animal-handling"
						}
					},
					{
						"option_type": "reference",
						"item": {
							"index": "skill-athletics",
							"name": "Skill: Athletics",
							"url": "/api/proficiencies/skill-athletics"
						}
					},
					{
						"option_type": "reference",
						"item": {
							"index": "skill-intimidation",
							"name": "Skill: Intimidation",
							"url": "/api/proficiencies/skill-intimidation"
						}
					},
					{
						"option_type": "reference",
						"item": {
							"index": "skill-nature",
							"name": "Skill: Nature",
							"url": "/api/proficiencies/skill-nature"
						}
					},
					{
						"option_type": "reference",
						"item": {
							"index": "skill-perception",
							"name": "Skill: Perception",
							"url": "/api/proficiencies/skill-perception"
						}
					},
					{
						"option_type": "reference",
						"item": {
							"index": "skill-survival",
							"name": "Skill: Survival",
							"url": "/api/proficiencies/skill-survival"
						}
					}
				]
			}
		}
	],
	"proficiencies": [
		{
			"index": "light-armor",
			"name": "Light Armor",
			"url": "/api/proficiencies/light-armor"
		},
		{
			"index": "medium-armor",
			"name": "Medium Armor",
			"url": "/api/proficiencies/medium-armor"
		},
		{
			"index": "shields",
			"name": "Shields",
			"url": "/api/proficiencies/shields"
		},
		{
			"index": "simple-weapons",
			"name": "Simple Weapons",
			"url": "/api/proficiencies/simple-weapons"
		},
		{
			"index": "martial-weapons",
			"name": "Martial Weapons",
			"url": "/api/proficiencies/martial-weapons"
		},
		{
			"index": "saving-throw-str",
			"name": "Saving Throw: STR",
			"url": "/api/proficiencies/saving-throw-str"
		},
		{
			"index": "saving-throw-con",
			"name": "Saving Throw: CON",
			"url": "/api/proficiencies/saving-throw-con"
		}
	],
	"saving_throws": [
		{
			"index": "str",
			"name": "STR",
			"url": "/api/ability-scores/str"
		},
		{
			"index": "con",
			"name": "CON",
			"url": "/api/ability-scores/con"
		}
	],
	"starting_equipment": [
		{
			"equipment": {
				"index": "explorers-pack",
				"name": "Explorer's Pack",
				"url": "/api/equipment/explorers-pack"
			},
			"quantity": 1
		},
		{
			"equipment": {
				"index": "javelin",
				"name": "Javelin",
				"url": "/api/equipment/javelin"
			},
			"quantity": 4
		}
	],
	"starting_equipment_options": [
		{
			"desc": "(a) a greataxe or (b) any martial melee weapon",
			"choose": 1,
			"type": "equipment",
			"from": {
				"option_set_type": "options_array",
				"options": [
					{
						"option_type": "counted_reference",
						"count": 1,
						"of": {
							"index": "greataxe",
							"name": "Greataxe",
							"url": "/api/equipment/greataxe"
						}
					},
					{
						"option_type": "choice",
						"choice": {
							"desc": "any martial melee weapon",
							"choose": 1,
							"type": "equipment",
							"from": {
								"option_set_type": "equipment_category",
								"equipment_category": {
									"index": "martial-melee-weapons",
									"name": "Martial Melee Weapons",
									"url": "/api/equipment-categories/martial-melee-weapons"
								}
							}
						}
					}
				]
			}
		},
		{
			"desc": "(a) two handaxes or (b) any simple weapon",
			"choose": 1,
			"type": "equipment",
			"from": {
				"option_set_type": "options_array",
				"options": [
					{
						"option_type": "counted_reference",
						"count": 2,
						"of": {
							"index": "handaxe",
							"name": "Handaxe",
							"url": "/api/equipment/handaxe"
						}
					},
					{
						"option_type": "choice",
						"choice": {
							"desc": "any simple weapon",
							"choose": 1,
							"type": "equipment",
							"from": {
								"option_set_type": "equipment_category",
								"equipment_category": {
									"index": "simple-weapons",
									"name": "Simple Weapons",
									"url": "/api/equipment-categories/simple-weapons"
								}
							}
						}
					}
				]
			}
		}
	],
	"class_levels": "/api/classes/barbarian/levels",
	"multi_classing": {
		"prerequisites": [
			{
				"ability_score": {
					"index": "str",
					"name": "STR",
					"url": "/api/ability-scores/str"
				},
				"minimum_score": 13
			}
		],
		"proficiencies": [
			{
				"index": "shields",
				"name": "Shields",
				"url": "/api/proficiencies/shields"
			},
			{
				"index": "simple-weapons",
				"name": "Simple Weapons",
				"url": "/api/proficiencies/simple-weapons"
			},
			{
				"index": "martial-weapons",
				"name": "Martial Weapons",
				"url": "/api/proficiencies/martial-weapons"
			}
		]
	},
	"subclasses": [
		{
			"index": "berserker",
			"name": "Berserker",
			"url": "/api/subclasses/berserker"
		}
	],
	"url": "/api/classes/barbarian"
}

interface CharacterClass {
    className: string, //class name e.g. Wizard, Rogue
    hitDie: number, //hit die e.g. 8, 6
    savingThrows: string[], //saving throws e.g. Strength, Dexterity
    skillProficiencies: string[] //proficiencies e.g. Acrobatics, Stealth
}

let Init_Class: CharacterClass;



const ClassDisplay = (props: any) => {

	//data is what is returned from axios
	const [data, updateData] = useState(Default_Data);

	//classData is what comes from the parent, and will need to be
	//  updated when new data is retrieved
	const [classData, updateClassData] = useState(props.name)

	useEffect(() => {
		axios.get("http://localhost:8080/classinfo?name=" + classData.className.toLowerCase())
		.then((response) => {
			updateData(response.data)
			updateParent()
		})
	}, [props.name])

	//update the parent whenever the classData is modified
	useEffect(() => {
		updateParent()
	}, [classData])

	//this should update the name prop passed by our parent
	//  when the data is retrieved from axios or otherwise updated
	const updateParent = () => {
		props.updater(classData)
	}

	const updateSkills = (skills: string[]) => {
		updateClassData((prevState: any) => {
			return {...prevState, skillProficiencies: skills}
		})
	}

	const updateAbilityScores = (abScores: AbilityScore[]) => {
		updateClassData((prevState: any) => {
			return {...prevState, abilityScores: abScores}
		})
	}

	//update the ability scores only when the name property changes
	//  as they are locked to the chosen class
	useEffect(() => {
		const list: AbilityScore[] = getSavingThrowList(data.saving_throws)
		console.log(list)
		updateAbilityScores(list)
	}, [classData.className])

    return (
		<div className="block-display">
			<h1>The class info for {data.name} is:</h1>
			<div className="flex-display">
				<div>Hit Die: d{data.hit_die}</div>

			</div>
			<div className="flex-display">
				<div>
					<span data-tip={"Your saving throws determine how easily you can get out of bad situations. " + 
					"For example, a good Strength bonus will help you to lift a heavy object off of your body."}>
						Saving Throws
					</span>
					<p>You will have a better chance of escaping using the following skills.</p>
					<SkillList skills={getSavingThrows(data.saving_throws)} addProficiency={false} checkable={false} />
				</div>
				<div>
					<span data-tip={"Your skill proficiencies determine your strengths and weaknesses. For example, deception determines how effectively you can stretch the truth."}>
						Skill Proficiencies
					</span>
					<p>Choose {data.proficiency_choices[0].choose} of the following skills to become better at than others.</p> 
					<SkillList skills={getSkills(data.proficiency_choices[0])} addProficiency={true} checkable={true} updater={updateSkills}/>
				</div>
			</div>
		</div>
	)


}

export default ClassDisplay