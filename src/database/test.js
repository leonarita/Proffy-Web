const Database = require('./db')
const createProffy = require('./createProffy')

Database.then(async (db) => {

    //Inserir dados
    proffyValue = {
        name: "Leonardo Narita",
        avatar: "https://avatars3.githubusercontent.com/u/57975413?s=460&u=f157befb01b058e48646c7ee4fe4f69b5c5c37df&v=4",
        whatsapp: "11944443333",
        bio: "Às vezes não sei nem onde eu tô, mas consigo me localizar facilmente em qualquer lugar. Tenho memória fotográfica e nunca fico perdido. Eu ensino a galera como não se perder na vida, com lições geográficas simples para você nunca precisar de mapa na sua bela vida.",
    }

    classValue = {
        subject: "Geografia",
        cost: "360",
    }

    classScheduleValues = [
        {
            weekday: 1,
            time_from: 720,
            time_to: 1220
        },
        {
            weekday: 0,
            time_from: 520,
            time_to: 1220
        },
    ]

    //await createProffy(db, { proffyValue, classValue, classScheduleValues })

    //const selectedProffys = await db.all("SELECT * FROM proffys;")
    //console.log(selectedProffys)

    //const selectClassesAndProffys = await db.all(`
    //    SELECT classes.*, proffys.* FROM proffys JOIN classes ON (classes.proffy_id = proffys.id) WHERE classes.proffy_id = 1;
    //`)

    //console.log(selectClassesAndProffys)

    const selectClassesSchedules = await db.all(` 
        SELECT class_schedule.* FROM class_schedule 
        WHERE class_schedule.class_id = 1 AND class_schedule.weekday = "0" 
        AND class_schedule.time_from <="520" AND class_schedule.time_to > "520"
    `)
    
    console.log(selectClassesSchedules)
})

