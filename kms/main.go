package main

import (
	"dependency"
	"fmt"
	"kms"

	"github.com/pemistahl/lingua-go"
)

func main() {
	languages := []lingua.Language{
		dependency.LinguaLanguageConverter["Indonesian"],
		dependency.LinguaLanguageConverter["English"],
	}

	detector := lingua.NewLanguageDetectorBuilder().
		FromLanguages(languages...).
		Build()

	if language, exists := detector.DetectLanguageOf("languages are awesome"); exists {
		fmt.Println(language)
	}

	fmt.Println("----------------------------------------------------------")

	defer kms.Database.Close()
	defer kms.Logger.Sync()
	defer kms.Logger.Info("KMS SERVER STOPPED")
	kms.Logger.Info("KMS SERVER STARTED")
	kms.Test_api()
}
