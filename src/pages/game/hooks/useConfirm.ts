import { useCallback, useState } from "react";

export const useConfirm = (onYes: Function, onNo?: Function) => {
  const [isOpen, setIsOpen] = useState(false);

  const openConfirm = useCallback(() => setIsOpen(true), []);

  const closeConfirm = useCallback(() => setIsOpen(false), []);

  const onConfirm = useCallback(() => {
    setIsOpen(false);
    onYes();
  }, [onYes]);

  const onCancel = useCallback(() => {
    setIsOpen(false);
    onNo?.();
  }, [onNo]);

  return {
    isOpen,
    setIsOpen,
    onConfirm,
    onCancel,
    openConfirm,
    closeConfirm,
  };
};
