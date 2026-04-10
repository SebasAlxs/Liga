#!/bin/bash

# Configuration
API_URL="http://localhost:3000/api"

echo "------------------------------------------------"
echo "Starting Full Flow Test Script"
echo "------------------------------------------------"

# 1. Create Sede
echo "1/8 Creating Headquarter (Sede)..."
SEDE_RES=$(curl -s -X POST "$API_URL/headquarters" \
  -H "Content-Type: application/json" \
  -d '{"name": "Estadio Central", "address": "Av. Amazonas"}')
SEDE_ID=$(echo $SEDE_RES | jq -r '.data.id')
echo "Sede created: $SEDE_ID"

# 2. Create Category
echo "2/8 Creating Category..."
CAT_RES=$(curl -s -X POST "$API_URL/categories" \
  -H "Content-Type: application/json" \
  -d '{"name": "Máxima", "minAge": 15, "maxAge": 100}')
CAT_ID=$(echo $CAT_RES | jq -r '.data.id')
echo "Category created: $CAT_ID"

# 3. Create Tournament
echo "3/8 Creating Tournament..."
TOUR_RES=$(curl -s -X POST "$API_URL/tournaments" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Copa 2026\", \"startDate\": \"2026-03-01\", \"endDate\": \"2026-12-31\", \"headquartersId\": \"$SEDE_ID\"}")
TOUR_ID=$(echo $TOUR_RES | jq -r '.data.id')
echo "Tournament created: $TOUR_ID"

# 4. Create Team A
echo "4/8 Creating Team Local (Inter)..."
TEAM_A_RES=$(curl -s -X POST "$API_URL/teams" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Inter\", \"categoryId\": \"$CAT_ID\"}")
TEAM_A_ID=$(echo $TEAM_A_RES | jq -r '.data.id')
echo "Team A created: $TEAM_A_ID"

# 5. Create Team B
echo "5/8 Creating Team Visitante (Independiente)..."
TEAM_B_RES=$(curl -s -X POST "$API_URL/teams" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Independiente\", \"categoryId\": \"$CAT_ID\"}")
TEAM_B_ID=$(echo $TEAM_B_RES | jq -r '.data.id')
echo "Team B created: $TEAM_B_ID"

# 6. Create 15 Players Team A
echo "6/8 Creating 15 Players for Team A..."
for i in {1..15}
do
  curl -s -X POST "$API_URL/players" \
    -H "Content-Type: application/json" \
    -d "{\"firstName\": \"Jugador\", \"lastName\": \"A$i\", \"number\": $i, \"teamId\": \"$TEAM_A_ID\", \"dni\": \"17000A$i\", \"birthDate\": \"1995-01-01\", \"isLocal\": true}" > /dev/null
done
echo "Players Team A created."

# 7. Create 15 Players Team B
echo "7/8 Creating 15 Players for Team B..."
for i in {1..15}
do
  curl -s -X POST "$API_URL/players" \
    -H "Content-Type: application/json" \
    -d "{\"firstName\": \"Jugador\", \"lastName\": \"B$i\", \"number\": $i, \"teamId\": \"$TEAM_B_ID\", \"dni\": \"17000B$i\", \"birthDate\": \"1995-01-01\", \"isLocal\": true}" > /dev/null
done
echo "Players Team B created."

# 8. Create Match
echo "8/8 Creating Match..."
MATCH_RES=$(curl -s -X POST "$API_URL/matches" \
  -H "Content-Type: application/json" \
  -d "{\"homeTeamId\": \"$TEAM_A_ID\", \"awayTeamId\": \"$TEAM_B_ID\", \"tournamentId\": \"$TOUR_ID\", \"date\": \"2026-03-20T15:00:00Z\", \"status\": \"SCHEDULED\"}")
MATCH_ID=$(echo $MATCH_RES | jq -r '.data.id')
echo "Match created: $MATCH_ID"

echo "------------------------------------------------"
echo "SUCCESS: Everything is set up!"
echo "Sede: $SEDE_ID"
echo "Torneo: $TOUR_ID"
echo "Partido: $MATCH_ID"
echo "------------------------------------------------"
echo "Ahora puedes ir a la App, entrar en 'Vocalía' y gestionar la planilla del partido."
