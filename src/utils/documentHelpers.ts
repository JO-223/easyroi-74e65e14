
/**
 * Helper function to download a file from a URL
 */
export function downloadFile(url: string, fileName: string): void {
  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
