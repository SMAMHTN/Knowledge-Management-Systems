package kms

import (
	"database/sql"
	"errors"
)

type File struct {
	FileID     int `json:"FileID" query:"FileID"`
	FileLoc    string
	CategoryID int
	FileType   string
}

func ReadFile(args string, values []interface{}) ([]File, error) {
	var results []File
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT * FROM kms_file"+" "+args, values...)
	} else {
		sqlresult, err = Database.Query("SELECT * FROM kms_file")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = File{}
		var err = sqlresult.Scan(&result.FileID, &result.FileLoc, &result.CategoryID, &result.FileType)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *File) Create() (int, error) {
	var err error

	ins, err := Database.Prepare("INSERT INTO kms_file(FileLoc, CategoryID, FileType) VALUES(?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.FileLoc, data.CategoryID, data.FileType)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.FileID = int(lastid)
	return int(lastid), nil
}

func (data *File) Read() error {
	var err error
	if data.FileID != 0 {
		err = Database.QueryRow("SELECT * FROM kms_file WHERE FileID = ?", data.FileID).Scan(&data.FileID, &data.FileLoc, &data.CategoryID, &data.FileType)
	} else if data.FileLoc != "" {
		err = Database.QueryRow("SELECT * FROM kms_file WHERE FileLoc = ?", data.FileLoc).Scan(&data.FileID, &data.FileLoc, &data.CategoryID, &data.FileType)
	} else {
		return errors.New("please insert fileid or fileloc")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data File) Update() error {
	if data.FileID != 0 {
		upd, err := Database.Prepare("UPDATE kms.kms_file SET FileLoc=?, CategoryID=?, FileType=? WHERE FileID=?;")
		if err != nil {
			return err
		}
		defer upd.Close()
		_, err = upd.Exec(data.FileLoc, data.CategoryID, data.FileType, data.FileID)
		if err != nil {
			return err
		}
	} else {
		return errors.New("please insert fileid")
	}
	return nil
}

func (data File) Delete() error {
	var err error
	del, err := Database.Prepare("DELETE FROM kms_file WHERE `FileID`=?")
	if err != nil {
		return err
	}
	if data.FileID != 0 {
		_, err = del.Exec(data.FileID)
	} else {
		return errors.New("fileid needed")
	}
	if err != nil {
		return err
	}

	return nil
}
