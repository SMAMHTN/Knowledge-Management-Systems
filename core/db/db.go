package db

import (
	"database/sql"
	dep "dependency"
	"fmt"
	"io/ioutil"

	_ "github.com/go-sql-driver/mysql"
)

func Db_Connect(dbname string) (database *sql.DB, err error) {
	conf := &dep.Conf
	fmt.Println(dep.Conf.Appname)
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname
	fmt.Println(url)
	Db, err := sql.Open("mysql", url)
	if err != nil {
		return Db, err
	}
	return Db, nil
}

func Execute_sql_file(sqlfile string, dbname string) error {
	conf := &dep.Conf
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname + "?multiStatements=true"
	db, err := sql.Open("mysql", url)
	if err != nil {
		return err
	}
	defer db.Close()
	file := dep.Get_Parent_Path() + sqlfile
	data, err := ioutil.ReadFile(file)
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

func Execute_sql_string_no_return(sqlstring string, dbname string) error {
	conf := &dep.Conf
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname + "?multiStatements=true"
	db, err := sql.Open("mysql", url)
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	_, err = db.Exec(sqlstring)
	if err != nil {
		return err
	}

	return nil
}

func Execute_sql_string_array_no_return(sqlslice []string, dbname string) error {
	conf := &dep.Conf
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname + "?multiStatements=true"
	db, err := sql.Open("mysql", url)
	if err != nil {
		fmt.Println(err)
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
