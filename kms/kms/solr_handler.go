package kms

import (
	"dependency"
	"fmt"
	"strconv"

	"github.com/labstack/echo/v4"
)

func (data Article_Table) ConvForSolr() (result ArticleSolr, err error) {
	result.ArticleID = strconv.Itoa(data.ArticleID)
	result.OwnerID = data.OwnerID
	result.LastEditedByID = data.LastEditedByID
	result.LastEditedTime = data.LastEditedTime
	result.Tag = dependency.ConvStringToStringArray(data.Tag)
	if err != nil {
		return result, err
	}
	result.Title = data.Title
	result.CategoryID = data.CategoryID
	result.Article = data.Article
	result.FileID, err = dependency.ConvStringToIntArray(data.FileID)
	if err != nil {
		return result, err
	}
	result.DocID, err = dependency.ConvStringToIntArray(data.DocID)
	if err != nil {
		return result, err
	}
	result.IsActive = data.IsActive
	return result, nil
}

func (data *ArticleSolr) PrepareSolrData(c echo.Context) (err error) {
	CategoryData := Category{
		CategoryID:          data.CategoryID,
		CategoryName:        "",
		CategoryParentID:    0,
		CategoryDescription: "",
	}
	err = CategoryData.Read()
	if err != nil {
		return err
	}
	data.CategoryName = CategoryData.CategoryName
	data.CategoryDescription = CategoryData.CategoryDescription
	CategoryDataParent, err := CategoryData.ListAllCategoryParent()
	if err != nil {
		return err
	}
	for _, SingleCategoryParentID := range CategoryDataParent {
		data.CategoryParent = "/" + data.CategoryParent
		SingleCategoryParent := Category{
			CategoryID:          SingleCategoryParentID,
			CategoryName:        "",
			CategoryParentID:    0,
			CategoryDescription: "",
		}
		err = SingleCategoryParent.Read()
		if err != nil {
			fmt.Println("Error When looking for category id" + strconv.Itoa(SingleCategoryParentID))
		}
		data.CategoryParent = SingleCategoryParent.CategoryName + data.CategoryParent
	}
	data.CategoryParent = data.CategoryParent[1:]
	data.OwnerName, data.OwnerUsername, err = GetNameUsername(c, data.OwnerID)
	if err != nil {
		return err
	}
	if data.OwnerID == data.LastEditedByID {
		data.LastEditedByName = data.OwnerName
		data.LastEditedByUsername = data.OwnerUsername
	} else {
		data.LastEditedByName, data.LastEditedByUsername, err = GetNameUsername(c, data.LastEditedByID)
		if err != nil {
			return err
		}
	}
	for _, SingleDocID := range data.DocID {
		SingleDoc := Doc{DocID: SingleDocID}
		err = SingleDoc.Read()
		if err != nil {
			Logger.Warn(err.Error())
		}
		SingleDocString, _, err := dependency.GetTextTika(Conf.Tika_link+TikaAddURL, SingleDoc.DocLoc)
		if err != nil {
			Logger.Warn(err.Error())
		}
		data.DocContent += SingleDocString
	}
	return nil
}
