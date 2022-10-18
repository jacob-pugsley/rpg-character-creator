export interface AbilityScore {
    name: string,
    score: number,
    modifier: number,
    bonus: number,
    isSavingThrow: boolean
}

export interface AbilityScoreBonus {
    ability: string,
    bonus: number
}

export interface RawAbilityScore {
    name: string,
    index: string,
    url: string
}