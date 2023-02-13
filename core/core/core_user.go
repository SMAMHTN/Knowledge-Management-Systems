package core

type User struct {
	UserID       int
	UserPhoto    []byte
	Username     string
	Password     string
	Name         string
	Email        string
	Address      string
	Phone        string
	RoleID       int
	AppthemeID   int
	Note         string
	IsSuperAdmin int
	IsActive     int
}
