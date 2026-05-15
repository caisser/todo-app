async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const toolArgs = JSON.parse(Buffer.concat(chunks).toString());

  const readPath = toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || '';

  if (readPath.endsWith('.env') || readPath.includes('.env.local')) {
    console.error('Claude is trying to read the .env file! Blocking this action.');
    process.exit(2);
  }
}

main();
