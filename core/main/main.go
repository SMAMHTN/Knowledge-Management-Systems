package main

import (
	"core"
	"db"
	"fmt"
	// "setup"
)

func main() {
	// conf := setup.Read_conf()
	// fmt.Printf(conf.Db_link)
	var sqlslice = []string{"SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT",
		"SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS",
		"SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION",
		"SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT;",
		"SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS;",
		"SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION;",
		"SET NAMES utf8mb4;",
		"SET @OLD_TIME_ZONE=@@TIME_ZONE;",
		"SET TIME_ZONE='+00:00';",
		"SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;",
		"SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;",
		"SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';",
		"SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;",
		"DROP TABLE IF EXISTS `core_history`;",
		"CREATE TABLE `core_history` (`history_id` int(11) NOT NULL AUTO_INCREMENT,`history_activity_type` varchar(100) NOT NULL,`history_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),`history_user_id` int(11) NOT NULL,`history_changes` varchar(255) NOT NULL,`history_ip_address` varchar(50) DEFAULT NULL,PRIMARY KEY (`history_id`),KEY `core_history_FK` (`history_user_id`),CONSTRAINT `core_history_FK` FOREIGN KEY (`history_user_id`) REFERENCES `core_user` (`user_id`) ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;"}
	database := db.Db_Connect(core.Appname)
	fmt.Println("")
	fmt.Println(database)
	fmt.Println("")
	// db.Execute_sql_string("SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT", database)
	db.Execute_sql_string_array(sqlslice, database)
}
