// configuring .env
import { config } from "dotenv"
config({ path: "./.env" })

import bcrypt from "bcrypt"
import { v4 } from "uuid"
import { connection } from "../../config/db.js"

export async function getAdmin(req, res) {
  try {
    connection.query(
      "SELECT d.doctor_id, UPPER(LEFT(firstname, 1)) AS fname, UPPER(LEFT(middlename, 1)) AS mname, lastname AS lname, position AS pname, department AS dname, email, phone, cabinet FROM doctors AS d WHERE role = ?  ",
      ["user"],
      (error, result) => {
        if (error) console.log(error)

        res.render("admin/admin", { users: result })
      }
    )
  } catch (error) {
    if (error) console.log(error)
  }
}

export async function postAdmin(req, res) {
  try {
  } catch (error) {
    if (error) console.log(error)
    return res.send("Error")
  }
}

export async function getAdminNew(req, res) {
  try {
    return res.render("admin/admin_new")
  } catch (error) {
    if (error) console.log(error)
    return res.send("Error getting the page")
  }
}

export async function postAdminNew(req, res) {
  try {
    // check existing user

    const {
      uin,
      password,
      fullname,
      email,
      phone,
      department,
      position,
      cabinet,
    } = req.body

    let str = fullname.split(" ")
    const firstname = str[1]
    const middlename = str[2]
    const lastname = str[0]

    // schedule req.body
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

    const id = v4()
    let params = [
      [1, id, monday_start, monday_end],
      [2, id, tuesday_start, tuesday_end],
      [3, id, wednesday_start, wednesday_end],
      [4, id, thursday_start, thursday_end],
      [5, id, friday_start, friday_end],
      [6, id, saturday_start, saturday_end],
    ]

    if (
      !uin ||
      !password ||
      !fullname ||
      !email ||
      !phone ||
      !department ||
      !position ||
      !cabinet
    )
      return res.json({ msg: "Все поля должны быть заполнены!" })
    else {
      connection.query(
        "SELECT * FROM doctors WHERE uin = ?",
        [uin],
        async (error, result) => {
          if (error) throw error
          if (result[0]) {
            console.log(result[0])
            return res.json({
              msg: "Пользователь с таким ИИН-ом уже зарегестрирован!",
            })
          } else {
            const hashPassword = await bcrypt.hash(password, 10)
            connection.query(
              "INSERT INTO doctors SET ?",
              {
                doctor_id: id,
                uin: uin,
                password: hashPassword,
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                email: email,
                phone: phone,
                department: department,
                position: position,
                cabinet: cabinet,
                floor: cabinet.charAt(0),
              },
              (error, result) => {
                if (error) throw error

                connection.query(
                  "INSERT INTO day_records (day_id, doctor_id, start_time, end_time) VALUES ?",
                  [params],
                  (error, scheds) => {
                    if (error) console.log(error)

                    return res.redirect("/admin")
                  }
                )
              }
            )
          }
        }
      )
    }
  } catch (error) {
    if (error) console.log(error)
    return res.send("Error during creating the user")
  }
}

export async function getAdminEdit(req, res) {
  connection.query(
    "SELECT doc.doctor_id AS id, firstname AS fname, middlename AS mname, lastname AS lname, department AS dname, position AS pname, phone, email, cabinet from doctors AS doc WHERE doc.doctor_id = ?",
    [req.params.id],
    (error, user) => {
      if (error) console.log(error)

      connection.query(
        "SELECT start_time, end_time FROM day_records WHERE doctor_id = ? ",
        [req.params.id],
        (error, sched) => {
          if (error) console.log(error)
          console.log(sched[0])

          return res.render("admin/admin_edit", {
            user: user[0],
            sched: sched,
          })
        }
      )
    }
  )
}

export async function postAdminEdit(req, res) {
  try {
    // check existing user

    const { fullname, email, phone, department, position, cabinet } = req.body

    let str = fullname.split(" ")
    const firstname = str[1]
    const middlename = str[2]
    const lastname = str[0]

    // schedule req.body
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
        console.log(result[0])
        var params = [
          [result[0].schedule_id, monday_start, monday_end],
          [result[1].schedule_id, tuesday_start, tuesday_end],
          [result[2].schedule_id, wednesday_start, wednesday_end],
          [result[3].schedule_id, thursday_start, thursday_end],
          [result[4].schedule_id, friday_start, friday_end],
          [result[5].schedule_id, saturday_start, saturday_end],
        ]
        console.log(params)

        connection.query(
          "UPDATE doctors SET firstname = ?, middlename = ?, lastname = ?, email = ?, phone = ?, department = ?, position = ?, cabinet = ?, floor = ? WHERE doctor_id = ?",
          [
            firstname,
            middlename,
            lastname,
            email,
            phone,
            department,
            position,
            cabinet,
            1,
            id,
          ]
        )

        connection.query(
          "INSERT INTO day_records (schedule_id, start_time, end_time) VALUES ? ON DUPLICATE KEY UPDATE schedule_id = VALUES(schedule_id), start_time = VALUES(start_time), end_time = VALUES(end_time)",
          [params],
          (error, days) => {
            if (error) console.log(error)

            res.redirect("/admin")
          }
        )
      }
    )
  } catch (error) {
    if (error) console.log(error)
    return res.send("Error during creating the user")
  }
}

export async function postAdminDelete(req, res) {
  connection.query(
    "DELETE FROM day_records WHERE doctor_id = ?",
    [req.params.id],
    (error, result) => {
      if (error) console.log(error)
    }
  )
  connection.query(
    "DELETE FROM doctors WHERE doctor_id = ?",
    [req.params.id],
    (error, result) => {
      if (error) console.log(error)

      res.redirect("/admin")
    }
  )
}
