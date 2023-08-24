package dependency

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

type LimitType struct {
	Page int `query:"page"`
	Num  int `query:"num"`
}

func Db_Connect(conf Configuration, dbname string) (database *sql.DB, err error) {
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname
	Db, err := sql.Open("mysql", url)
	if err != nil {

		return Db, err
	}
	return Db, nil
}

func Db_Connect_custom(conf Configuration, dbname string, args string) (database *sql.DB, err error) {
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname + "?" + args
	Db, err := sql.Open("mysql", url)
	if err != nil {

		return Db, err
	}
	return Db, nil
}

func Execute_sql_file(conf Configuration, sqlfile string, dbname string) error {
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname + "?multiStatements=true"
	db, err := sql.Open("mysql", url)
	if err != nil {

		return err
	}
	defer db.Close()
	file := Get_Parent_Path() + sqlfile
	data, err := os.ReadFile(file)
	if err != nil {

		return err
	}
	_, err = db.Exec(string(data))
	if err != nil {

		return err
	}
	fmt.Println("SQL file imported successfully into the MariaDB database.")
	return nil
}

func Execute_sql_string_no_return(conf Configuration, sqlstring string, dbname string) error {
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname + "?multiStatements=true"
	db, err := sql.Open("mysql", url)
	if err != nil {

		return err
	}
	defer db.Close()

	_, err = db.Exec(sqlstring)
	if err != nil {

		return err
	}

	return nil
}

func Execute_sql_string_array_no_return(conf Configuration, sqlslice []string, dbname string) error {
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname + "?multiStatements=true"
	db, err := sql.Open("mysql", url)
	if err != nil {

		return err
	}
	defer db.Close()
	for _, y := range sqlslice {
		_, err = db.Exec(y)
		if err != nil {

			return err
		}
	}
	return nil
}

func LimitMaker(page int, num int) (limit string) {
	if num == 0 {
		num = 10
	}
	limit = "LIMIT " + strconv.Itoa(page*num) + "," + strconv.Itoa(num)
	return limit
}

func (data LimitType) LimitMaker() (limit string) {
	if data.Num == 0 {
		data.Num = 10
	}
	limit = "LIMIT " + strconv.Itoa(data.Page*data.Num) + "," + strconv.Itoa(data.Num)
	return limit
}
