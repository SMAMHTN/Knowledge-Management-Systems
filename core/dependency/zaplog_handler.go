package dependency

import (
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func UniversalTimeEncoder(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
	ZapEncodeTimeLayout(t, time.RFC3339, enc)
}

func CasualTimeEncoder(t time.Time, enc zapcore.PrimitiveArrayEncoder) {
	ZapEncodeTimeLayout(t, time.RFC1123, enc)
}

func ZapEncodeTimeLayout(t time.Time, layout string, enc zapcore.PrimitiveArrayEncoder) {
	type appendTimeEncoder interface {
		AppendTimeLayout(time.Time, string)
	}

	// Modified
	desiredTimezone, err := time.LoadLocation(TimeZone)
	if err != nil {
		panic(err)
	}
	t = t.In(desiredTimezone)
	// Modified

	if enc, ok := enc.(appendTimeEncoder); ok {
		enc.AppendTimeLayout(t, layout)
		return
	}

	enc.AppendString(t.Format(layout))
}

func InitZapLog(LogFile string, LogFileLow string) (logger *zap.Logger, err error) {
	fmt.Println("---------------------------------------")
	fmt.Println("Preparing Logger")
	parent := Get_Parent_Path()
	// Check if the log file exists at the provided path
	_, err = os.Stat(LogFile)
	if os.IsNotExist(err) {
		// If not found, try appending the LogFile to the parent path
		LogFile = filepath.Join(parent, "log", "Error.log")
	}
	if err := os.MkdirAll(filepath.Dir(LogFile), 0711); err != nil {
		return logger, err
	}

	// Open the log file for writing
	file, err := os.OpenFile(LogFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0761)
	if err != nil {
		return logger, errors.New("failed to open log file: " + err.Error())
	}

	_, err = os.Stat(LogFileLow)
	if os.IsNotExist(err) {
		// If not found, try appending the LogFile to the parent path
		LogFileLow = filepath.Join(parent, "log", "Info.log")
	}
	if err := os.MkdirAll(filepath.Dir(LogFileLow), 0711); err != nil {
		return logger, err
	}

	// Open the log file for writing
	fileLow, err := os.OpenFile(LogFileLow, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0761)
	if err != nil {
		return logger, errors.New("failed to open log file: " + err.Error())
	}

	config := zap.NewProductionEncoderConfig()
	config.EncodeTime = UniversalTimeEncoder
	config2 := zap.NewProductionEncoderConfig()
	config2.EncodeTime = CasualTimeEncoder
	UniversalEncoder := zapcore.NewJSONEncoder(config)
	CasualEncoder := zapcore.NewConsoleEncoder(config2)
	highPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.ErrorLevel
	})
	lowPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl < zapcore.ErrorLevel
	})
	mediumPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.WarnLevel
	})
	core := zapcore.NewTee(
		zapcore.NewCore(CasualEncoder, zapcore.AddSync(os.Stdout), highPriority),
		zapcore.NewCore(CasualEncoder, zapcore.AddSync(os.Stdout), lowPriority),
		zapcore.NewCore(UniversalEncoder, zapcore.AddSync(file), highPriority),
		zapcore.NewCore(UniversalEncoder, zapcore.AddSync(fileLow), lowPriority),
	)
	logger = zap.New(core, zap.AddStacktrace(mediumPriority), zap.AddCaller())

	fmt.Println("Error Logger at " + LogFile)
	fmt.Println("Info Logger at " + LogFileLow)
	fmt.Println("---------------------------------------")
	return logger, nil
}
