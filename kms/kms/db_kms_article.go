package kms

import (
	"database/sql"
	"dependency"
	"errors"
	"strconv"
	"time"
)

type Article_Table struct {
	ArticleID      int `json:"ArticleID" query:"ArticleID"`
	OwnerID        int
	LastEditedByID int
	LastEditedTime time.Time
	Tag            string
	Title          string
	CategoryID     int
	Article        string
	FileID         string
	DocID          string
	IsActive       int
}

type ArticleSolr struct {
	ArticleID            string
	OwnerID              int
	OwnerUsername        string
	OwnerName            string
	LastEditedByID       int
	LastEditedByUsername string
	LastEditedByName     string
	LastEditedTime       time.Time
	Tag                  []string
	Title                string
	CategoryID           int
	CategoryName         string
	CategoryParent       string
	CategoryDescription  string
	Article              string
	FileID               []int
	DocID                []int
	IsActive             int
	DocContent           string
}

func ReadArticle(args string, values []interface{}) ([]Article_Table, error) {
	var results []Article_Table
	var sqlresult *sql.Rows
	var err error

	if args != "" {
		sqlresult, err = Database.Query("SELECT ArticleID, OwnerID, LastEditedByID, LastEditedTime, Tag, Title, CategoryID, FileID, DocID, IsActive FROM kms_article"+" "+args, values...)
	} else {
		sqlresult, err = Database.Query("SELECT ArticleID, OwnerID, LastEditedByID, LastEditedTime, Tag, Title, CategoryID, FileID, DocID, IsActive FROM kms_article")
	}

	if err != nil {
		return results, err
	}
	defer sqlresult.Close()
	for sqlresult.Next() {
		var result = Article_Table{}
		var err = sqlresult.Scan(&result.ArticleID, &result.OwnerID, &result.LastEditedByID, &result.LastEditedTime, &result.Tag, &result.Title, &result.CategoryID, &result.FileID, &result.DocID, &result.IsActive)
		if err != nil {
			return results, err
		}
		results = append(results, result)
	}
	return results, nil
}

func (data *Article_Table) Create() (int, error) {
	var err error
	DocIDList, err := dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		return 0, errors.New("Article DocID Error : " + err.Error())
	}
	for _, SingleDocID := range DocIDList {
		SingleDoc := Doc{DocID: SingleDocID}
		err = SingleDoc.Read()
		if err != nil {
			return 0, errors.New("Article DocID Error : " + strconv.Itoa(SingleDocID) + " " + err.Error())
		}
	}
	FileIDList, err := dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		return 0, errors.New("Article FileID Error : " + err.Error())
	}
	for _, SingleFileID := range FileIDList {
		SingleFile := File{FileID: SingleFileID}
		err = SingleFile.Read()
		if err != nil {
			return 0, errors.New("Article FileID Error " + strconv.Itoa(SingleFileID) + " : " + err.Error())
		}
	}

	ins, err := Database.Prepare("INSERT INTO kms_article(OwnerID, LastEditedByID, LastEditedTime, Tag, Title, CategoryID, Article, FileID, DocID, IsActive) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		return 0, err
	}
	defer ins.Close()
	resproc, err := ins.Exec(data.OwnerID, data.LastEditedByID, data.LastEditedTime, data.Tag, data.Title, data.CategoryID, data.Article, data.FileID, data.DocID, data.IsActive)
	if err != nil {
		return 0, err
	}
	lastid, _ := resproc.LastInsertId()
	data.ArticleID = int(lastid)
	return int(lastid), nil
}

func (data *Article_Table) Read() error {
	var err error
	if data.ArticleID != 0 {
		err = Database.QueryRow("SELECT * FROM kms_article WHERE ArticleID = ?", data.ArticleID).Scan(&data.ArticleID, &data.OwnerID, &data.LastEditedByID, &data.LastEditedTime, &data.Tag, &data.Title, &data.CategoryID, &data.Article, &data.FileID, &data.DocID, &data.IsActive)
	} else {
		return errors.New("please insert articleid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data *Article_Table) ReadShort() error {
	var err error
	if data.ArticleID != 0 {
		err = Database.QueryRow("SELECT ArticleID,OwnerID,CategoryID,FileID,DocID,IsActive FROM kms_article WHERE ArticleID = ?", data.ArticleID).Scan(&data.ArticleID, &data.OwnerID, &data.CategoryID, &data.FileID, &data.DocID, &data.IsActive)
	} else {
		return errors.New("please insert articleid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data *Article_Table) ReadArticleOnly() error {
	var err error
	if data.ArticleID != 0 {
		err = Database.QueryRow("SELECT ArticleID,Article FROM kms_article WHERE ArticleID = ?", data.ArticleID).Scan(&data.ArticleID, &data.Article)
	} else {
		return errors.New("please insert articleid")
	}
	if err != nil {
		return err
	}
	return nil
}

func (data Article_Table) Update() error {
	var err error
	DocIDList, err := dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		return errors.New("Article DocID Error : " + err.Error())
	}
	for _, SingleDocID := range DocIDList {
		SingleDoc := Doc{DocID: SingleDocID}
		err = SingleDoc.Read()
		if err != nil {
			return errors.New("Article DocID Error : " + strconv.Itoa(SingleDocID) + " " + err.Error())
		}
	}
	FileIDList, err := dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		return errors.New("Article FileID Error : " + err.Error())
	}
	for _, SingleFileID := range FileIDList {
		SingleFile := File{FileID: SingleFileID}
		err = SingleFile.Read()
		if err != nil {
			return errors.New("Article FileID Error " + strconv.Itoa(SingleFileID) + " : " + err.Error())
		}
	}

	upd, err := Database.Prepare("UPDATE kms.kms_article SET OwnerID=?, LastEditedByID=?, LastEditedTime=?, Tag=?, Title=?, CategoryID=?, Article=?, FileID=?, DocID=?, IsActive=? WHERE ArticleID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.OwnerID, data.LastEditedByID, data.LastEditedTime, data.Tag, data.Title, data.CategoryID, data.Article, data.FileID, data.DocID, data.IsActive, data.ArticleID)
	if err != nil {
		return err
	}
	return nil
}

func (data Article_Table) UpdateArticleOnly() error {
	var err error
	upd, err := Database.Prepare("UPDATE kms.kms_article SET Article=? WHERE ArticleID=?;")
	if err != nil {
		return err
	}
	defer upd.Close()
	_, err = upd.Exec(data.Article, data.ArticleID)
	if err != nil {
		return err
	}
	return nil
}

func (data Article_Table) Delete() error {
	var err error
	del, err := Database.Prepare("DELETE FROM kms_article WHERE `ArticleID`=?")
	if err != nil {
		return err
	}
	if data.ArticleID != 0 {
		_, err = del.Exec(data.ArticleID)
	} else {
		return errors.New("articleid needed")
	}
	if err != nil {
		return err
	}

	return nil
}
