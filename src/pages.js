const {  subjects, weekdays, getSubject, convertHourToMinutes } = require('./utils/format')
const Database = require('./database/db')

function pageLanding(req, res)  {
    //return res.sendFile(__dirname + "/views/index.html")
    return res.render("index.html")
}

async function pageStudy(req, res)  {

    const filters = req.query

    if (!filters.subject || !filters.weekday || !filters.time) {
        return res.render("study.html", { filters, subjects, weekdays })
    }

    const timeToMinutes = convertHourToMinutes(filters.time)

    const query = `
        SELECT classes.*, proffys.* FROM proffys 
        JOIN classes ON (classes.proffy_id = proffys.id) 
        WHERE EXISTS (
            SELECT class_schedule.* FROM class_schedule 
            WHERE class_schedule.class_id = classes.id 
            AND class_schedule.weekday = ${filters.weekday} 
            AND class_schedule.time_from <= ${timeToMinutes}  
            AND class_schedule.time_to > ${timeToMinutes} 
        )
        AND classes.subject = '${filters.subject}'
    `

    try {
        const db = await Database
        const proffys = await db.all(query)

        proffys.map((proffy) => {
            proffy.subject = getSubject(proffy.subject)
        })

        return res.render("study.html", { proffys, filters, subjects, weekdays })
    }
    catch (err) {
        console.log(err)
    }
}

function pageGiveClasses(req, res)  {

    //return res.sendFile(__dirname + "/views/give-classes.html")
    return res.render("give-classes.html", { weekdays, subjects })
}

async function saveClasses(req, res) {

    const createProffy = require('./database/createProffy')
    
    const data = req.body

    const proffyValue = {
        name: data.name,
        avatar: data.avatar,
        whatsapp: data.whatsapp,
        bio: data.bio
    }

    const classValue = {
        subject: data.subject,
        cost: data.cost
    }

    const classScheduleValues = req.body.weekday.map((weekday, index) => {
        return {
            weekday,
            time_from: convertHourToMinutes(data.time_from[index]),
            time_to: convertHourToMinutes(data.time_to[index])
        }
    })

    try {
        const db = await Database
        await createProffy(db, { proffyValue, classValue, classScheduleValues })

        let queryString = "?subject=" + data.subject + "&weekday=" + data.weekday[0]
        queryString += "&time=" + data.time_from[0]
    
        return res.redirect("/study" + queryString)
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { pageLanding, pageStudy, pageGiveClasses, saveClasses }