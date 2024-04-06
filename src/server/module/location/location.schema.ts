import {object,type Output, number, optional} from 'valibot'

export const getCityNameSchema = object({
    altitude:optional(number(),-181),
    longitude:optional(number(),-181),
})

export type GetCityNameParams = Output<typeof getCityNameSchema>


export type LocationRequest = {
    name:        string;
    local_names:  {[key: string]: string};
    lat:         number;
    lon:         number;
    country:     string;
    state:       string;
}

export type LocalNames = {
    
    zh: string;
    tl: string;
    de: string;
    fa: string;
    cs: string;
    id: string;
    et: string;
    ru: string;
    nn: string;
    en: string;
    ar: string;
    fi: string;
    ko: string;
    vi: string;
    mg: string;
    pl: string;
    ja: string;
    ur: string;
    it: string;
    fr: string;
    da: string;
    eu: string;
    tr: string;
    no: string;
    es: string;
    sv: string;
    ki: string;
    af: string;
    nl: string;
}
