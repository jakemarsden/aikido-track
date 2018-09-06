import ch.qos.logback.classic.filter.ThresholdFilter
import ch.qos.logback.core.util.FileSize
import java.nio.charset.Charset
import java.nio.charset.StandardCharsets

final PATTERN_BRIEF = '%date{HH:mm:ss} %highlight(%-4.-4level) [%15.15thread] %-40.40logger{40} : %msg%n'
final PATTERN_DETAILED = '%date{yyyy-MM-dd HH:mm:ss.SSS} %-4.-4level [%30.30thread] %-80.80logger{80} : %msg%n'

final APPLICATION_NAME = 'aikido-track'
final LOG_DIRECTORY = './data'

scan '30 seconds'

appender('CONSOLE', ConsoleAppender) {
    filter(ThresholdFilter) {
        level = INFO
    }
    encoder(PatternLayoutEncoder) {
        charset = Charset.defaultCharset()
        pattern = PATTERN_BRIEF
    }
}

appender('FILE', RollingFileAppender) {
    file = "$LOG_DIRECTORY/${APPLICATION_NAME}.log"
    rollingPolicy(SizeAndTimeBasedRollingPolicy) {
        // Roll over at midnight and when the file exceeds 100MB
        fileNamePattern = "$LOG_DIRECTORY/${APPLICATION_NAME}-%d{yyyy-MM-dd}-%i.log"
        maxFileSize = FileSize.valueOf '100MB'

        // Delete old logs when there are more than 30 days or 500MB of logs
        maxHistory = 30
        totalSizeCap = FileSize.valueOf '500MB'
        cleanHistoryOnStart = true
    }
    filter(ThresholdFilter) {
        level = ALL
    }
    encoder(PatternLayoutEncoder) {
        charset = StandardCharsets.UTF_8
        pattern = PATTERN_DETAILED
    }
}

logger 'ch.qos.logback', WARN
logger 'com.jakemarsden', TRACE
logger 'org.hibernate', INFO
logger 'org.hibernate.SQL', OFF  // Set to DEBUG to log SQL queries
logger 'org.hibernate.type', OFF // Set to TRACE to log SQL query parameter values
logger 'org.springframework', INFO
root INFO, ['CONSOLE', 'FILE']
