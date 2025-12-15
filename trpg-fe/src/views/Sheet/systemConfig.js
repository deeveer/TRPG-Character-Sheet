
export default {
    DND5e:{
        pages:[{
            name:"info",
            component:"DND5eInfo",
        },{
            name:"skill_equip",
            component: "DND5eEquip"
        },{
            name: "background",
            component: "DND5eStory",
        },{
            name: "spell",
            component: "DND5eSpell",
        }],
        props:{
            info: {
                author: "",
                name: "",
                permission: "所有人",
                system:"DND5e"
            },
            stat: {
                stat: {
                    str: 10,
                    dex: 10,
                    con: 10,
                    wis: 10,
                    int: 10,
                    cha: 10
                },
                inspiration: 0,
                passive_wisdom: 0,
                pro: 0,
                armorValue: 0,
                initiative: 0,
                speed: "",
                max_hp: 0,
                hp: 0,
                temp_hp: 0,
                hit_dice_total: 0,
                hit_dice: 0,
                death_save: "00",
                savings: [],
                skills: [],
                skill_multiplier: {}
            },
            story: {
                height: "",
                skin: "",
                age: "",
                weight: "",
                hair: "",
                pupil: "",
                trait: "",
                alignment: "",
                backstory: "",
                otherTrait: "",
                personality: "",
                ideals: "",
                bonds: "",
                flaws: "",
                note: ""
            },
            equip: {
                attack: {
                    first: "",
                    second: "",
                    third: "",
                    spells: ""
                },
                money: {
                    cp: 0,
                    sp: 0,
                    ep: 0,
                    gp: 0,
                    pp: 0
                },
                equipment: "",
                treasure: "",
                language: ""

            },
            spell: {
                spell_class: "",
                spell_ability: "",
                spell_save: 0,
                spell_bonus: 0,
                spell: {
                    "0": [],
                    "1": [],
                    "2": [],
                    "3": [],
                    "4": [],
                    "5": [],
                    "6": [],
                    "7": [],
                    "8": [],
                    "9": [],
                }
            },
            success: {
                info: false,
                stat: false,
                spell: false,
                equip: false,
                story: false,
                all: false,
                not_init: false,
                upload: true
            },
        }
    }
}
