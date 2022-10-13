import Axios from 'axios'
import { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import { CharacterBackground } from '../interfaces/CharacterInterfaces'
import SkillList from './SkillList'

const Fake_Backgrounds: string[] = []

const Default_Data: any = {"index": "acolyte", "name": "Acolyte", "url": "/api/backgrounds/acolyte", "skills":["Insight","Religion"]}

const BackgroundDisplay = (props: any) => {

    let axios = Axios.create()

    const background: CharacterBackground = props.background

    const [data, updateData] = useState(Default_Data);

	useEffect(() => {
		axios.get("http://localhost:8080/background?name=" + background.backgroundName.toLowerCase())
		.then((response) => {
			updateData(response.data)
		})
	}, [props.background])

    return (
        <div>
            <ReactTooltip delayHide={5} />
            <div className="block-display">
                <h1>The background traits for {background.backgroundName} are:</h1>
                <div className="flex-display">
                    <div>Height/weight</div>
                </div>

                <br />
                <div className="flex-display">
                    <div>
                        <span data-tip="You may add your proficieny bonus to each of these if you have not already done so through your class.">Skill Proficiencies</span>
                        <p>Your chosen background gives you some innate advantages in the form of extra skill proficiencies.</p>
                        <SkillList skills={data.skills} addProficiency={false}/>
                    </div>
                </div>
            </div>
        </div>

    )



}

export default BackgroundDisplay