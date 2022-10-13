export interface Character {
    pcName: string, //the player character's name
    pcLevel: number, //the character's starting level
    pcClass: CharacterClass, //class
    pcRace: CharacterRace, //race
    pcBackground: CharacterBackground //background
}

export interface CharacterClass {
    className: string, //class name e.g. Wizard, Rogue
    hitDie: number, //hit die e.g. 8, 6
    savingThrows: string[], //saving throws e.g. Strength, Dexterity
    skillProficiencies: string[] //proficiencies e.g. Acrobatics, Stealth
}

export interface CharacterRace {
    raceName: string, //e.g. Orc, Human
    languages: string[], //e.g. common, draconic
    bonuses: string[], //e.g. +2 to Charisma
}

export interface CharacterBackground {
    backgroundName: string, //e.g. Acolyte
    skillProficiencies: string[], //e.g. Acrobatics, Stealth
}