"use client";

import {
  useState,
  ReactNode,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type ModalContextType = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModalContext = () => {
  return useContext(ModalContext) as ModalContextType;
};

export default function AuthModal({
  action,
  width = 400,
  height = 460,
  children,
}: {
  width?: number;
  height?: number;
  action: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const value = {
    setOpen,
  };

  return (
    <div>
      <div onClick={handleOpen}>{action}</div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...style, width, height }}>
          <ModalContext.Provider value={value}>
            {children}
          </ModalContext.Provider>
        </Box>
      </Modal>
    </div>
  );
}
