package middleware

import (
	"context"
	"fmt"
	"os"
)

func Success(ctx context.Context, action, tableName, userOid string, recordOid any, newData any) {
	send(ctx, action, tableName, userOid, recordOid, newData, "SUCCESS", fmt.Sprintf("%s %s success", action, tableName))
}

func Failed(ctx context.Context, action, tableName, userOid string, recordOid any, err error) {
	send(ctx, action, tableName, userOid, recordOid, nil, "FAILED", err.Error())
}

func send(ctx context.Context, action, tableName, userOid string, recordOid any, newData any, status, message string) {
	ip := castToString(ctx.Value("client_ip"))
	userAgent := castToString(ctx.Value("user_agent"))
	var recordOidStr *string
	if recordOid != nil {
		str := fmt.Sprintf("%v", recordOid)
		if str != "" && str != "<nil>" {
			recordOidStr = &str
		}
	}
	payload := AuditPayload{
		TableName: tableName,
		RecordOid: recordOidStr,
		Action:    action,
		UserOid:   userOid,
		IpAddress: ip,
		UserAgent: userAgent,
		Status:    status,
		Message:   message,
	}

	if newData != nil {
		payload.NewData = toMap(newData)
	}

	// url := os.Getenv("AUDIT_TRAIL_SERVICE_URL")
	// url := path.Join(os.Getenv("AUDIT_TRAIL_SERVICE_URL"), "/create")
	// http: //localhost:3001/api/v1/audit-log/api/v1/audit-log/create

	url := fmt.Sprintf("%s/create", os.Getenv("AUDIT_TRAIL_SERVICE_URL"))

	_ = RecordAuditTrail(payload, url)
}

func castToString(val interface{}) string {
	if s, ok := val.(string); ok {
		return s
	}
	return ""
}

func toMap(data interface{}) map[string]interface{} {
	m, ok := data.(map[string]interface{})
	if ok {
		return m
	}
	return map[string]interface{}{}
}
