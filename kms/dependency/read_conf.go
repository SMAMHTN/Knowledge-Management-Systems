package dependency

import (
	"encoding/json"
	"errors"
	"os"
	// "reflect"
)

type Configuration struct {
	Appname               string `json:"app_name"`
	Appport               int    `json:"app_port"`
	App_password          string `json:"app_password"`
	Core_link             string `json:"core_link"`
	Core_password         string `json:"core_password"`
	Db_link               string `json:"db_link"`
	Db_username           string `json:"db_username"`
	Db_password           string `json:"db_password"`
	Filestore             string `json:"filestore"`
	Error_Log_location    string `json:"error_log_location"`
	Disable_Error_Log     bool   `json:"disable_error_log"`
	Warn_Log_location     string `json:"warn_log_location"`
	Activate_Warn_Log     bool   `json:"activate_warn_log"`
	Info_Log_Location     string `json:"info_log_location"`
	Activate_Info_Log     bool   `json:"activate_info_log"`
	Activate_terminal_log bool   `json:"activate_terminal_log"`
	Tika_link             string `json:"tika_link"`
	Solr_link             string `json:"solr_link"`
	Solr_username         string `json:"solr_username"`
	Solr_password         string `json:"solr_password"`
	Max_upload            string `json:"max_upload"`
}

func fixpath(path string) string {
	if path[len(path)-1:] != "/" {
		path = path + "/"
	}
	return path
}

func Get_Parent_Path() string {
	parent, a := os.Getwd()
	if a != nil {

		panic(a)
	}
	parent = fixpath(parent)
	return parent
}

func Read_conf(ConfFile string) (Configuration, error) {
	Configuration := Configuration{}
	file, err := os.Open(ConfFile)
	if err != nil {
		parent := Get_Parent_Path()
		path := parent + ConfFile
		file, err = os.Open(path)
		if err != nil {

			return Configuration, errors.New("conf file not found")
		}
	}
	defer file.Close()
	decoder := json.NewDecoder(file)
	err = decoder.Decode(&Configuration)
	if err != nil {

		return Configuration, err
	}
	return Configuration, nil
}
