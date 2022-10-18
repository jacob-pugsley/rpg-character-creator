import ReactTooltip from "react-tooltip"
import { useState, useEffect } from "react"
import Axios from "axios"
import LanguageList from "../LanguageList"
import { CharacterRace } from "../../interfaces/CharacterInterfaces"

const Default_Data = {
	"index": "dragonborn",
	"name": "Dragonborn",
	"speed": 30,
	"ability_bonuses": [
		{
			"ability_score": {
				"index": "str",
				"name": "STR",
				"url": "/api/ability-scores/str"
			},
			"bonus": 2
		},
		{
			"ability_score": {
				"index": "cha",
				"name": "CHA",
				"url": "/api/ability-scores/cha"
			},
			"bonus": 1
		}
	],
	"alignment": "Dragonborn tend to extremes, making a conscious choice for one side or the other in the cosmic war between good and evil. Most dragonborn are good, but those who side with evil can be terrible villains.",
	"age": "Young dragonborn grow quickly. They walk hours after hatching, attain the size and development of a 10-year-old human child by the age of 3, and reach adulthood by 15. They live to be around 80.",
	"size": "Medium",
	"size_description": "Dragonborn are taller and heavier than humans, standing well over 6 feet tall and averaging almost 250 pounds. Your size is Medium.",
	"starting_proficiencies": [],
	"languages": [
		{
			"index": "common",
			"name": "Common",
			"url": "/api/languages/common"
		},
		{
			"index": "draconic",
			"name": "Draconic",
			"url": "/api/languages/draconic"
		}
	],
	"language_desc": "You can speak, read, and write Common and Draconic. Draconic is thought to be one of the oldest languages and is often used in the study of magic. The language sounds harsh to most other creatures and includes numerous hard consonants and sibilants.",
	"traits": [
		{
			"index": "draconic-ancestry",
			"name": "Draconic Ancestry",
			"url": "/api/traits/draconic-ancestry"
		},
		{
			"index": "breath-weapon",
			"name": "Breath Weapon",
			"url": "/api/traits/breath-weapon"
		},
		{
			"index": "damage-resistance",
			"name": "Damage Resistance",
			"url": "/api/traits/damage-resistance"
		}
	],
	"subraces": [],
	"url": "/api/races/dragonborn"
}

interface AbilityScoreBonus {
    name: string,
    bonus: string
}

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


function getAbilityBonuses(abilities: any) {
    let abList: AbilityScoreBonus[] = []

    for( let i = 0; i < abilities.length; i++ ) {
        abList.push(
            {
                name: getFullSkillName(abilities[i].ability_score.name),
                bonus: abilities[i].bonus
            }
        )   
    }

    return abList
}

function getLanguages(languages: any) {
    let langList: string[] = []

    for( let i = 0; i < languages.length; i++) {
        langList.push(languages[i].name)
    }

    return langList
}

const RaceDisplay = (props: any) => {

    const [data, updateData] = useState(Default_Data);

	useEffect(() => {
		getData()
	}, [props.raceName])

	useEffect(() => {
		getData()
	}, [])

	const getData = () => {
		axios.get("http://localhost:8080/raceinfo?name=" + props.raceName.toLowerCase())
		.then((response) => {
			updateData(response.data)
			props.updater(
				{
					languages: response.data.languages,
					bonuses: getAbilityBonuses(response.data.ability_bonuses)
				}
			)
		})
	}

    return (
        <div>
            <ReactTooltip delayHide={5} />
			<div className="block-display">
			<h1>The racial traits for {props.raceName} are:</h1>
			<div className="flex-display">
				<div>Height/weight</div>
			</div>

			<br />
			<div className="flex-display">
				<div>
					<span data-tip="Languages determine what your character can read and speak.">
						Languages
					</span>
					<p>You will be able to speak and read the following languages by virtue of your chosen race.</p>
					<LanguageList languages={data.languages} />
				</div>

				<div>
					<span data-tip="This will be added to the ability score from your class.">Ability Score Bonuses</span>
					<p>Your chosen race gives you some innate advantages in the form of ability bonuses.</p>
					<ul>
						{getAbilityBonuses(data.ability_bonuses).map((ability) => <li key={ability.name}>{ability.bonus} to {ability.name}</li>)}
					</ul>
				</div>
			</div>
		</div>

			



        </div>
    )


}

export default RaceDisplay