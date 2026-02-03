#!/bin/bash
# Agent Switching Helper Script for Idle Raiders
# Usage: ./script/agent-switch.sh [backend|frontend|test|coordinator|gamedesign|items]

AGENT=$1
VALID_AGENTS="backend frontend test coordinator gamedesign items"

if [ -z "$AGENT" ]; then
  echo "❌ Error: No agent specified"
  echo ""
  echo "Usage: ./script/agent-switch.sh [AGENT]"
  echo ""
  echo "Available agents:"
  echo "  backend      - 🔧 Backend Agent (server/)"
  echo "  frontend     - 🎨 Frontend Agent (client/src/)"
  echo "  test         - 🧪 Test Agent (tests/)"
  echo "  coordinator  - 📋 Coordinator (shared/, migrations/)"
  echo "  gamedesign   - 📖 Game Design Agent (GDD)"
  echo "  items        - 🎲🖼️ Item Balance + Art Agent (items)"
  echo ""
  exit 1
fi

# Validate agent name
if ! echo "$VALID_AGENTS" | grep -w "$AGENT" > /dev/null; then
  echo "❌ Error: Invalid agent '$AGENT'"
  echo "Valid agents: $VALID_AGENTS"
  exit 1
fi

echo "🔄 Switching to agent: $AGENT"
echo ""

# Switch to agent branch
git checkout agent/$AGENT

if [ $? -ne 0 ]; then
  echo "❌ Failed to switch to agent/$AGENT branch"
  exit 1
fi

# Rebase on main to get latest changes
echo ""
echo "📥 Rebasing on main to get latest shared/ changes..."
git rebase main

if [ $? -ne 0 ]; then
  echo "⚠️  Rebase failed - you may need to resolve conflicts"
  echo "   Run 'git rebase --abort' to cancel, or resolve and 'git rebase --continue'"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 Now working as: $(echo $AGENT | tr '[:lower:]' '[:upper:]') Agent"
echo "📝 Status file: .claude/status/$AGENT.md"
echo "📁 Branch: agent/$AGENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show status file if it exists
if [ -f ".claude/status/$AGENT.md" ]; then
  echo "📋 Latest Status:"
  echo ""
  # Show first 30 lines of status file (usually the latest update)
  head -n 30 .claude/status/$AGENT.md
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
  echo "⚠️  Warning: Status file not found at .claude/status/$AGENT.md"
fi

echo ""

# Special instructions for Coordinator
if [ "$AGENT" = "coordinator" ]; then
  echo "🔍 COORDINATOR MODE - Enhanced Workflow:"
  echo ""
  echo "   Step 1: Tell Claude to analyze changes"
  echo "   ────────────────────────────────────────"
  echo "   Prompt: \"I'm the Coordinator. Check changes from agents.\""
  echo ""
  echo "   Step 2: Coordinator will:"
  echo "   - Read all .claude/status/*.md files"
  echo "   - Identify 'Needs from Coordinator' sections"
  echo "   - Analyze changes against original plan"
  echo "   - Report: 'Agent X/Y/Z needs these shared/ changes: [summary]'"
  echo ""
  echo "   Step 3: Review and validate:"
  echo "   - Evaluate if changes align with architecture"
  echo "   - Flag potential issues or conflicts"
  echo "   - Suggest improvements if needed"
  echo ""
  echo "   Step 4: Implement validated changes:"
  echo "   - Update shared/ files"
  echo "   - Commit with [Coordinator] prefix"
  echo "   - Merge to main"
  echo "   - Update .claude/status/coordinator.md"
  echo ""
else
  echo "✅ Ready to work! Remember to:"
  echo "   1. Update .claude/status/$AGENT.md when done"
  echo "   2. Commit with '[$(echo $AGENT | sed 's/\b\(.\)/\u\1/g')] Message' format"
  echo "   3. Document any handoffs to other agents"
  echo ""
fi
