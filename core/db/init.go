package db

import (
	"core"
	"database/sql"
	"fmt"
	"io/ioutil"

	_ "github.com/go-sql-driver/mysql"
)

func Db_Connect(dbname string) *sql.DB {
	conf := core.Read_conf()
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname
	Db, err := sql.Open("mysql", url)
	if err != nil {
		fmt.Println(err)
	}
	return Db
}

func Execute_sql_file(sqlfile string, db *sql.DB) {
	file := core.Get_Parent_Path() + sqlfile
	data, err := ioutil.ReadFile(file)
	if err != nil {
		fmt.Println(err)
		return
	}
	_, err = db.Exec(string(data))
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("SQL file imported successfully into the MariaDB database.")
}

func Execute_sql_string(sql string, db *sql.DB) {
	_, err := db.Exec(sql)
	if err != nil {
		fmt.Println(err)
		return
	}
}

func Execute_sql_string_array(sqlslice []string, db *sql.DB) {
	for _, y := range sqlslice {
		Execute_sql_string(y, db)
	}
}
