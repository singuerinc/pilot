export const copy = (text: string): boolean => {
  const ta: HTMLTextAreaElement = document.createElement('textarea');

  ta.textContent = text;
  document.body.appendChild(ta);

  ta.select();

  const result: boolean = document.execCommand('copy', true, text);
  document.body.removeChild(ta);

  return result;
};
