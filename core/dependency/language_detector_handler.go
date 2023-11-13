package dependency

import (
	"errors"

	"github.com/pemistahl/lingua-go"
)

type LanguageDetector struct {
	Detector lingua.LanguageDetector
	Language []string
}

// LanguageConverter maps language names to lingua.Language constants
var LinguaLanguageConverter = map[string]lingua.Language{
	"Afrikaans":   lingua.Afrikaans,
	"Albanian":    lingua.Albanian,
	"Arabic":      lingua.Arabic,
	"Armenian":    lingua.Armenian,
	"Azerbaijani": lingua.Azerbaijani,
	"Basque":      lingua.Basque,
	"Belarusian":  lingua.Belarusian,
	"Bengali":     lingua.Bengali,
	"Bosnian":     lingua.Bosnian,
	"Bulgarian":   lingua.Bulgarian,
	"Catalan":     lingua.Catalan,
	"Chinese":     lingua.Chinese,
	"Croatian":    lingua.Croatian,
	"Czech":       lingua.Czech,
	"Danish":      lingua.Danish,
	"Dutch":       lingua.Dutch,
	"English":     lingua.English,
	"Esperanto":   lingua.Esperanto,
	"Estonian":    lingua.Estonian,
	"Finnish":     lingua.Finnish,
	"French":      lingua.French,
	"Ganda":       lingua.Ganda,
	"Georgian":    lingua.Georgian,
	"German":      lingua.German,
	"Greek":       lingua.Greek,
	"Gujarati":    lingua.Gujarati,
	"Hebrew":      lingua.Hebrew,
	"Hindi":       lingua.Hindi,
	"Hungarian":   lingua.Hungarian,
	"Icelandic":   lingua.Icelandic,
	"Indonesian":  lingua.Indonesian,
	"Irish":       lingua.Irish,
	"Italian":     lingua.Italian,
	"Japanese":    lingua.Japanese,
	"Kazakh":      lingua.Kazakh,
	"Korean":      lingua.Korean,
	"Latin":       lingua.Latin,
	"Latvian":     lingua.Latvian,
	"Lithuanian":  lingua.Lithuanian,
	"Macedonian":  lingua.Macedonian,
	"Malay":       lingua.Malay,
	"Maori":       lingua.Maori,
	"Marathi":     lingua.Marathi,
	"Mongolian":   lingua.Mongolian,
	"Persian":     lingua.Persian,
	"Polish":      lingua.Polish,
	"Portuguese":  lingua.Portuguese,
	"Punjabi":     lingua.Punjabi,
	"Romanian":    lingua.Romanian,
	"Russian":     lingua.Russian,
	"Serbian":     lingua.Serbian,
	"Shona":       lingua.Shona,
	"Slovak":      lingua.Slovak,
	"Slovene":     lingua.Slovene,
	"Somali":      lingua.Somali,
	"Sotho":       lingua.Sotho,
	"Spanish":     lingua.Spanish,
	"Swahili":     lingua.Swahili,
	"Swedish":     lingua.Swedish,
	"Tagalog":     lingua.Tagalog,
	"Tamil":       lingua.Tamil,
	"Telugu":      lingua.Telugu,
	"Thai":        lingua.Thai,
	"Tsonga":      lingua.Tsonga,
	"Tswana":      lingua.Tswana,
	"Turkish":     lingua.Turkish,
	"Ukrainian":   lingua.Ukrainian,
	"Urdu":        lingua.Urdu,
	"Vietnamese":  lingua.Vietnamese,
	"Welsh":       lingua.Welsh,
	"Xhosa":       lingua.Xhosa,
	"Yoruba":      lingua.Yoruba,
	"Zulu":        lingua.Zulu,
}

func NlpInit(LanguageList []string) (Detector LanguageDetector, err error) {
	if len(LanguageList) < 1 {
		return Detector, errors.New("please insert at least 1 language")
	}
	languages := []lingua.Language{}
	for _, name := range LanguageList {
		if lang, ok := LinguaLanguageConverter[name]; ok {
			languages = append(languages, lang)
		} else {
			err = errors.New("Unknown language: " + name)
			return Detector, err
		}
	}

	DetectorLangua := lingua.NewLanguageDetectorBuilder().
		FromLanguages(languages...).
		Build()
	return LanguageDetector{Detector: DetectorLangua, Language: LanguageList}, nil
}

func (lld LanguageDetector) Scan(text string) (language string) {
	if language, exists := lld.Detector.DetectLanguageOf(text); exists {
		return language.String()
	} else {
		return lld.Language[0]
	}
}
