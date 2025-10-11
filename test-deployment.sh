#!/bin/bash

###############################################################################
# Find Your Word Widget - Deployment Test Script
# Tests all endpoints to verify deployment is working correctly
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if URL is provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: ./test-deployment.sh <your-server-url>${NC}"
  echo ""
  echo "Examples:"
  echo "  Local:      ./test-deployment.sh http://localhost:8080"
  echo "  Production: ./test-deployment.sh https://your-app.ondigitalocean.app"
  exit 1
fi

SERVER_URL=$1

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Find Your Word Widget - Deployment Test${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Testing server:${NC} $SERVER_URL"
echo ""

# Test 1: Health Check
echo -e "${BLUE}[1/5]${NC} Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$SERVER_URL/health")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)

if [ "$HEALTH_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Health check passed${NC}"
  echo -e "  Response: $HEALTH_BODY"
else
  echo -e "${RED}✗ Health check failed (HTTP $HEALTH_CODE)${NC}"
  echo -e "  Response: $HEALTH_BODY"
fi
echo ""

# Test 2: Widget Info
echo -e "${BLUE}[2/5]${NC} Testing widget info endpoint..."
INFO_RESPONSE=$(curl -s -w "\n%{http_code}" "$SERVER_URL/widget/info")
INFO_CODE=$(echo "$INFO_RESPONSE" | tail -n 1)
INFO_BODY=$(echo "$INFO_RESPONSE" | head -n -1)

if [ "$INFO_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Widget info endpoint working${NC}"
  echo -e "  Response: $INFO_BODY"
else
  echo -e "${RED}✗ Widget info failed (HTTP $INFO_CODE)${NC}"
  echo -e "  Response: $INFO_BODY"
fi
echo ""

# Test 3: Widget JS File
echo -e "${BLUE}[3/5]${NC} Testing widget JavaScript file..."
JS_RESPONSE=$(curl -s -w "\n%{http_code}" "$SERVER_URL/widget/v2/find-your-word-v2.iife.js" -I)
JS_CODE=$(echo "$JS_RESPONSE" | grep "HTTP" | awk '{print $2}')

if [ "$JS_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Widget JS file accessible${NC}"
  echo -e "  URL: $SERVER_URL/widget/v2/find-your-word-v2.iife.js"
else
  echo -e "${RED}✗ Widget JS file not found (HTTP $JS_CODE)${NC}"
fi
echo ""

# Test 4: Widget CSS File
echo -e "${BLUE}[4/5]${NC} Testing widget CSS file..."
CSS_RESPONSE=$(curl -s -w "\n%{http_code}" "$SERVER_URL/widget/v2/style.css" -I)
CSS_CODE=$(echo "$CSS_RESPONSE" | grep "HTTP" | awk '{print $2}')

if [ "$CSS_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Widget CSS file accessible${NC}"
  echo -e "  URL: $SERVER_URL/widget/v2/style.css"
else
  echo -e "${RED}✗ Widget CSS file not found (HTTP $CSS_CODE)${NC}"
fi
echo ""

# Test 5: API Endpoint
echo -e "${BLUE}[5/5]${NC} Testing API endpoint..."
API_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$SERVER_URL/api/suggest-words" \
  -H "Content-Type: application/json" \
  -d '{
    "userData": {
      "wordType": "mine",
      "name": "Test",
      "age": "25-35"
    }
  }')

API_CODE=$(echo "$API_RESPONSE" | tail -n 1)
API_BODY=$(echo "$API_RESPONSE" | head -n -1)

if [ "$API_CODE" = "200" ]; then
  echo -e "${GREEN}✓ API endpoint working correctly${NC}"
  echo -e "  Successfully received response from OpenAI"
elif [ "$API_CODE" = "500" ]; then
  echo -e "${YELLOW}⚠ API endpoint accessible but returned error${NC}"
  echo -e "  This might mean OpenAI API key is not configured"
  echo -e "  Response: $API_BODY"
elif [ "$API_CODE" = "400" ]; then
  echo -e "${YELLOW}⚠ API endpoint returned 400 (bad request)${NC}"
  echo -e "  Response: $API_BODY"
else
  echo -e "${RED}✗ API endpoint failed (HTTP $API_CODE)${NC}"
  echo -e "  Response: $API_BODY"
fi
echo ""

# Summary
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

ALL_PASSED=true

if [ "$HEALTH_CODE" != "200" ]; then
  echo -e "${RED}✗ Health check failed${NC}"
  ALL_PASSED=false
else
  echo -e "${GREEN}✓ Health check passed${NC}"
fi

if [ "$INFO_CODE" != "200" ]; then
  echo -e "${RED}✗ Widget info failed${NC}"
  ALL_PASSED=false
else
  echo -e "${GREEN}✓ Widget info passed${NC}"
fi

if [ "$JS_CODE" != "200" ]; then
  echo -e "${RED}✗ Widget JS file not accessible${NC}"
  ALL_PASSED=false
else
  echo -e "${GREEN}✓ Widget JS file accessible${NC}"
fi

if [ "$CSS_CODE" != "200" ]; then
  echo -e "${RED}✗ Widget CSS file not accessible${NC}"
  ALL_PASSED=false
else
  echo -e "${GREEN}✓ Widget CSS file accessible${NC}"
fi

if [ "$API_CODE" = "200" ]; then
  echo -e "${GREEN}✓ API endpoint working${NC}"
elif [ "$API_CODE" = "500" ]; then
  echo -e "${YELLOW}⚠ API endpoint needs configuration${NC}"
else
  echo -e "${RED}✗ API endpoint failed${NC}"
  ALL_PASSED=false
fi

echo ""

if [ "$ALL_PASSED" = true ]; then
  echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
  echo -e "${GREEN}  ✓ All tests passed! Ready for Shopify integration.${NC}"
  echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Copy this URL to Shopify:"
  echo -e "   ${BLUE}$SERVER_URL/widget/v2/find-your-word-v2.iife.js${NC}"
  echo ""
  echo "2. Add to your Shopify theme:"
  echo -e "   ${BLUE}<link rel=\"stylesheet\" href=\"$SERVER_URL/widget/v2/style.css\">${NC}"
  echo -e "   ${BLUE}<script src=\"$SERVER_URL/widget/v2/find-your-word-v2.iife.js\" defer></script>${NC}"
else
  echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
  echo -e "${RED}  ✗ Some tests failed. Please check the errors above.${NC}"
  echo -e "${RED}════════════════════════════════════════════════════════════════${NC}"
  echo ""
  echo "Common issues:"
  echo "1. Server not running (check with: curl $SERVER_URL/health)"
  echo "2. Widget not built (run: npm run build)"
  echo "3. Environment variables not set (check .env file or DO settings)"
fi

echo ""

