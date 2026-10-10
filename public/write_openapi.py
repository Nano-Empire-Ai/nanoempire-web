import json

spec = {
  "openapi": "3.1.0",
  "info": {
    "title": "Nano Empire AI — Unified Machine-Native APIs",
    "version": "1.0.0",
    "description": "Unified API spec for all Nano Empire services: Orchestrator, Quote-Box, RecallGuard, Tollbooth. Trial onramp (50 credits, 24hr TTL) available on all paid endpoints via Bearer token.",
    "contact": {"name": "Nano Empire AI", "url": "https://nanoempireai.com", "email": "security@nanoempireai.com"},
    "x-paper-mode": False
  },
  "servers": [
    {"url": "https://api.nanoempireai.com", "description": "Production (Vercel)"},
    {"url": "http://147.5.105.20:8080", "description": "Orchestrator (VPS)"},
    {"url": "http://147.5.105.20:8405", "description": "Quote-Box (VPS)"},
    {"url": "http://147.5.105.20:8403", "description": "Tollbooth (VPS)"},
    {"url": "https://recallguard-api.vercel.app", "description": "RecallGuard Primary (Vercel)"}
  ],
  "security": [{}, {"x402": []}, {"trialAuth": []}],
  "paths": {
    "/orchestrator/v1/trial": {
      "get": {
        "summary": "Claim Trial (Orchestrator)",
        "description": "Claim a trial token with 50 credits. No auth required.",
        "operationId": "claimTrialOrchestrator",
        "parameters": [{"name": "agent_id", "in": "query", "required": False, "schema": {"type": "string"}}],
        "responses": {"200": {"description": "Trial token issued", "content": {"application/json": {"$ref": "#/components/schemas/TrialClaimResponse"}}}}
      }
    },
    "/orchestrator/v1/trial/verify": {
      "get": {
        "summary": "Verify Trial (Orchestrator - no decrement)",
        "description": "Verify trial token without decrementing credits. Requires Bearer token.",
        "operationId": "verifyTrialOrchestratorGet",
        "parameters": [{"name": "authorization", "in": "header", "required": True, "schema": {"type": "string"}}],
        "responses": {"200": {"description": "Trial verified", "content": {"application/json": {"$ref": "#/components/schemas/TrialVerifyResponse"}}}}
      },
      "post": {
        "summary": "Verify Trial (Orchestrator - decrement)",
        "description": "Verify trial token and decrement 1 credit. Requires Bearer token.",
        "operationId": "verifyTrialOrchestratorPost",
        "parameters": [{"name": "authorization", "in": "header", "required": True, "schema": {"type": "string"}}],
        "responses": {"200": {"description": "Trial verified, credit consumed", "content": {"application/json": {"$ref": "#/components/schemas/TrialVerifyResponse"}}}}
      }
    },
    "/quote-box/v1/trial": {
      "post": {
        "summary": "Claim Trial (Quote-Box)",
        "description": "Claim a trial token with 50 credits. No auth required.",
        "operationId": "claimTrialQuoteBox",
        "requestBody": {"content": {"application/json": {"$ref": "#/components/schemas/TrialClaimRequest"}}, "required": True},
        "responses": {"200": {"description": "Trial token issued", "content": {"application/json": {"$ref": "#/components/schemas/TrialClaimResponse"}}}}
      }
    },
    "/quote-box/v1/trial/verify": {
      "get": {
        "summary": "Verify Trial (Quote-Box - no decrement)",
        "description": "Verify trial token without decrementing credits. Requires Bearer token.",
        "operationId": "verifyTrialQuoteBoxGet",
        "parameters": [{"name": "authorization", "in": "header", "required": True, "schema": {"type": "string"}}],
        "responses": {"200": {"description": "Trial verified", "content": {"application/json": {"$ref": "#/components/schemas/TrialVerifyResponse"}}}}
      },
      "post": {
        "summary": "Verify Trial (Quote-Box - decrement)",
        "description": "Verify trial token and decrement 1 credit. Requires Bearer token.",
        "operationId": "verifyTrialQuoteBoxPost",
        "parameters": [{"name": "authorization", "in": "header", "required": True, "schema": {"type": "string"}}],
        "responses": {"200": {"description": "Trial verified, credit consumed", "content": {"application/json": {"$ref": "#/components/schemas/TrialVerifyResponse"}}}}
      }
    },
    "/recallguard/v1/feed": {
      "get": {
        "summary": "RecallGuard Feed (with trial)",
        "description": "Get recall feed with trial token or x402 payment.",
        "operationId": "recallguardFeed",
        "parameters": [
          {"name": "authorization", "in": "header", "required": False, "schema": {"type": "string"}},
          {"name": "since", "in": "query", "schema": {"type": "string", "format": "date"}},
          {"name": "limit", "in": "query", "schema": {"type": "integer", "default": 50}}
        ],
        "responses": {"200": {"description": "Feed returned", "content": {"application/json": {"$ref": "#/components/schemas/RecallFeedResponse"}}}, "402": {"description": "Payment required"}}
      },
      "post": {
        "summary": "RecallGuard Feed POST (full access)",
        "description": "Get full recall feed with trial token or x402 payment.",
        "operationId": "recallguardFeedPost",
        "parameters": [{"name": "authorization", "in": "header", "required": False, "schema": {"type": "string"}}],
        "responses": {"200": {"description": "Feed returned", "content": {"application/json": {"$ref": "#/components/schemas/RecallFeedResponse"}}}, "402": {"description": "Payment required"}}
      }
    },
    "/recallguard/v1/match": {
      "post": {
        "summary": "RecallGuard Match (with trial)",
        "description": "Match inventory against recalls with trial token or x402 payment.",
        "operationId": "recallguardMatch",
        "requestBody": {"content": {"application/json": {"$ref": "#/components/schemas/MatchRequest"}}, "required": True},
        "parameters": [{"name": "authorization", "in": "header", "required": False, "schema": {"type": "string"}}],
        "responses": {"200": {"description": "Matches returned", "content": {"application/json": {"$ref": "#/components/schemas/RecallMatchResponse"}}}, "402": {"description": "Payment required"}}
      }
    },
    "/tollbooth/v1/health": {
      "get": {
        "summary": "Tollbooth Health",
        "operationId": "tollboothHealth",
        "responses": {"200": {"description": "OK", "content": {"application/json": {"$ref": "#/components/schemas/HealthResponse"}}}}
      }
    }
  },
  "components": {
    "schemas": {
      "TrialClaimRequest": {
        "type": "object",
        "properties": {
          "agent_id": {"type": "string"},
          "client": {"type": "string", "default": "unknown"},
          "metadata": {"type": "object"}
        }
      },
      "TrialClaimResponse": {
        "type": "object",
        "required": ["trial_token", "credits", "expires_at", "endpoints"],
        "properties": {
          "trial_token": {"type": "string"},
          "credits": {"type": "integer", "example": 50},
          "expires_at": {"type": "integer"},
          "endpoints": {"type": "array", "items": {"type": "string"}}
        }
      },
      "TrialVerifyResponse": {
        "type": "object",
        "required": ["credits_remaining", "tier", "expires_at"],
        "properties": {
          "credits_remaining": {"type": "integer"},
          "tier": {"type": "string", "enum": ["trial", "paid", "free"]},
          "agent_id": {"type": ["string", "null"]},
          "client": {"type": ["string", "null"]},
          "expires_at": {"type": "integer"}
        }
      },
      "RecallFeedResponse": {
        "type": "object",
        "properties": {
          "ok": {"type": "boolean"},
          "tier": {"type": "string"},
          "count": {"type": "integer"},
          "recalls": {"type": "array", "items": {"type": "object"}}
        }
      },
      "MatchRequest": {
        "type": "object",
        "required": ["inventory"],
        "properties": {
          "inventory": {"type": "array", "items": {"type": "object"}}
        }
      },
      "RecallMatchResponse": {
        "type": "object",
        "properties": {
          "ok": {"type": "boolean"},
          "tier": {"type": "string"},
          "items_checked": {"type": "integer"},
          "matches": {"type": "array", "items": {"type": "object"}}
        }
      },
      "HealthResponse": {
        "type": "object",
        "properties": {"ok": {"type": "boolean"}}
      }
    },
    "securitySchemes": {
      "x402": {"type": "http", "scheme": "bearer", "bearerFormat": "x402"},
      "trialAuth": {"type": "http", "scheme": "bearer", "description": "Trial token (50 credits, 24hr TTL)"}
    }
  }
}

with open(r'C:\Users\robla\empire\nanoempire-web\public\openapi.json', 'w') as f:
    json.dump(spec, f, indent=2)
print('Done')