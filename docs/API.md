# API Crawler 接口文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`

---

## 一、Crawl 接口 (爬虫相关)

### 1.1 开始爬取

```
POST /api/crawl/start
```

**请求体**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | string | 是 | 目标网站 URL |
| mode | string | 否 | 爬取模式 |
| cookies | array | 否 | Cookie 数组 |
| filters | object | 否 | 过滤规则 |
| waitTime | number | 否 | 等待时间(毫秒)，默认 10000 |
| headless | boolean | 否 | 是否无头模式，默认 true |

**请求示例**:
```json
{
  "url": "https://example.com",
  "waitTime": 15000,
  "headless": true,
  "cookies": [],
  "filters": {}
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "Crawling started",
  "sessionId": "xxx-xxx-xxx"
}
```

---

### 1.2 停止爬取

```
POST /api/crawl/stop
```

**响应示例**:
```json
{
  "success": true,
  "message": "Crawl stopped"
}
```

---

### 1.3 获取爬取状态

```
GET /api/crawl/status
```

**响应示例**:
```json
{
  "isRunning": true,
  "sessionId": "xxx-xxx-xxx",
  "url": "https://example.com",
  "startTime": 1234567890,
  "requestCount": 50
}
```

---

### 1.4 获取所有请求

```
GET /api/crawl/requests
```

**响应示例**:
```json
{
  "requests": [
    {
      "id": "req_xxx",
      "url": "https://example.com/api/users",
      "method": "GET",
      "headers": {},
      "postData": null,
      "resourceType": "xhr",
      "timestamp": 1234567890,
      "status": 200,
      "responseBody": "{\"data\":[]}",
      "responseHeaders": {},
      "error": null
    }
  ],
  "total": 1
}
```

---

## 二、Modules 接口 (模块管理)

### 2.1 获取所有模块

```
GET /api/modules
```

**响应示例**:
```json
{
  "success": true,
  "modules": [
    {
      "id": 1,
      "name": "用户模块",
      "description": "用户相关接口",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "request_count": 10
    }
  ]
}
```

---

### 2.2 创建模块

```
POST /api/modules
```

**请求体**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 模块名称 |
| description | string | 否 | 模块描述 |

**请求示例**:
```json
{
  "name": "用户模块",
  "description": "用户相关接口"
}
```

**响应示例**:
```json
{
  "success": true,
  "module": {
    "id": 1,
    "name": "用户模块",
    "description": "用户相关接口",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2.3 获取模块详情

```
GET /api/modules/getById
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 模块 ID |

**响应示例**:
```json
{
  "success": true,
  "module": {
    "id": 1,
    "name": "用户模块",
    "description": "用户相关接口",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "requests": [
      {
        "id": 1,
        "module_id": 1,
        "url": "https://example.com/api/users",
        "method": "GET",
        "headers": {},
        "post_data": null,
        "resource_type": "xhr",
        "timestamp": 1234567890,
        "status": 200,
        "response_body": "{\"data\":[]}",
        "response_headers": {},
        "error": null,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 2.4 删除模块

```
DELETE /api/modules/deleteById
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 模块 ID |

**响应示例**:
```json
{
  "success": true,
  "message": "Module deleted successfully"
}
```

---

### 2.5 添加请求到模块

```
POST /api/modules/addRequests
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 模块 ID |

**请求体**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| requests | array | 是 | 请求数组 |

**请求示例**:
```json
{
  "requests": [
    {
      "url": "https://example.com/api/users",
      "method": "GET",
      "headers": {},
      "postData": null,
      "resourceType": "xhr",
      "timestamp": 1234567890,
      "status": 200,
      "responseBody": "{\"data\":[]}",
      "responseHeaders": {},
      "error": null
    }
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "requests": [
    {
      "id": 1,
      "module_id": 1,
      "url": "https://example.com/api/users",
      "method": "GET",
      ...
    }
  ]
}
```

---

### 2.6 从模块移除请求

```
DELETE /api/modules/removeRequest
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| moduleId | number | 是 | 模块 ID |
| requestId | number | 是 | 请求 ID |

**响应示例**:
```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

---

### 2.7 导入模块

```
POST /api/modules/import
```

**请求体**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| module | object | 是 | 模块信息 |
| requests | array | 否 | 请求数组 |

**请求示例**:
```json
{
  "module": {
    "name": "用户模块",
    "description": "用户相关接口"
  },
  "requests": [
    {
      "url": "https://example.com/api/users",
      "method": "GET",
      "postData": null,
      "responseBody": "{\"data\":[]}"
    }
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "module": {
    "id": 1,
    "name": "用户模块",
    "requests": []
  }
}
```

---

### 2.8 导出模块

```
GET /api/modules/exportData
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | number | 是 | 模块 ID |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "module": {
      "name": "用户模块",
      "description": "用户相关接口",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "requests": [
      {
        "url": "https://example.com/api/users",
        "method": "GET",
        "headers": {},
        "postData": null,
        "resourceType": "xhr",
        "timestamp": 1234567890,
        "status": 200,
        "responseBody": "{\"data\":[]}",
        "responseHeaders": {},
        "error": null
      }
    ]
  }
}
```

---

### 2.9 搜索请求

```
GET /api/modules/search
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| q | string | 是 | 搜索关键词 |
| mode | string | 否 | 搜索模式: url / header / request-response / (默认: 综合搜索) |

**响应示例**:
```json
{
  "success": true,
  "requests": [
    {
      "id": 1,
      "module_id": 1,
      "url": "https://example.com/api/users",
      "method": "GET",
      "status": 200,
      "module": {
        "id": 1,
        "name": "用户模块"
      }
    }
  ],
  "total": 1
}
```

---

## 三、数据模型

### 3.1 Module (模块)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| name | STRING | 模块名称（唯一） |
| description | TEXT | 模块描述 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 3.2 Request (请求)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| module_id | INTEGER | 外键，关联模块 |
| url | TEXT | 请求 URL |
| method | STRING(10) | 请求方法: GET/POST/PUT/DELETE/PATCH |
| headers | JSON | 请求头 |
| post_data | TEXT | 请求体（POST/PUT/PATCH） |
| resource_type | STRING(50) | 资源类型: xhr/fetch/document... |
| timestamp | BIGINT | 时间戳 |
| status | INTEGER | 响应状态码 |
| response_body | LONGTEXT | 响应体 |
| response_headers | JSON | 响应头 |
| error | TEXT | 错误信息 |
| created_at | DATETIME | 创建时间 |

---

## 四、错误响应

所有接口的错误响应格式如下:

```json
{
  "success": false,
  "error": "错误信息描述"
}
```

或:

```json
{
  "error": "错误信息描述"
}
```

**常见状态码**:
- 400: 请求参数错误
- 404: 资源不存在
- 500: 服务器内部错误
