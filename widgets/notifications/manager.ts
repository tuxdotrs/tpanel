import GLib from "gi://GLib";

type TimeoutManager = {
  setupTimeout: () => void;
  clearTimeout: () => void;
  handleHover: () => void;
  handleHoverLost: () => void;
  cleanup: () => void;
};

export const createTimeoutManager = (
  dismissCallback: () => void,
  timeoutDelay: number,
): TimeoutManager => {
  let isHovered = false;
  let timeoutId: number | null = null;

  const clearTimeout = () => {
    if (timeoutId !== null) {
      GLib.source_remove(timeoutId);
      timeoutId = null;
    }
  };

  const setupTimeout = () => {
    clearTimeout();

    if (!isHovered) {
      timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeoutDelay, () => {
        clearTimeout();
        dismissCallback();
        return GLib.SOURCE_REMOVE;
      });
    }
  };

  return {
    setupTimeout,
    clearTimeout,
    handleHover: () => {
      isHovered = true;
      clearTimeout();
    },
    handleHoverLost: () => {
      isHovered = false;
      setupTimeout();
    },
    cleanup: clearTimeout,
  };
};
