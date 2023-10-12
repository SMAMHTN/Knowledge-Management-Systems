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

func InitZapLog(Conf Configuration, LogFile string, LogFileWarn string, LogFileInfo string) (logger *zap.Logger, err error) {
	fmt.Println("---------------------------------------")
	fmt.Println("Preparing Logger")
	parent := Get_Parent_Path()

	//ERROR LOG
	_, err = os.Stat(LogFile)
	if os.IsNotExist(err) {
		LogFile = filepath.Join(parent, "log", "Error.log")
	}
	if err := os.MkdirAll(filepath.Dir(LogFile), 0711); err != nil {
		return logger, err
	}

	fileError, err := os.OpenFile(LogFile, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0761)
	if err != nil {
		return logger, errors.New("failed to open log file: " + err.Error())
	}

	//WARN LOG
	_, err = os.Stat(LogFileWarn)
	if os.IsNotExist(err) {
		LogFileWarn = filepath.Join(parent, "log", "Warn.log")
	}
	if err := os.MkdirAll(filepath.Dir(LogFileWarn), 0711); err != nil {
		return logger, err
	}
	fileWarn, err := os.OpenFile(LogFileWarn, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0761)
	if err != nil {
		return logger, errors.New("failed to open log file: " + err.Error())
	}

	//INFO LOG
	_, err = os.Stat(LogFileInfo)
	if os.IsNotExist(err) {
		LogFileInfo = filepath.Join(parent, "log", "Info.log")
	}
	if err := os.MkdirAll(filepath.Dir(LogFileInfo), 0711); err != nil {
		return logger, err
	}
	fileInfo, err := os.OpenFile(LogFileInfo, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0761)
	if err != nil {
		return logger, errors.New("failed to open log file: " + err.Error())
	}

	//ENCODER
	config := zap.NewProductionEncoderConfig()
	config.EncodeTime = UniversalTimeEncoder
	config2 := zap.NewProductionEncoderConfig()
	config2.EncodeTime = CasualTimeEncoder
	UniversalEncoder := zapcore.NewJSONEncoder(config)
	CasualEncoder := zapcore.NewConsoleEncoder(config2)

	//PRIORITY
	highPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.ErrorLevel
	})
	lowPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl == zapcore.WarnLevel
	})
	InfoPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl == zapcore.InfoLevel
	})
	mediumPriority := zap.LevelEnablerFunc(func(lvl zapcore.Level) bool {
		return lvl >= zapcore.WarnLevel
	})

	//CORE ACTIVATION OR WHICH LOGGING ACTIVATED
	var CoreList []zapcore.Core
	if Conf.Activate_Info_Log {
		fmt.Println("INFO LOG ACTIVATED")
		fmt.Println("Info Logger at " + LogFileInfo)
		CoreList = append(CoreList, zapcore.NewCore(UniversalEncoder, zapcore.AddSync(fileInfo), InfoPriority))
	}
	if Conf.Activate_Warn_Log {
		fmt.Println("WARN LOG ACTIVATED")
		fmt.Println("Warn Logger at " + LogFileWarn)
		CoreList = append(CoreList, zapcore.NewCore(UniversalEncoder, zapcore.AddSync(fileWarn), lowPriority))
	}
	if !Conf.Disable_Error_Log {
		fmt.Println("ERRROR LOG ACTIVATED")
		fmt.Println("Error Logger at " + LogFile)
		CoreList = append(CoreList, zapcore.NewCore(UniversalEncoder, zapcore.AddSync(fileError), highPriority))
	}
	if Conf.Activate_terminal_log {
		CoreList = append(CoreList,
			zapcore.NewCore(CasualEncoder, zapcore.AddSync(os.Stdout), highPriority),
			zapcore.NewCore(CasualEncoder, zapcore.AddSync(os.Stdout), lowPriority),
			zapcore.NewCore(CasualEncoder, zapcore.AddSync(os.Stdout), InfoPriority),
		)
	}

	core := zapcore.NewTee(CoreList...)
	logger = zap.New(core, zap.AddStacktrace(mediumPriority), zap.AddCaller())
	fmt.Println("---------------------------------------")
	return logger, nil
}
