// import useSettingsStore from "@/stores/settings"
import { BaseDirectory, removeFile, writeFile } from '@tauri-apps/api/fs'


// const settingsStore = useSettingsStore()
const configPath = '.automator/data/config.json'

const krIdeologies = {
    "ideologies": {
        "totalist" : { name: "Totalist", short: "tot" },
        "syndicalist" : { name: "Syndicalist", short: "syn" },
        "radical_socialist" : { name: "Radical Socalism", short: "rso" },
        "social_democrat" : { name: "Social Democrat", short: "sde" },
        "social_liberal" : { name: "Social Liberal", short: "sli" },
        "market_liberal" : { name: "Market Liberal", short: "mli" },
        "social_conservative" : { name: "Social Conservative", short: "sco" },
        "authoritarian_democrat" : { name: "Authoritarian Democrat", short: "ade" },
        "paternal_autocrat" : { name: "Paternal Autocrat", short: "pau" },
        "national_populist" : { name: "National Populist", short: "npo" },
    }, 
    "positions": {
        "second_in_command": { name: "Second in Command", short: "sic"},
        "political_advisor": { name: "Political Advisor", short: "pol"},
    }
}

const vanillaIdeologies = {
    "ideologies": {
        "communist" : { name: "Communist", short: "com" },
        "non_aligned" : { name: "Non-Aligned", short: "nal" },
        "democrat" : { name: "Democrat", short: "dem" },
        "fascist" : { name: "Fascist", short: "fas" },
    }, 
    "positions": {
        "political_advisor": { name: "Political Advisor", short: "pol"},
    }
}

export default async function useConfigurationPresets(val :number) {
    switch (val) {
        case 0: // just delete file if you gon use FX ideologies
            // await settingsStore.updateSetting('customConfig', false)
            await removeFile(
                '.automator/data/config.json',
                { dir: BaseDirectory.Home }
            )
            break;
        case 1:
            const krContent = await JSON.stringify(krIdeologies, null, 2)
            await writeFile(configPath, krContent, { dir: BaseDirectory.Home})
            break;
        case 2:
            const vanContent = await JSON.stringify(vanillaIdeologies, null, 2)
            await writeFile(configPath, vanContent, { dir: BaseDirectory.Home})
            break;
        default:
            console.error('Undefined parameter in useConfigurationPresets:', val)
            break;
    }
}