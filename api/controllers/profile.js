import { connection } from "../../config/db.js"

// GET Profile page
export async function getProfile(req, res) {
  try {
    connection.query(
      "SELECT doc.doctor_id AS id, firstname AS fname, middlename AS mname, lastname AS lname, department AS dname, phone, email from doctors AS doc WHERE doc.doctor_id = ?",
      [req.params.id],
      (error, user) => {
        if (error) console.log(error)
        console.log(user[0])

        connection.query(
          "SELECT start_time, end_time FROM day_records WHERE doctor_id = ? ",
          [req.params.id],
          (error, sched) => {
            if (error) console.log(error)
            console.log(req.params.id)
            console.log(sched[0])

            return res.render("profile", {
              user: user[0],
              sched: sched,
            })
          }
        )
      }
    )
  } catch (error) {
    if (error) console.log(error)

    return res.json("Error page")
  }
}

// PATCH Profile page
export async function patchProfile(req, res) {
  const { email, phone } = req.body

  connection.query(
    "UPDATE doctors SET email = ?, phone = ? WHERE doctor_id = ?",
    [email, phone, req.params.id],
    (error, result) => {
      if (error) console.log(error)
      var id = req.app.locals.user.id
      res.redirect(`/profile/${id}`)
    }
  )
}

// MultiInsert

// POST Schedule of the doctor
export async function postSchedule(req, res) {
  const {
    monday_start,
    monday_end,
    tuesday_start,
    tuesday_end,
    wednesday_start,
    wednesday_end,
    thursday_start,
    thursday_end,
    friday_start,
    friday_end,
    saturday_start,
    saturday_end,
  } = req.body

  let id = req.params.id
  connection.query(
    "SELECT schedule_id FROM day_records WHERE doctor_id = ?",
    [id],
    (error, result) => {
      if (error) console.log(error)
      console.log(result[0])
      var params = [
        [result[0].schedule_id, monday_start, monday_end],
        [result[1].schedule_id, tuesday_start, tuesday_end],
        [result[2].schedule_id, wednesday_start, wednesday_end],
        [result[3].schedule_id, thursday_start, thursday_end],
        [result[4].schedule_id, friday_start, friday_end],
        [result[5].schedule_id, saturday_start, saturday_end],
      ]

      connection.query(
        "INSERT INTO day_records (schedule_id, start_time, end_time) VALUES ? ON DUPLICATE KEY UPDATE schedule_id = VALUES(schedule_id), start_time = VALUES(start_time), end_time = VALUES(end_time)",
        [params],
        (error, days) => {
          if (error) console.log(error)

          res.redirect(`/profile/${id}`)
        }
      )
    }
  )
}
