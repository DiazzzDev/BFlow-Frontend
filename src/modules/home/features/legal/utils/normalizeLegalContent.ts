export const normalizeLegalContent = (content: string) => {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const discardLeadingBlankLines = () => {
    while (lines[0]?.trim() === "") lines.shift();
  };

  discardLeadingBlankLines();
  if (lines[0]?.startsWith("# ")) lines.shift();
  discardLeadingBlankLines();

  if (/^\*\*(Última actualización|Last updated)[:\s]/i.test(lines[0] ?? "")) {
    lines.shift();
    discardLeadingBlankLines();
  }

  if (/^---\s*$/.test(lines[0] ?? "")) {
    lines.shift();
    discardLeadingBlankLines();
  }

  return lines.join("\n");
};
