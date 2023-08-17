package kms

import (
	"database/sql"
	"dependency"
	"errors"
)

type Doc struct {
	DocID      int `json:"DocID" query:"DocID"`
	DocLoc     string
	CategoryID int
	DocType    string
}

func ReadDoc(args string) ([]Doc, error) {
	var results []Doc
	var sqlresult *sql.Rows
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return []Doc{}, err
	}
	defer database.Close()
	if args != "" {
		sqlresult, err = database.Query("SELECT * FROM kms_doc" + " " + args)
	} else {
		sqlresult, err = database.Query("SELECT * FROM kms_doc")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Doc{}
		var err = sqlresult.Scan(&result.DocID, &result.DocLoc, &result.CategoryID, &result.DocType)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Doc) Create() (int, error) {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return 0, err
	}
	defer database.Close()
	ins, err := database.Prepare("INSERT INTO kms_doc(DocLoc, CategoryID, DocType) VALUES(?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.DocLoc, data.CategoryID, data.DocType)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.DocID = int(lastid)
	return int(lastid), nil
}

func (data *Doc) Read() error {
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	if data.DocID != 0 {
		err = database.QueryRow("SELECT * FROM kms_doc WHERE DocID = ?", data.DocID).Scan(&data.DocID, &data.DocLoc, &data.CategoryID, &data.DocType)
	} else if data.DocLoc != "" {
		err = database.QueryRow("SELECT * FROM kms_doc WHERE DocLoc = ?", data.DocLoc).Scan(&data.DocID, &data.DocLoc, &data.CategoryID, &data.DocType)
	} else {
		return errors.New("please insert docid or docloc")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Doc) Update() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	defer database.Close()
	upd, err := database.Prepare("UPDATE kms.kms_doc SET DocLoc=?, CategoryID=?, DocType=? WHERE DocID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.DocLoc, data.CategoryID, data.DocType, data.DocID)
	if err != nil {
		return err
	}
	return nil
}

func (data Doc) Delete() error {
	var err error
	database, err := dependency.Db_Connect(Conf, DatabaseName)
	if err != nil {
		return err
	}
	del, err := database.Prepare("DELETE FROM kms_doc WHERE `DocID`=?")
	if err != nil {
		return err
	}
	if data.DocID != 0 {
		_, err = del.Exec(data.DocID)
	} else {
		return errors.New("docid needed")
	}
	if err != nil {
		return err
	}
	defer database.Close()
	return nil
}
