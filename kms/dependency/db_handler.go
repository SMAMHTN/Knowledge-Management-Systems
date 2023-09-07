package dependency

import (
	"database/sql"
	"fmt"
	"math"
	"os"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

type Info struct {
	UpperLimit  int
	LowerLimit  int
	TotalPage   int
	TotalRow    int
	CurrentPage int
	TotalShow   int
}

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

func (data *LimitType) LimitMaker(totalrow int) (limit string, info Info) {
	if data.Num == 0 {
		data.Num = 10
	}
	if data.Page == 0 {
		data.Page = 1
	}
	info.TotalPage = int(math.Ceil(float64(totalrow) / float64(data.Num)))
	info.CurrentPage = data.Page
	info.TotalRow = totalrow
	Lowerlimit0 := (data.Page - 1) * data.Num
	info.LowerLimit = Lowerlimit0 + 1
	if info.TotalPage == info.CurrentPage {
		info.TotalShow = totalrow % data.Num
	} else {
		info.TotalShow = data.Num
	}
	info.UpperLimit = Lowerlimit0 + info.TotalShow
	limit = "LIMIT " + strconv.Itoa(Lowerlimit0) + "," + strconv.Itoa(data.Num)
	return limit, info
}
