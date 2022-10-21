import { MouseEventHandler, useEffect, useState } from "react"
import Axios from "axios"
import ItemsWithInfo from "./ItemsWithInfo"
import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils"


interface ItemWithDescription {
    item: string,
    description: string
}

function newClass(target: Element) {
    let oldClass = target.getAttribute("class")

    if (oldClass == null) {
        return ""
    }

    return oldClass.replace(" selected", "")
}

export function getShortSkillName(skill: string) {
    skill = skill.toLowerCase()
    switch(skill) {
        case "strength": return "str"
        case "dexterity": return "dex"
        case "intelligence": return "int"
        case "wisdom": return "wis"
        case "constitution": return "con"
        case "charisma": return "cha"
        default: return skill
    }
}

export function getFullSkillName(skill: string) {
    skill = skill.toLowerCase()
    switch(skill) {
        case "str": return "Strength"
        case "con": return "Constitution"
        case "dex": return "Dexterity"
        case "cha": return "Charisma"
        case "int": return "Intelligence"
        case "wis": return "Wisdom"
		default: return skill.substring(0, 1).toUpperCase() + skill.substring(1)
    }
}

const SkillList = (props:any) => {

    const axios = Axios.create()
    
    const skills: string[] = props.skills

    const Default_List: ItemWithDescription[] = []

    const [skillList, setSkillList] = useState(Default_List)

    useEffect(() => {
        const shortSkills: string[] = []
        for( let i = 0; i < skills.length; i++ ){
            shortSkills.push(getShortSkillName(skills[i]))
        }
    }, [])

	useEffect(() => {
        const shortSkills: string[] = []
        for( let i = 0; i < skills.length; i++ ){
            shortSkills.push(getShortSkillName(skills[i]))
        }
        axios({
            url: 'http://localhost:8080/skilllist',
            method: 'post',
            data: shortSkills
            })
        .then((response) => {
            const iwds: ItemWithDescription[] = []
            for( let i = 0; i < response.data.length; i++ ){
                let iwd: ItemWithDescription = {
                    item: getFullSkillName(response.data[i].name),
                    description: response.data[i].desc
                } 

                iwds.push(iwd)
            }

            setSkillList(iwds)
        })
	}, [props.skills])

    const [selectedSkills, updateSelectedSkills] = useState([""])

    useEffect(() => {
        if (props.updater) {
            props.updater(selectedSkills)
        }
    }, [selectedSkills])


    const updateSkills = (skills: string[]) => {

        updateSelectedSkills(skills)
    }

    return (
        <ItemsWithInfo items={skillList} allowDuplicates={false} addProficiency={props.addProficiency} checkable={props.checkable} 
        maxChecked={props.maxChecked} onUpdate={updateSkills}/>
    )

}

export default SkillList