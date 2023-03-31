import { connection } from "../../config/db.js"

// GET
export async function getIndex(req, res) {
  connection.query(
    "SELECT d.doctor_id, UPPER(LEFT(firstname, 1)) AS fname, UPPER(LEFT(middlename, 1)) AS mname, lastname, position AS pname, cabinet, GROUP_CONCAT(start_time ORDER BY day_id ASC SEPARATOR ',') AS start_time, GROUP_CONCAT(end_time ORDER BY day_id SEPARATOR ',') AS end_time FROM doctors AS d JOIN day_records AS dr ON d.doctor_id = dr.doctor_id WHERE role = ? GROUP BY d.doctor_id",
    ["user"],
    (error, result) => {
      if (error) console.log(error)

      var startArr = [],
        endArr = []
      console.log(result)
      for (let i = 0; i < result.length; i++) {
        startArr[i] = result[i].start_time.split(",")
        endArr[i] = result[i].end_time.split(",")
        for (let j = 0; j < startArr[i].length; j++) {
          if (startArr[i][j] === "") startArr[i][j] = "Выходной"
        }
      }

      return res.render("index", {
        users: result,
        start: startArr,
        end: endArr,
      })
    }
  )
}

export async function getTable(req, res) {
  connection.query(
    "SELECT d.doctor_id, UPPER(LEFT(firstname, 1)) AS fname, UPPER(LEFT(middlename, 1)) AS mname, lastname, position AS pname, cabinet, GROUP_CONCAT(start_time ORDER BY day_id ASC SEPARATOR ',') AS start_time, GROUP_CONCAT(end_time ORDER BY day_id SEPARATOR ',') AS end_time FROM doctors AS d JOIN day_records AS dr ON d.doctor_id = dr.doctor_id WHERE role = ? GROUP BY d.doctor_id",
    ["user"],
    (error, result) => {
      if (error) console.log(error)

      var startArr = [],
        endArr = []
      console.log(result)
      for (let i = 0; i < result.length; i++) {
        startArr[i] = result[i].start_time.split(",")
        endArr[i] = result[i].end_time.split(",")
        for (let j = 0; j < startArr[i].length; j++) {
          if (startArr[i][j] === "") startArr[i][j] = "Выходной"
        }
      }

      return res.render("table", {
        users: result,
        start: startArr,
        end: endArr,
        layout: false,
      })
    }
  )
}
