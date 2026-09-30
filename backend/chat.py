"""
Anthropic Claude API Streaming SSE Handler for Griha Mitra
Manages tool calling, multi-turn tool execution, streaming chunks, and safety rate limiting.
"""

import os
import json
import time
import asyncio
from typing import AsyncGenerator, List, Dict, Any
from prompts import GRIHA_MITRA_SYSTEM_PROMPT
from tools import CLAUDE_TOOLS, handle_tool_call

# Anthropic API Key
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY")
MODEL_NAME = os.environ.get("CLAUDE_MODEL", "claude-3-5-haiku-20241022")

# In-Memory Rate Limiting per IP: { ip: [timestamp1, timestamp2, ...] }
RATE_LIMIT_STORE: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW = 60 # 1 minute
MAX_REQUESTS_PER_MINUTE = 20


def is_rate_limited(client_ip: str) -> bool:
    """Enforce 20 requests per minute per IP"""
    now = time.time()
    timestamps = RATE_LIMIT_STORE.get(client_ip, [])
    # Filter timestamps within current window
    valid_timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
    if len(valid_timestamps) >= MAX_REQUESTS_PER_MINUTE:
        return True
    valid_timestamps.append(now)
    RATE_LIMIT_STORE[client_ip] = valid_timestamps
    return False


async def stream_claude_chat(messages: List[Dict[str, Any]], language: str = "en") -> AsyncGenerator[str, None]:
    """
    Stream Claude conversation via Server-Sent Events (SSE) with tool calling
    """
    if not ANTHROPIC_API_KEY or ANTHROPIC_API_KEY == "your_anthropic_api_key_here":
        # Yield offline notice chunk
        fallback_msg = (
            "नमस्ते! AI assistant is running in offline mode. Please configure your ANTHROPIC_API_KEY in the backend .env file to enable live Claude 3.5 Haiku intelligence."
            if language == "hi"
            else "Namaste! The AI assistant is currently in offline mode. Please provide a valid ANTHROPIC_API_KEY in the backend .env file to enable live Claude intelligence."
        )
        yield f"data: {json.dumps({'type': 'delta', 'content': fallback_msg})}\n\n"
        yield "data: [DONE]\n\n"
        return

    try:
        import anthropic
        client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    except ImportError:
        yield f"data: {json.dumps({'type': 'delta', 'content': 'Anthropic Python SDK not installed. Run `pip install anthropic`.'})}\n\n"
        yield "data: [DONE]\n\n"
        return

    # Clean and structure incoming conversation history
    claude_messages = []
    for m in messages:
        role = "user" if m.get("role") == "user" else "assistant"
        content = m.get("content", "").strip()
        if content:
            claude_messages.append({"role": role, "content": content})

    if not claude_messages:
        claude_messages = [{"role": "user", "content": "Hello Griha Mitra"}]

    system_instruction = GRIHA_MITRA_SYSTEM_PROMPT
    if language == "hi":
        system_instruction += "\n\nUser has selected Hindi (हिन्दी). Respond in clear, respectful, and friendly Hindi."

    try:
        # Step 1: Initial call to Claude with tools
        response = await client.messages.create(
            model=MODEL_NAME,
            max_tokens=500,
            system=system_instruction,
            messages=claude_messages,
            tools=CLAUDE_TOOLS,
        )

        # Check if Claude requested tool calls
        tool_calls = [c for c in response.content if c.type == "tool_use"]

        if tool_calls:
            # Execute tools
            tool_results_content = []
            for tool_call in tool_calls:
                tool_name = tool_call.name
                tool_input = tool_call.input
                tool_id = tool_call.id

                # Execute handler
                result_data = handle_tool_call(tool_name, tool_input)

                # Send tool event to frontend
                yield f"data: {json.dumps({'type': 'tool_result', 'tool': tool_name, 'data': result_data})}\n\n"

                tool_results_content.append({
                    "type": "tool_result",
                    "tool_use_id": tool_id,
                    "content": json.dumps(result_data),
                })

            # Append assistant's tool-use turn and user's tool-result turn
            claude_messages.append({"role": "assistant", "content": response.content})
            claude_messages.append({"role": "user", "content": tool_results_content})

            # Stream second turn with tool results incorporated
            async with client.messages.stream(
                model=MODEL_NAME,
                max_tokens=600,
                system=system_instruction,
                messages=claude_messages,
            ) as stream:
                async for text in stream.text_stream:
                    yield f"data: {json.dumps({'type': 'delta', 'content': text})}\n\n"

        else:
            # Direct text response
            for block in response.content:
                if block.type == "text":
                    yield f"data: {json.dumps({'type': 'delta', 'content': block.text})}\n\n"

        # Provide standard follow-up suggestions
        suggestions = [
            "Estimate my house price",
            "How does it work?",
            "Compare two cities",
            "What is RERA?",
        ]
        yield f"data: {json.dumps({'type': 'suggestions', 'items': suggestions})}\n\n"
        yield "data: [DONE]\n\n"

    except Exception as e:
        error_msg = f"Griha Mitra AI service notification: {str(e)}"
        yield f"data: {json.dumps({'type': 'delta', 'content': error_msg})}\n\n"
        yield "data: [DONE]\n\n"
