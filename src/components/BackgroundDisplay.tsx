import Axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import CharacterInfoDisplay from './CharacterInfoDisplay'
import SkillList from './SkillList'

const Default_Data: any = {"index": "acolyte", "name": "Acolyte", "url": "/api/backgrounds/acolyte", "skills":["Insight","Religion"]}

const BackgroundDisplay = (props: any) => {

    let axios = Axios.create()

    const [data, updateData] = useState(Default_Data);

	useEffect(() => {
        getData()
	}, [props.background])

    useEffect(() => {
        getData()
	}, [])

    const getData = () => {
        axios.get("http://localhost:8080/background?name=" + props.backgroundName.toLowerCase())
		.then((response) => {
			updateData(response.data)
            props.updater(
                {
                    skillProficiencies: response.data.skills
                }
            )
		})
    }

    const onSelectBackground = (val: string) => {
        props.updater(
            {backgroundName: val}
        )
    }

    return (
        <CharacterInfoDisplay title={`Background: ${props.backgroundName}`} updateSelectedName={onSelectBackground} namelist={props.backgroundlist} 
            infotext="Your background provides more specifics on what your character does and what kind of experiences they've had. 
            Specifically, it provides you with more languages, skill proficiencies, and items."
        >
            <div>
                <span >Skill Proficiencies</span>
                <p>Your chosen background gives you some innate advantages in the form of extra skill proficiencies.</p>
                <SkillList skills={data.skills} addProficiency={false} />
            </div>
        </CharacterInfoDisplay>

    )



}

export default BackgroundDisplay