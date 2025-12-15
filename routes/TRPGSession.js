const router = require('express').Router();
const Session = require('../model/Session');
const User = require("../model/User");
const Info = require('../model/SheetInfo');
const SessionLink = require('../model/SessionLink')
const verify = require('../utils/verifyToken');
const {sessionValidation} = require("../utils/validation");
const {CharacterSheet} = require("../model/CharacterSheet");

// Get User's Sessions
router.get('/getSessions', verify, async function (req, res) {
    const player = req.token;
    const SessionFind = await Session.findOne({
        where: {
            player: {
                [require('sequelize').Op.contains]: [player.name]
            }
        }
    });
    if (!SessionFind) {
        res.send('你還沒創建團務')
    } else {
        const sessions = await Session.findAll({
            where: {
                player: {
                    [require('sequelize').Op.contains]: [player.name]
                }
            }
        });
        const session = [];
        sessions.forEach(function (sessionItem) {
            session.push({
                name: sessionItem.name,
                gm: sessionItem.gm,
                id: sessionItem.id
            })
        });
        res.status(200).send(session)
    }
});


//Get Session's Info
router.get('/getInfo/:id', verify, async function (req, res) {
    const id = req.params.id
    try {
        const info = await Session.findByPk(id)
        if (!info) return res.sendStatus(404)
        const sheets = {}
        const player = req.token;
        if (!info.player.includes(player.name)) return res.status(403).send("你不是這團務的成員")
        // Get member's sheets
        for (let user in info.sheet) {
            sheets[user] = []
            // Check for every sheet's permission
            for(let sheetId of info.sheet[user]){
                const memberSheet = await new CharacterSheet().init(sheetId, player)
                if(memberSheet.checkOwn() || await memberSheet.checkView(info)){
                    let sheet = await memberSheet.exec("stat")
                    sheets[user].push(Object.assign({
                        access:true
                    },sheet))
                }else {
                    sheets[user].push({
                        access: false,
                        info: memberSheet.info
                    })
                }
            }
        }
        const infoData = info.toJSON()
        infoData.sheets = sheets
        const link = await SessionLink.findOne({ where: { id: info.id } })
        infoData.code = (link) ? link.code : ""
        res.status(200).send(infoData)
    } catch (err) {
        console.log(err)
        res.sendStatus(404)
    }
})

