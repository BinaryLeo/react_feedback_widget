#!/bin/bash

# ==========================================
# Feedback Widget - Quick Start Script
# ==========================================
# This script helps you start the Feedback Widget with Docker
# 
# AUTOMATIC SETUP:
#   - Database is created automatically
#   - Migrations run automatically on startup
#   - Sample data is seeded if database is empty
#   - No manual setup required!

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "============================================================"
echo ""
echo "           Feedback Widget v2.0 - Quick Start            "
echo ""
echo "============================================================"
echo -e "${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed!${NC}"
    echo "   Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed!${NC}"
    echo "   Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}.env file not found. Creating from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env file${NC}"
    echo -e "${YELLOW}   You can edit .env to configure AI providers, SMTP, etc.${NC}"
    echo ""
fi

# Function to show status
show_status() {
    echo ""
    echo -e "${BLUE}=============================================================${NC}"
    echo -e "${GREEN}Feedback Widget is starting up!${NC}"
    echo -e "${BLUE}=============================================================${NC}"
    echo ""
    echo -e "Services will be available at:"
    echo -e "  ${GREEN}API:${NC}        http://localhost:3333"
    echo -e "  ${GREEN}Health:${NC}     http://localhost:3333/health"
    echo -e "  ${GREEN}Database:${NC}  localhost:5432 (PostgreSQL)"
    echo ""
    echo -e "${YELLOW}For the best frontend experience, run:${NC}"
    echo -e "  ${BLUE}cd web && npm install && npm run dev${NC}"
    echo -e "  Then open: ${GREEN}http://localhost:4321${NC}"
    echo ""
    echo -e "${YELLOW}Useful commands:${NC}"
    echo -e "  View logs:     ${BLUE}docker-compose logs -f${NC}"
    echo -e "  Stop services: ${BLUE}docker-compose down${NC}"
    echo -e "  Restart API:   ${BLUE}docker-compose restart api${NC}"
    echo ""
    echo -e "${BLUE}=============================================================${NC}"
}

# Parse command line arguments
ACTION=${1:-up}

case $ACTION in
    up|start)
        echo -e "${BLUE}Starting Feedback Widget services...${NC}"
        echo ""

        # Build and start services
        docker-compose up --build -d

        echo ""
        echo -e "${BLUE}Waiting for services to be healthy...${NC}"
        sleep 5

        # Check if API is healthy
        if docker-compose ps | grep -q "api"; then
            echo -e "${GREEN}API is running${NC}"
        fi

        if docker-compose ps | grep -q "postgres"; then
            echo -e "${GREEN}Database is running${NC}"
        fi

        show_status
        ;;

    down|stop)
        echo -e "${BLUE}Stopping Feedback Widget services...${NC}"
        docker-compose down
        echo -e "${GREEN}Services stopped${NC}"
        ;;

    restart)
        echo -e "${BLUE}Restarting Feedback Widget services...${NC}"
        docker-compose restart
        show_status
        ;;

    logs)
        echo -e "${BLUE}Showing logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;

    reset)
        echo -e "${YELLOW}WARNING: This will delete all data!${NC}"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}Stopping services and removing volumes...${NC}"
            docker-compose down -v
            echo -e "${GREEN}All data has been reset${NC}"
            echo -e "${BLUE}Starting fresh...${NC}"
            docker-compose up --build -d
            show_status
        else
            echo -e "${YELLOW}Cancelled.${NC}"
        fi
        ;;

    migrate)
        echo -e "${BLUE}Running database migrations...${NC}"
        docker-compose exec api npx prisma migrate dev
        ;;

    seed)
        echo -e "${BLUE}Seeding database...${NC}"
        docker-compose exec api npx prisma db seed
        ;;

    studio)
        echo -e "${BLUE}Opening Prisma Studio...${NC}"
        echo -e "${YELLOW}   Press Ctrl+C to stop${NC}"
        docker-compose exec api npx prisma studio
        ;;

    shell)
        echo -e "${BLUE}Opening API shell...${NC}"
        docker-compose exec api sh
        ;;

    *)
        echo "Usage: ./start.sh [command]"
        echo ""
        echo "Commands:"
        echo "  up, start     - Start all services (default)"
        echo "  down, stop    - Stop all services"
        echo "  restart       - Restart all services"
        echo "  logs          - Show service logs"
        echo "  reset         - Reset all data (WARNING: destructive)"
        echo "  migrate       - Run database migrations"
        echo "  seed          - Seed database with sample data"
        echo "  studio        - Open Prisma Studio (database GUI)"
        echo "  shell         - Open API container shell"
        echo ""
        echo "Examples:"
        echo "  ./start.sh              # Start services"
        echo "  ./start.sh logs         # View logs"
        echo "  ./start.sh down         # Stop services"
        exit 1
        ;;
esac
