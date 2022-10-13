import { useState, useEffect, ChangeEvent } from "react"

import "./ItemsWithInfo.css"

interface ItemWithDescription {
    item: string,
    description: string
}

interface CheckedSkill {
    skill: string,
    addProfBonus: boolean
}

const Fake_CheckedSkills: CheckedSkill[] = []

const ItemsWithInfo = (props: any) => {

    const Fake_IWD: ItemWithDescription = {
        item: "placeholder",
        description: "Select an item to read its description."
    }

    const Fake_Element = document.createElement("div")

    const [selectedItem, setSelectedItem] = useState(Fake_IWD)
    const [selectedElement, setSelectedElement] = useState(Fake_Element)
    const [checkedSkills, setCheckedSkill] = useState(Fake_CheckedSkills)
    

    const items: ItemWithDescription[] = props.items
    const itemsToDisplay: ItemWithDescription[] = []

    if(props.allowDuplicates) {
        itemsToDisplay.push(...items)
    } else {
        //remove duplicates
        let itemsInList: string[] = []
        for( let i = 0; i < items.length; i++ ) {
            if( itemsInList.includes(items[i].item) ) {
                continue
            } else {
                itemsToDisplay.push(items[i])
                itemsInList.push(items[i].item)
            }
        }
    }
    function newClass(target: Element) {
        let oldClass = target.getAttribute("class")
    
        if (oldClass == null) {
            return ""
        }
    
        return oldClass.replace(" selected", "")
    }

    const selectItem: any = (event: MouseEvent) => {
        let target = event.target as Element;
        let currentClass = target.getAttribute("class")
        target.setAttribute("class", (currentClass == null ? "" : currentClass) + " selected")


        selectedElement.setAttribute(
            "class",
            newClass(target)
        )

        setSelectedItem(items.filter(e => target.innerHTML.includes(e.item))[0])
        setSelectedElement(event.target as HTMLDivElement)
    }

    const selectItemByElement: any = (element: Element) => {
        //select the wrapper list item
        let target = element

        let currentClass = target.getAttribute("class")
        target.setAttribute("class", (currentClass == null ? "" : currentClass) + " selected")


        selectedElement.setAttribute(
            "class",
            newClass(target)
        )
        
        setSelectedItem(items.filter(e => target.innerHTML.includes(e.item))[0])
        setSelectedElement(target as HTMLDivElement)
    }

    const addCheckedSkill = (skill: string) => {
        setCheckedSkill((prevState) => {
            return [...prevState, {skill: skill, addProfBonus: props.addProficiency}]
        })
    }

    const removeCheckedSkill = (skill: string) => {
        setCheckedSkill((prevState) => {
            return [...prevState.filter(el => el.skill !== skill)]
        })
    }

    const changeCheckedSkill = (event: ChangeEvent, skill: string) => {
        const el = event.target as HTMLInputElement;
        
        selectItemByElement(el.parentElement)

        if (el.checked) {
            addCheckedSkill(skill)
        } else {
            removeCheckedSkill(skill)
        }
    }

    const updateParent = () => {
        props.onUpdate(checkedSkills)
    }

    return (        
        <div id="skillListContent">
            <ul id="skillList">
                {itemsToDisplay.map((iwd: ItemWithDescription) => <li onClick={selectItem} key={iwd.item}>
                    {props.checkable && <input type="checkbox" onChange={e => changeCheckedSkill(e, iwd.item)} />}{iwd.item}</li>)}
            </ul>

            <div id="infoDisplay">
                <p>{selectedItem.description}</p>
            </div>

            {props.checkable && <button type="button" onClick={updateParent}>Update selections</button>}
        </div>
    )
}

export default ItemsWithInfo