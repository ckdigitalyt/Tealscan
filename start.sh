#!/bin/bash

cd /home/runner/workspace/backend && python main.py &
BACKEND_PID=$!

cd /home/runner/workspace/frontend && npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
