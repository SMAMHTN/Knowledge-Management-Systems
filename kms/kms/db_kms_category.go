package kms

import (
	"database/sql"
	"dependency"
	"errors"
)

type Category struct {
	CategoryID          int `json:"CategoryID" query:"CategoryID"`
	CategoryName        string
	CategoryParentID    int
	CategoryDescription string
}

func ReadCategory(args string) ([]Category, error) {
	var results []Category
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []Category{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM kms_category" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM kms_category")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Category{}
		var err = sqlresult.Scan(&result.CategoryID, &result.CategoryName, &result.CategoryParentID, &result.CategoryDescription)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Category) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO kms_category(CategoryName, CategoryParentID, CategoryDescription) VALUES(?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.CategoryName, data.CategoryParentID, data.CategoryDescription)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.CategoryID = int(lastid)
	return int(lastid), nil
}

func (data *Category) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.CategoryID != 0 {
		err = database.QueryRow("SELECT * FROM kms_category WHERE CategoryID = ?", data.CategoryID).Scan(&data.CategoryID, &data.CategoryName, &data.CategoryParentID, &data.CategoryDescription)
	} else {
		return errors.New("please insert categoryid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Category) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE kms.kms_category SET CategoryName=?, CategoryParentID=?, CategoryDescription=? WHERE CategoryID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.CategoryName, data.CategoryParentID, data.CategoryDescription, data.CategoryID)
	if err != nil {
		return err
	}
	return nil
}

func (data Category) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM kms_category WHERE `CategoryID`=?")
	if err != nil {
		return err
	}
	if data.CategoryID != 0 {
		_, err = del.Exec(data.CategoryID)
	} else {
		return errors.New("categoryid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}

func (data Category) ListAllCategoryParent() ([]int, error) {
	var err error
	var parents = []int{}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return parents, err
	}
	defer database.Close()
	if data.CategoryID != 0 {
		rows, err := database.Query(`
			WITH RECURSIVE categoryparents AS (
				SELECT CategoryID,CategoryParentID FROM kms_category WHERE CategoryID = ?
				UNION
				SELECT r.CategoryID,r.CategoryParentID FROM kms_category AS r, categoryparents AS rc
				WHERE r.CategoryID = rc.CategoryParentID
			)
			SELECT CategoryID FROM categoryparents
		`, data.CategoryID)
		if err != nil {
			return parents, err
		}
		for rows.Next() {
			var categoryid int
			err := rows.Scan(&categoryid)
			if err != nil {
				return parents, err
			}
			parents = append(parents, categoryid)
		}
	} else {
		return parents, errors.New("categoryid needed")
	}
	return parents, nil
}

func (data Category) ListAllCategoryChild() ([]int, error) {
	var err error
	var Child = []int{}
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return nil, err
	}
	defer database.Close()
	if data.CategoryID != 0 {
		rows, err := database.Query(`
			WITH RECURSIVE categoryparents AS (
				SELECT CategoryID,CategoryParentID FROM kms_category WHERE CategoryID = ?
				UNION
				SELECT r.CategoryID,r.CategoryParentID FROM kms_category AS r, categoryparents AS rc
				WHERE r.CategoryParentID = rc.CategoryID
			)
			SELECT CategoryID FROM categoryparents
		`, data.CategoryID)
		if err != nil {
			return nil, err
		}
		for rows.Next() {
			var categoryid int
			err := rows.Scan(&categoryid)
			if err != nil {
				return nil, err
			}
			Child = append(Child, categoryid)
		}
	} else {
		return Child, errors.New("categoryid needed")
	}
	return Child, nil
}
