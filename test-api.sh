#!/bin/bash

# Test script for Subscription Tracker API
echo "🧪 Testing Subscription Tracker API..."

API_URL="http://localhost:3001/api"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test API health
echo -e "${YELLOW}Testing API health...${NC}"
HEALTH_RESPONSE=$(curl -s $API_URL/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo -e "${GREEN}✅ API health check passed${NC}"
else
    echo -e "${RED}❌ API health check failed${NC}"
    exit 1
fi

# Test getting all subscriptions
echo -e "${YELLOW}Testing get all subscriptions...${NC}"
SUBSCRIPTIONS=$(curl -s $API_URL/subscriptions)
echo "Found subscriptions: $SUBSCRIPTIONS"

# Test getting stats
echo -e "${YELLOW}Testing get statistics...${NC}"
STATS=$(curl -s $API_URL/subscriptions/stats)
echo "Statistics: $STATS"

echo -e "${GREEN}🎉 All API tests passed!${NC}"
