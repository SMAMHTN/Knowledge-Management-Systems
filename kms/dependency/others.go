package dependency

import "reflect"

func GetElementString(slice []string, index int) string {
	if index < len(slice) {
		return slice[index]
	}
	return ""
}

var LanguageRFC3066Converter = map[string]string{
	"Afrikaans":   "af",
	"Albanian":    "sq",
	"Arabic":      "ar",
	"Armenian":    "hy",
	"Azerbaijani": "az",
	"Basque":      "eu",
	"Belarusian":  "be",
	"Bengali":     "bn",
	"Bosnian":     "bs",
	"Bulgarian":   "bg",
	"Catalan":     "ca",
	"Chinese":     "zh",
	"Croatian":    "hr",
	"Czech":       "cs",
	"Danish":      "da",
	"Dutch":       "nl",
	"English":     "en",
	"Esperanto":   "eo",
	"Estonian":    "et",
	"Finnish":     "fi",
	"French":      "fr",
	"Ganda":       "lg",
	"Georgian":    "ka",
	"German":      "de",
	"Greek":       "el",
	"Gujarati":    "gu",
	"Hebrew":      "he",
	"Hindi":       "hi",
	"Hungarian":   "hu",
	"Icelandic":   "is",
	"Indonesian":  "id",
	"Irish":       "ga",
	"Italian":     "it",
	"Japanese":    "ja",
	"Kazakh":      "kk",
	"Korean":      "ko",
	"Latin":       "la",
	"Latvian":     "lv",
	"Lithuanian":  "lt",
	"Macedonian":  "mk",
	"Malay":       "ms",
	"Maori":       "mi",
	"Marathi":     "mr",
	"Mongolian":   "mn",
	"Persian":     "fa",
	"Polish":      "pl",
	"Portuguese":  "pt",
	"Punjabi":     "pa",
	"Romanian":    "ro",
	"Russian":     "ru",
	"Serbian":     "sr",
	"Shona":       "sn",
	"Slovak":      "sk",
	"Slovene":     "sl",
	"Somali":      "so",
	"Sotho":       "st",
	"Spanish":     "es",
	"Swahili":     "sw",
	"Swedish":     "sv",
	"Tagalog":     "tl",
	"Tamil":       "ta",
	"Telugu":      "te",
	"Thai":        "th",
	"Tsonga":      "ts",
	"Tswana":      "tn",
	"Turkish":     "tr",
	"Ukrainian":   "uk",
	"Urdu":        "ur",
	"Vietnamese":  "vi",
	"Welsh":       "cy",
	"Xhosa":       "xh",
	"Yoruba":      "yo",
	"Zulu":        "zu",
}

func CheckValueExistString(slice []string, value string) bool {
	for _, slicevalue := range slice {
		if slicevalue == value {
			return true
		}
	}
	return false
}

func BooltoInt(data bool) (res int) {
	if data {
		return 1
	} else {
		return 0
	}
}

func GetFieldNames(v interface{}) []string {
	var fieldNames []string
	val := reflect.ValueOf(v)

	for i := 0; i < val.NumField(); i++ {
		fieldNames = append(fieldNames, val.Type().Field(i).Name)
	}

	return fieldNames
}
