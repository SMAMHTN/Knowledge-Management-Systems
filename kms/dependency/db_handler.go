package dependency

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func Db_Connect(conf Configuration, dbname string) (database *sql.DB, err error) {
	if dbname == "" {
		dbname = conf.Appname
	}
	url := conf.Db_username + ":" + conf.Db_password + "@tcp(" + conf.Db_link + ")/" + dbname
	Db, err := sql.Open("mysql", url)
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		return err
	}
	defer db.Close()
	file := Get_Parent_Path() + sqlfile
	data, err := os.ReadFile(file)
	if err != nil {
		log.Println("WARNING " + err.Error())
		return err
	}
	_, err = db.Exec(string(data))
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		return err
	}
	defer db.Close()

	_, err = db.Exec(sqlstring)
	if err != nil {
		log.Println("WARNING " + err.Error())
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
		log.Println("WARNING " + err.Error())
		return err
	}
	defer db.Close()
	for _, y := range sqlslice {
		_, err = db.Exec(y)
		if err != nil {
			log.Println("WARNING " + err.Error())
			return err
		}
	}
	return nil
}
