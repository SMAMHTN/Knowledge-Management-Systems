package core

func CountRows(tableName string) (int, error) {
	var count int
	query := "SELECT COUNT(*) FROM " + tableName

	err := Database.QueryRow(query).Scan(&count)
	if err != nil {
		return 0, err
	}

	return count, nil
}
