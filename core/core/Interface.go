package core

type Core interface {
	// Read() error for this one you need pointer
	Create() error
	Update() error
	Delete() error
}
