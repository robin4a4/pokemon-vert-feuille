import * as Dialog from "@radix-ui/react-dialog";
import { PropsWithChildren } from "react";
import { Button, Window, WindowContent, WindowHeader } from "react95";
import { motion, useDragControls } from "framer-motion";

export const DialogRoot = Dialog.Root;
export const DialogTrigger = Dialog.Trigger;
export function DialogContent({
  children,
  title,
  ...props
}: PropsWithChildren<{ title: string } & Dialog.DialogContentProps>) {
  const dragControls = useDragControls();

  function startDrag(event: React.PointerEvent) {
    dragControls.start(event, { snapToCursor: true });
  }
  return (
    <Dialog.Portal>
      <Dialog.Content
        {...props}
        className="fixed top-1/2 left-1/2"
        style={{
          minWidth: "300px",
          minHeight: "300px",
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          drag
          dragMomentum={false}
          dragListener={false}
          dragControls={dragControls}
        >
          <Window className="window w-full h-full min-h-[300px]">
            <WindowHeader
              className="window-title flex justify-between items-center"
              onPointerDown={startDrag}
            >
              <span>{title}</span>
              <Dialog.Close asChild>
                <Button>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5 5h2v2H5zm4 4H7V7h2zm2 2H9V9h2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2zm2-2v2h-2V9zm2-2v2h-2V7zm0 0V5h2v2z"
                    ></path>
                  </svg>
                </Button>
              </Dialog.Close>
            </WindowHeader>
            <WindowContent>{children}</WindowContent>
          </Window>
        </motion.div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
