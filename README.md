# Automator
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FFuhrerredux%2Fautomator.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FFuhrerredux%2Fautomator?ref=badge_shield)


An automated component generation tool for mods

## License

This project was created under the AGPL-3.0 License by Dax0102 and thanasislanaras. See the relative license file for more details.


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FFuhrerredux%2Fautomator.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FFuhrerredux%2Fautomator?ref=badge_large)

## Contributing

Even with the first non-beta version releasing, this tool is still heavily under development, with a lot of features being planned. For this reason, any contributions are welcome.

## Accessibility

This tool was created with accessibility in mind. It is properly resized for smaller/bigger screens, as long as they meet the minimum size. It furthermore has themes (dark, white, auto) and languages (English, German, French, Spanish, Italian and Greek. You can help us expanding this by making a PR with any new locale you'd like, if you know it, that is.

## Notes

This tool supports a multitude of features. Most prominent of which is the character automation. However, there are still a lot of features, such as sprite ordering/fixing, shine generation, event logging/removing, character localisation and more.

---


## What does Automator do?
Automator was originally built using Dart with Flutter as a tool for the Führerredux Team (and sibling mods such as original Fuhrerreich and Kaiserredux) to convert their pre-NSB characters to NSB characters. We later decided to redesign it completely, coding it in Tauri, a Rust toolkit, with Typescript, TailwindCSS and Vue.js used for the scripting, Styling, and UI respectively. This redesign got rid of the character conversion, as we thought it was unneeded, and there was no reason to try incorporating it again to our new version. Thus, we added a lot more stuff, which you'll easily find through exploring

---

### How do I automate creation of characters?

While the aim of the creation of this tool is to automate the creation of the
characters used in the mod; there is also manual work involved. Currently,
there are three ways in adding characters. One is adding a single character
through the character editor clicking the "Create" button, this is ideal when
adding or editing single characters, not ideal when creating batches. An import feature is planned and underway, but it may be a while till it appears.

### How can I add my mod's ideologies and positions to the mod?
Automator was built with the goal of customisation. You can customise a lot of aspects, like ideologies, positions, default character cost, and portrait paths. To do that, you will need to:
1. Go to your user directory,
2. then open `.automator` folder
3. Open/edit file config.json
4. This is the file's format;

```json
{
    "ideologies": {
        "ideologyId": {
            "name": "Localised Name",
            "short": "short"
        },
    },
    "positions": {
        "positionId": {
            "name": "Localised Name",
            "short": "short",
            "hirable": true,
            "removable": true
        }
    },
    "character": {
        "defaultCost": 150,
        "largePortraitPath": "gfx/leaders",
        "smallPortraitPath": "gfx/interface/ministers"
    },
    "localisation": {
        "countryDir": "folder where your mod has the country loc files"
    }
}
```

Now, you'll wonder. What is this 'short'? The short has the value used for position suffixes in advisor tokens. The ideological ones aren't required, and you can not add them, although there is an option inside the settings page to disable the ideological suffixes as well. To add more positions and ideologies, you simply use the JSON syntax to add more key-value pairs.

---

### I added the characters, now what?

If you are done in tweaking the characters, you can export it by clicking the
"Export" button. This will automatically export each character to their character file, creating one if it doesn't exist. This, however, does not add `recruit_character` statements inside your history file. To do that, head over to the others page, and find the recruit characters option. Suppose you want to additionally localise your characters, having a localisation key in the name value and a value in the localisation file. In that case, you can do that through the others page as well. However, this requires you to load and save manually, it doesn't do it automatically for each character you may have. Additionally, it doesn't detect duplicates, so you'd have to do them yourself.

---

### What are traits?

The traits boxes will be populated through combo boxes automatically if you:
- have loaded the relative trait files
- your traits have the relative position short, i.e, if you had entered in the config `hog` which is for the head of government position, then it will try to search the traits file for any traits beginning with `hog`, and add them as options. If you use a different naming convention, sadly you'd have to either enter them yourself on the trait input box, by adjusting the setting converting it into an input, or adding them manually after the export. For some positions additionally, it is required to have a trait, so you will have to either enter gibberish, or the traits yourself to bypass it. There are plans to override this behaviour though, through further customisation.

---


### How about the leader and commander traits from Vanilla?

Those traits are not supported yet, so you'll need to enter them manually.

---

### I encountered an error

If you encounted an error such as the tool crashed or the generated file is
invalid, report it to us, by creating an issue here in GitHub. Note, that we need to know what exactly you were doing, as detailed as possible in order to assist you in the best of our ability.

---

### Where's the Führerredux invite link tho?

Here it is: [Führerredux Discord Server](https://discord.gg/dVT7bHNVgY)