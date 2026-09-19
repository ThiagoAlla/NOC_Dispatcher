import { INotifierAdapter, NotificationPayload, NotificationResult } from '../../types/notifier';

export class ClipboardNotifierAdapter implements INotifierAdapter {
  readonly channelName = 'CLIPBOARD';

  async send(payload: NotificationPayload): Promise<NotificationResult> {
    const text = payload.compiledMarkdown;
    const nowIso = new Date().toISOString();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return { success: true, channel: this.channelName, timestamp: nowIso };
      }
      this.fallbackExecCommand(text);
      return { success: true, channel: this.channelName, timestamp: nowIso };
    } catch {
      try {
        this.fallbackExecCommand(text);
        return { success: true, channel: this.channelName, timestamp: nowIso };
      } catch (fbErr) {
        return {
          success: false,
          channel: this.channelName,
          timestamp: nowIso,
          errorMessage: fbErr instanceof Error ? fbErr.message : 'Falha ao copiar para o clipboard',
        };
      }
    }
  }

  private fallbackExecCommand(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (!successful) {
      throw new Error('Fallback execCommand copy failed');
    }
  }
}

export const clipboardAdapter = new ClipboardNotifierAdapter();
