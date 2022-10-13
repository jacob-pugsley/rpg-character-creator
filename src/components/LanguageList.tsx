

import Axios from "axios"
import { execFile } from "child_process"
import { useEffect, useState, useSyncExternalStore } from "react"
import ItemsWithInfo from "./ItemsWithInfo"

/* eslint-disable */

interface Language {
    index: string,
    name: string,
    users: string[],
    url: string
}

interface ItemWithDescription {
    item: string,
    description: string
}


const Fake_Languages: Language[] = []

const Fake_IWDs: ItemWithDescription[] = []

/* eslint-disable */
const LanguageList = (props: any) => {

    const axios = Axios.create()

    const languageList: any[] = props.languages
    
    const [languages, setLanguages] = useState(Fake_Languages)
    const [languagesWithDescriptions, setLanguagesWithDescriptions] = useState(Fake_IWDs)

    useEffect(() => {
        //axios request to get language objects
        for( let i = 0; i < languageList.length; i++ ) {
            axios.get("http://localhost:8080/language?name=" + languageList[i].name.toLowerCase())
            .then((response: any) => {
                let resp = response.data

                const lang: Language = {
                    index: resp.index,
                    name: resp.name,
                    users: resp.users,
                    url: resp.url
                }

                setLanguages((prevState: Language[]) => {
                    if(i == 0) {
                        return [lang]
                    } else {
                        return [...prevState, lang]
                    }
                })
            })
        }
        

    }, [props.languages])


    useEffect(() => {
        //convert language objects to itemwithdescription objects
        for( let i = 0; i < languages.length; i++ ) {
            let desc: string = ""
            if( languages[i].name.toLowerCase() === "common" ) {
                desc = "Common is typically used by all characters to ensure everyone in the party understands the same language, although it is canonically the language of Humans. " + 
                "It is effectively the default for all things spoken or written in character."
            } else {
                desc = languages[i].name + " is typically used by ";

                let usersLength = languages[i].users.length
                for( let j = 0; j < usersLength; j++) {
                    desc = desc + languages[i].users[j]

                    if( j == usersLength-1) {
                        desc = desc + "."
                    } else if( usersLength == 2) {
                        desc = desc + " and "
                    } else if( j == usersLength-2) {
                        desc = desc + ", "
                    }
                }
            }

            const iwg: ItemWithDescription = {
                item: languages[i].name,
                description: desc
            }

            setLanguagesWithDescriptions((prevState: ItemWithDescription[]) => {
                if( i == 0 ){
                    return [iwg]
                } else {
                    return [...prevState, iwg]
                }

            })
            
        }
    }, [languages])

    return (
        <ItemsWithInfo items={languagesWithDescriptions} addProficiency={false} checkable={false} />
    )

    
}

export default LanguageList