package dependency

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"
	"time"

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
	Page  int    `query:"page"`
	Num   int    `query:"num"`
	Sort  string `query:"sort"`
	Query string `query:"query"`
}

type SortType struct {
	Field     string `json:"field" query:"field"`
	Ascending bool   `json:"asc" query:"asc"`
}

type QueryType struct {
	Field   string  `json:"field" query:"field"`
	String  string  `json:"string" query:"string"`
	Integer int     `json:"int" query:"int"`
	Float   float64 `json:"float" query:"float"`
	Date    string  `json:"date" query:"date"`
	DateGo  time.Time
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

func (data *LimitType) LimitMaker(totalrow int) (limit string, info Info, err error) {
	var sortquery []SortType
	var queryquery []QueryType
	if data.Sort != "" {
		err = json.Unmarshal([]byte(data.Sort), &sortquery)
		if err != nil {
			err = errors.New("sort field json read error : " + err.Error())
			return limit, info, err
		}
	}
	if data.Query != "" {
		err = json.Unmarshal([]byte(data.Query), &queryquery)
		if err != nil {
			err = errors.New("query field json read error : " + err.Error())
			return limit, info, err
		}
	}
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
	if len(queryquery) > 0 {
		var queryList []string
		for _, y := range queryquery {
			if y.Integer != 0 {
				queryList = append(queryList, y.Field+"="+strconv.Itoa(y.Integer))
			} else if y.Float != 0.0 {
				queryList = append(queryList, strconv.FormatFloat(y.Float, 'f', -1, 64))
			} else if y.String != "" {
				queryList = append(queryList, "LOWER("+y.Field+") LIKE LOWER("+y.String+")")
			} else if y.Date != "" {
				y.DateGo, err = time.Parse(time.RFC3339, y.Date)
				if err != nil {
					err = errors.New("query field date format error (RFC3339) : " + err.Error())
					return limit, info, err
				}
			}
		}
		limit += "WHERE (" + strings.Join(queryList, " OR ") + ") "
	}
	if len(sortquery) > 0 {
		var sortList []string
		for _, y := range sortquery {
			if y.Ascending {
				sortList = append(sortList, y.Field+" ASC")
			} else {
				sortList = append(sortList, y.Field+" DESC")
			}
		}
		limit = limit + "ORDER BY " + strings.Join(sortList, ", ") + " "
	}
	info.UpperLimit = Lowerlimit0 + info.TotalShow
	limit = limit + "LIMIT " + strconv.Itoa(Lowerlimit0) + "," + strconv.Itoa(data.Num)
	fmt.Println(limit)
	return limit, info, nil
}