//create invite link
router.get('/createInvite/:id', async function (req, res) {
    const codeExist = await SessionLink.findOne({ where: { id: req.params.id } })
    if (codeExist) return res.sendStatus(400)
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //get random code
    const code = Array(9).join().split(',').map(function () {
        return charSet.charAt(Math.floor(Math.random() * charSet.length));
    }).join('');
    await SessionLink.create({
        id: req.params.id,
        code: code
    });
    res.send(code)
})
//create a session
router.post('/createSession', verify, async function (req, res) {
    //check if the format is correct
    const {error} = sessionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if the session is already exist
    const sessionExist = await Session.findOne({ where: { name: req.body.name } });
    if (sessionExist) return res.status(400).send('此名稱已存在');

    //decode auth_token to get user information
    const user = req.token.name;
    //get the user information in the database
    const gm = await User.findOne({ where: { name: user } });

    try {
        //create new session
        await Session.create({
            name: req.body.name,
            gm: gm.name,
            player: [gm.name],
            sheet: {
                [gm.name]: []
            }
        });
        res.send(req.body.name + '創建成功' + ' GM:' + user);

    } catch (err) {
        res.status(400).send(err);
    }
});
//join a session
router.get('/joinSession', verify, async function (req, res) {

    //decode
    const user = req.token.name;
    const invite = await SessionLink.findOne({ where: { code: req.query.code } })
    if (!invite) return res.status(400).send("此邀請碼無效或是過時");
    const session = await Session.findByPk(invite.id);
    //check if the player is already in the session
    if (session.player.includes(user)) return res.send({
        session: session.id,
        player: user
    })
    try {
        //add player and set it to map
        const updatedPlayer = [...session.player, user];
        const updatedSheet = { ...session.sheet, [user]: [] };
        await Session.update(
            { player: updatedPlayer, sheet: updatedSheet },
            { where: { id: invite.id } }
        );
        res.send({
            session: session.id,
            player: user
        });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/uploadSheet/:id', verify, async function (req, res) {
    const name = req.token.name
    const session = await Session.findOne({
        where: {
            id: req.params.id,
            player: {
                [require('sequelize').Op.contains]: [name]
            }
        }
    })
    if (!session) return res.status(401).send('你無權限上傳角色卡')
    const sheet = req.body;
    try {
        if (!Array.isArray(sheet)) {
            return res.status(400).send('請選擇角卡上傳');
        }
        let set = new Set(session.sheet[name] || [])
        for (let index in sheet) {
            const info = await Info.findOne({ where: { id: sheet[index], author_id: req.token.id } });
            if (info) {
                const updatedSession = [...(info.session || []), req.params.id];
                await Info.update({ session: updatedSession }, { where: { id: sheet[index] } });
                set.add(sheet[index])
            }
        }
        const updatedSheet = { ...session.sheet, [name]: [...set] };
        await Session.update({ sheet: updatedSheet }, { where: { id: req.params.id } });
        res.send('上傳成功');

    } catch (err) {
        console.log(err)
        res.status(400).send('上傳角卡失敗');
    }
});
router.delete('/removeSheet/:id', verify, async function (req, res) {
    const user = req.token;
    const sheet = req.params.id;
    const session = req.query.session;
    if (!session) return res.status(400).send('URL的值無效')
    const sheetOwn = await Info.findOne({ where: { id: sheet, author_id: user.id } });
    if (!sheetOwn) return res.status(400).send('這不是你的角色卡!');
    try {
        const sessionData = await Session.findByPk(session);
        const userSheets = sessionData.sheet[user.name] || [];
        const updatedSheets = userSheets.filter(id => id !== sheet);
        const updatedSheet = { ...sessionData.sheet, [user.name]: updatedSheets };
        await Session.update({ sheet: updatedSheet }, { where: { id: session } });

        const updatedSession = (sheetOwn.session || []).filter(s => s !== session);
        await Info.update({ session: updatedSession }, { where: { id: sheet } });

        res.send('已取消上傳的角色卡');
    } catch (err) {
        console.log(err)
        res.status(400)
    }
})
router.get('/playerDelete/:id', verify, async function (req, res) {
    //get current user
    const user = req.token;
    //get delete player
    const player = req.params.id;
    //get current session
    const session = req.query.session;
    if (!session) return res.status(400).send('URL的值無效')
    //check if user is gm and player is in session
    const check = await Session.findOne({
        where: {
            id: session,
            gm: user.name,
            player: {
                [require('sequelize').Op.contains]: [player]
            }
        }
    });
    if (!check) return res.status(400).send('無效');

    const player_user = await User.findOne({ where: { name: player } })
    try {
        const sessionData = await Session.findByPk(session);
        const updatedPlayer = sessionData.player.filter(p => p !== player_user.name);
        const updatedSheet = { ...sessionData.sheet };
        delete updatedSheet[player_user.name];
        await Session.update(
            { player: updatedPlayer, sheet: updatedSheet },
            { where: { id: session } }
        );

        // Remove session from player's sheets
        const sheetsToUpdate = await Info.findAll({
            where: {
                session: {
                    [require('sequelize').Op.contains]: [session]
                },
                author_id: player_user.id
            }
        });

        for (let sheet of sheetsToUpdate) {
            const updatedSession = (sheet.session || []).filter(s => s !== session);
            await Info.update({ session: updatedSession }, { where: { id: sheet.id } });
        }

        res.send('已將' + player + '剔除');
    } catch (err) {
        res.status(400).send(err)
    }
})


//leave or dismiss a session if you are the gm
router.delete('/deleteSession/:id', verify, async function (req, res) {
    const user = req.token;
    const session = await Session.findByPk(req.params.id);
    const sheet = await Info.findAll({
        where: {
            session: {
                [require('sequelize').Op.contains]: [req.params.id]
            }
        }
    });
    const user_sheet = await Info.findAll({
        where: {
            session: {
                [require('sequelize').Op.contains]: [req.params.id]
            },
            author_id: user.id
        }
    });

    if (session.gm === user.name) {
        for (const info of sheet) {
            const updatedSession = (info.session || []).filter(s => s !== req.params.id);
            await Info.update({ session: updatedSession }, { where: { id: info.id } });
        }
        await Session.destroy({ where: { id: req.params.id } });
        await SessionLink.destroy({ where: { id: req.params.id } });
        res.send(session.name + '已被解散');
    } else {
        for (const info of user_sheet) {
            const updatedSession = (info.session || []).filter(s => s !== req.params.id);
            await Info.update({ session: updatedSession }, { where: { id: info.id } });
        }

        const sessionData = await Session.findByPk(req.params.id);
        const updatedPlayer = sessionData.player.filter(p => p !== user.name);
        const updatedSheet = { ...sessionData.sheet };
        delete updatedSheet[user.name];

        await Session.update(
            { player: updatedPlayer, sheet: updatedSheet },
            { where: { id: req.params.id } }
        );
        res.send('已離開' + session.name);
    }
});

module.exports = router;
