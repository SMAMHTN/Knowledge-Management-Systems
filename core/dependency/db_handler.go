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

type QueryType struct {
	Page  int    `query:"page"`
	Num   int    `query:"num"`
	Sort  string `query:"sort"`
	Query string `query:"query"`
}

type SortType struct {
	Field     string `json:"field" query:"field"`
	Ascending bool   `json:"asc" query:"asc"`
}

type WhereType struct {
	Field    string        `json:"field" query:"field"`
	Operator string        `json:"operator" query:"operator"`
	Logic    string        `json:"logic" query:"logic"`
	Values   []interface{} `json:"values" query:"values"`
}

var (
	AllowedOperator        = [...]string{"=", "!=", "<=>", ">", "<", ">=", "<=", "LIKE"}
	SpecialAllowedOperator = [...]string{"BETWEEN", "GREATEST", "IN", "LEAST", "NOT BETWEEN", "NOT IN", "!", "LowerLIKE"}
	AllowedLogic           = [...]string{"AND", "OR", "XOR"}
	SpecialAllowedLogic    = [...]string{}
)

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

func (data *QueryType) QueryMaker(totalrow int) (query string, values []interface{}, info Info, err error) {
	var sortquery []SortType
	var wherequery []WhereType
	if data.Sort != "" {
		err = json.Unmarshal([]byte(data.Sort), &sortquery)
		if err != nil {
			err = errors.New("sort field json read error : " + err.Error())
			return query, values, info, err
		}
	}
	if data.Query != "" {
		err = json.Unmarshal([]byte(data.Query), &wherequery)
		if err != nil {
			err = errors.New("query query json read error : " + err.Error())
			return query, values, info, err
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
	//WHERE QUERY CREATOR
	if len(wherequery) > 0 {
		query += "WHERE ("
		for i, condition := range wherequery {
			if i > 0 {
				switch condition.Logic {
				case "AND", "OR", "XOR":
					query += " " + condition.Logic + " "
				default:
					err = errors.New("use only these allowed logic : " + strings.Join(AllowedLogic[:], ", ") + "," + strings.Join(SpecialAllowedLogic[:], ", ") + " but got " + condition.Logic)
					return query, values, info, err
				}
			}
			//CONDITION CHECKER
			switch condition.Operator {
			case "=", "!=", "<=>", ">", "<", ">=", "<=", "LIKE":
				query += fmt.Sprintf("%s %s ?", condition.Field, condition.Operator)
				values = append(values, condition.Values[0])
			case "IN", "NOT IN":
				query += fmt.Sprintf("%s %s (?%s)", condition.Field, condition.Operator, strings.Repeat(", ?", len(condition.Values)-1))
				values = append(values, condition.Values...)
			case "BETWEEN", "NOT BETWEEN":
				query += fmt.Sprintf("%s %s ? AND ?", condition.Field, condition.Operator)
				values = append(values, condition.Values[0], condition.Values[1])
			case "GREATEST", "LEAST":
				query += fmt.Sprintf("%s (%s)", condition.Operator, condition.Field)
			case "LowerLIKE":
				query += fmt.Sprintf("LOWER(%s) LIKE LOWER(?)", condition.Field)
				values = append(values, condition.Values[0])
			default:
				err = errors.New("use only these allowed operator : " + strings.Join(AllowedOperator[:], ", ") + "," + strings.Join(SpecialAllowedOperator[:], ", ") + " but got " + condition.Operator)
				return query, values, info, err
			}
		}
		query += ") "
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
		query = query + "ORDER BY " + strings.Join(sortList, ", ") + " "
	}
	info.UpperLimit = Lowerlimit0 + info.TotalShow
	query = query + "LIMIT " + strconv.Itoa(Lowerlimit0) + "," + strconv.Itoa(data.Num)
	fmt.Println(query)
	fmt.Println(values)
	return query, values, info, nil
}
